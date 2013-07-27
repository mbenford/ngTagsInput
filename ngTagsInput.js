(function() {
'use strict';

angular.module('tags-input', []).directive('tagsInput', function() {
    function toBool(value, defaultValue) {
        return angular.isDefined(value) ? value === 'true' : defaultValue;
    }

    return {
        restrict: 'A,E',
        scope: { tags: '=ngModel', cssClass: '@class' },
        replace: false,
        template: '<div class="ngTagsInput {{ cssClass }}">' +
                  '  <ul class="tag" ng-repeat="tag in tags">' +
                  '    <li><span>{{ tag }}</span><button type="button" class="removeTag" ng-click="remove($index)">{{ removeTagSymbol }}</button></li>' +
                  '  </ul>' +
                  '  <input class="newTag" type="text" placeholder="{{ placeholder }}" size="{{ placeholder.length }}" maxlength="{{ maxLength }}">' +
                  '</div>',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
            $scope.placeholder = $attrs.placeholder || 'Add a tag';
            $scope.removeTagSymbol = $attrs.removeTagSymbol || String.fromCharCode(215);
            $scope.replaceSpacesWithDashes = toBool($attrs.replaceSpacesWithDashes, true);
            $scope.minLength = $attrs.minLength || 3;
            $scope.maxLength = Math.max($attrs.maxLength || $scope.placeholder.length, $scope.minLength);
            $scope.addOnEnter = toBool($attrs.addOnEnter, true);
            $scope.addOnSpace = toBool($attrs.addOnSpace, false);
            $scope.addOnComma = toBool($attrs.addOnComma, true);
            $scope.allowedChars = new RegExp($attrs.allowedChars || '[A-Za-z0-9\\s]');

            if (!angular.isDefined($scope.tags)) {
                $scope.tags = [];
            }

            $scope.add = function(tag) {
                if ($scope.replaceSpacesWithDashes) {
                    tag = tag.replace(/\s/g, '-');
                }

                if ($scope.tags.indexOf(tag) === -1) {
                    $scope.tags.push(tag);
                }
            };

            $scope.removeLast = function() {
                $scope.tags.pop();
            };

            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };
        }],
        link: function(scope, element) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            element.find('input')
                .bind('keydown', function(e) {
                    if ((e.keyCode === ENTER && scope.addOnEnter ||
                         e.keyCode === COMMA && scope.addOnComma ||
                         e.keyCode === SPACE && scope.addOnSpace) && this.value.trim().length >= scope.minLength) {

                        scope.add(this.value.trim());
                        scope.$apply();

                        this.value = '';
                        e.preventDefault();
                    }
                    else if (e.keyCode === BACKSPACE && this.value.length === 0) {
                        scope.removeLast();
                        scope.$apply();
                    }
                })
                .bind('keypress', function(e) {
                    if (!scope.allowedChars.test(String.fromCharCode(e.charCode))) {
                        e.preventDefault();
                    }
                });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});
}());