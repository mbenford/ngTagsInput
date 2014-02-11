'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:tagsInput
 *
 * @description
 * ngTagsInput is an Angular directive that renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
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
 * @param {string=} [allowedTagsPattern=^[a-zA-Z0-9\s]+$*] Regular expression that determines whether a new tag is valid.
 * @param {boolean=} [enableEditingLastTag=false] Flag indicating that the last tag will be moved back into
 *                                                the new tag input box instead of being removed when the backspace key
 *                                                is pressed and the input box is empty.
 * @param {expression} onTagAdded Expression to evaluate upon adding a new tag. The new tag is available as $tag.
 * @param {expression} onTagRemoved Expression to evaluate upon removing an existing tag. The removed tag is available as $tag.
 */
tagsInput.directive('tagsInput', function($timeout, $document, tagsInputConfig) {
    function SimplePubSub() {
        var events = {};

        return {
            on: function(name, handler) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            },
            trigger: function(name, args) {
                angular.forEach(events[name], function(handler) {
                    handler.call(null, args);
                });
            }
        };
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
            var shouldRemoveLastTag;

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
                allowedTagsPattern: [RegExp, /^[a-zA-Z0-9\s-\.]+$/],
                enableEditingLastTag: [Boolean, false],
                minTags: [Number],
                maxTags: [Number]
            });

            $scope.events = new SimplePubSub();

            $scope.events.on('tag-added', $scope.onTagAdded);
            $scope.events.on('tag-removed', $scope.onTagRemoved);

            $scope.newTag = '';
            $scope.tags = $scope.tags || [];

            $scope.tryAdd = function() {
                var changed = false;
                var tag = $scope.newTag;

                if (tag.length >= $scope.options.minLength && $scope.options.allowedTagsPattern.test(tag)) {

                    if ($scope.options.replaceSpacesWithDashes) {
                        tag = tag.replace(/\s/g, '-');
                    }

                    if ($scope.tags.indexOf(tag) === -1) {
                        $scope.tags.push(tag);

                        $scope.events.trigger('tag-added', { $tag: tag });
                    }

                    $scope.newTag = '';
                    $scope.events.trigger('input-change', '');
                    changed = true;
                }
                return changed;
            };

            $scope.tryRemoveLast = function() {
                var changed = false;

                if ($scope.tags.length > 0) {
                    if ($scope.options.enableEditingLastTag) {
                        $scope.newTag = $scope.remove($scope.tags.length - 1);
                    }
                    else {
                        if (shouldRemoveLastTag) {
                            $scope.remove($scope.tags.length - 1);

                            shouldRemoveLastTag = false;
                        }
                        else {
                            shouldRemoveLastTag = true;
                        }
                    }
                    changed = true;
                }
                return changed;
            };

            $scope.remove = function(index) {
                var removedTag = $scope.tags.splice(index, 1)[0];
                $scope.events.trigger('tag-removed', { $tag: removedTag });
                return removedTag;
            };

            $scope.getCssClass = function(index) {
                var isLastTag = index === $scope.tags.length - 1;
                return shouldRemoveLastTag && isLastTag ? 'selected' : '';
            };

            $scope.$watch(function() { return $scope.newTag.length > 0; }, function() {
                shouldRemoveLastTag = false;
            });

            this.registerAutocomplete = function() {
                var input = $element.find('input');
                input.on('keydown', function(e) {
                    $scope.events.trigger('input-keydown', e);
                });

                $scope.newTagChange = function() {
                    $scope.events.trigger('input-change', $scope.newTag);
                };

                return {
                    tryAddTag: function(tag) {
                        $scope.newTag = tag;
                        return $scope.tryAdd();
                    },
                    focusInput: function() {
                        input[0].focus();
                    },
                    getTags: function() {
                        return $scope.tags;
                    },
                    on: function(name, handler) {
                        $scope.events.on(name, handler);
                        return this;
                    }
                };
            };
        },
        link: function(scope, element, attrs, ngModelCtrl) {
            var hotkeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace];
            var input = element.find('input');

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

                    if (key === KEYS.enter && scope.options.addOnEnter ||
                        key === KEYS.comma && scope.options.addOnComma ||
                        key === KEYS.space && scope.options.addOnSpace) {

                        if (scope.tryAdd()) {
                            scope.$apply();
                        }
                        e.preventDefault();
                    }
                    else if (key === KEYS.backspace && this.value.length === 0) {
                        if (scope.tryRemoveLast()) {
                            scope.$apply();

                            e.preventDefault();
                        }
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
                            if (scope.options.addOnBlur) {
                                scope.tryAdd();
                            }
                            scope.events.trigger('input-blur');
                            scope.$apply();
                        }
                    }, 0, false);
                });

            element.find('div').on('click', function() {
                input[0].focus();
            });

            scope.$watch('tags.length', function() {
                ngModelCtrl.$setValidity('maxTags', angular.isUndefined(scope.options.maxTags) || scope.tags.length <= scope.options.maxTags);
                ngModelCtrl.$setValidity('minTags', angular.isUndefined(scope.options.minTags) || scope.tags.length >= scope.options.minTags);
            });
        }
    };
});
