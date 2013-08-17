(function() {
'use strict';

describe('tags-input-directive', function() {
    var ENTER = 13, COMMA = 188, SPACE = 32, BACKSPACE = 8;

    var $compile,
        $rootScope,
        element;

    beforeEach(function() {
        module('tags-input');

        inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function compile() {
        var options = jQuery.makeArray(arguments).join(' ');
        var template = '<tags-input ng-model="tags" ' + options + '></tags-input>';

        element = $compile(template)($rootScope);
        $rootScope.$digest();
    }

    function getTags() {
        return element.find('li');
    }

    function getTag(index) {
        return getTags().eq(index);
    }

    function getTagText(index) {
        return getTag(index).find('span').html();
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
            input.trigger('input');
        }
    }

    function sendKeyDown(keyCode) {
        var event = jQuery.Event('keydown', { keyCode: keyCode });
        getInput().trigger(event);

        return event;
    }

    function sendBackspace() {
        var event = sendKeyDown(BACKSPACE);
        if (!event.isDefaultPrevented()) {
            var input = getInput();
            var value = input.val();
            input.val(value.substr(0, value.length - 1));
            input.trigger('input');
        }
    }

    describe('basic features', function() {
        it('renders the correct number of tags', function() {
            // Arrange
            $rootScope.tags = ['some','cool','tags'];

            // Act
            compile();

            // Assert
            expect(getTags().length).toBe(3);
            expect(getTagText(0)).toBe('some');
            expect(getTagText(1)).toBe('cool');
            expect(getTagText(2)).toBe('tags');
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

        it('does not allow duplicate tags', function() {
            // Arrange
            compile();

            // Act
            newTag('foo');
            newTag('foo');

            // Assert
            expect($rootScope.tags).toEqual(['foo']);
        });

        it('adds a custom CSS class to the container div when ng-class option is provided', function() {
            // Arrange/Act
            compile('ng-class="myClass"');

            // Arrange
            expect(element.find('div').hasClass('myClass')).toBe(true);
        });
    });

    describe('tabindex option', function() {
        it('sets correctly the input box tab index', function() {
            // Arrange/Act
            compile('tabindex="1"');

            // Assert
            expect(getInput().attr('tabindex')).toBe('1');
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

    describe('allowed-tags-pattern option', function() {
        it('allows only tags matching a regular expression to be added', function() {
            // Arrange
            compile('allowed-chars-pattern="[a-z@\\.]" allowed-tags-pattern="^[a-z]+@[a-z]+\\.com$"');

            // Act
            newTag('foo@bar.com');

            // Assert
            expect($rootScope.tags).toEqual(['foo@bar.com']);
        });

        it('rejects tags that do not match the regular expression', function() {
            // Arrange
            compile('allowed-chars-pattern="[a-z@\\.]" allowed-tags-pattern="^[a-z]+@[a-z]+\\.com$"');

            // Act
            newTag('foobar.com');

            // Assert
            expect($rootScope.tags).toEqual([]);
        });

        it('initializes the option to .*', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().allowedTagsPattern.toString()).toBe('/.*/');
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

    describe('enable-editing-last-tag option', function() {
        beforeEach(function() {
            $rootScope.tags = ['some','cool','tags'];
        });

        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.scope().enableEditingLastTag).toBe(false);
        });

        describe('option is on', function() {
            beforeEach(function() {
                compile('enable-editing-last-tag="true"');
            });

            describe('backspace is pressed once', function() {
                it('moves the last tag back into the input field when the input field is empty', function() {
                    // Act
                    sendBackspace();

                    // Assert
                    expect(getInput().val()).toBe('tags');
                    expect($rootScope.tags).toEqual(['some','cool']);
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();

                    // Assert
                    expect($rootScope.tags).toEqual(['some','cool','tags']);
                });
            });
        });

        describe('option is off', function() {
            beforeEach(function() {
                compile('enable-editing-last-tag="false"');
            });

            describe('backspace is pressed once', function() {
                it('highlights the tag about to be removed when the input box is empty', function() {
                    // Act
                    sendBackspace();

                    // Assert
                    expect(getTag(2).hasClass('selected')).toBe(true);
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();

                    // Assert
                    expect($rootScope.tags).toEqual(['some','cool','tags']);
                });

                it('stops highlighting the last tag when the input box becomes non-empty', function() {
                    // Act
                    sendBackspace();
                    sendKeyPress(65);

                    // Assert
                    expect(getTag(2).hasClass('selected')).toBe(false);
                });
            });

            describe('backspace is pressed twice', function() {
                it('removes the last tag when the input field is empty', function() {
                    // Act
                    sendBackspace();
                    sendBackspace();

                    // Assert
                    expect(getInput().val()).toBe('');
                    expect($rootScope.tags).toEqual(['some','cool']);
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();
                    sendBackspace();

                    // Assert
                    expect($rootScope.tags).toEqual(['some','cool','tags']);
                });
            });
        });
    });
});
}());
