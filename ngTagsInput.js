'use strict';

angular.module('tags-input', []).directive('tagsInput', function() {
    function toBool(value, defaultValue) {
        return angular.isDefined(value) ? value === 'true' : defaultValue;
    }

    return {
        restrict: 'E',
        scope: { tags: '=ngModel', cssClass: '@class' },
        replace: false,
        template: '<div class="ngTagsInput {{ cssClass }}">' +
                  '  <div class="tag" ng-repeat="tag in tags">' +
                  '    <span>{{ tag }}</span><button type="button" class="removeTag" ng-click="remove($index)">{{ removeTagSymbol }}</button>' +
                  '  </div>' +
                  '  <input class="newTag" type="text" placeholder="{{ placeholder }}" size="{{ placeholder.length }}" maxlength="{{ maxLength }}" ng-model="newTag">' +
                  '</div>',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
            $scope.newTag = '';
            $scope.placeholder = $attrs.placeholder || 'Add a tag';
            $scope.removeTagSymbol = $attrs.removeTagSymbol || String.fromCharCode(215);
            $scope.replaceSpacesWithDashes = toBool($attrs.replaceSpacesWithDashes, true);
            $scope.minLength = $attrs.minLength || 3;
            $scope.maxLength = Math.max($attrs.maxLength || $scope.placeholder.length, $scope.minLength);

            if (!angular.isDefined($scope.tags)) {
                $scope.tags = [];
            }

            $scope.add = function() {
                if ($scope.replaceSpacesWithDashes) {
                    $scope.newTag = $scope.newTag.replace(/\s/g, '-');
                }

                if ($scope.tags.indexOf($scope.newTag) == -1) {
                    $scope.tags.push($scope.newTag);
                }

                $scope.newTag = '';
            };

            $scope.removeLast = function() {
                $scope.tags.pop();
            };

            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };
        }],
        link: function(scope, element, attrs) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            var addOnEnter = toBool(attrs.addOnEnter, true),
                addOnSpace = toBool(attrs.addOnSpace, false),
                addOnComma = toBool(attrs.addOnComma, true),
                allowedChars = new RegExp(attrs.allowedChars || '[A-Za-z0-9\\s]');

            element.find('input')
                .bind('keydown', function(e) {
                    if ((e.keyCode == ENTER && addOnEnter ||
                         e.keyCode == COMMA && addOnComma ||
                         e.keyCode == SPACE && addOnSpace) && this.value.trim().length >= scope.minLength) {
                        scope.add();
                        scope.$apply();

                        e.preventDefault();
                    }
                    else if (e.keyCode == BACKSPACE && this.value.length == 0) {
                        scope.removeLast();
                        scope.$apply();
                    }
                })
                .bind('keypress', function(e) {
                    if (!allowedChars.test(String.fromCharCode(e.charCode))) {
                        e.preventDefault();
                    }
                });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});
