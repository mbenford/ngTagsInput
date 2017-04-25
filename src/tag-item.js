/**
 * @ngdoc directive
 * @name tiTagItem
 * @module ngTagsInput
 *
 * @description
 * Represents a tag item. Used internally by the tagsInput directive.
 */
export default function TagItemDirective(tiUtil) {
  'ngInject';

  return {
    restrict: 'E',
    require: '^tagsInput',
    template: '<ng-include src="$$template"></ng-include>',
    scope: {
      $scope: '=scope',
      data: '='
    },
    link(scope, element, attrs, tagsInputCtrl) {
      let tagsInput = tagsInputCtrl.registerTagItem();
      let options = tagsInput.getOptions();

      scope.$$template = options.template;
      scope.$$removeTagSymbol = options.removeTagSymbol;

      scope.$getDisplayText = () => tiUtil.safeToString(scope.data[options.displayProperty]);
      scope.$removeTag = () => {
        tagsInput.removeTag(scope.$index);
      };

      scope.$watch('$parent.$index', value => {
        scope.$index = value;
      });
    }
  };
}
