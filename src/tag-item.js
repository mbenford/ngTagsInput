'use strict';

/**
 * @ngdoc directive
 * @name tiTagItem
 * @module ngTagsInput
 *
 * @description
 * Represents a tag item. Used internally by the tagsInput directive.
 */
tagsInput.directive('tiTagItem', function(tiUtil) {
    return {
        restrict: 'E',
        require: '^tagsInput',
        template: '<ng-include src="$$template"></ng-include>',
        scope: { data: '=' },
        link: function(scope, element, attrs, tagsInputCtrl) {
            var tagsInput = tagsInputCtrl.registerTagItem(),
                options = tagsInput.getOptions();

            scope.$$template = options.template;
            scope.$$removeTagSymbol = options.removeTagSymbol;

            scope.$getDisplayText = function() {
                return tiUtil.safeToString(scope.data[options.displayProperty]);
            };
            scope.$removeTag = function() {
                tagsInput.removeTag(scope.$index);
            };

            scope.$watch('$parent.$index', function(value) {
                scope.$index = value;
            });

            element.parent().click(function() {
                var hostContainerElement = element.parent().parent().parent().parent();
                if (element.offset().left < hostContainerElement.offset().left) {
                    hostContainerElement.animate({
                        scrollLeft: element.parent().offset().left - element.parent().parent().parent().offset().left
                    });
                }
            });            
        }
    };
});
