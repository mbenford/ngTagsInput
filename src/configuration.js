/**
 * @ngdoc service
 * @name tagsInputConfig
 * @module ngTagsInput
 *
 * @description
 * Sets global configuration settings for both tagsInput and autoComplete directives. It's also used internally to parse and
 *  initialize options from HTML attributes.
 */
export default function TagsInputConfigurationProvider() {
  'ngInject';

  let globalDefaults = {};
  let interpolationStatus = {};
  let autosizeThreshold = 3;

  /**
   * @ngdoc method
   * @name tagsInputConfig#setDefaults
   * @description Sets the default configuration option for a directive.
   *
   * @param {string} directive Name of the directive to be configured. Must be either 'tagsInput' or 'autoComplete'.
   * @param {object} defaults Object containing options and their values.
   *
   * @returns {object} The service itself for chaining purposes.
   */
  this.setDefaults = (directive, defaults) => {
    globalDefaults[directive] = defaults;
    return this;
  };

  /**
   * @ngdoc method
   * @name tagsInputConfig#setActiveInterpolation
   * @description Sets active interpolation for a set of options.
   *
   * @param {string} directive Name of the directive to be configured. Must be either 'tagsInput' or 'autoComplete'.
   * @param {object} options Object containing which options should have interpolation turned on at all times.
   *
   * @returns {object} The service itself for chaining purposes.
   */
  this.setActiveInterpolation = (directive, options) => {
    interpolationStatus[directive] = options;
    return this;
  };

  /**
   * @ngdoc method
   * @name tagsInputConfig#setTextAutosizeThreshold
   * @description Sets the threshold used by the tagsInput directive to re-size the inner input field element based on its contents.
   *
   * @param {number} threshold Threshold value, in pixels.
   *
   * @returns {object} The service itself for chaining purposes.
   */
  this.setTextAutosizeThreshold = threshold => {
    autosizeThreshold = threshold;
    return this;
  };

  this.$get = $interpolate => {
    'ngInject';

    let converters = {
      [String]: value => value.toString(),
      [Number]: value => parseInt(value, 10),
      [Boolean]: value => value.toLowerCase() === 'true',
      [RegExp]: value => new RegExp(value)
    };

    return {
      load(directive, element, attrs, events, optionDefinitions) {
        let defaultValidator = () => true;
        let options = {};

        angular.forEach(optionDefinitions, (value, key) => {
          let type = value[0];
          let localDefault = value[1];
          let validator = value[2] || defaultValidator;
          let converter = converters[type];

          let getDefault = () => {
            let globalValue = globalDefaults[directive] && globalDefaults[directive][key];
            return angular.isDefined(globalValue) ? globalValue : localDefault;
          };

          let updateValue = value => {
            options[key] = value && validator(value) ? converter(value) : getDefault();
          };

          if (interpolationStatus[directive] && interpolationStatus[directive][key]) {
            attrs.$observe(key, value => {
              updateValue(value);
              events.trigger('option-change', { name: key, newValue: value });
            });
          }
          else {
            updateValue(attrs[key] && $interpolate(attrs[key])(element.scope()));
          }
        });

        return options;
      },
      getTextAutosizeThreshold() {
        return autosizeThreshold;
      }
    };
  };
}
