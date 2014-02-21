'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:tiAutosize
 *
 * @description
 * Automatically sets the input's width so its content is always visible. Used internally by tagsInput directive.
 */
tagsInput.directive('tiAutosize', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            var span, resize;

            span = angular.element('<span class="input"></span>');
            span.css('display', 'none')
                .css('visibility', 'hidden')
                .css('width', 'auto');

            element.parent().append(span);

            resize = function(value) {
                var originalValue = value;

                if (angular.isString(value) && value.length === 0) {
                    value = element.attr('placeholder');
                }
                span.text(value);
                span.css('display', '');
                try {
                    element.css('width', span.prop('offsetWidth') + 'px');
                }
                finally {
                    span.css('display', 'none');
                }

                return originalValue;
            };

            ctrl.$parsers.unshift(resize);
            ctrl.$formatters.unshift(resize);
        }
    };
});