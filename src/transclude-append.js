/**
 * @ngdoc directive
 * @name tiTranscludeAppend
 * @module ngTagsInput
 *
 * @description
 * Re-creates the old behavior of ng-transclude. Used internally by tagsInput directive.
 */
export default function TranscludeAppendDirective() {
  return (scope, element, attrs, ctrl, transcludeFn) => {
    transcludeFn(clone => {
      element.append(clone);
    });
  };
}