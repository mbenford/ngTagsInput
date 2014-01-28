'use strict';

/**
 * @ngdoc service
 * @name tagsInput.service:tagsInputConfig
 *
 * @description
 * Sets global default configuration options for tagsInput and autoComplete directives. It's also used internally to parse and
 * initialize options from HTML attributes.
 */
tagsInput.provider('tagsInputConfig', function() {
    var globalDefaults = {};

    /**
     * @ngdoc method
     * @name setDefaults
     * @description Sets the default configuration option for a directive.
     * @methodOf tagsInput.service:tagsInputConfig
     *
     * @param {string} directive Name of the directive to be configured. Must be either 'tagsInput' or 'autoComplete'.
     * @param {object} defaults Object containing options and their values.
     *
     * @returns {object} The service itself for chaining purposes.
     */
    this.setDefaults = function(directive, defaults) {
        globalDefaults[directive] = defaults;
        return this;
    };

    this.$get = function($interpolate) {
        var converters = {};
        converters[String] = function(value) { return value; };
        converters[Number] = function(value) { return parseInt(value, 10); };
        converters[Boolean] = function(value) { return value.toLowerCase() === 'true'; };
        converters[RegExp] = function(value) { return new RegExp(value); };

        return {
            load: function(directive, scope, attrs, options) {
                scope.options = {};

                angular.forEach(options, function(value, key) {
                    var interpolatedValue = attrs[key] && $interpolate(attrs[key])(scope.$parent),
                        converter = converters[value[0]],
                        getDefault = function(key) {
                            var globalValue = globalDefaults[directive] && globalDefaults[directive][key];
                            return angular.isDefined(globalValue) ? globalValue : value[1];
                        };

                    scope.options[key] = interpolatedValue ? converter(interpolatedValue) : getDefault(key);
                });
            }
        };
    };
});
