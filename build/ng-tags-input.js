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
 * @param {string} ngClass CSS class to style the control.
 * @param {number} tabindex Tab order of the control.
 * @param {string=Add a tag} placeholder Placeholder text for the control.
 * @param {number=3} minLength Minimum length for a new tag.
 * @param {number=} maxLength Maximum length allowed for a new tag.
 * @param {string=×} removeTagSymbol Symbol character for the remove tag button.
 * @param {boolean=true} addOnEnter Flag indicating that a new tag will be added on pressing the ENTER key.
 * @param {boolean=false} addOnSpace Flag indicating that a new tag will be added on pressing the SPACE key.
 * @param {boolean=true} addOnComma Flag indicating that a new tag will be added on pressing the COMMA key.
 * @param {boolean=true} replaceSpacesWithDashes Flag indicating that spaces will be replaced with dashes.
 * @param {string=^[a-zA-Z0-9\s]+$*} allowedTagsPattern Regular expression that determines whether a new tag is valid.
 * @param {boolean=false} enableEditingLastTag Flag indicating that the last tag will be moved back into
 *                                             the new tag input box instead of being removed when the backspace key
 *                                             is pressed and the input box is empty.
 */
angular.module('tags-input').directive('tagsInput', ["$interpolate", function($interpolate) {
    function loadOptions(scope, attrs) {
        function getStr(name, defaultValue) {
            return attrs[name] ? $interpolate(attrs[name])(scope.$parent) : defaultValue;
        }

        function getInt(name, defaultValue) {
            var value = getStr(name, null);
            return value ? parseInt(value, 10) : defaultValue;
        }

        function getBool(name, defaultValue) {
            var value = getStr(name, null);
            return value ? value === 'true' : defaultValue;
        }

        scope.options = {
            cssClass: getStr('ngClass', ''),
            placeholder: getStr('placeholder', 'Add a tag'),
            tabindex: getInt('tabindex', ''),
            removeTagSymbol: getStr('removeTagSymbol', String.fromCharCode(215)),
            replaceSpacesWithDashes: getBool('replaceSpacesWithDashes', true),
            minLength: getInt('minLength', 3),
            maxLength: getInt('maxLength', ''),
            addOnEnter: getBool('addOnEnter', true),
            addOnSpace: getBool('addOnSpace', false),
            addOnComma: getBool('addOnComma', true),
            allowedTagsPattern: new RegExp(getStr('allowedTagsPattern', '^[a-zA-Z0-9\\s]+$')),
            enableEditingLastTag: getBool('enableEditingLastTag', false)
        };
    }

    return {
        restrict: 'A,E',
        scope: { tags: '=ngModel' },
        replace: false,
        transclude: true,
        template: '<div class="ngTagsInput {{ options.cssClass }}" ng-transclude>' +
                  '  <div class="tags">' +
                  '    <ul>' +
                  '      <li ng-repeat="tag in tags" ng-class="getCssClass($index)">' +
                  '        <span>{{ tag }}</span>' +
                  '        <button type="button" ng-click="remove($index)">{{ options.removeTagSymbol }}</button>' +
                  '      </li>' +
                  '    </ul>' +
                  '    <input type="text" placeholder="{{ options.placeholder }}" size="{{ options.placeholder.length }}" maxlength="{{ options.maxLength }}" tabindex="{{ options.tabindex }}" ng-model="newTag" ng-change="newTagChange()">' +
                  '  </div>' +
                  '</div>',
        controller: ["$scope","$attrs","$element", function($scope, $attrs, $element) {
            var shouldRemoveLastTag;

            loadOptions($scope, $attrs);

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
                    }

                    $scope.newTag = '';
                    changed = true;
                }
                return changed;
            };

            $scope.tryRemoveLast = function() {
                var changed = false;
                if ($scope.tags.length > 0) {
                    if ($scope.options.enableEditingLastTag) {
                        $scope.newTag = $scope.tags.pop();
                    }
                    else {
                        if (shouldRemoveLastTag) {
                            $scope.tags.pop();

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
                $scope.tags.splice(index, 1);
            };

            $scope.getCssClass = function(index) {
                var isLastTag = index === $scope.tags.length - 1;
                return shouldRemoveLastTag && isLastTag ? 'selected' : '';
            };

            $scope.$watch(function() { return $scope.newTag.length > 0; }, function() {
                shouldRemoveLastTag = false;
            });

            $scope.newTagChange = angular.noop;

            this.getNewTagInput = function() {
                var input = $element.find('input');
                input.changeValue = function(value) {
                    $scope.newTag = value;
                };

                input.change = function(handler) {
                    $scope.newTagChange = function() {
                        handler($scope.newTag);
                    };
                };

                return input;
            };
        }],
        link: function(scope, element) {
            var hotkeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace];
            var input = element.find('input');

            input.bind('keydown', function(e) {
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
            });

            element.find('div').bind('click', function() {
                input[0].focus();
            });
        }
    };
}]);

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
angular.module('tags-input').directive('autocomplete', ["$document", function($document) {
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
}]);

}());