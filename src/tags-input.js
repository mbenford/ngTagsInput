'use strict';

/**
 * @ngdoc directive
 * @name tagsInput
 * @module ngTagsInput
 *
 * @description
 * Renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} [displayProperty=text] Property to be rendered as the tag label.
 * @param {string=} [type=text] Type of the input element. Only 'text', 'email' and 'url' are supported values.
 * @param {number=} tabindex Tab order of the control.
 * @param {string=} [placeholder=Add a tag] Placeholder text for the control.
 * @param {number=} [minLength=3] Minimum length for a new tag.
 * @param {number=} [maxLength=MAX_SAFE_INTEGER] Maximum length allowed for a new tag.
 * @param {number=} [minTags=0] Sets minTags validation error key if the number of tags added is less than minTags.
 * @param {number=} [maxTags=MAX_SAFE_INTEGER] Sets maxTags validation error key if the number of tags added is greater than maxTags.
 * @param {boolean=} [allowLeftoverText=false] Sets leftoverText validation error key if there is any leftover text in
 *                                             the input element when the directive loses focus.
 * @param {string=} [removeTagSymbol=×] Symbol character for the remove tag button.
 * @param {boolean=} [addOnEnter=true] Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=} [addOnSpace=false] Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=} [addOnComma=true] Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=} [addOnBlur=true] Flag indicating that a new tag will be added when the input field loses focus.
 * @param {boolean=} [replaceSpacesWithDashes=true] Flag indicating that spaces will be replaced with dashes.
 * @param {string=} [allowedTagsPattern=.+] Regular expression that determines whether a new tag is valid.
 * @param {boolean=} [enableEditingLastTag=false] Flag indicating that the last tag will be moved back into
 *                                                the new tag input box instead of being removed when the backspace key
 *                                                is pressed and the input box is empty.
 * @param {boolean=} [addFromAutocompleteOnly=false] Flag indicating that only tags coming from the autocomplete list will be allowed.
 *                                                   When this flag is true, addOnEnter, addOnComma, addOnSpace, addOnBlur and
 *                                                   allowLeftoverText values are ignored.
 * @param {expression} onTagAdded Expression to evaluate upon adding a new tag. The new tag is available as $tag.
 * @param {expression} onTagRemoved Expression to evaluate upon removing an existing tag. The removed tag is available as $tag.
 */
