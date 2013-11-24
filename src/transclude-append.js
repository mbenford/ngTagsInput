(function() {
'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:transcludeAppend
 *
 * @description
 * Re-creates the old behavior of ng-transclude.
 */
angular.module('tags-input').directive('transcludeAppend', function() {
    return function(scope, element, attrs, ctrl, transcludeFn) {
        transcludeFn(function(clone) {
            element.append(clone);
        });
    };
});

}());