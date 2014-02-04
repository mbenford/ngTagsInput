function generateArray(count, callback) {
    var array = [];
    for (var i = 1; i <= count; i++) {
        array.push(callback(i));
    }
    return array;
}