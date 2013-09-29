(function() {
'use strict';

angular.module('tags-input', []).directive('tagsInput', function() {
    function toBool(value, defaultValue) {
        return angular.isDefined(value) ? value === 'true' : defaultValue;
    }

    return {
        restrict: 'A,E',
        scope: { tags: '=ngModel', cssClass: '@ngClass', onTagAdded: '&', onTagRemoved: '&'},
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
            $scope.allowedTagsPattern = new RegExp($attrs.allowedTagsPattern || '^[a-zA-Z0-9\\s]+$');
            $scope.enableEditingLastTag = toBool($attrs.enableEditingLastTag, false);

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

                if (tag.length >= $scope.minLength && $scope.allowedTagsPattern.test(tag)) {

                    if ($scope.replaceSpacesWithDashes) {
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
                    if ($scope.enableEditingLastTag) {
                        tagRemoved = $scope.tags.pop();
                        $scope.newTag = tagRemoved;
                    }
                    else {
                        if ($scope.shouldRemoveLastTag) {
                            tagRemoved = $scope.tags.pop();

                            $scope.shouldRemoveLastTag = false;
                        }
                        else {
                            $scope.shouldRemoveLastTag = true;
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
}());
