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
            angular.forEach(events[name], function(handler) {
                handler.call(null, args);
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

function findInObjectArray(array, obj, key) {
    var item = null;
    for (var i = 0; i < array.length; i++) {
        // I'm aware of the internationalization issues regarding toLowerCase()
        // but I couldn't come up with a better solution right now
        if (array[i][key].toLowerCase() === obj[key].toLowerCase()) {
            item = array[i];
            break;
        }
    }
    return item;
}