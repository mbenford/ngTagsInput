'use strict';

describe('tags-input-directive', function() {
    var $compile, $scope, $timeout, $document,
        isolateScope, element;

    beforeEach(function() {
        module('ngTagsInput');

        inject(function(_$compile_, _$rootScope_, _$document_, _$timeout_) {
            $compile = _$compile_;
            $scope = _$rootScope_;
            $document = _$document_;
            $timeout = _$timeout_;
        });
    });

    function compile() {
        var options = jQuery.makeArray(arguments).join(' ');
        var template = '<tags-input ng-model="tags" ' + options + '></tags-input>';

        element = $compile(template)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
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
            input.val(input.val() + String.fromCharCode(charCode));
            input.trigger('input');
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
            input.val(value.substr(0, value.length - 1));
            input.trigger('input');
        }
    }

    describe('basic features', function() {
        it('renders the correct number of tags', function() {
            // Arrange
            $scope.tags = ['some','cool','tags'];

            // Act
            compile();

            // Assert
            expect(getTags().length).toBe(3);
            expect(getTagText(0)).toBe('some');
            expect(getTagText(1)).toBe('cool');
            expect(getTagText(2)).toBe('tags');
        });

        it('updates the model', function() {
            // Arrange
            compile();

            // Act
            newTag('some');
            newTag('cool');
            newTag('tags');

            // Assert
            expect($scope.tags).toEqual(['some','cool','tags']);
        });

        it('removes a tag when the remove button is clicked', function() {
            // Arrange
            $scope.tags = ['some','cool','tags'];
            compile();

            // Act
            element.find('button').click();

            // Assert
            expect($scope.tags).toEqual([]);
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
            expect($scope.tags).toEqual(['foo']);
        });

        it('adds a custom CSS class to the container div when custom-class option is provided', function() {
            // Arrange/Act
            compile('custom-class="myClass"');

            // Arrange
            expect(element.find('div').hasClass('myClass')).toBe(true);
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
            expect(element.find('div.tags').hasClass('focused')).toBe(true);
        });

        it('does not outline the tags div when the focused property is false', function() {
            // Arrange
            isolateScope.hasFocus = false;

            // Act
            $scope.$digest();

            // Assert
            expect(element.find('div.tags').hasClass('focused')).toBe(false);
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

        it('does not trigger a digest cycle when the input field is focused already', function() {
            // Arrange
            isolateScope.hasFocus = true;
            spyOn($scope, '$digest');

            // Act
            getInput().triggerHandler('focus');

            // Assert
            expect($scope.$digest).not.toHaveBeenCalled();
        });
    });
    
    describe('tabindex option', function() {
        it('sets the input field tab index', function() {
            // Arrange/Act
            compile('tabindex="1"');

            // Assert
            expect(getInput().attr('tabindex')).toBe('1');
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('tabindex="1"');

            // Assert
            expect(isolateScope.options.tabindex).toBe(1);
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = 1;

            // Act
            compile('tabindex="{{ value }}"');

            // Assert
            expect(isolateScope.options.tabindex).toBe(1);
        });
    });

    describe('add-on-enter option', function() {
        it('adds a new tag when the enter key is pressed and add-on-enter option is true', function() {
            // Arrange
            compile('add-on-enter="true"');

            // Act
            newTag('foo', KEYS.enter);

            // Assert
            expect($scope.tags).toEqual(['foo']);
        });

        it('does not add a new tag when the enter key is pressed and add-on-enter option is false', function() {
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

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('add-on-enter="true"');

            // Assert
            expect(isolateScope.options.addOnEnter).toBe(true);
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = true;

            // Act
            compile('add-on-enter="{{ value }}"');

            // Assert
            expect(isolateScope.options.addOnEnter).toBe(true);
        });
    });

    describe('add-on-space option', function() {
        it('adds a new tag when the space key is pressed and add-on-space option is true', function() {
            // Arrange
            compile('add-on-space="true"');

            // Act
            newTag('foo', KEYS.space);

            // Assert
            expect($scope.tags).toEqual(['foo']);
        });

        it('does not add a new tag when the space key is pressed and add-on-space option is false', function() {
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

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('add-on-space="true"');

            // Assert
            expect(isolateScope.options.addOnSpace).toBe(true);
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = true;

            // Act
            compile('add-on-space="{{ value }}"');

            // Assert
            expect(isolateScope.options.addOnSpace).toBe(true);
        });
    });

    describe('add-on-comma option', function() {
        it('adds a new tag when the comma key is pressed and add-on-comma option is true', function() {
            // Arrange
            compile('add-on-comma="true"');

            // Act
            newTag('foo', KEYS.comma);

            // Assert
            expect($scope.tags).toEqual(['foo']);
        });

        it('does not add a new tag when the space key is pressed and add-on-comma option is false', function() {
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

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('add-on-comma="true"');

            // Assert
            expect(isolateScope.options.addOnComma).toBe(true);
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = true;

            // Act
            compile('add-on-comma="{{ value }}"');

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

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('add-on-blur="false"');

            // Assert
            expect(isolateScope.options.addOnBlur).toBe(false);
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = false;

            // Act
            compile('add-on-blur="{{ value }}"');

            // Assert
            expect(isolateScope.options.addOnBlur).toBe(false);
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
                isolateScope.newTag = 'foo';
                body.focus();

                // Act
                getInput().triggerHandler('blur');
                $timeout.flush();

                // Assert
                expect($scope.tags).toEqual(['foo']);
            });

            it('does not add a tag when the input field loses focus to the directive itself', function() {
                // Arrange
                isolateScope.newTag = 'foo';
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
                isolateScope.newTag = 'foo';

                // Act
                getInput().triggerHandler('blur');

                // Assert
                expect($scope.tags).toEqual([]);
            });
        });
    });

    describe('placeholder option', function() {
        it('sets the input field placeholder text', function() {
            // Arrange/Act
            compile('placeholder="New tag"');

            // Assert
            expect(getInput().attr('placeholder')).toBe('New tag');
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('placeholder="New tag"');

            // Assert
            expect(isolateScope.options.placeholder).toBe('New tag');
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = 'New tag';

            // Act
            compile('placeholder="{{ value }}"');

            // Assert
            expect(isolateScope.options.placeholder).toBe('New tag');
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
            $scope.tags = ['foo'];

            // Act
            compile('remove-tag-symbol="X"');

            // Assert
            expect(element.find('button').html()).toBe('X');
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('remove-tag-symbol="X"');

            // Assert
            expect(isolateScope.options.removeTagSymbol).toBe('X');
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = 'X';

            // Act
            compile('remove-tag-symbol="{{ value }}"');

            // Assert
            expect(isolateScope.options.removeTagSymbol).toBe('X');
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
            expect($scope.tags).toEqual(['foo-bar']);
        });

        it('does not replace spaces with dashes when replaces-spaces-with-dashes option is true', function() {
            // Arrange
            compile('replace-spaces-with-dashes="false"');

            // Act
            newTag('foo bar');

            // Assert
            expect($scope.tags).toEqual(['foo bar']);
        });

        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.replaceSpacesWithDashes).toBe(true);
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('replace-spaces-with-dashes="true"');

            // Assert
            expect(isolateScope.options.replaceSpacesWithDashes).toBe(true);
        });

        it('sets the option given a interpolated string', function() {
            // Arrange
            $scope.value = true;

            // Act
            compile('replace-spaces-with-dashes="{{ value }}"');

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
            expect($scope.tags).toEqual(['foo@bar.com']);
        });

        it('rejects tags that do not match the regular expression', function() {
            // Arrange
            compile('allowed-tags-pattern="^[a-z]+@[a-z]+\\.com$"');

            // Act
            newTag('foobar.com');

            // Assert
            expect($scope.tags).toEqual([]);
        });

        it('initializes the option to ^[a-zA-Z0-9\\s]+$', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.allowedTagsPattern.toString()).toBe('/^[a-zA-Z0-9\\s]+$/');
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('allowed-tags-pattern=".*"');

            // Assert
            expect(isolateScope.options.allowedTagsPattern.toString()).toBe('/.*/');
        });

        it('sets the option given a interpolated string', function() {
            // Arrange
            $scope.value = '.*';

            // Act
            compile('allowed-tags-pattern="{{ value }}"');

            // Assert
            expect(isolateScope.options.allowedTagsPattern.toString()).toBe('/.*/');
        });
    });

    describe('min-length option', function() {
        it('adds a new tag only if its length is greater than or equal to min-length option', function() {
            // Arrange
            compile('min-length="5"');

            // Act
            newTag('foo');

            // Assert
            expect($scope.tags).toEqual([]);
        });

        it('initializes the option to 3', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.minLength).toBe(3);
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('min-length="5"');

            // Assert
            expect(isolateScope.options.minLength).toBe(5);
        });

        it('sets the option given a interpolated string', function() {
            // Arrange
            $scope.value = 5;

            // Act
            compile('min-length="{{ value }}"');

            // Assert
            expect(isolateScope.options.minLength).toBe(5);
        });
    });

    describe('max-length option', function() {
        it('sets the maxlength attribute of the input field to max-length option', function() {
            // Arrange/Act
            compile('max-length="10"');

            // Assert
            expect(getInput().attr('maxlength')).toBe('10');
        });

        it('initializes the option to empty', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(getInput().attr('maxlength')).toBe('');
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('max-length="5"');

            // Assert
            expect(isolateScope.options.maxLength).toBe(5);
        });

        it('sets the option given a interpolated string', function() {
            // Arrange
            $scope.value = 5;

            // Act
            compile('max-length="{{ value }}"');

            // Assert
            expect(isolateScope.options.maxLength).toBe(5);
        });
    });

    describe('enable-editing-last-tag option', function() {
        beforeEach(function() {
            $scope.tags = ['some','cool','tags'];
        });

        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.enableEditingLastTag).toBe(false);
        });

        it('sets the option given a static string', function() {
            // Arrange/Act
            compile('enable-editing-last-tag="true"');

            // Assert
            expect(isolateScope.options.enableEditingLastTag).toBe(true);
        });

        it('sets the option given an interpolated string', function() {
            // Arrange
            $scope.value = true;

            // Act
            compile('enable-editing-last-tag="{{ value }}"');

            // Assert
            expect(isolateScope.options.enableEditingLastTag).toBe(true);
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
                    expect($scope.tags).toEqual(['some','cool']);
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();

                    // Assert
                    expect($scope.tags).toEqual(['some','cool','tags']);
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
                    expect($scope.tags).toEqual(['some','cool','tags']);
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
                    expect($scope.tags).toEqual(['some','cool']);
                });

                it('does nothing when the input field is not empty', function() {
                    // Act
                    sendKeyPress(65);
                    sendBackspace();
                    sendBackspace();

                    // Assert
                    expect($scope.tags).toEqual(['some','cool','tags']);
                });
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
            expect($scope.callback).toHaveBeenCalledWith('foo');
        });
    });

    describe('on-tag-removed option', function () {
        it('calls the provided callback when a tag is removed by clicking the remove button', function() {
            // Arrange
            $scope.tags = ['some','cool','tags'];
            $scope.callback = jasmine.createSpy();
            compile('on-tag-removed="callback($tag)"');

            // Act
            element.find('button')[0].click();

            // Assert
            expect($scope.callback).toHaveBeenCalledWith('some');
        });

        it('calls the provided callback when the last tag is removed by pressing backspace twice', function() {
            // Arrange
            $scope.tags = ['some','cool','tags'];
            $scope.callback = jasmine.createSpy();
            compile('on-tag-removed="callback($tag)"');

            // Act
            sendBackspace();
            sendBackspace();

            // Assert
            expect($scope.callback).toHaveBeenCalledWith('tags');
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
                tryAddTag: jasmine.any(Function),
                focusInput: jasmine.any(Function),
                on: jasmine.any(Function),
                getTags: jasmine.any(Function)
            });
        });

        it('tries to add a tag', function() {
            // Arrange
            $scope.tags = [];
            $scope.$digest();

            // Act
            autocompleteObj.tryAddTag('tag');

            // Assert
            expect($scope.tags).toEqual(['tag']);
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
            $scope.tags = ['a', 'b', 'c'];
            $scope.$digest();

            // Act/Assert
            expect(autocompleteObj.getTags()).toEqual(['a', 'b', 'c']);
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
                        metaKey: false}).isDefaultPrevented()).toBe(true);
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