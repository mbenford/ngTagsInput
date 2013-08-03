(function() {
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
                  '  <ul>' +
                  '    <li ng-repeat="tag in tags"><span>{{ tag }}</span><button type="button" ng-click="remove($index)">{{ removeTagSymbol }}</button></li>' +
                  '  </ul>' +
                  '  <input type="text" placeholder="{{ placeholder }}" size="{{ placeholder.length }}" maxlength="{{ maxLength }}" ng-model="newTag">' +
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

            $scope.newTag = '';
            $scope.tags = $scope.tags || [];

            $scope.tryAdd = function() {
                var added = false;
                var tag = $scope.newTag;

                if (tag.length >= $scope.minLength) {

                    if ($scope.replaceSpacesWithDashes) {
                        tag = tag.replace(/\s/g, '-');
                    }

                    if ($scope.tags.indexOf(tag) === -1) {
                        $scope.tags.push(tag);

                        added = true;
                    }

                    $scope.newTag = '';
                }
                return added;
            };

            $scope.tryRemoveLast = function() {
                var removed = false;
                if ($scope.newTag.length === 0) {
                    $scope.tags.pop();

                    removed = true;
                }
                return removed;
            };

            $scope.remove = function(index) {
                $scope.tags.splice(index, 1);
            };

            $scope.$watch('newTag', function (newValue, oldValue) {
              //  console.log(newValue);
            });
        }],
        link: function(scope, element) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            element.find('input')
                .bind('keydown', function(e) {
                    if (e.keyCode === ENTER && scope.addOnEnter ||
                        e.keyCode === COMMA && scope.addOnComma ||
                        e.keyCode === SPACE && scope.addOnSpace) {

                        if (scope.tryAdd(this.value.trim()))
                            scope.$apply();

                        e.preventDefault();
                    }
                    else if (e.keyCode === BACKSPACE) {
                        if (scope.tryRemoveLast())
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