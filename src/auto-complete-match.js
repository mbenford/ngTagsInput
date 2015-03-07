'use strict';

/**
 * @ngdoc directive
 * @name tiAutocompleteMatch
 * @module ngTagsInput
 *
 * @description
 * Represents an autocomplete match. Used internally by the tagsInput directive.
 */
tagsInput.directive('tiAutocompleteMatch', function($sce, tiUtil) {
    return {
        restrict: 'E',
        require: '^autoComplete',
        template: '<ng-include src="template"></ng-include>',
        scope: { data: '=' },
        link: function(scope, element, attrs, autoCompleteCtrl) {
            var autoComplete = autoCompleteCtrl.registerAutocompleteMatch(),
                options = autoComplete.getOptions();

            scope.template = options.template;

            scope.util = {
                highlight: function(text) {
                    if (options.highlightMatchedText) {
                        text = tiUtil.safeHighlight(text, autoComplete.getQuery());
                    }
                    return $sce.trustAsHtml(text);
                },
                getDisplayText: function() {
                    return tiUtil.safeToString(scope.data[options.displayProperty || options.tagsInput.displayProperty]);
                }
            };
        }
    };
});
