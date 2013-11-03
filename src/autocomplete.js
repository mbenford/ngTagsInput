(function() {
'use strict';

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
        scope: { source: '&'},
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
                if (suggestionList.selected) {
                    input.changeValue(suggestionList.selected);
                }
                suggestionList.reset();

                input[0].focus();
            };

            input.change(function(value) {
                if (value) {
                    suggestionList.load(value);
                } else {
                    suggestionList.reset();
                }
            });

            input.bind('keydown', function(e) {
                var key;

                if (hotkeys.indexOf(e.keyCode) === -1) {
                    return;
                }

                key = e.keyCode;

                if (key === KEYS.down) {
                    if (!suggestionList.visible) {
                        suggestionList.load('');
                    }
                    else {
                        suggestionList.selectNext();
                    }
                    e.preventDefault();
                    scope.$apply();
                }
                else if (suggestionList.visible) {
                    if (key === KEYS.up) {
                        suggestionList.selectPrior();
                    }
                    else if (key === KEYS.escape) {
                        suggestionList.reset();
                    }
                    else if (key === KEYS.enter || key === KEYS.tab) {
                        scope.addSuggestion();
                    }
                    e.preventDefault();
                    scope.$apply();
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