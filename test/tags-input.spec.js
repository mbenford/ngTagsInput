'use strict';

describe('tags-input directive', function() {
    var $compile, $scope, $timeout, $document,
        $window, isolateScope, element;

    beforeEach(function() {
        jasmine.addMatchers(customMatchers);

        module('ngTagsInput');

        inject(function(_$compile_, _$rootScope_, _$document_, _$timeout_, _$window_) {
            $compile = _$compile_;
            $scope = _$rootScope_;
            $document = _$document_;
            $timeout = _$timeout_;
            $window = _$window_;
        });
    });

    function compile() {
        var options = jQuery.makeArray(arguments).join(' ');
        var template = '<tags-input ng-model="tags" ' + options + '></tags-input>';

        element = $compile(template)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }

    function compileWithForm() {
        var options = jQuery.makeArray(arguments).join(' ');
        var template = '<form name="form"><tags-input ng-model="tags" ' + options + '></tags-input></form>';

        element = $compile(template)($scope);
        $scope.$digest();
        isolateScope = element.children().isolateScope();
    }

    function generateTags(count) {
        return generateArray(count, function(index) {
            return { text: 'Tag' + index };
        });
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

    function getRemoveButton(index) {
        return getTag(index).find('a').first();
    }

    function getInput() {
        return element.find('input');
    }

    function newTag(tag, key) {
        key = key || KEYS.enter;

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
            changeInputValue(input.val() + String.fromCharCode(charCode));
        }
    }

    function sendKeyDown(keyCode, properties) {
        var event = jQuery.Event('keydown', angular.extend({ keyCode: keyCode }, properties || {}));
        getInput().trigger(event);

        return event;
    }

    function sendBackspace() {
        var event = sendKeyDown(KEYS.backspace);
        if (!event.isDefaultPrevented()) {
            var input = getInput();
            var value = input.val();
            changeInputValue(value.substr(0, value.length - 1));
        }
    }

    function changeInputValue(value) {
        changeElementValue(getInput(), value);
    }

    describe('basic features', function() {
        it('initializes the model as an empty array', function() {
            // Arrange/Act
            compile();

            // Assert
            expect($scope.tags).toEqual([]);
        });

        it('renders the correct number of tags', function() {
            // Arrange
            $scope.tags = [
                { text: 'Tag1 '},
                { text: ' Tag2'},
                { text: ' Tag3 '}
            ];

            // Act
            compile();

            // Assert
            expect(getTags().length).toBe(3);
            expect(getTagText(0)).toBe('Tag1');
            expect(getTagText(1)).toBe('Tag2');
            expect(getTagText(2)).toBe('Tag3');
        });

        it('renders the correct number of tags (non-string items)', function() {
            // Arrange
            $scope.tags = [
                { text: 1 },
                { text: true },
                { text: 1.5 },
                { text: {} },
                { text: null },
                { text: undefined }
            ];

            // Act
            compile();

            // Assert
            expect(getTags().length).toBe(6);
            expect(getTagText(0)).toBe('1');
            expect(getTagText(1)).toBe('true');
            expect(getTagText(2)).toBe('1.5');
            expect(getTagText(3)).toBe('[object Object]');
            expect(getTagText(4)).toBe('');
            expect(getTagText(5)).toBe('');
        });

        it('updates the model', function() {
            // Arrange
            compile();

            // Act
            newTag('Tag1 ');
            newTag(' Tag2');
            newTag(' Tag3 ');

            // Assert
            expect($scope.tags).toEqual([
                { text: 'Tag1' },
                { text: 'Tag2' },
                { text: 'Tag3' }
            ]);
        });

        it('removes a tag when the remove button is clicked', function() {
            // Arrange
            $scope.tags = generateTags(3);
            compile();

            // Act
            getRemoveButton(1).click();

            // Assert
            expect($scope.tags).toEqual([{ text: 'Tag1' }, { text: 'Tag3' }]);
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
            newTag('Foo');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo' }]);
        });

        it('will not add a tag based on custom logic specified by the on-tag-adding option', function() {
            // Arrange
            $scope.tagIsNotInvalid = function(newTag) {
                return (newTag.text !== 'INVALID');
            };

            compile('on-tag-adding="tagIsNotInvalid($tag)"');

            // Act
            newTag('foo');
            newTag('bar');
            newTag('INVALID');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo' }, { text: 'bar' }]);
        });

        it('will not remove a tag based on custom logic specified by the on-tag-removing option', function() {
            // Arrange
            $scope.tagIsNotPermanent = function(newTag) {
                return (newTag.text !== 'PERMANENT');
            };

            compile('on-tag-removing="tagIsNotPermanent($tag)"');

            // Act
            newTag('foo');
            newTag('PERMANENT');
            newTag('bar');

            getRemoveButton(1).click();

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo' }, { text: 'PERMANENT' }, { text: 'bar' }]);
        });

        it('makes the input field invalid when a duplicate tag is tried to be added', function() {
            // Arrange
            compile();

            // Act
            newTag('foo');
            newTag('Foo');

            // Assert
            expect(getInput()).toHaveClass('invalid-tag');
        });

        it('makes the input field valid when its content changes', function() {
            // Arrange
            compile();
            newTag('foo');
            newTag('Foo');

            // Act
            changeInputValue('foo');

            // Assert
            expect(getInput()).not.toHaveClass('invalid-tag');
        });

        it('empties the input field after a tag is added directly', function() {
            // Arrange
            compile();
            spyOn(isolateScope.events, 'trigger').and.callThrough();

            // Act
            newTag('foo');

            // Assert
            expect(getInput().val()).toBe('');
            expect(isolateScope.events.trigger).toHaveBeenCalledWith('input-change', '');
        });

        it('converts an array of strings into an array of objects', function() {
            // Arrange
            $scope.tags = ['Item1', 'Item2', 'Item3'];

            // Act
            compile();

            // Assert
            expect($scope.tags).toEqual([
                { text: 'Item1' },
                { text: 'Item2' },
                { text: 'Item3' }
            ]);
        });

        it('does not add an empty tag', function() {
            // Arrange
            compile('min-length="0"', 'allowed-tags-pattern=".*"');

            // Act
            newTag('');

            // Assert
            expect($scope.tags).toEqual([]);
            expect(isolateScope.newTag.invalid).toBeFalsy();
        });

        it('sets the element as dirty when a tag is added', function() {
            // Arrange
            compileWithForm('name="tags"');

            // Act
            newTag('foo');

            // Assert
            expect($scope.form.tags.$dirty).toBe(true);
        });

        it('sets the element as dirty when a tag is removed', function() {
            // Arrange
            compileWithForm('name="tags"');
            newTag('foo');

            // Act
            getRemoveButton(0).click();

            // Assert
            expect($scope.form.tags.$dirty).toBe(true);
        });

        it('sets the input\'s autocomplete attribute to off', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(getInput().attr('autocomplete')).toBe('off');
        });
    });

    describe('focus outline', function() {
        beforeEach(function() {
            compile();
        });

        it('outlines the tags div when the focused property is true', function() {
            // Arrange
            isolateScope.hasFocus = true;

            // Act
            $scope.$digest();

            // Assert
            expect(element.find('div.tags')).toHaveClass('focused');
        });

        it('does not outline the tags div when the focused property is false', function() {
            // Arrange
            isolateScope.hasFocus = false;

            // Act
            $scope.$digest();

            // Assert
            expect(element.find('div.tags')).not.toHaveClass('focused');
        });

        it('sets the focused property to true when the input field gains focus', function() {
            // Arrange
            isolateScope.hasFocus = false;
            spyOn($scope, '$digest');

            // Act
            getInput().triggerHandler('focus');

            // Assert
            expect(isolateScope.hasFocus).toBe(true);
            expect($scope.$digest).toHaveBeenCalled();
        });

        it('does nothing when the focused property is true and the input field gains focus', function() {
            // Arrange
            isolateScope.hasFocus = true;
            spyOn($scope, '$digest');
            spyOn(isolateScope.events, 'trigger');

            // Act
            getInput().triggerHandler('focus');

            // Assert
            expect(isolateScope.hasFocus).toBe(true);
            expect(isolateScope.events.trigger).not.toHaveBeenCalled();
        });

        it('sets the focused property to false when the input field loses focus', function() {
            // Arrange
            var body = $document.find('body');
            body.append(element);
            body.focus();

            isolateScope.hasFocus = true;
            spyOn($scope, '$digest');

            // Act
            getInput().triggerHandler('blur');
            $timeout.flush();

            // Assert
            expect(isolateScope.hasFocus).toBe(false);
            expect($scope.$digest).toHaveBeenCalled();
        });

        it('focuses the directive element when the input field receives focus', function() {
            // Arrange
            $scope.callback = jasmine.createSpy();
            compile('ng-focus="callback()"');

            // Act
            getInput().triggerHandler('focus');
            $timeout.flush();

            // Assert
            expect($scope.callback).toHaveBeenCalled();
        });

        it('blurs the directive element when the input field loses focus', function() {
            // Arrange
            $scope.callback = jasmine.createSpy();
            compile('ng-blur="callback()"');

            // Act
            getInput().triggerHandler('blur');
            $timeout.flush();

            // Assert
            expect($scope.callback).toHaveBeenCalled();
        });
    });

    describe('tabindex option', function() {
        it('sets the input field tab index', function() {
            // Arrange/Act
            compile('tabindex="1"');

            // Assert
            expect(getInput().attr('tabindex')).toBe('1');
        });

        it('initializes the option to null', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.tabindex).toBeNull();
        });
    });

    describe('add-on-enter option', function() {
        it('adds a new tag when the enter key is pressed and the option is true', function() {
            // Arrange
            compile('add-on-enter="true"');

            // Act
            newTag('foo', KEYS.enter);

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo' }]);
        });

        it('does not add a new tag when the enter key is pressed and the option is false', function() {
            // Arrange
            compile('add-on-enter="false"');

            // Act
            newTag('foo', KEYS.enter);

            // Assert
            expect($scope.tags).toEqual([]);
        });

        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.addOnEnter).toBe(true);
        });
    });

    describe('add-on-space option', function() {
        it('adds a new tag when the space key is pressed and the option is true', function() {
            // Arrange
            compile('add-on-space="true"');

            // Act
            newTag('foo', KEYS.space);

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo' }]);
        });

        it('does not add a new tag when the space key is pressed and the option is false', function() {
            // Arrange
            compile('add-on-space="false"');

            // Act
            newTag('foo', KEYS.space);

            // Assert
            expect($scope.tags).toEqual([]);
        });

        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.addOnSpace).toBe(false);
        });
    });

    describe('add-on-comma option', function() {
        it('adds a new tag when the comma key is pressed and the option is true', function() {
            // Arrange
            compile('add-on-comma="true"');

            // Act
            newTag('foo', KEYS.comma);

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo' }]);
        });

        it('does not add a new tag when the space key is pressed and the option is false', function() {
            // Arrange
            compile('add-on-comma="false"');

            // Act
            newTag('foo', KEYS.comma);

            // Assert
            expect($scope.tags).toEqual([]);
        });

        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.addOnComma).toBe(true);
        });
    });

    describe('add-on-blur option', function() {
        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.addOnBlur).toBe(true);
        });

        it('ensures the outermost div element has a tabindex attribute set to -1', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(element.find('div').attr('tabindex')).toBe('-1');
        });

        describe('option is true', function() {
            var body;

            beforeEach(function() {
                compile('add-on-blur="true"');

                body = $document.find('body');
                body.append(element);
            });

            it('adds a tag when the input field loses focus to any element on the page but the directive itself', function() {
                // Arrange
                isolateScope.newTag.text = 'foo';
                body.focus();

                // Act
                getInput().triggerHandler('blur');
                $timeout.flush();

                // Assert
                expect($scope.tags).toEqual([{ text: 'foo' }]);
            });

            it('adds a tag when the input field loses focus to the browser window', function() {
                // Arrange
                isolateScope.newTag.text = 'foo';
                spyOn($document, 'prop');
                $document.prop.and.returnValue(getInput()[0]);

                // Act
                getInput().triggerHandler('blur');
                $timeout.flush();

                // Assert
                expect($scope.tags).toEqual([{ text: 'foo' }]);
            });

            it('does not add a tag when the input field loses focus to the directive itself', function() {
                // Arrange
                isolateScope.newTag.text = 'foo';
                element.find('div').focus();

                // Act
                getInput().triggerHandler('blur');
                $timeout.flush();

                // Assert
                expect($scope.tags).toEqual([]);
            });
        });

        describe('option is off', function() {
            it('does not add a new tag when the input field loses focus', function() {
                // Arrange
                compile('add-on-blur="false"');
                isolateScope.newTag.text = 'foo';

                // Act
                getInput().triggerHandler('blur');

                // Assert
                expect($scope.tags).toEqual([]);
            });
        });
    });

    describe('add-on-paste option', function() {
        var eventData;

        beforeEach(function() {
            eventData = {
                clipboardData: jasmine.createSpyObj('clipboardData', ['getData']),
                preventDefault: jasmine.createSpy()
            };
        });

        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.addOnPaste).toBe(false);
        });

        it('works in IE', function() {
            // Arrange
            compile('add-on-paste="true"');
            $window.clipboardData = eventData.clipboardData;
            eventData.clipboardData = undefined;
            $window.clipboardData.getData.and.returnValue('tag1, tag2, tag3');

            // Act
            var event = jQuery.Event('paste', eventData);
            getInput().trigger(event);

            // Assert
            expect($scope.tags).toEqual([
                { text: 'tag1' },
                { text: 'tag2' },
                { text: 'tag3' }
            ]);
        });

        it('splits the pasted text into tags if there is more than one tag and the option is true', function() {
            // Arrange
            compile('add-on-paste="true"');
            eventData.clipboardData.getData.and.returnValue('tag1, tag2, tag3');

            // Act
            var event = jQuery.Event('paste', eventData);
            getInput().trigger(event);

            // Assert
            expect($scope.tags).toEqual([
                { text: 'tag1' },
                { text: 'tag2' },
                { text: 'tag3' }
            ]);
            expect(eventData.preventDefault).toHaveBeenCalled();
        });

        it('doesn\'t split the pasted text into tags if there is just one tag and the option is true', function() {
            // Arrange
            compile('add-on-paste="true"');
            eventData.clipboardData.getData.and.returnValue('tag1');

            // Act
            var event = jQuery.Event('paste', eventData);
            getInput().trigger(event);

            // Assert
            expect($scope.tags).toEqual([]);
            expect(eventData.preventDefault).not.toHaveBeenCalled();
        });

        it('doesn\'t split the pasted text into tags if the option is false', function() {
            // Arrange
            compile('add-on-paste="false"');
            eventData.clipboardData.getData.and.returnValue('tag1, tag2, tag3');

            // Act
            var event = jQuery.Event('paste', eventData);
            getInput().trigger(event);

            // Assert
            expect($scope.tags).toEqual([]);
            expect(eventData.preventDefault).not.toHaveBeenCalled();
        });

        describe('paste-split-pattern option', function() {
            it('initializes the option to comma', function() {
                // Arrange/Act
                compile();

                // Assert
                expect(isolateScope.options.pasteSplitPattern).toEqual(/,/);
            });

            it('splits the pasted text into tags using the provided pattern', function() {
                // Arrange
                compile('add-on-paste="true"', 'paste-split-pattern="[,;|]"');
                eventData.clipboardData.getData.and.returnValue('tag1, tag2; tag3| tag4');

                // Act
                var event = jQuery.Event('paste', eventData);
                getInput().trigger(event);

                // Assert
                expect($scope.tags).toEqual([
                    { text: 'tag1' },
                    { text: 'tag2' },
                    { text: 'tag3' },
                    { text: 'tag4' }
                ]);
                expect(eventData.preventDefault).toHaveBeenCalled();
            });
        });
    });

    describe('type option', function() {
        it('sets the input\'s type property', function() {
            SUPPORTED_INPUT_TYPES.forEach(function(type) {
                // Arrange/Act
                compile('type="' + type + '"');

                // Assert
                expect(getInput().attr('type')).toBe(type);
            });
        });

        it('initializes the option to "text"', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.type).toBe('text');
        });

        it('falls back to "text" when unsupported values are provided', function() {
            // Arrange/Act
            compile('type="datetime"');

            // Assert
            expect(getInput().attr('type')).toBe('text');
        });
    });

    describe('spellcheck option', function() {
        it('sets the input\'s spellcheck property', function() {
            ['true', 'false'].forEach(function(value) {
                // Arrange/Act
                compile('spellcheck="' + value + '"');

                // Assert
                expect(getInput().attr('spellcheck')).toBe(value);
            });
        });

        it('initializes the option to "true"', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.spellcheck).toBe(true);
        });
    });

    describe('placeholder option', function() {
        it('sets the input\'s placeholder text', function() {
            // Arrange/Act
            compile('placeholder="New tag"');

            // Assert
            expect(getInput().attr('placeholder')).toBe('New tag');
        });

        it('initializes the option to "Add a tag"', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.placeholder).toBe('Add a tag');
        });
    });

    describe('remove-tag-symbol option', function() {
        it('sets the remove button text', function() {
            // Arrange/Act
            $scope.tags = generateTags(1);

            // Act
            compile('remove-tag-symbol="X"');

            // Assert
            expect(getRemoveButton(0).html()).toBe('X');
        });

        it('initializes the option to charcode 215 (&times;)', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.removeTagSymbol).toBe(String.fromCharCode(215));
        });
    });

    describe('replace-spaces-with-dashes option', function() {
        it('replaces spaces with dashes when replaces-spaces-with-dashes option is true', function() {
            // Arrange
            compile('replace-spaces-with-dashes="true"');

            // Act
            newTag('foo bar');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo-bar' }]);
        });

        it('does not replace spaces with dashes when replaces-spaces-with-dashes option is true', function() {
            // Arrange
            compile('replace-spaces-with-dashes="false"');

            // Act
            newTag('foo bar');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo bar' }]);
        });

        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.replaceSpacesWithDashes).toBe(true);
        });
    });

    describe('allowed-tags-pattern option', function() {
        it('allows only tags matching a regular expression to be added', function() {
            // Arrange
            compile('allowed-tags-pattern="^[a-z]+@[a-z]+\\.com$"');

            // Act
            newTag('foo@bar.com');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo@bar.com' }]);
        });

        it('rejects tags that do not match the regular expression', function() {
            // Arrange
            compile('allowed-tags-pattern="^[a-z]+@[a-z]+\\.com$"');

            // Act
            newTag('foobar.com');

            // Assert
            expect($scope.tags).toEqual([]);
        });

        it('initializes the option to .+', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.allowedTagsPattern).toEqual(/.+/);
        });
    });

    describe('min-length option', function() {
        it('initializes the option to 3', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.minLength).toBe(3);
        });

        it('adds a new tag if the input length is greater than the min-length option', function() {
            // Arrange
            compile('min-length="5"');

            // Act
            newTag('foobar');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foobar' }]);
            expect(getInput()).not.toHaveClass('invalid-tag');

        });

        it('does not add a new tag if the input length is less than the min-length option', function() {
            // Arrange
            compile('min-length="5"');

            // Act
            newTag('foo');

            // Assert
            expect($scope.tags).toEqual([]);
            expect(getInput()).toHaveClass('invalid-tag');
        });
    });

    describe('max-length option', function() {
        it('initializes the option to MAX_SAFE_INTEGER', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.maxLength).toBe(MAX_SAFE_INTEGER);
        });

        it('adds a new tag if the input length is less than the max-length option', function() {
            // Arrange
            compile('max-length="5"');

            // Act
            newTag('foo');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foo' }]);
            expect(getInput()).not.toHaveClass('invalid-tag');
        });

        it('adds a new tag of any length if the max-length option has no value', function() {
            // Arrange
            compile();

            // Act
            newTag('foooooooooooooooooooooooooooooooooooooooooooooooooooooooobar');

            // Assert
            expect($scope.tags).toEqual([{ text: 'foooooooooooooooooooooooooooooooooooooooooooooooooooooooobar' }]);
        });

        it('does not add a new tag if the input length is greater than the max-length option', function() {
            // Arrange
            compile('max-length="5"');

            // Act
            newTag('foobar');

            // Assert
            expect($scope.tags).toEqual([]);
            expect(getInput()).toHaveClass('invalid-tag');
        });
    });

    describe('enable-editing-last-tag option', function() {
        beforeEach(function() {
            $scope.tags = generateTags(3);
        });

        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.enableEditingLastTag).toBe(false);
        });

        describe('option is on', function() {
            beforeEach(function() {
                compile('enable-editing-last-tag="true"');
            });

            describe('backspace is pressed once', function() {
                it('moves the last tag back into the input field when the input field is empty', function() {
                    // Arrange
                    spyOn(isolateScope.events, 'trigger').and.callThrough();
                    // Act
                    sendBackspace();

                    // Assert
                    expect(getInput().val()).toBe('Tag3');
                    expect($scope.tags).toEqual([{ text: 'Tag1' }, { text: 'Tag2' }]);
                    expect(isolateScope.events.trigger).toHaveBeenCalledWith('input-change', 'Tag3');
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();

                    // Assert
                    expect($scope.tags).toEqual([{ text: 'Tag1' }, { text: 'Tag2' }, { text: 'Tag3' }]);
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
                    expect(getTag(2)).toHaveClass('selected');
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();

                    // Assert
                    expect($scope.tags).toEqual([{ text: 'Tag1' }, { text: 'Tag2' }, { text: 'Tag3' }]);
                });

                it('stops highlighting the last tag when the input box becomes non-empty', function() {
                    // Act
                    sendBackspace();
                    sendKeyPress(65);

                    // Assert
                    expect(getTag(2)).not.toHaveClass('selected');
                });
            });

            describe('backspace is pressed twice', function() {
                it('removes the last tag when the input field is empty', function() {
                    // Act
                    sendBackspace();
                    sendBackspace();

                    // Assert
                    expect(getInput().val()).toBe('');
                    expect($scope.tags).toEqual([{ text: 'Tag1' }, { text: 'Tag2' }]);
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();
                    sendBackspace();

                    // Assert
                    expect($scope.tags).toEqual([{ text: 'Tag1' }, { text: 'Tag2' }, { text: 'Tag3' }]);
                });
            });
        });
    });

    describe('min-tags option', function() {
        it('initializes the option to 0', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.minTags).toBe(0);
        });

        it('makes the element invalid when the number of tags is less than the min-tags option', function() {
            // Arrange
            compileWithForm('min-tags="3"', 'name="tags"');

            // Act
            $scope.tags = generateTags(2);
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$invalid).toBe(true);
            expect($scope.form.tags.$error.minTags).toBe(true);
        });

        it('makes the element valid when the number of tags is not less than the min-tags option', function() {
            // Arrange
            compileWithForm('min-tags="2"', 'name="tags"');

            // Act
            $scope.tags = generateTags(2);
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$valid).toBe(true);
            expect($scope.form.tags.$error.minTags).toBe(false);
        });

        it('makes the element valid when the max-tags option is undefined', function() {
            // Arrange
            compileWithForm('name="tags"');

            // Act
            $scope.tags = generateTags(5);
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$valid).toBe(true);
            expect($scope.form.tags.$error.minTags).toBe(false);
        });

        it('re-validates the element when the min-tags option changes', function() {
            // Arrange
            compileWithForm('min-tags="2"', 'name="tags"');

            $scope.tags = generateTags(2);
            $scope.$digest();

            // Act
            isolateScope.options.minTags = 3;
            isolateScope.events.trigger('option-change', { name: 'minTags' });
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$invalid).toBe(true);
            expect($scope.form.tags.$error.minTags).toBe(true);
        });
    });


    describe('max-tags option', function() {
        it('initializes the option to MAX_SAFE_INTEGER', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.maxTags).toBe(MAX_SAFE_INTEGER);
        });

        it('makes the element invalid when the number of tags is greater than the max-tags option', function() {
            // Arrange
            compileWithForm('max-tags="2"', 'name="tags"');

            // Act
            $scope.tags = generateTags(3);
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$invalid).toBe(true);
            expect($scope.form.tags.$error.maxTags).toBe(true);
        });

        it('makes the element valid when the number of tags is not greater than the max-tags option', function() {
            // Arrange
            compileWithForm('max-tags="2"', 'name="tags"');

            // Act
            $scope.tags = generateTags(2);
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$valid).toBe(true);
            expect($scope.form.tags.$error.maxTags).toBe(false);
        });

        it('makes the element valid when the max-tags option is undefined', function() {
            // Arrange
            compileWithForm('name="tags"');

            // Act
            $scope.tags = generateTags(5);
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$valid).toBe(true);
            expect($scope.form.tags.$error.maxTags).toBe(false);
        });

        it('re-validates the element when the max-tags option changes', function() {
            // Arrange
            compileWithForm('max-tags="2"', 'name="tags"');

            $scope.tags = generateTags(2);
            $scope.$digest();

            // Act
            isolateScope.options.maxTags = 1;
            isolateScope.events.trigger('option-change', { name: 'maxTags' });
            $scope.$digest();

            // Assert
            expect($scope.form.tags.$invalid).toBe(true);
            expect($scope.form.tags.$error.maxTags).toBe(true);
        });
    });

    describe('display-property option', function() {
        it('initializes the option to "text"', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.displayProperty).toBe('text');
        });

        it('renders the correct number of tags', function() {
            // Arrange
            $scope.tags = [
                { id: 1, label: 'Tag1' },
                { id: 2, label: 'Tag2' },
                { id: 3, label: 'Tag3' },
            ];

            // Act
            compile('display-property="label"');

            // Assert
            expect(getTags().length).toBe(3);
            expect(getTagText(0)).toBe('Tag1');
            expect(getTagText(1)).toBe('Tag2');
            expect(getTagText(2)).toBe('Tag3');
        });

        it('updates the model', function() {
            // Arrange
            compile('display-property="label"');

            // Act
            newTag('Tag1');
            newTag('Tag2');
            newTag('Tag3');

            // Assert
            expect($scope.tags).toEqual([
                { label: 'Tag1' },
                { label: 'Tag2' },
                { label: 'Tag3' }
            ]);
        });

        it('converts an array of strings into an array of objects', function() {
            // Arrange
            $scope.tags = ['Item1', 'Item2', 'Item3'];

            // Act
            compile('display-property="label"');

            // Assert
            expect($scope.tags).toEqual([
                { label: 'Item1' },
                { label: 'Item2' },
                { label: 'Item3' }
            ]);
        });
    });

    describe('key-property option', function () {
        it('initializes the option to an empty string', function () {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.keyProperty).toBe('');
        });

        it('renders tags with duplicate labels but different keys', function () {
            // Arrange
            $scope.tags= [
                { id: 1, text: 'Tag' },
                { id: 2, text: 'Tag' }
            ];

            // Act
            compile('key-property="id"');

            // Assert
            expect(getTagText(0)).toBe('Tag');
            expect(getTagText(1)).toBe('Tag');
        });

        it('fails to render tags with duplicate keys', function () {
            // Arrange
            $scope.tags= [
                { id: 1, text: 'Tag' },
                { id: 1, text: 'Tag' }
            ];

            // Act/Assert
            expect(function() { compile('key-property="id"'); }).toThrowError();
        });

        it('adds tags with duplicate labels but different keys', function () {
            // Arrange
            $scope.tags = [
                { id: 1, text: 'Tag' }
            ];
            compile('key-property="id"');

            // Act
            isolateScope.tagList.add({ id: 2, text: 'Tag' });

            // Assert
            expect($scope.tags).toEqual([
                { id: 1, text: 'Tag' },
                { id: 2, text: 'Tag' }
            ]);
        });

        it('doesn\'t allow tags with duplicate keys', function () {
            // Arrange
            $scope.tags = [
                { id: 1, text: 'Tag' }
            ];
            compile('key-property="id"');

            // Act
            isolateScope.tagList.add({ id: 1, text: 'Other' });

            // Assert
            expect($scope.tags).toEqual([{ id: 1, text: 'Tag' }]);
        });
    });

    describe('allow-leftover-text option', function() {
        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.allowLeftoverText).toBe(false);
        });

        it('makes the element invalid when it loses focus and there is any leftover text', function() {
            // Arrange
            compileWithForm('allow-leftover-text="false"', 'name="tags"');
            newTag('foo');
            newTag('Foo');

            // Act
            isolateScope.events.trigger('input-blur');

            // Assert
            expect($scope.form.tags.$invalid).toBe(true);
            expect($scope.form.tags.$error.leftoverText).toBe(true);
        });

        it('does not make the element invalid when it loses focus and there is any leftover text and the option is true', function() {
            // Arrange
            compileWithForm('allow-leftover-text="true"', 'name="tags"');
            newTag('foo');
            newTag('Foo');

            // Act
            isolateScope.events.trigger('input-blur');

            // Assert
            expect($scope.form.tags.$valid).toBe(true);
            expect($scope.form.tags.$error.leftoverText).toBe(false);
        });

        it('does not make the element invalid when some tag is removed and there is any leftover text', function() {
            // Arrange
            compileWithForm('allow-leftover-text="false"', 'name="tags"');
            isolateScope.hasFocus = true;
            newTag('foo');
            newTag('Foo');
            changeInputValue('some text');

            // Act
            getRemoveButton(0).click();

            // Assert
            expect($scope.form.tags.$valid).toBe(true);
            expect($scope.form.tags.$error.leftoverText).toBe(false);
        });

        it('makes the element valid and removes the leftoverText error when it gains focus', function() {
            // Arrange
            compileWithForm('name="tags"');
            newTag('foo');
            newTag('Foo');
            isolateScope.events.trigger('input-blur');

            // Act
            isolateScope.events.trigger('input-focus');

            // Assert
            expect($scope.form.tags.$valid).toBe(true);
            expect($scope.form.tags.$error.leftoverText).toBe(false);
        });

        it('re-validates the element when the allow-leftover-text option changes', function() {
            // Arrange
            compileWithForm('allow-leftover-text="true"', 'name="tags"');
            newTag('foo');
            newTag('Foo');
            isolateScope.events.trigger('input-blur');

            // Act
            isolateScope.options.allowLeftoverText = false;
            isolateScope.events.trigger('option-change', { name: 'allowLeftoverText' });

            // Assert
            expect($scope.form.tags.$invalid).toBe(true);
            expect($scope.form.tags.$error.leftoverText).toBe(true);
        });
    });

    describe('add-from-autocomplete-only option', function() {
        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.addFromAutocompleteOnly).toBe(false);
        });

        describe('option is true', function() {
            beforeEach(function() {
                compileWithForm('add-from-autocomplete-only="true"', 'name="tags"', 'allow-leftover-text="false"',
                    'add-on-blur="true"', 'add-on-enter="true"', 'add-on-comma="true"', 'add-on-space="true"');
            });

            it('does not add a tag when the enter key is pressed', function() {
                // Act
                newTag('foo', KEYS.enter);

                // Assert
                expect($scope.tags).toEqual([]);
            });

            it('does not add a tag when the comma key is pressed', function() {
                // Act
                newTag('foo', KEYS.comma);

                // Assert
                expect($scope.tags).toEqual([]);
            });

            it('does not add a tag when the space key is pressed', function() {
                // Act
                newTag('foo', KEYS.space);

                // Assert
                expect($scope.tags).toEqual([]);
            });

            it('does not add a tag when the element loses focus', function() {
                // Arrange
                isolateScope.newTag.text = 'foo';

                // Act
                isolateScope.events.trigger('input-blur');

                // Assert
                expect(isolateScope.tags).toEqual([]);
            });
        });
    });

    describe('on-tag-added option', function() {
        it('calls the provided callback when a new tag is added', function() {
            // Arrange
            $scope.callback = jasmine.createSpy();
            compile('on-tag-added="callback($tag)"');

            // Act
            newTag('foo');

            // Assert
            expect($scope.callback).toHaveBeenCalledWith({ text: 'foo' });
        });
    });

    describe('on-invalid-tag option', function() {
        it('calls the provided callback when a invalid tag is added', function() {
            // Arrange
            $scope.callback = jasmine.createSpy();
            compile('on-invalid-tag="callback($tag)" allowed-tags-pattern="^[a-z]+@[a-z]+\\.com$"');

            // Act
            newTag('foo');

            // Assert
            expect($scope.callback).toHaveBeenCalledWith({ text: 'foo' });
        });
    });

    describe('on-tag-removed option', function () {
        it('calls the provided callback when a tag is removed by clicking the remove button', function() {
            // Arrange
            $scope.tags = generateTags(3);
            $scope.callback = jasmine.createSpy();
            compile('on-tag-removed="callback($tag)"');

            // Act
            getRemoveButton(0).click();

            // Assert
            expect($scope.callback).toHaveBeenCalledWith({ text: 'Tag1' });
        });

        it('calls the provided callback when the last tag is removed by pressing backspace twice', function() {
            // Arrange
            $scope.tags = generateTags(2);
            $scope.callback = jasmine.createSpy();
            compile('on-tag-removed="callback($tag)"');

            // Act
            sendBackspace();
            sendBackspace();

            // Assert
            expect($scope.callback).toHaveBeenCalledWith({ text: 'Tag2' });
        });
    });

    describe('ng-disabled support', function () {
        it('disables the inner input element', function () {
            // Arrange/Act
            compile('ng-disabled="true"');

            // Assert
            expect(getInput()[0].disabled).toBe(true);
        });

        it('doesn\'t focus the input field when the container div is clicked', function() {
            // Arrange
            var input = getInput()[0];
            spyOn(input, 'focus');

            compile('ng-disabled="true"');

            // Act
            element.find('div').click();

            // Assert
            expect(input.focus).not.toHaveBeenCalled();
        });

        it('doesn\'t remove existing tags', function() {
            // Arrange
            compile('ng-disabled="true"');
            $scope.tags = generateTags(1);

            // Act
            getRemoveButton(0).click();

            // Assert
            expect($scope.tags).toEqual([{ text: 'Tag1' }]);
        });

        it('monitors the disabled attribute', function () {
            // Arrange
            $scope.disabled = false;
            compile('ng-disabled="disabled"');

            // Act
            $scope.disabled = true;
            $scope.$digest();

            // Assert
            expect(isolateScope.disabled).toBe(true);
        });
    });

    describe('autocomplete registration', function() {
        var autocompleteObj;

        beforeEach(function() {
            compile();
            autocompleteObj = element.controller('tagsInput').registerAutocomplete();
        });

        it('creates an object containing all the autocomplete directive needs to work', function() {
            expect(autocompleteObj).toEqual({
                addTag: jasmine.any(Function),
                focusInput: jasmine.any(Function),
                on: jasmine.any(Function),
                getTags: jasmine.any(Function),
                getCurrentTagText: jasmine.any(Function),
                getOptions: jasmine.any(Function)
            });
        });

        it('tries to add a tag', function() {
            // Arrange
            $scope.tags = [];
            $scope.$digest();

            // Act
            autocompleteObj.addTag({ text: ' Tag ' });

            // Assert
            expect($scope.tags).toEqual([{ text: 'Tag' }]);
        });

        it('empties the input field after a tag is added', function() {
            // Arrange
            changeInputValue('Tag');

            // Act
            autocompleteObj.addTag({ text: 'Tag' });
            $scope.$digest();

            // Assert
            expect(getInput().val()).toBe('');
        });

        it('focus the input box', function() {
            // Arrange
            var input = getInput()[0];
            spyOn(input, 'focus');

            // Act
            autocompleteObj.focusInput();

            // Assert
            expect(input.focus).toHaveBeenCalled();
        });

        it('returns the list of tags', function() {
            // Arrange
            $scope.tags = generateTags(2);
            $scope.$digest();

            // Act/Assert
            expect(autocompleteObj.getTags()).toEqual([{ text: 'Tag1' }, { text: 'Tag2' }]);
        });

        it('returns the current tag text', function() {
            // Arrange
            changeInputValue('ABC');
            $scope.$digest();

            // Act/Assert
            expect(autocompleteObj.getCurrentTagText()).toBe('ABC');
        });

        it('returns the option list', function() {
            // Arrange
            isolateScope.options = { option1: 1, option2: 2, option3: true };

            // Act/Assert
            expect(autocompleteObj.getOptions()).toEqual({ option1: 1, option2: 2, option3: true });
        });

        it('subscribe for an event', function() {
            // Arrange
            var callback = angular.noop;
            spyOn(isolateScope.events, 'on');

            // Act
            var obj = autocompleteObj.on('dummy event', callback);

            // Assert
            expect(obj).toBe(autocompleteObj);
            expect(isolateScope.events.on).toHaveBeenCalledWith('dummy event', callback);
        });
    });

    describe('hotkeys propagation handling', function() {
        var hotkeys;

        beforeEach(function() {
            compile('add-on-enter="true"', 'add-on-space="true"', 'add-on-comma="true"');
        });

        describe('modifier key is on', function() {
            beforeEach(function() {
                hotkeys = [KEYS.enter, KEYS.comma, KEYS.space, KEYS.backspace];
            });

            it('does not prevent any hotkey from being propagated when the shift key is down', function() {
                angular.forEach(hotkeys, function(key) {
                    expect(sendKeyDown(key, { shiftKey: true }).isDefaultPrevented()).toBe(false);
                });
            });

            it('does not prevent any hotkey from being propagated when the alt key is down', function() {
                angular.forEach(hotkeys, function(key) {
                    expect(sendKeyDown(key, { altKey: true }).isDefaultPrevented()).toBe(false);
                });
            });

            it('does not prevent any hotkey from being propagated when the ctrl key is down', function() {
                angular.forEach(hotkeys, function(key) {
                    expect(sendKeyDown(key, { ctrlKey: true }).isDefaultPrevented()).toBe(false);
                });
            });

            it('does not prevent any hotkey from being propagated when the meta key is down', function() {
                angular.forEach(hotkeys, function(key) {
                    expect(sendKeyDown(key, { metaKey: true }).isDefaultPrevented()).toBe(false);
                });
            });

        });

        describe('modifier key is off', function() {
            it('prevents enter, comma and space keys from being propagated when all modifiers are up', function() {
                // Arrange
                hotkeys = [KEYS.enter, KEYS.comma, KEYS.space];

                // Act/Assert
                angular.forEach(hotkeys, function(key) {
                    expect(sendKeyDown(key, {
                        shiftKey: false,
                        ctrlKey: false,
                        altKey: false,
                        metaKey: false
                    }).isDefaultPrevented()).toBe(true);
                });
            });

            it('prevents the backspace key from being propagated when all modifiers are up', function() {
                // Arrange
                isolateScope.tryRemoveLast = function() { return true; };

                // Act/Assert
                expect(sendKeyDown(KEYS.backspace).isDefaultPrevented()).toBe(true);
            });
        });
    });
});