tagsInput.directive('tagsInput', function($timeout, $document, tagsInputConfig) {
    function TagList(options, events) {
        var self = {}, getTagText, setTagText, tagIsValid;

        getTagText = function(tag) {
            return safeToString(tag[options.displayProperty]);
        };

        setTagText = function(tag, text) {
            tag[options.displayProperty] = text;
        };

        tagIsValid = function(tag) {
            var tagText = getTagText(tag);

            return tagText &&
                   tagText.length >= options.minLength &&
                   tagText.length <= options.maxLength &&
                   options.allowedTagsPattern.test(tagText) &&
                   !findInObjectArray(self.items, tag, options.displayProperty);
        };

        self.items = [];

        self.addText = function(text) {
            var tag = {};
            setTagText(tag, text);
            return self.add(tag);
        };

        self.add = function(tag) {
            var tagText = getTagText(tag);

            if (options.replaceSpacesWithDashes) {
                tagText = tagText.replace(/\s/g, '-');
            }

            setTagText(tag, tagText);

            if (tagIsValid(tag)) {
                self.items.push(tag);
                events.trigger('tag-added', { $tag: tag });
            }
            else if (tagText) {
                events.trigger('invalid-tag', { $tag: tag });
            }

            return tag;
        };

        self.remove = function(index) {
            var tag = self.items.splice(index, 1)[0];
            events.trigger('tag-removed', { $tag: tag });
            return tag;
        };

        self.removeLast = function() {
            var tag, lastTagIndex = self.items.length - 1;

            if (options.enableEditingLastTag || self.selected) {
                self.selected = null;
                tag = self.remove(lastTagIndex);
            }
            else if (!self.selected) {
                self.selected = self.items[lastTagIndex];
            }

            return tag;
        };

        return self;
    }

    function validateType(type) {
        return SUPPORTED_INPUT_TYPES.indexOf(type) !== -1;
    }

    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            tags: '=ngModel',
            onTagAdded: '&',
            onTagRemoved: '&'
        },
        replace: false,
        transclude: true,
        templateUrl: 'ngTagsInput/tags-input.html',
        controller: function($scope, $attrs, $element) {
            $scope.events = new SimplePubSub();

            tagsInputConfig.load('tagsInput', $scope, $attrs, {
                type: [String, 'text', validateType],
                placeholder: [String, 'Add a tag'],
                tabindex: [Number, null],
                removeTagSymbol: [String, String.fromCharCode(215)],
                replaceSpacesWithDashes: [Boolean, true],
                minLength: [Number, 3],
                maxLength: [Number, MAX_SAFE_INTEGER],
                addOnEnter: [Boolean, true],
                addOnSpace: [Boolean, false],
                addOnComma: [Boolean, true],
                addOnBlur: [Boolean, true],
                allowedTagsPattern: [RegExp, /.+/],
                enableEditingLastTag: [Boolean, false],
                minTags: [Number, 0],
                maxTags: [Number, MAX_SAFE_INTEGER],
                displayProperty: [String, 'text'],
                allowLeftoverText: [Boolean, false],
                addFromAutocompleteOnly: [Boolean, false]
            });

            $scope.tagList = new TagList($scope.options, $scope.events);

            this.registerAutocomplete = function() {
                var input = $element.find('input');
                input.on('keydown', function(e) {
                    $scope.events.trigger('input-keydown', e);
                });

                return {
                    addTag: function(tag) {
                        return $scope.tagList.add(tag);
                    },
                    focusInput: function() {
                        input[0].focus();
                    },
                    getTags: function() {
                        return $scope.tags;
                    },
                    getCurrentTagText: function() {
                        return $scope.newTag.text;
                    },
                    getOptions: function() {
                        return $scope.options;
                    },
                    on: function(name, handler) {
                        $scope.events.on(name, handler);
                        return this;
                    }
                };
            };
        },
        link: function(scope, element, attrs, ngModelCtrl) {
            var hotkeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace],
                tagList = scope.tagList,
                events = scope.events,
                options = scope.options,
                input = element.find('input'),
                validationOptions = ['minTags', 'maxTags', 'allowLeftoverText'],
                setElementValidity;

            setElementValidity = function() {
                ngModelCtrl.$setValidity('maxTags', scope.tags.length <= options.maxTags);
                ngModelCtrl.$setValidity('minTags', scope.tags.length >= options.minTags);
                ngModelCtrl.$setValidity('leftoverText', options.allowLeftoverText ? true : !scope.newTag.text);
            };

            events
                .on('tag-added', scope.onTagAdded)
                .on('tag-removed', scope.onTagRemoved)
                .on('tag-added', function() {
                    scope.newTag.text = '';
                })
                .on('tag-added tag-removed', function() {
                    ngModelCtrl.$setViewValue(scope.tags);
                })
                .on('invalid-tag', function() {
                    scope.newTag.invalid = true;
                })
                .on('input-change', function() {
                    tagList.selected = null;
                    scope.newTag.invalid = null;
                })
                .on('input-focus', function() {
                    ngModelCtrl.$setValidity('leftoverText', true);
                })
                .on('input-blur', function() {
                    if (!options.addFromAutocompleteOnly) {
                        if (options.addOnBlur) {
                            tagList.addText(scope.newTag.text);
                        }

                        setElementValidity();
                    }
                })
                .on('option-change', function(e) {
                    if (validationOptions.indexOf(e.name) !== -1) {
                        setElementValidity();
                    }
                });

            scope.newTag = { text: '', invalid: null };

            scope.getDisplayText = function(tag) {
                return safeToString(tag[options.displayProperty]);
            };

            scope.track = function(tag) {
                return tag[options.displayProperty];
            };

            scope.newTagChange = function() {
                events.trigger('input-change', scope.newTag.text);
            };

            scope.$watch('tags', function(value) {
                scope.tags = makeObjectArray(value, options.displayProperty);
                tagList.items = scope.tags;
            });

            scope.$watch('tags.length', function() {
                setElementValidity();
            });

            input
                .on('keydown', function(e) {
                    // This hack is needed because jqLite doesn't implement stopImmediatePropagation properly.
                    // I've sent a PR to Angular addressing this issue and hopefully it'll be fixed soon.
                    // https://github.com/angular/angular.js/pull/4833
                    if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                        return;
                    }

                    var key = e.keyCode,
                        isModifier = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey,
                        addKeys = {},
                        shouldAdd, shouldRemove;

                    if (isModifier || hotkeys.indexOf(key) === -1) {
                        return;
                    }

                    addKeys[KEYS.enter] = options.addOnEnter;
                    addKeys[KEYS.comma] = options.addOnComma;
                    addKeys[KEYS.space] = options.addOnSpace;

                    shouldAdd = !options.addFromAutocompleteOnly && addKeys[key];
                    shouldRemove = !shouldAdd && key === KEYS.backspace && scope.newTag.text.length === 0;

                    if (shouldAdd) {
                        tagList.addText(scope.newTag.text);

                        scope.$apply();
                        e.preventDefault();
                    }
                    else if (shouldRemove) {
                        var tag = tagList.removeLast();
                        if (tag && options.enableEditingLastTag) {
                            scope.newTag.text = tag[options.displayProperty];
                        }

                        scope.$apply();
                        e.preventDefault();
                    }
                })
                .on('focus', function() {
                    if (scope.hasFocus) {
                        return;
                    }

                    scope.hasFocus = true;
                    events.trigger('input-focus');

                    scope.$apply();
                })
                .on('blur', function() {
                    $timeout(function() {
                        var activeElement = $document.prop('activeElement'),
                            lostFocusToBrowserWindow = activeElement === input[0],
                            lostFocusToChildElement = element[0].contains(activeElement);

                        if (lostFocusToBrowserWindow || !lostFocusToChildElement) {
                            scope.hasFocus = false;
                            events.trigger('input-blur');
                        }
                    });
                });

            element.find('div').on('click', function() {
                input[0].focus();
            });
        }
    };
});