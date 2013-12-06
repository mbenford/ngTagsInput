(function() {
'use strict';

var KEYS = {
    backspace: 8,
    tab: 9,
    enter: 13,
    escape: 27,
    space: 32,
    up: 38,
    down: 40,
    comma: 188
};

angular.module('tags-input', []);

/**
 * @ngdoc directive
 * @name tagsInput.directive:tagsInput
 *
 * @description
 * ngTagsInput is an Angular directive that renders an input box with tag editing support.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} ngClass CSS class to style the control.
 * @param {number=} tabindex Tab order of the control.
 * @param {string=} [placeholder=Add a tag] Placeholder text for the control.
 * @param {number=} [minLength=3] Minimum length for a new tag.
 * @param {number=} maxLength Maximum length allowed for a new tag.
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
angular.module('tags-input').directive('tagsInput', ["$timeout","$document","configuration", function($timeout, $document, configuration) {
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
        scope: {
            tags: '=ngModel',
            onTagAdded: '&',
            onTagRemoved: '&'
        },
        replace: false,
        transclude: true,
        template: '<div class="ngTagsInput" tabindex="-1" ng-class="options.customClass" transclude-append>' +
                  '  <div class="tags" ng-class="{focused: hasFocus}">' +
                  '    <ul>' +
                  '      <li ng-repeat="tag in tags" ng-class="getCssClass($index)">' +
                  '        <span>{{ tag }}</span>' +
                  '        <button type="button" ng-click="remove($index)">{{ options.removeTagSymbol }}</button>' +
                  '      </li>' +
                  '    </ul>' +
                  '    <input type="text"' +
                  '           placeholder="{{ options.placeholder }}"' +
                  '           size="{{ options.placeholder.length }}"' +
                  '           maxlength="{{ options.maxLength }}"' +
                  '           tabindex="{{ options.tabindex }}"' +
                  '           ng-model="newTag"' +
                  '           ng-change="newTagChange()">' +
                  '  </div>' +
                  '</div>',
        controller: ["$scope","$attrs","$element", function($scope, $attrs, $element) {
            var events = new SimplePubSub(),
                shouldRemoveLastTag;

            configuration.load($scope, $attrs, {
                customClass: { type: String, defaultValue: '' },
                placeholder: { type: String, defaultValue: 'Add a tag' },
                tabindex: { type: Number },
                removeTagSymbol: { type: String, defaultValue: String.fromCharCode(215) },
                replaceSpacesWithDashes: { type: Boolean, defaultValue: true },
                minLength: { type: Number, defaultValue: 3 },
                maxLength: { type: Number },
                addOnEnter: { type: Boolean, defaultValue: true },
                addOnSpace: { type: Boolean, defaultValue: false },
                addOnComma: { type: Boolean, defaultValue: true },
                addOnBlur: { type: Boolean, defaultValue: true },
                allowedTagsPattern: { type: RegExp, defaultValue: /^[a-zA-Z0-9\s]+$/ },
                enableEditingLastTag: { type: Boolean, defaultValue: false }
            });

            events.on('tag-added', $scope.onTagAdded);
            events.on('tag-removed', $scope.onTagRemoved);

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

                        events.trigger('tag-added', { $tag: tag });
                    }

                    $scope.newTag = '';
                    events.trigger('input-changed', '');
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
                events.trigger('tag-removed', { $tag: removedTag });
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
                    events.trigger('input-keydown', e);
                });

                $scope.newTagChange = function() {
                    events.trigger('input-changed', $scope.newTag);
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
                        events.on(name, handler);
                        return this;
                    }
                };
            };
        }],
        link: function(scope, element) {
            var hotkeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace];
            var input = element.find('input');

            input
                .on('keydown', function(e) {
                    var key;

                    // This hack is needed because jqLite doesn't implement stopImmediatePropagation properly.
                    // I've sent a PR to Angular addressing this issue and hopefully it'll be fixed soon.
                    // https://github.com/angular/angular.js/pull/4833
                    if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                        return;
                    }

                    if (hotkeys.indexOf(e.keyCode) === -1) {
                        return;
                    }

                    key = e.keyCode;

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
                            scope.$apply();
                        }
                    }, 0, false);
                });

            element.find('div').on('click', function() {
                input[0].focus();
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name tagsInput.directive:autoComplete
 *
 * @description
 * Provides autocomplete support for the tagsInput directive.
 *
 * @param {expression} source Expression to evaluate upon changing the input content. The input value is available as
 *                            $query. The result of the expression must be a promise that resolves to an array of strings.
 * @param {number=} [debounceDelay=100] Amount of time, in milliseconds, to wait after the last keystroke before
 *                                      evaluating the expression in the source option.
 * @param {number=} [minLength=3] Minimum number of characters that must be entered before evaluating the expression
 *                                 in the source option.
 * @param {boolean=} [highlightMatchedText=true] Flag indicating that the matched text will be highlighted in the
 *                                               suggestions list.
 * @param {number=} [maxResultsToShow=10] Maximum number of results to be displayed at a time.
 */
angular.module('tags-input').directive('autoComplete', ["$document","$timeout","$sce","configuration", function($document, $timeout, $sce, configuration) {
    function SuggestionList(loadFn, options) {
        var self = {}, debouncedLoadId, getDifference;

        getDifference = function(array1, array2) {
            var result = [];

            array1.forEach(function(item) {
                if (array2.indexOf(item) === -1) {
                    result.push(item);
                }
            });

            return result;
        };

        self.reset = function() {
            self.items = [];
            self.visible = false;
            self.index = -1;
            self.selected = null;
            self.query = null;

            $timeout.cancel(debouncedLoadId);
        };
        self.show = function() {
            self.selected = null;
            self.visible = true;
        };
        self.hide = function() {
            self.visible = false;
        };
        self.load = function(query, tags) {
            if (query.length < options.minLength) {
                self.reset();
                return;
            }

            $timeout.cancel(debouncedLoadId);
            debouncedLoadId = $timeout(function() {
                self.query = query;
                loadFn({ $query: query }).then(function(items) {
                    self.items = getDifference(items, tags);
                    if (self.items.length > 0) {
                        self.show();
                    }
                });
            }, options.debounceDelay, false);
        };
        self.selectNext = function() {
            self.select(++self.index);
        };
        self.selectPrior = function() {
            self.select(--self.index);
        };
        self.select = function(index) {
            if (index < 0) {
                index = self.items.length - 1;
            }
            else if (index >= self.items.length) {
                index = 0;
            }
            self.index = index;
            self.selected = self.items[index];
        };

        self.reset();

        return self;
    }

    return {
        restrict: 'E',
        require: '?^tagsInput',
        scope: { source: '&' },
        template: '<div class="autocomplete" ng-show="suggestionList.visible">' +
                  '  <ul class="suggestions">' +
                  '    <li class="suggestion" ng-repeat="item in suggestionList.items | limitTo:options.maxResultsToShow"' +
                  '                           ng-class="{selected: item == suggestionList.selected}"' +
                  '                           ng-click="addSuggestion()"' +
                  '                           ng-mouseenter="suggestionList.select($index)"' +
                  '                           ng-bind-html="highlight(item)"></li>' +
                  '  </ul>' +
                  '</div>',
        link: function(scope, element, attrs, tagsInputCtrl) {
            var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down],
                suggestionList, tagsInput, highlight;

            configuration.load(scope, attrs, {
                debounceDelay: { type: Number, defaultValue: 100 },
                minLength: { type: Number, defaultValue: 3 },
                highlightMatchedText: { type: Boolean, defaultValue: true },
                maxResultsToShow: { type: Number, defaultValue: 10 }
            });

            tagsInput = tagsInputCtrl.registerAutocomplete();
            suggestionList = new SuggestionList(scope.source, scope.options);

            if (scope.options.highlightMatchedText) {
                highlight = function(item, text) {
                    var expression = new RegExp(text, 'gi');
                    return item.replace(expression, '<em>$&</em>');
                };
            }
            else {
                highlight = function(item) {
                    return item;
                };
            }

            scope.suggestionList = suggestionList;

            scope.addSuggestion = function() {
                var added = false;

                if (suggestionList.selected) {
                    tagsInput.tryAddTag(suggestionList.selected);
                    suggestionList.reset();
                    tagsInput.focusInput();

                    added = true;
                }
                return added;
            };

            scope.highlight = function(item) {
                return $sce.trustAsHtml(highlight(item, suggestionList.query));
            };

            tagsInput
                .on('input-changed', function(value) {
                    if (value) {
                        suggestionList.load(value, tagsInput.getTags());
                    } else {
                        suggestionList.reset();
                    }
                })
                .on('input-keydown', function(e) {
                    var key, handled;

                    if (hotkeys.indexOf(e.keyCode) === -1) {
                        return;
                    }

                    // This hack is needed because jqLite doesn't implement stopImmediatePropagation properly.
                    // I've sent a PR to Angular addressing this issue and hopefully it'll be fixed soon.
                    // https://github.com/angular/angular.js/pull/4833
                    var immediatePropagationStopped = false;
                    e.stopImmediatePropagation = function() {
                        immediatePropagationStopped = true;
                        e.stopPropagation();
                    };
                    e.isImmediatePropagationStopped = function() {
                        return immediatePropagationStopped;
                    };

                    if (suggestionList.visible) {
                        key = e.keyCode;
                        handled = false;

                        if (key === KEYS.down) {
                            suggestionList.selectNext();
                            handled = true;
                        }
                        else if (key === KEYS.up) {
                            suggestionList.selectPrior();
                            handled = true;
                        }
                        else if (key === KEYS.escape) {
                            suggestionList.reset();
                            handled = true;
                        }
                        else if (key === KEYS.enter || key === KEYS.tab) {
                            handled = scope.addSuggestion();
                        }

                        if (handled) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            scope.$apply();
                        }
                    }
                });

            $document.on('click', function() {
                if (suggestionList.visible) {
                    suggestionList.reset();
                    scope.$apply();
                }
            });
        }
    };
}]);

