angular.module('tags-input', []).directive('tagsInput', function() {
    return {
        restrict: 'E',
        scope: {
            tags: '=ngModel',
            cssClass: '@class'
        },
        replace: false,
        template: '<div class="ngTagsInput {{ cssClass }}">' +
                  '  <span ng-repeat="tag in tags">{{ tag }}<button ng-click="remove($index)">&#10006;</button></span>' +
                  '  <input type="text" placeholder="{{ placeholder }}" size="{{ placeholder.length }}"  ng-model="newTag">' +
                  '</div>',
        controller: function($scope, $attrs) {
            $scope.newTag = '';
            $scope.placeholder = $attrs.placeholder || 'Add a tag';

            $scope.add = function() {
                if ($scope.newTag.length === 0) return;

                if ($scope.tags.indexOf($scope.newTag) == -1) {
                    $scope.tags.push($scope.newTag);
                }

                $scope.newTag = '';
            };

            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };

            $scope.tryRemoveLast = function() {
                if ($scope.newTag.length > 0) return;

                $scope.tags.pop();
            };
        },
        link: function(scope, element, attrs) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            var addOnEnter = attrs.addOnEnter || true,
                addOnSpace = attrs.addOnSpace || false,
                addOnComma = attrs.addOnComma || true;

            element.find('input').bind('keydown', function(e) {
                if (e.keyCode == ENTER && addOnEnter ||
                    e.keyCode == COMMA && addOnComma ||
                    e.keyCode == SPACE && addOnSpace) {
                    scope.add();
                    scope.$apply();

                    event.preventDefault();
                }
                else if (e.keyCode == BACKSPACE) {
                    scope.tryRemoveLast();
                    scope.$apply();
                }
            });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});
