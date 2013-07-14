angular.module('tags-input', []).directive('tagsInput', function() {
    return {
        restrict: 'E',
        scope: {
            tags: '=ngModel',
            cssClass: '@class'
        },
        replace: false,
        template: '<div class="ngTagsInput {{ cssClass }}">' +
                  '  <span ng-repeat="tag in tags">{{ tag }}<button ng-click="remove($index)">{{ removeTagSymbol }}</button></span>' +
                  '  <input type="text" placeholder="{{ placeholder }}" size="{{ placeholder.length }}"  ng-model="newTag">' +
                  '</div>',
        controller: function($scope, $attrs) {
            $scope.newTag = '';
            $scope.placeholder = $attrs.placeholder || 'Add a tag';
            $scope.removeTagSymbol = $attrs.removeTagSymbol || String.fromCharCode(215);

            $scope.add = function() {
                if ($scope.newTag.length === 0) return;

                if ($attrs.replaceSpacesWithDashes) {
                    $scope.newTag = $scope.newTag.replace(/\s/g, '-');
                }

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

            var addOnEnter = angular.isDefined(attrs.addOnEnter) ? attrs.addOnEnter === 'true' : true,
                addOnSpace = angular.isDefined(attrs.addOnSpace) ? attrs.addOnSpace === 'true': false,
                addOnComma = angular.isDefined(attrs.addOnComma) ? attrs.addOnComma === 'true': true;

            var allowedChars = new RegExp(attrs.allowedChars || '[A-Za-z0-9\\s]');

            element.find('input')
                .bind('keydown', function(e) {
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
                })
                .bind('keypress', function(e) {
                    if (!allowedChars.test(String.fromCharCode(e.keyCode))) {
                        e.preventDefault();
                    }
                });

            element.find('div').bind('click', function() {
                element.find('input')[0].focus();
            });
        }
    };
});
