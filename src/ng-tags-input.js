(function() {
'use strict';

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

var tagsInput = angular.module('tags-input', []);

tagsInput.directive('tagsInput', function($interpolate) {
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
        controller: function($scope, $attrs, $element) {
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
                        if ($scope.shouldRemoveLastTag) {
                            $scope.tags.pop();

                            $scope.shouldRemoveLastTag = false;
                        }
                        else {
                            $scope.shouldRemoveLastTag = true;
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
                return $scope.shouldRemoveLastTag && isLastTag ? 'selected' : '';
            };

            $scope.$watch(function() { return $scope.newTag.length > 0; }, function() {
                $scope.shouldRemoveLastTag = false;
            });

            $scope.newTagChange = angular.noop;

            this.getInputWrapper = function() {
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
        },
        link: function(scope, element) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            element.find('input')
                .bind('keydown', function(e) {
                    if (e.keyCode === ENTER && scope.options.addOnEnter ||
                        e.keyCode === COMMA && scope.options.addOnComma ||
                        e.keyCode === SPACE && scope.options.addOnSpace) {

                        if (scope.tryAdd()) {
                            scope.$apply();
                        }
                        e.preventDefault();
                    }
                    else if (e.keyCode === BACKSPACE && this.value.length === 0) {
                        if (scope.tryRemoveLast()) {
                            scope.$apply();

                            e.preventDefault();
                        }
                    }
                });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});

tagsInput.directive('autocomplete', function($document) {

    function Suggestions(loadFn) {
        var self = this;

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
            loadFn(text).then(function(items) {
                self.items = items;
                if (items.length > 0) {
                    self.show();
                }
            });
        };
        self.next = function() {
            self.select(++self.index);
        };
        self.prior = function() {
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
    }

    var hotkeys = {
        9: { name: 'tab' },
        13: { name: 'enter' },
        27: { name: 'escape' },
        38: { name: 'up' },
        40: { name: 'down' }
    };

    return {
        restrict: 'A,E',
        require: '?^tagsInput',
        scope: { source: '&'},
        template: '<div class="autocomplete" ng-show="suggestions.visible">' +
                  '  <ul class="suggestions">' +
                  '    <li class="suggestion" ng-repeat="item in suggestions.items"' +
                  '                           ng-class="{selected: item == suggestions.selected}"' +
                  '                           ng-click="addSuggestion()"' +
                  '                           ng-mouseenter="selectSuggestion($index)">{{ item }}</li>' +
                  '  </ul>' +
                  '</div>',
        controller: function() {
        },
        link: function(scope, element, attrs, tagsInput) {
            var input = tagsInput.getInputWrapper();
            input.change(function(value) {
                if (value) {
                    scope.loadSuggestions(value);
                } else {
                    scope.hideSuggestions();
                }
            });

            scope.suggestions = new Suggestions(scope.source());

            scope.loadSuggestions = function(text) {
                if (scope.suggestions.selected === text) {
                    return;
                }
                scope.suggestions.load(text);
            };

            scope.showSuggestions = function () {
                scope.suggestions.show();
            };

            scope.hideSuggestions = function() {
                scope.suggestions.reset();
            };

            scope.nextSuggestion = function() {
                if (scope.suggestions.visible) {
                    scope.suggestions.next();
                }
                else {
                    scope.loadSuggestions('');
                }
            };

            scope.priorSuggestion = function() {
                scope.suggestions.prior();
            };

            scope.selectSuggestion = function(index) {
                scope.suggestions.select(index);
            };

            scope.addSuggestion = function() {
                if (scope.suggestions.selected) {
                    input.changeValue(scope.suggestions.selected);
                }
                scope.hideSuggestions();

                input[0].focus();
            };

            input.bind('keydown', function(e) {
                var key = hotkeys[e.keyCode];

                if (!key) {
                    return;
                }

                if (key.name === 'down') {
                    scope.nextSuggestion();
                    e.preventDefault();
                    scope.$apply();
                }
                else if (scope.suggestions.visible) {
                    if (key.name === 'up') {
                        scope.priorSuggestion();
                    }
                    else if (key.name === 'escape') {
                        scope.hideSuggestions();
                    }
                    else if (key.name === 'enter' || key.name === 'tab') {
                        scope.addSuggestion();
                    }
                    e.preventDefault();
                    scope.$apply();
                }
            });

            $document.bind('click', function(e) {
                if (scope.suggestions.visible) {
                    scope.hideSuggestions();
                    scope.$apply();
                }
            });
        }
    };
});

}());