/**
 * @ngdoc directive
 * @name tagsInput.directive:transcludeAppend
 *
 * @description
 * Re-creates the old behavior of ng-transclude.
 */
angular.module('tags-input').directive('transcludeAppend', function() {
    return function(scope, element, attrs, ctrl, transcludeFn) {
        transcludeFn(function(clone) {
            element.append(clone);
        });
    };
});

/**
 * @ngdoc service
 * @name tagsInput.service:configuration
 *
 * @description
 * Loads and initializes options from HTML attributes. Used internally for tagsInput and autoComplete directives.
 */
angular.module('tags-input').service('configuration', ["$interpolate", function($interpolate) {
    this.load = function(scope, attrs, options) {
        var converters = {};
        converters[String] = function(value) { return value; };
        converters[Number] = function(value) { return parseInt(value, 10); };
        converters[Boolean] = function(value) { return value === 'true'; };
        converters[RegExp] = function(value) { return new RegExp(value); };

        scope.options = {};

        angular.forEach(options, function(value, key) {
            var interpolatedValue = attrs[key] && $interpolate(attrs[key])(scope.$parent),
                converter = converters[options[key].type];

            scope.options[key] = interpolatedValue ? converter(interpolatedValue) : options[key].defaultValue;
        });
    };
}]);


}());