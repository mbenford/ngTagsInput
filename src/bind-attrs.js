'use strict';
/* global console*/

/**
 * @ngdoc directive
 * @name tiBindAttrs
 * @module ngTagsInput
 *
 * @description
 * Binds attributes to expressions. Used internally by tagsInput directive.
 */
tagsInput.directive('tiBindAttrs', function() {
    return function(scope, element, attrs) {
        scope.$watch(attrs.tiBindAttrs, function(value) {
            angular.forEach(value, function(value, key) {
                try {
                    attrs.$set(key, value);
                } catch (error) {
                    // workaround for jQuery 1.8 (https://bugs.jquery.com/ticket/13011)
                    // see https://github.com/mbenford/ngTagsInput/issues/405
                    if (console && console.error) {
                        console.error('Error while setting ' + key + ' to ' + value + ': ' + error.message);
                    }
                }
            });
        }, true);
    };
});