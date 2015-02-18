'use strict';

function generateArray(count, callback) {
    var array = [];
    for (var i = 1; i <= count; i++) {
        array.push(callback(i));
    }
    return array;
}

function changeElementValue(input, value) {
    input.val(value);
    if ('oninput' in input) {
        input.trigger('input');
    }
    else {
        // 'input' doesn't work in Opera, so 'change' is used instead
        input.trigger('change');
    }
}