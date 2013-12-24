'use strict';

/**
 * @ngdoc service
 * @name tagsInput.service:tiConfiguration
 *
 * @description
 * Loads and initializes options from HTML attributes. Used internally by tagsInput and autoComplete directives.
 */
tagsInput.service('tiConfiguration', function($interpolate) {
    this.load = function(scope, attrs, options) {
        var converters = {};
        converters[String] = function(value) { return value; };
        converters[Number] = function(value) { return parseInt(value, 10); };
        converters[Boolean] = function(value) { return value === 'true'; };
        converters[RegExp] = function(value) { return new RegExp(value); };

        scope.options = {};

        angular.forEach(options, function(value, key) {
            var interpolatedValue = attrs[key] && $interpolate(attrs[key])(scope.$parent),
                converter = converters[options[key].type];

            scope.options[key] = interpolatedValue ? converter(interpolatedValue) : options[key].defaultValue;
        });
    };
});
