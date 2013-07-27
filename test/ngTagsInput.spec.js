(function() {
    'use strict';

describe('tags-input-directive', function() {
    var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

    var $compile,
        $rootScope,
        element;

    beforeEach(module('tags-input'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    function compile() {
        var options = jQuery.makeArray(arguments).join(' ');
        var template = '<tags-input ng-model="tags" ' + options + '></tags-input>';

        element = $compile(template)($rootScope);
        $rootScope.$digest();
    }

    function getTags() {
        return element.find('span');
    }

    function getTag(index) {
        return getTags().eq(index);
    }

    function getInput() {
        return element.find('input');
    }

    function newTag(tag, key) {
        key = key || ENTER;

        for(var i = 0; i < tag.length; i++) {
            sendKeyPress(tag.charCodeAt(i));
        }
        sendKeyDown(key);
    }

    function sendKeyPress(charCode) {
        var input = getInput();
        var event = jQuery.Event('keypress', { charCode: charCode });

        input.trigger(event);
        if (!event.isDefaultPrevented()) {
            input.val(input.val() + String.fromCharCode(charCode));
        }
    }

    function sendKeyDown(keyCode) {
        getInput().trigger(jQuery.Event('keydown', { keyCode: keyCode }));
    }

    describe('basic functionalities', function() {
        it('renders the correct number of tags', function() {
            // Arrange
            $rootScope.tags = ['some','cool','tags'];

            // Act
            compile();

            // Assert
            expect(getTags().length).toBe(3);
            expect(getTag(0).html()).toBe('some');
            expect(getTag(1).html()).toBe('cool');
            expect(getTag(2).html()).toBe('tags');
        });

        it('updates correctly the model', function() {
            // Arrange
            compile();

            // Act
            newTag('some');
            newTag('cool');
            newTag('tags');

            // Assert
            expect($rootScope.tags).toEqual(['some','cool','tags']);
        });

        it('removes a tag when the remove button is clicked', function() {
            // Arrange
            $rootScope.tags = ['some','cool','tags'];
            compile();

            // Act
            element.find('button').click();

            // Assert
            expect($rootScope.tags).toEqual([]);
        });

        it('removes the last tag when the backspace key is pressed and the input field is empty', function() {
            // Arrange
            $rootScope.tags = ['some','cool','tags'];
            compile();

            // Act
            sendKeyDown(BACKSPACE);

            // Assert
            expect($rootScope.tags).toEqual(['some','cool']);
        });

        it('sets focus on the input field when the container div is clicked', function() {
            // Arrange
            compile();
            var input = getInput()[0];
            spyOn(input, 'focus');

            // /Act
            element.find('div').click();

            // Assert
            expect(input.focus).toHaveBeenCalled();
        });
    });

    describe('class option', function() {
        it('adds a custom CSS class to the container div when cssClass option is provided', function() {
            // Arrange/Act
            compile('class="myClass"');

            // Arrange
            expect(element.find('div').attr('class').trim()).toBe('ngTagsInput myClass');
        });

        it('does not add a custom CSS class to the container div when cssClass option is not provided', function() {
            // Arrange/Act
            compile();

            // Arrange
            expect(element.find('div').attr('class').trim()).toBe('ngTagsInput');
        });
    });

    describe('add-on-enter option', function() {
        it('adds a new tag when the enter key is pressed and add-on-enter option is true', function() {
            // Arrange
            compile('add-on-enter="true"');

            // Act
            newTag('foo', ENTER);

            // Assert
            expect($rootScope.tags).toEqual(['foo']);
        });

        it('does not add a new tag when the enter key is pressed and add-on-enter option is false', function() {
            // Arrange
            compile('add-on-enter="false"');

            // Act
            newTag('foo', ENTER);

            // Assert
            expect($rootScope.tags).toEqual([]);
        });

        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().addOnEnter).toBe(true);
        });
    });

    describe('add-on-space option', function() {
        it('adds a new tag when the space key is pressed and add-on-space option is true', function() {
            // Arrange
            compile('add-on-space="true"');

            // Act
            newTag('foo', SPACE);

            // Assert
            expect($rootScope.tags).toEqual(['foo']);
        });

        it('does not add a new tag when the space key is pressed and add-on-space option is false', function() {
            // Arrange
            compile('add-on-space="false"');

            // Act
            newTag('foo', SPACE);

            // Assert
            expect($rootScope.tags).toEqual([]);
        });

        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().addOnSpace).toBe(false);
        });
    });

    describe('add-on-comma option', function() {
        it('adds a new tag when the comma key is pressed and add-on-comma option is true', function() {
            // Arrange
            compile('add-on-comma="true"');

            // Act
            newTag('foo', COMMA);

            // Assert
            expect($rootScope.tags).toEqual(['foo']);
        });

        it('does not add a new tag when the space key is pressed and add-on-comma option is false', function() {
            // Arrange
            compile('add-on-comma="false"');

            // Act
            newTag('foo', COMMA);

            // Assert
            expect($rootScope.tags).toEqual([]);
        });

        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().addOnComma).toBe(true);
        });
    });

    describe('placeholder option', function() {
        it('sets correctly the input field placeholder text', function() {
            // Arrange/Act
            compile('placeholder="New tag"');

            // Assert
            expect(getInput().attr('placeholder')).toBe('New tag');
        });

        it('sets the input size attribute to placeholder option length', function() {
            // Arrange/Act
            compile('placeholder="New tag"');

            // Assert
            expect(getInput().attr('size')).toBe('7');
        });

        it('initializes the option to "Add a tag"', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().placeholder).toBe('Add a tag');
        });
    });

    describe('remove-tag-symbol option', function() {
        it('sets correctly the remove button text', function() {
            // Arrange/Act
            $rootScope.tags = ['foo'];

            // Act
            compile('remove-tag-symbol="X"');

            // Assert
            expect(element.find('button').html()).toBe('X');
        });

        it('initializes the option to charcode 215 (&times;)', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().removeTagSymbol).toBe(String.fromCharCode(215));
        });
    });

    describe('replace-spaces-with-dashes option', function() {
        it('replaces spaces with dashes when replaces-spaces-with-dashes option is true', function() {
            // Arrange
            compile('replace-spaces-with-dashes="true"');

            // Act
            newTag('foo bar');

            // Assert
            expect($rootScope.tags).toEqual(['foo-bar']);
        });

        it('does not replace spaces with dashes when replaces-spaces-with-dashes option is true', function() {
            // Arrange
            compile('replace-spaces-with-dashes="false"');

            // Act
            newTag('foo bar');

            // Assert
            expect($rootScope.tags).toEqual(['foo bar']);
        });

        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().replaceSpacesWithDashes).toBe(true);
        });
    });

    describe('allowed-chars option', function() {
        it('allows only the characters matching the regular expression in allowed-chars option', function() {
            // Arrange
            compile('allowed-chars="[a-z]"');

            // Act
            newTag('foo_123_bar_456');

            // Assert
            expect($rootScope.tags).toEqual(['foobar']);
        });

        it('initializes the option to [A-Za-z0-9\\s]', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().allowedChars.toString()).toBe('/[A-Za-z0-9\\s]/');
        });
    });

    describe('min-length option', function() {
        it('adds a new tag only if its length is greater than or equal to min-length option', function() {
            // Arrange
            compile('min-length="5"');

            // Act
            newTag('foo');

            // Assert
            expect($rootScope.tags).toEqual([]);
        });

        it('initializes the option to 3', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().minLength).toBe(3);
        });
    });

    describe('max-length option', function() {
        it('sets the maxlength attribute of the input field to max-length option', function() {
            // Arrange/Act
            compile('max-length="10"');

            // Assert
            expect(getInput().attr('maxlength')).toBe('10');
        });

        it('initializes the option to min-length when it is greater than placeholder length', function() {
            // Arrange/Act
            compile('min-length="10" placeholder="New tag"');

            // Assert
            expect(element.scope().maxLength).toBe(10);
        });

        it('initializes the option to placeholder length when it is greater than min-length', function() {
            // Arrange/Act
            compile('min-length="3" placeholder="New tag"');

            // Assert
            expect(element.scope().maxLength).toBe(7);
        });

    });
});
}());