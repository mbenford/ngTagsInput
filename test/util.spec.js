'use strict';

describe('tiUtil factory', function() {
    var tiUtil;

    beforeEach(function() {
        module('ngTagsInput');
        inject(function(_tiUtil_) {
            tiUtil = _tiUtil_;
        });
    });

    describe('simplePubSub', function() {
        var sut;

        beforeEach(function() {
            sut = tiUtil.simplePubSub();
        });

        it('subscribes to an event', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            sut.on('foo', callback);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback).toHaveBeenCalledWith('some data');
        });

        it('subscribes to multiple events', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            sut.on('foo bar', callback);
            sut.trigger('foo', 'some data');
            sut.trigger('bar', 'some other data');

            // Assert
            expect(callback.calls.count()).toBe(2);
            expect(callback.calls.argsFor(0)).toEqual(['some data']);
            expect(callback.calls.argsFor(1)).toEqual(['some other data']);
        });

        it('subscribes multiple times to the same event', function() {
            // Arrange
            var callback1 = jasmine.createSpy(),
                callback2 = jasmine.createSpy();

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback1).toHaveBeenCalledWith('some data');
            expect(callback2).toHaveBeenCalledWith('some data');
        });

        it('stops the propagation of an event', function() {
            // Arrange
            var callback1 = jasmine.createSpy().and.returnValue(false),
                callback2 = jasmine.createSpy();

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback1).toHaveBeenCalledWith('some data');
            expect(callback2).not.toHaveBeenCalled();
        });

        it('returns the object instance so calls can be chained', function() {
            // Arrange
            var callback1 = jasmine.createSpy(),
                callback2 = jasmine.createSpy();

            // Act
            sut.on('foo', callback1)
               .on('bar', callback2)
               .trigger('foo', 'some data')
               .trigger('bar', 'some other data');

            // Assert
            expect(callback1).toHaveBeenCalledWith('some data');
            expect(callback2).toHaveBeenCalledWith('some other data');
        });
    });

    describe('makeObjectArray', function() {
        it('converts a non-object array into an object array using the provided key', function() {
            var array = ['a', 'b', 'c'],
                result = tiUtil.makeObjectArray(array, 'prop');

            expect(result).not.toBe(array);
            expect(result).toEqual([
                { prop: 'a' },
                { prop: 'b' },
                { prop: 'c' }
            ]);
        });

        [
            { desc: 'an empty array', value: [] },
            { desc: 'an array of objects', value: [{}] },
            { desc: 'null', value: null },
            { desc: 'a number', value: 1 },
            { desc: 'a string', value: 'a' }
        ].forEach(function(item) {
            it('returns the provided argument itself if it is ' + item.desc, function() {
                expect(tiUtil.makeObjectArray(item.value, 'prop')).toBe(item.value);
            });
        });
    });

    describe('findInObjectArray', function() {
        var array = [
            { prop: 'foo' },
            { prop: 'bar' },
            { prop: 'baz' }
        ];

        it('finds an object within an array by using the provided key', function() {
            expect(tiUtil.findInObjectArray(array, { prop: 'bar' }, 'prop')).toBe(array[1]);
        });

        it('finds an object within an array by using the provided key regardless of the text case', function() {
            expect(tiUtil.findInObjectArray(array, { prop: 'BAR' }, 'prop')).toBe(array[1]);
        });

        it('returns null when the provided object is not found', function() {
            expect(tiUtil.findInObjectArray(array, { prop: 'foobar' }, 'prop')).toBe(null);
        });

        it('returns null when the provided array is empty', function() {
            expect(tiUtil.findInObjectArray([], { prop: 'foo' }, 'prop')).toBe(null);
        });

        it('uses a custom comparer to find an item within an array', function() {
            // Arrange
            var caseSensitiveComparer = function(a, b) { return a === b; };

            // Act/Assert
            expect(tiUtil.findInObjectArray(array, { prop: 'BAR' }, 'prop', caseSensitiveComparer)).toBe(null);
        });
    });

    describe('safeHighlight', function() {
        it('highlights the provided text', function() {
            expect(tiUtil.safeHighlight('abc', 'b')).toBe('a<em>b</em>c');
            expect(tiUtil.safeHighlight('aBc', 'b')).toBe('a<em>B</em>c');
            expect(tiUtil.safeHighlight('abc', 'B')).toBe('a<em>b</em>c');
        });

        it('highlights HTML entities', function() {
            expect(tiUtil.safeHighlight('a&a', '&')).toBe('a<em>&amp;</em>a');
            expect(tiUtil.safeHighlight('a>a', '>')).toBe('a<em>&gt;</em>a');
            expect(tiUtil.safeHighlight('a<a', '<')).toBe('a<em>&lt;</em>a');
        });
    });

    describe('safeToString', function() {
        it('returns an empty string when the provide value is either null or undefined', function() {
            expect(tiUtil.safeToString(null)).toBe('');
            expect(tiUtil.safeToString()).toBe('');
        });

        it('returns the trimmed string representation of the provided value', function() {
            expect(tiUtil.safeToString(1)).toBe('1');
            expect(tiUtil.safeToString(1.5)).toBe('1.5');
            expect(tiUtil.safeToString(true)).toBe('true');
            expect(tiUtil.safeToString(false)).toBe('false');
            expect(tiUtil.safeToString('foo')).toBe('foo');
        });
    });

    describe('encodeHTML', function() {
        it('encodes <, > and & as HTML entities', function() {
            expect(tiUtil.encodeHTML('<foo>&</foo>')).toBe('&lt;foo&gt;&amp;&lt;/foo&gt;');
        });
    });

    describe('debounce', function() {
        var $timeout;

        beforeEach(function() {
            inject(function(_$timeout_) {
                $timeout = _$timeout_;
            });
        });

        it('returns a debounced function', function() {
            // Arrange
            var callback = jasmine.createSpy();

            // Act
            var debounced = tiUtil.debounce(callback, 100);

            // Assert
            debounced('foo', 'bar');
            debounced('bar', 'foo');
            debounced('foobar');

            expect(callback).not.toHaveBeenCalled();

            $timeout.flush(100);

            expect(callback).toHaveBeenCalledWith('foobar');
        });
    });

    describe('handleUndefinedResult', function() {
        it('wraps the provided function and change its return value if it\'s undefined', function() {
            // Arrange
            var fn = function() { return; };

            // Act
            var result = tiUtil.handleUndefinedResult(fn, 'foobar')();

            // Act/Assert
            expect(result).toBe('foobar');
        });

        it('wraps the provided function and does not change its return value if it\'s defined', function() {
            // Arrange
            var fn = function() { return 1; };

            // Act
            var result = tiUtil.handleUndefinedResult(fn, 'foobar')();

            // Act/Assert
            expect(result).toBe(1);
        });

        it('re-passes the provided arguments to the wrapped function', function() {
            // Arrange
            var fn = function(a, b) { return a + b; };

            // Act
            var result = tiUtil.handleUndefinedResult(fn)(1, 2);

            // Assert
            expect(result).toBe(3);
        });
    });

    describe('replaceSpacesWithDashes', function() {
        it('replaces spaces with dashes within the provided string', function() {
            expect(tiUtil.replaceSpacesWithDashes('a b c')).toBe('a-b-c');
            expect(tiUtil.replaceSpacesWithDashes('a     b     c')).toBe('a-----b-----c');
            expect(tiUtil.replaceSpacesWithDashes('a b c ')).toBe('a-b-c');
            expect(tiUtil.replaceSpacesWithDashes(' a b c')).toBe('a-b-c');
            expect(tiUtil.replaceSpacesWithDashes(' a b c ')).toBe('a-b-c');
            expect(tiUtil.replaceSpacesWithDashes('')).toBe('');
            expect(tiUtil.replaceSpacesWithDashes(null)).toBe('');
            expect(tiUtil.replaceSpacesWithDashes()).toBe('');
        });
    });

    describe('isModifierOn', function() {
        it('returns true if a modifier is on', function() {
            expect(tiUtil.isModifierOn({ shiftKey: true })).toBe(true);
            expect(tiUtil.isModifierOn({ ctrlKey: true })).toBe(true);
            expect(tiUtil.isModifierOn({ altKey: true })).toBe(true);
            expect(tiUtil.isModifierOn({ metaKey: true })).toBe(true);
        });

        it('returns false if all modifiers are off', function() {
            expect(tiUtil.isModifierOn({
                shiftKey: false,
                ctrlKey: false,
                altKey: false,
                metaKey: false
            })).toBe(false);

            expect(tiUtil.isModifierOn({
                shiftKey: false,
                ctrlKey: false,
                altKey: true,
                metaKey: false
            })).toBe(true);
        });
    });
});
