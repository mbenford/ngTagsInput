/***
 * @ngdoc service
 * @name tiUtil
 * @module ngTagsInput
 *
 * @description
 * Helper methods used internally by the directive. Should not be called directly from user code.
 */
export default function UtilService($timeout, $q) {
  'ngInject';

  let self = {};

  self.debounce = (fn, delay) => {
    let timeoutId;
    return function(...args) {
      $timeout.cancel(timeoutId);
      timeoutId = $timeout(function() { fn.apply(null, args); }, delay);
    };
  };

  self.makeObjectArray = (array, key) => {
    if (!angular.isArray(array) || array.length === 0 || angular.isObject(array[0])) {
      return array;
    }

    return array.map(item => ({ [key]: item }));
  };

  self.findInObjectArray = (array, obj, key, comparer) => {
    let item = null;
    comparer = comparer || self.defaultComparer;

    array.some(element => {
      if (comparer(element[key], obj[key])) {
        item = element;
        return true;
      }
    });

    return item;
  };

  self.defaultComparer = (a, b) => {
    // I'm aware of the internationalization issues regarding toLowerCase()
    // but I couldn't come up with a better solution right now
    return self.safeToString(a).toLowerCase() === self.safeToString(b).toLowerCase();
  };

  self.safeHighlight = (str, value) => {
    str = self.encodeHTML(str);
    value = self.encodeHTML(value);

    if (!value) {
      return str;
    }

    let escapeRegexChars = str => str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    let expression = new RegExp('&[^;]+;|' + escapeRegexChars(value), 'gi');

    return str.replace(expression, match => match.toLowerCase() === value.toLowerCase() ? '<em>' + match + '</em>' : match);
  };

  self.safeToString = value => angular.isUndefined(value) || value === null ? '' : value.toString().trim();

  self.encodeHTML = value => self.safeToString(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  self.handleUndefinedResult = (fn, valueIfUndefined) => {
    return function () {
      let result = fn.apply(null, arguments);
      return angular.isUndefined(result) ? valueIfUndefined : result;
    };
  };

  self.replaceSpacesWithDashes = str => self.safeToString(str).replace(/\s/g, '-');

  self.isModifierOn = event => event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;

  self.promisifyValue = value => {
    value = angular.isUndefined(value) ? true : value;
    return $q[value ? 'when' : 'reject']();
  };

  self.simplePubSub = function() {
    let events = {};
    return {
      on(names, handler, first) {
        names.split(' ').forEach(name => {
          if (!events[name]) {
            events[name] = [];
          }
          let method = first ? [].unshift : [].push;
          method.call(events[name], handler);
        });
        return this;
      },
      trigger(name, args) {
        let handlers = events[name] || [];
        handlers.every(handler => self.handleUndefinedResult(handler, true)(args));
        return this;
      }
    };
  };

  return self;
}
