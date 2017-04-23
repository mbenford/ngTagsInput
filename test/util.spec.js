'use strict';

describe('tiUtil factory', () => {
    let tiUtil;

    beforeEach(() => {
        module('ngTagsInput');

        inject(_tiUtil_ => {
            tiUtil = _tiUtil_;
        });
    });

    describe('simplePubSub', () => {
        let sut;

        beforeEach(() => {
            sut = tiUtil.simplePubSub();
        });

        it('subscribes to an event', () => {
            // Arrange
            let callback = jasmine.createSpy();

            // Act
            sut.on('foo', callback);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback).toHaveBeenCalledWith('some data');
        });

        it('subscribes to an event in reverse order', () => {
            // Arrange
            let callback = jasmine.createSpy();

            // Act
            sut.on('foo', callback, true);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback).toHaveBeenCalledWith('some data');
        });

        it('subscribes to multiple events', () => {
            // Arrange
            let callback = jasmine.createSpy();

            // Act
            sut.on('foo bar', callback);
            sut.trigger('foo', 'some data');
            sut.trigger('bar', 'some other data');

            // Assert
            expect(callback.calls.count()).toBe(2);
            expect(callback.calls.argsFor(0)).toEqual(['some data']);
            expect(callback.calls.argsFor(1)).toEqual(['some other data']);
        });

        it('subscribes multiple times to the same event', () => {
            // Arrange
            let callback1 = jasmine.createSpy(),
                callback2 = jasmine.createSpy();

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback1).toHaveBeenCalledWith('some data');
            expect(callback2).toHaveBeenCalledWith('some data');
        });

        it('subscribes multiple times to the same event in reverse order', () => {
            // Arrange
            let callback1 = jasmine.createSpy(),
                callback2 = jasmine.createSpy();

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2, true);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback1).toHaveBeenCalledWith('some data');
            expect(callback2).toHaveBeenCalledWith('some data');
        });

        it('guarantees the order of invocation is correct (regular order)', () => {
            // Arrange
            let calls = [],
                callback1 = () => { calls.push('callback1'); },
                callback2 = () => { calls.push('callback2'); };

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2);
            sut.trigger('foo', 'some data');

            // Assert
            expect(calls).toEqual(['callback1', 'callback2']);
        });

        it('guarantees the order of invocation is correct (reverse order)', () => {
            // Arrange
            let calls = [],
                callback1 = () => { calls.push('callback1'); },
                callback2 = () => { calls.push('callback2'); };

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2, true);
            sut.trigger('foo', 'some data');

            // Assert
            expect(calls).toEqual(['callback2', 'callback1']);
        });

        it('stops the propagation of an event (regular order)', () => {
            // Arrange
            let callback1 = jasmine.createSpy().and.returnValue(false),
                callback2 = jasmine.createSpy();

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback1).toHaveBeenCalledWith('some data');
            expect(callback2).not.toHaveBeenCalled();
        });

        it('stops the propagation of an event (reverse order)', () => {
            // Arrange
            let callback1 = jasmine.createSpy(),
                callback2 = jasmine.createSpy().and.returnValue(false);

            // Act
            sut.on('foo', callback1);
            sut.on('foo', callback2, true);
            sut.trigger('foo', 'some data');

            // Assert
            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalledWith('some data');
        });

        it('returns the object instance so calls can be chained', () => {
            // Arrange
            let callback1 = jasmine.createSpy(),
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

    describe('makeObjectArray', () => {
        it('converts a non-object array into an object array using the provided key', () => {
            let array = ['a', 'b', 'c'],
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
        ].forEach(item => {
            it('returns the provided argument itself if it is ' + item.desc, () => {
                expect(tiUtil.makeObjectArray(item.value, 'prop')).toBe(item.value);
            });
        });
    });

    describe('findInObjectArray', () => {
        let array = [
            { prop: 'foo' },
            { prop: 'bar' },
            { prop: 'baz' }
        ];

        it('finds an object within an array by using the provided key', () => {
            expect(tiUtil.findInObjectArray(array, { prop: 'bar' }, 'prop')).toBe(array[1]);
        });

        it('finds an object within an array by using the provided key regardless of the text case', () => {
            expect(tiUtil.findInObjectArray(array, { prop: 'BAR' }, 'prop')).toBe(array[1]);
        });

        it('returns null when the provided object is not found', () => {
            expect(tiUtil.findInObjectArray(array, { prop: 'foobar' }, 'prop')).toBe(null);
        });

        it('returns null when the provided array is empty', () => {
            expect(tiUtil.findInObjectArray([], { prop: 'foo' }, 'prop')).toBe(null);
        });

        it('uses a custom comparer to find an item within an array', () => {
            // Arrange
            let caseSensitiveComparer = (a, b) => a === b;

            // Act/Assert
            expect(tiUtil.findInObjectArray(array, { prop: 'BAR' }, 'prop', caseSensitiveComparer)).toBe(null);
        });
    });

    describe('safeHighlight', () => {
        it('highlights the provided text', () => {
            expect(tiUtil.safeHighlight('abc', 'b')).toBe('a<em>b</em>c');
            expect(tiUtil.safeHighlight('aBc', 'b')).toBe('a<em>B</em>c');
            expect(tiUtil.safeHighlight('abc', 'B')).toBe('a<em>b</em>c');
            expect(tiUtil.safeHighlight('abcB', 'B')).toBe('a<em>b</em>c<em>B</em>');
            expect(tiUtil.safeHighlight('abc', '')).toBe('abc');
        });

        it('highlights HTML entities', () => {
            expect(tiUtil.safeHighlight('a&a', '&')).toBe('a<em>&amp;</em>a');
            expect(tiUtil.safeHighlight('a>a', '>')).toBe('a<em>&gt;</em>a');
            expect(tiUtil.safeHighlight('a<a', '<')).toBe('a<em>&lt;</em>a');
            expect(tiUtil.safeHighlight('<script>alert("XSS")</script>', '<'))
                .toBe('<em>&lt;</em>script&gt;alert("XSS")<em>&lt;</em>/script&gt;');
            expect(tiUtil.safeHighlight('<script>alert("XSS")</script>', ''))
                .toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
        });
    });

    describe('safeToString', () => {
        it('returns an empty string when the provide value is either null or undefined', () => {
            expect(tiUtil.safeToString(null)).toBe('');
            expect(tiUtil.safeToString()).toBe('');
        });

        it('returns the trimmed string representation of the provided value', () => {
            expect(tiUtil.safeToString(1)).toBe('1');
            expect(tiUtil.safeToString(1.5)).toBe('1.5');
            expect(tiUtil.safeToString(true)).toBe('true');
            expect(tiUtil.safeToString(false)).toBe('false');
            expect(tiUtil.safeToString('foo')).toBe('foo');
        });
    });

    describe('encodeHTML', () => {
        it('encodes <, > and & as HTML entities', () => {
            expect(tiUtil.encodeHTML('<foo>&</foo>')).toBe('&lt;foo&gt;&amp;&lt;/foo&gt;');
        });
    });

    describe('debounce', () => {
        let $timeout;

        beforeEach(() => {
            inject(_$timeout_ => {
                $timeout = _$timeout_;
            });
        });

        it('returns a debounced function', () => {
            // Arrange
            let callback = jasmine.createSpy();

            // Act
            let debounced = tiUtil.debounce(callback, 100);

            // Assert
            debounced('foo', 'bar');
            debounced('bar', 'foo');
            debounced('foobar');

            expect(callback).not.toHaveBeenCalled();

            $timeout.flush(100);

            expect(callback).toHaveBeenCalledWith('foobar');
        });
    });

    describe('handleUndefinedResult', () => {
        it('wraps the provided function and change its return value if it\'s undefined', () => {
            // Arrange
            let fn = () => {};

            // Act
            let result = tiUtil.handleUndefinedResult(fn, 'foobar')();

            // Act/Assert
            expect(result).toBe('foobar');
        });

        it('wraps the provided function and does not change its return value if it\'s defined', () => {
            // Arrange
            let fn = () => 1;

            // Act
            let result = tiUtil.handleUndefinedResult(fn, 'foobar')();

            // Act/Assert
            expect(result).toBe(1);
        });

        it('re-passes the provided arguments to the wrapped function', () => {
            // Arrange
            let fn = (a, b) => a + b;

            // Act
            let result = tiUtil.handleUndefinedResult(fn)(1, 2);

            // Assert
            expect(result).toBe(3);
        });
    });

    describe('replaceSpacesWithDashes', () => {
        it('replaces spaces with dashes within the provided string', () => {
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

    describe('isModifierOn', () => {
        it('returns true if a modifier is on', () => {
            expect(tiUtil.isModifierOn({ shiftKey: true })).toBe(true);
            expect(tiUtil.isModifierOn({ ctrlKey: true })).toBe(true);
            expect(tiUtil.isModifierOn({ altKey: true })).toBe(true);
            expect(tiUtil.isModifierOn({ metaKey: true })).toBe(true);
        });

        it('returns false if all modifiers are off', () => {
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
