'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:tagsInput
 *
 * @description
 * Renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} [displayProperty=text] Property to be rendered as the tag label.
 * @param {string=} customClass CSS class to style the control.
 * @param {number=} tabindex Tab order of the control.
 * @param {string=} [placeholder=Add a tag] Placeholder text for the control.
 * @param {number=} [minLength=3] Minimum length for a new tag.
 * @param {number=} maxLength Maximum length allowed for a new tag.
 * @param {number=} minTags Sets minTags validation error key if the number of tags added is less than minTags.
 * @param {number=} maxTags Sets maxTags validation error key if the number of tags added is greater than maxTags.
 * @param {string=} [removeTagSymbol=×] Symbol character for the remove tag button.
 * @param {boolean=} [addOnEnter=true] Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=} [addOnSpace=false] Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=} [addOnComma=true] Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=} [addOnBlur=true] Flag indicating that a new tag will be added when the input field loses focus.
 * @param {boolean=} [replaceSpacesWithDashes=true] Flag indicating that spaces will be replaced with dashes.
 * @param {string=} [allowedTagsPattern=^&#91;a-zA-Z0-9\s&#93;+$] Regular expression that determines whether a new tag is valid.
 * @param {boolean=} [enableEditingLastTag=false] Flag indicating that the last tag will be moved back into
 *                                                the new tag input box instead of being removed when the backspace key
 *                                                is pressed and the input box is empty.
 * @param {expression} onTagAdded Expression to evaluate upon adding a new tag. The new tag is available as $tag.
 * @param {expression} onTagRemoved Expression to evaluate upon removing an existing tag. The removed tag is available as $tag.
 */
tagsInput.directive('tagsInput', function($timeout, $document, tagsInputConfig) {
    function TagList(options, events) {
        var self = {}, getTagText, setTagText;

        getTagText = function(tag) {
            return tag[options.displayProperty];
        };

        setTagText = function(tag, text) {
            tag[options.displayProperty] = text;
        };

        self.items = [];

        self.addText = function(text) {
            var tag = {};
            setTagText(tag, text);
            return self.add(tag);
        };

        self.add = function(tag) {
            var tagText = getTagText(tag).trim();

            if (tagText.length >= options.minLength && options.allowedTagsPattern.test(tagText)) {

                if (options.replaceSpacesWithDashes) {
                    tagText = tagText.replace(/\s/g, '-');
                }

                setTagText(tag, tagText);

                if (!findInObjectArray(self.items, tag, options.displayProperty)) {
                    self.items.push(tag);

                    events.trigger('tag-added', { $tag: tag });
                }
                else {
                    events.trigger('duplicate-tag', { $tag: tag });
                }
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
            var tagList, events, options;

            tagsInputConfig.load('tagsInput', $scope, $attrs, {
                customClass: [String],
                placeholder: [String, 'Add a tag'],
                tabindex: [Number],
                removeTagSymbol: [String, String.fromCharCode(215)],
                replaceSpacesWithDashes: [Boolean, true],
                minLength: [Number, 3],
                maxLength: [Number],
                addOnEnter: [Boolean, true],
                addOnSpace: [Boolean, false],
                addOnComma: [Boolean, true],
                addOnBlur: [Boolean, true],
                allowedTagsPattern: [RegExp, /^[a-zA-Z0-9\s]+$/],
                enableEditingLastTag: [Boolean, false],
                minTags: [Number],
                maxTags: [Number],
                displayProperty: [String, 'text']
            });

            events = new SimplePubSub();
            options = $scope.options;
            tagList = new TagList(options, events);

            $scope.events = events;
            $scope.tagList = tagList;
            $scope.newTag = '';

            events
                .on('tag-added', $scope.onTagAdded)
                .on('tag-removed', $scope.onTagRemoved)
                .on('tag-added duplicate-tag', function() {
                    $scope.newTag = '';
                })
                .on('input-change', function() {
                    tagList.selected = null;
                });

            $scope.$watch('tags', function(value) {
                $scope.tags = makeObjectArray(value, options.displayProperty);
                tagList.items = $scope.tags;
            });

            $scope.getDisplayText = function(tag) {
                return tag[options.displayProperty].trim();
            };

            $scope.track = function(tag) {
                return tag[options.displayProperty];
            };

            $scope.newTagChange = function() {
                events.trigger('input-change', $scope.newTag);
            };

            this.registerAutocomplete = function() {
                var input = $element.find('input');
                input.on('keydown', function(e) {
                    events.trigger('input-keydown', e);
                });

                return {
                    addTag: function(tag) {
                        return tagList.add(tag);
                    },
                    focusInput: function() {
                        input[0].focus();
                    },
                    getTags: function() {
                        return $scope.tags;
                    },
                    getOptions: function() {
                        return $scope.options;
                    },
                    on: function(name, handler) {
                        events.on(name, handler);
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
                input = element.find('input');

            scope.$watch('tags.length', function() {
                ngModelCtrl.$setValidity('maxTags', angular.isUndefined(options.maxTags) || scope.tags.length <= options.maxTags);
                ngModelCtrl.$setValidity('minTags', angular.isUndefined(options.minTags) || scope.tags.length >= options.minTags);
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
                        isModifier = e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;

                    if (isModifier || hotkeys.indexOf(key) === -1) {
                        return;
                    }

                    if (key === KEYS.enter && options.addOnEnter ||
                        key === KEYS.comma && options.addOnComma ||
                        key === KEYS.space && options.addOnSpace) {

                        tagList.addText(scope.newTag);

                        scope.$apply();
                        e.preventDefault();
                    }
                    else if (key === KEYS.backspace && scope.newTag.length === 0) {
                        var tag = tagList.removeLast();
                        if (tag && options.enableEditingLastTag) {
                            scope.newTag = tag[options.displayProperty];
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
                    scope.$apply();
                })
                .on('blur', function() {
                    $timeout(function() {
                        var parentElement = angular.element($document[0].activeElement).parent();
                        if (parentElement[0] !== element[0]) {
                            scope.hasFocus = false;
                            if (options.addOnBlur) {
                                tagList.addText(scope.newTag);
                            }
                            events.trigger('input-blur');
                            scope.$apply();
                        }
                    }, 0, false);
                });

            element.find('div').on('click', function() {
                input[0].focus();
            });
        }
    };
});