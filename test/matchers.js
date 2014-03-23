'use strict';

var customMatchers = {
    toHaveClass: function () {
        return {
            compare: function(actual, expected) {
                var result = {};
                result.pass = actual.hasClass(expected);
                result.message = 'Expected element' + (result.pass ? ' not ' : ' ') + 'to have class \'' + expected + '\'';
                return result;
            }
        };
    }
};
