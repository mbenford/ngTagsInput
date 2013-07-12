angular.module('ngTagsInput', []).directive('tagsInput', function() {
    return {
        restrict: 'A,E',
        scope: { tags: '=ngModel' },
        template: '<div class="ngTagsInput">' +
                  '<span class="ngTagsInput" ng-repeat="tag in tags">{{ tag }}<button class="ngTagsInput" ng-click="remove($index)">&#10006;</button></span>' +
                  '<input class="ngTagsInput" placeholder="Add a tag" type="text" ng-model="newTag">' +
                  '</div>',
        controller: function($scope) {
            $scope.newTag = '';
            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };
        },
        link: function(scope, element) {
            var ENTER = 13;
            var COMMA = 188;

            var input = element.find('input');
            input.bind('keydown', function(event) {
                var key = event.keyCode;

                if ((key == ENTER || key == COMMA) && scope.newTag.length > 0) {
                    if (scope.tags.indexOf(scope.newTag) == -1) {
                        scope.tags.push(scope.newTag);
                    }
                    scope.newTag = '';
                    scope.$apply();
                    event.preventDefault();
                }
                else if (key == 8 && scope.newTag.length == 0) {
                    scope.tags.pop();
                    scope.$apply();
                }

                input.attr('size', Math.max(scope.newTag.length + 5, 10));
            });

            var div = element.find('div');
            div.bind('click', function() {
                input[0].focus();
            });
        }
    };
});
