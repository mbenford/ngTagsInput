(function() {
'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:autocomplete
 *
 * @description
 * Provides autocomplete support for the tagsInput directive.
 *
 * @param {expression} source Callback that will be called for every keystroke and will be provided with the current
 *                            input's value. Must return a promise.
 */
angular.module('tags-input').directive('autocomplete', function($document) {
    function SuggestionList(loadFn) {
        var self = {};

        self.reset = function() {
            self.items = [];
            self.visible = false;
            self.index = -1;
            self.selected = null;
        };
        self.show = function() {
            self.selected = null;
            self.visible = true;
        };
        self.hide = function() {
            self.visible = false;
        };
        self.load = function(text) {
            if (self.selected === text) {
                return;
            }

            loadFn(text).then(function(items) {
                self.items = items;
                if (items.length > 0) {
                    self.show();
                }
            });
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
        restrict: 'A,E',
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
        link: function(scope, element, attrs, tagsInput) {
            var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down];
            var suggestionList = new SuggestionList(scope.source());
            var input = tagsInput.getNewTagInput();

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

            input.bind('keydown', function(e) {
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

            $document.bind('click', function() {
                if (suggestionList.visible) {
                    suggestionList.reset();
                    scope.$apply();
                }
            });
        }
    };
});

}());