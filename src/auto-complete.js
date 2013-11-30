(function() {
'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:autoComplete
 *
 * @description
 * Provides autocomplete support for the tagsInput directive.
 *
 * @param {expression} source Expression to evaluate upon changing the input content. The input value is available as $text.
 *                            The result of the expression must be a promise that resolves to an array of strings.
 * @param {number=} [debounceDelay=100] Amount of time, in milliseconds, to wait after the last keystroke before evaluating
 *                                      the expression in the source option.
 */
angular.module('tags-input').directive('autoComplete', function($document, $timeout, configuration) {
    function SuggestionList(loadFn, options) {
        var self = {}, debouncedLoadId;

        self.reset = function() {
            self.items = [];
            self.visible = false;
            self.index = -1;
            self.selected = null;

            $timeout.cancel(debouncedLoadId);
        };
        self.show = function() {
            self.selected = null;
            self.visible = true;
        };
        self.hide = function() {
            self.visible = false;
        };
        self.load = function(text) {
            $timeout.cancel(debouncedLoadId);
            debouncedLoadId = $timeout(function() {
                loadFn({ $text: text }).then(function(items) {
                    self.items = items;
                    if (items.length > 0) {
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
                  '    <li class="suggestion" ng-repeat="item in suggestionList.items"' +
                  '                           ng-class="{selected: item == suggestionList.selected}"' +
                  '                           ng-click="addSuggestion()"' +
                  '                           ng-mouseenter="suggestionList.select($index)">{{ item }}</li>' +
                  '  </ul>' +
                  '</div>',
        link: function(scope, element, attrs, tagsInputCtrl) {
            var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down],
                suggestionList, tagsInput, input;

            configuration.load(scope, attrs, {
                debounceDelay: { type: Number, defaultValue: 100 }
            });

            suggestionList = new SuggestionList(scope.source, scope.options);
            tagsInput = tagsInputCtrl.registerAutocomplete();
            input = tagsInput.input;

            scope.suggestionList = suggestionList;

            scope.addSuggestion = function() {
                var added = false;

                if (suggestionList.selected) {
                    input.changeValue(suggestionList.selected);
                    suggestionList.reset();
                    input[0].focus();

                    added = true;
                }
                return added;
            };

            input.change(function(value) {
                if (value) {
                    suggestionList.load(value);
                } else {
                    suggestionList.reset();
                }
            });

            input.on('keydown', function(e) {
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

            tagsInput.events.on('tag-added', function() {
                suggestionList.reset();
            });
        }
    };
});

}());