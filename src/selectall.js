/**
 * @ngdoc directive
 * @name tiSelectall
 * @module ngTagsInput
 *
 * @description
 * Automatically select all and focus the input. Used internally by tagsInput directive.
 */

export default function SelectallDirective($timeout, $parse) {
  'ngInject';
  return {
    scope: {},
    link(scope, element, attrs) {
      scope.selectAll = false;
      let model = $parse(attrs.tiSelectall);
      let selectAll = () => {
        $timeout(() => {
          element[0].focus();
          element[0].select();
        });
      };
      scope.$watch(model, (value) =>{
        if (value === true) {
          selectAll();
        }
        scope.selectAll = value;
      });
    }
  };
}