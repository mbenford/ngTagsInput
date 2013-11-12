(function() {
'use strict';

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
angular.module('tags-input').directive('tagsInput', function($interpolate) {
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
        scope: { tags: '=ngModel', onTagAdded: '&', onTagRemoved: '&' },
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
                  '    <input type="text"' +
                  '           placeholder="{{ options.placeholder }}"' +
                  '           size="{{ options.placeholder.length }}"' +
                  '           maxlength="{{ options.maxLength }}"' +
                  '           tabindex="{{ options.tabindex }}"' +
                  '           ng-model="newTag"' +
                  '           ng-change="newTagChange()">' +
                  '  </div>' +
                  '</div>',
        controller: function($scope, $attrs, $element) {
            var shouldRemoveLastTag;

            loadOptions($scope, $attrs);

            $scope.newTag = '';
            $scope.tags = $scope.tags || [];

            var onTagAdded = function(tag){
                if ($scope.onTagAdded){
                    $scope.onTagAdded({tag: tag});
                }
            };
            var onTagRemoved = function(tag){
                if ($scope.onTagRemoved){
                    $scope.onTagRemoved({tag: tag});
                }
            };
            
            $scope.tryAdd = function() {
                var changed = false;
                var tag = $scope.newTag;

                if (tag.length >= $scope.options.minLength && $scope.options.allowedTagsPattern.test(tag)) {

                    if ($scope.options.replaceSpacesWithDashes) {
                        tag = tag.replace(/\s/g, '-');
                    }

                    if ($scope.tags.indexOf(tag) === -1) {
                        $scope.tags.push(tag);
                        onTagAdded(tag);
                    }

                    $scope.newTag = '';
                    changed = true;
                }
                return changed;
            };

            $scope.tryRemoveLast = function() {
                var changed = false;
                var tagRemoved;
                if ($scope.tags.length > 0) {
                    if ($scope.options.enableEditingLastTag) {
                        tagRemoved = $scope.tags.pop();
                        $scope.newTag = tagRemoved;
                    }
                    else {
                        if (shouldRemoveLastTag) {
                            tagRemoved = $scope.tags.pop();

                            shouldRemoveLastTag = false;
                        }
                        else {
                            shouldRemoveLastTag = true;
                        }
                    }
                    changed = true;
                    
                    if (tagRemoved){
                        onTagRemoved(tagRemoved);
                    }
                }
                return changed;
            };

            $scope.remove = function(index) {
                var tagToRemove = $scope.tags[index];
                $scope.tags.splice(index, 1);
                onTagRemoved(tagToRemove);
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
        },
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
});

}());