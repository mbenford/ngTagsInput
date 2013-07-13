angular.module('tagsinput', []).directive('tagsInput', function() {
    return {
        restrict: 'A,E',
        scope: {
            tags: '=ngModel',
            cssClass: '@class'
        },
        template: '<div class="ngTagsInput {{ cssClass }}">' +
                  '  <span ng-repeat="tag in tags">{{ tag }}<button ng-click="remove($index)">&#10006;</button></span>' +
                  '  <input type="text" placeholder="{{ placeholder }}" size="{{ placeholder.length }}"  ng-model="newTag">' +
                  '</div>',
        controller: function($scope) {
            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };
        },
        link: function(scope, element, attributes) {
            scope.newTag = '';
            scope.placeholder = attributes.placeholder || 'Add a tag';

            var addOnEnter = attributes.addOnEnter || true,
                addOnSpace = attributes.addOnSpace || false,
                addOnComma = attributes.addOnComma || true;

            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            element.find('input').bind('keydown', function(event) {
                var key = event.keyCode;

                var shouldAdd = (key == ENTER && addOnEnter) ||
                                (key == COMMA && addOnComma) ||
                                (key == SPACE && addOnSpace) &&
                                scope.newTag.length > 0;

                if (shouldAdd) {
                    if (scope.tags.indexOf(scope.newTag) == -1) {
                        scope.tags.push(scope.newTag);
                    }
                    scope.newTag = '';
                    scope.$apply();
                    event.preventDefault();
                }
                else {
                    var shouldRemoveLast = key == BACKSPACE && scope.newTag.length === 0;

                    if (shouldRemoveLast) {
                        scope.tags.pop();
                        scope.$apply();
                    }
                }
            });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});
