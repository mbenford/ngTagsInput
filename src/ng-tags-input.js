(function() {
'use strict';

angular.module('tags-input', []).directive('tagsInput', function() {
    function toBool(value, defaultValue) {
        return angular.isDefined(value) ? value === 'true' : defaultValue;
    }

    return {
        restrict: 'E',
        scope: { tags: '=ngModel', cssClass: '@classes' },
        replace: false,
        template: '<div class="ngTagsInput {{ cssClass }}">' +
                  '  <ul>' +
                  '    <li ng-repeat="tag in tags" ng-class="getCssClass($index)"><span>{{ tag }}</span><button type="button" ng-click="remove($index)">{{ removeTagSymbol }}</button></li>' +
                  '  </ul>' +
                  '  <input type="text" placeholder="{{ placeholder }}" size="{{ placeholder.length }}" maxlength="{{ maxLength }}" tabindex="{{ tabindex }}" ng-model="newTag">' +
                  '</div>',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
            $scope.placeholder = $attrs.placeholder || 'Add a tag';
            $scope.tabindex= $attrs.tabindex;
            $scope.removeTagSymbol = $attrs.removeTagSymbol || String.fromCharCode(215);
            $scope.replaceSpacesWithDashes = toBool($attrs.replaceSpacesWithDashes, true);
            $scope.minLength = $attrs.minLength || 3;
            $scope.maxLength = Math.max($attrs.maxLength || $scope.placeholder.length, $scope.minLength);
            $scope.addOnEnter = toBool($attrs.addOnEnter, true);
            $scope.addOnSpace = toBool($attrs.addOnSpace, false);
            $scope.addOnComma = toBool($attrs.addOnComma, true);
            $scope.allowedChars = new RegExp($attrs.allowedChars || '[A-Za-z0-9\\s]');
            $scope.pattern = new RegExp($attrs.pattern || '.*');

            $scope.newTag = '';
            $scope.tags = $scope.tags || [];

            $scope.tryAdd = function() {
                var changed = false;
                var tag = $scope.newTag;

                if (tag.length >= $scope.minLength && $scope.pattern.test(tag)) {

                    if ($scope.replaceSpacesWithDashes) {
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
                if ($scope.newTag.length === 0 && $scope.tags.length > 0) {
                    if ($scope.shouldRemoveLastTag) {
                        $scope.newTag = $scope.tags.pop();

                        $scope.shouldRemoveLastTag = false;
                    }
                    else {
                        $scope.shouldRemoveLastTag = true;
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

        }],
        link: function(scope, element) {
            var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

            element.find('input')
                .bind('keydown', function(e) {
                    if (e.keyCode === ENTER && scope.addOnEnter ||
                        e.keyCode === COMMA && scope.addOnComma ||
                        e.keyCode === SPACE && scope.addOnSpace) {

                        if (scope.tryAdd()) {
                            scope.$apply();
                        }
                        e.preventDefault();
                    }
                    else if (e.keyCode === BACKSPACE) {
                        if (scope.tryRemoveLast()) {
                            scope.$apply();
                        }
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
