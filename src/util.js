'use strict';

function SimplePubSub() {
    var events = {};
    return {
        on: function(names, handler) {
            names.split(' ').forEach(function(name) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            });
            return this;
        },
        trigger: function(name, args) {
            var handlers = events[name] || [];
            handlers.every(function(handler) {
                var retVal = handler.call(null, args);
                return angular.isUndefined(retVal) || retVal;
            });
            return this;
        }
    };
}

function makeObjectArray(array, key) {
    array = array || [];
    if (array.length > 0 && !angular.isObject(array[0])) {
        array.forEach(function(item, index) {
            array[index] = {};
            array[index][key] = item;
        });
    }
    return array;
}

function findInObjectArray(array, obj, key, caseInsesitive) {
    var item = null;
    for (var i = 0; i < array.length; i++) {
        if(caseInsesitive && safeToString(array[i][key]) === safeToString(obj[key])) {
            item = array[i];
            break;
        } else if(!caseInsesitive && safeToString(array[i][key]).toLocaleLowerCase() === safeToString(obj[key]).toLocaleLowerCase()) {
            item = array[i];
            break;
        }
    }
    return item;
}

function safeHighlight(str, value) {
    if (!value) {
        return str;
    }

    function escapeRegexChars(str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    var expression = new RegExp('&[^;]+;|' + escapeRegexChars(value), 'gi');
    return str.replace(expression, function(match) {
        return match === value ? '<em>' + value + '</em>' : match;
    });
}

function safeToString(value) {
    return angular.isUndefined(value) || value == null ? '' : value.toString().trim();
}

function encodeHTML(value) {
    return value.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
}