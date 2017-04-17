'use strict';

/**
 * @ngdoc directive
 * @name autoCompleteTrigger
 * @module ngTagsInput
 *
 * @description
 * Provides an autocomplete trigger button.
 */
tagsInput.directive('autoCompleteTrigger', function(tiUtil) {
    return {
        restrict: 'E',
        require: '^tagsInput',
        templateUrl: 'ngTagsInput/auto-complete-trigger.html',
        scope: { data: '=' },
        controller: function($scope, $element, $attrs) {
            $scope.events = tiUtil.simplePubSub();
        },
        link: function(scope, element, attrs, tagsInputCtrl) {
            var tagsInput = tagsInputCtrl.registerAutocompleteTrigger(),
                events = scope.events;

            scope.triggerAutocomplete = function() {
                events.trigger('trigger-clicked');
            };

            events.on('trigger-clicked', function() {
                tagsInput.loadSuggestions();
            });
        }
    };
});
