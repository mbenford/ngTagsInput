'use strict';

describe('autoComplete directive', function() {
    var $compile, $scope, $q, $timeout,
        parentCtrl, element, isolateScope, suggestionList, deferred, tagsInput, eventHandlers;

    beforeEach(function() {
        jasmine.addMatchers(customMatchers);

        module('ngTagsInput');

        inject(function($rootScope, _$compile_, _$q_, _$timeout_) {
            $scope = $rootScope;
            $compile = _$compile_;
            $q = _$q_;
            $timeout = _$timeout_;
        });

        deferred = $q.defer();
        eventHandlers = {
            call: function(name, args) {
                if (this[name]) {
                    this[name].call(null, args);
                }
            }
        };
        $scope.loadItems = jasmine.createSpy().and.returnValue(deferred.promise);

        tagsInput = {
            changeInputValue: jasmine.createSpy(),
            addTag: jasmine.createSpy(),
            focusInput: jasmine.createSpy(),
            on: jasmine.createSpy().and.callFake(function(names, handler) {
                names.split(' ').forEach(function(name) { eventHandlers[name] = handler; });
                return this;
            }),
            getTags: jasmine.createSpy().and.returnValue([]),
            getCurrentTagText: jasmine.createSpy(),
            getOptions: jasmine.createSpy().and.returnValue({
                displayProperty: 'text'
            })
        };

        compile();
    });

    function compile() {
        var parent, options;

        parent = $compile('<tags-input ng-model="whatever"></tags-input>')($scope);
        $scope.$digest();

        parentCtrl = parent.controller('tagsInput');
        spyOn(parentCtrl, 'registerAutocomplete').and.returnValue(tagsInput);

        options = jQuery.makeArray(arguments).join(' ');
        element = angular.element('<auto-complete source="loadItems($query)" ' + options + '></auto-complete>');
        parent.append(element);

        $compile(element)($scope);
        $scope.$digest();

        isolateScope = element.isolateScope();
        suggestionList = isolateScope.suggestionList;
    }

    function resolve(items) {
        deferred.resolve(items);
        $scope.$digest();
    }

    function sendKeyDown(keyCode) {
        var event = jQuery.Event('keydown', { keyCode: keyCode });
        eventHandlers.call('input-keydown', event);

        return event;
    }

    function changeInputValue(value) {
        eventHandlers.call('input-change', value);
        $scope.$digest();
    }

    function getSuggestionsBox() {
        return element.find('div');
    }

    function getSuggestions() {
        return getSuggestionsBox().find('li');
    }

    function getSuggestion(index) {
        return getSuggestions().eq(index);
    }

    function getSuggestionText(index) {
        return getSuggestion(index).find('ti-autocomplete-match > ng-include > span').html();
    }

    function isSuggestionsBoxVisible() {
        return !!getSuggestionsBox().length;
    }

    function generateSuggestions(count) {
        return range(count, function(index) {
            return { text: 'Item' + (index + 1) };
        });
    }

    function loadSuggestions(countOrItems, text) {
        var items = angular.isNumber(countOrItems) ? generateSuggestions(countOrItems) : countOrItems;
        text = angular.isUndefined(text) ? 'foobar' : text;

        suggestionList.load(text, tagsInput.getTags());
        $timeout.flush();
        resolve(items);
    }

    describe('basic features', function() {
        it('ensures that the suggestions list is hidden by default', function() {
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('renders all elements returned by the load function that aren\'t already added', function() {
            // Act
            tagsInput.getTags.and.returnValue([{ text: 'Item3' }]);
            loadSuggestions(3);

            // Assert
            expect(getSuggestions().length).toBe(2);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
        });

        it('renders all elements returned by the load function that aren\'t already added (replaceSpaceWithDashes on)', function() {
            // Act
            tagsInput.getOptions.and.returnValue({ displayProperty: 'text', replaceSpacesWithDashes: true });
            compile();

            tagsInput.getTags.and.returnValue([{ text: 'Item-3' }]);
            loadSuggestions([
                { text: 'Item 1'},
                { text: 'Item 2'},
                { text: 'Item 3'},
            ]);

            // Assert
            expect(getSuggestions().length).toBe(2);
            expect(getSuggestionText(0)).toBe('Item 1');
            expect(getSuggestionText(1)).toBe('Item 2');
        });

        it('renders all elements returned by the load function that aren\'t already added ($http promise)', function() {
            // Act
            tagsInput.getTags.and.returnValue([{ text: 'Item3' }]);
            loadSuggestions({ data: generateSuggestions(3)});

            // Assert
            expect(getSuggestions().length).toBe(2);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
        });

        it('renders all elements returned by the load function that aren\'t already added (non-string items)', function() {
            // Act
            tagsInput.getTags.and.returnValue([{ text: '1' }]);
            loadSuggestions({
                data: [
                    { text: 1 },
                    { text: 1.5 },
                    { text: true },
                    { text: {} },
                    { text: null },
                    { text: undefined }
                ]
            });

            // Assert
            expect(getSuggestions().length).toBe(5);
            expect(getSuggestionText(0)).toBe('1.5');
            expect(getSuggestionText(1)).toBe('true');
            expect(getSuggestionText(2)).toBe('[object Object]');
            expect(getSuggestionText(3)).toBe('');
            expect(getSuggestionText(4)).toBe('');
        });

        it('renders all elements returned by the load function that aren\'t already added (non-promise)', function() {
            // Arrange
            tagsInput.getTags.and.returnValue([{ text: 'Item3' }]);
            $scope.loadItems = jasmine.createSpy().and.returnValue(generateSuggestions(3));

            // Act
            suggestionList.load('', tagsInput.getTags());
            $timeout.flush();

            // Assert
            expect(getSuggestions().length).toBe(2);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
        });

        it('renders all elements returned by the load function using the provided display-property option', function() {
            // Arrange
            tagsInput.getOptions.and.returnValue({ displayProperty: 'label' });
            compile();

            // Act
            loadSuggestions([
                { label: 'Item1' },
                { label: 'Item2' },
                { label: 'Item3' },
            ]);

            // Assert
            expect(getSuggestions().length).toBe(3);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
            expect(getSuggestionText(2)).toBe('Item3');
        });

        it('shows the suggestions list when there are items to show', function() {
            // Act
            loadSuggestions(1);

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(true);
        });

        it('hides the suggestions list when there is no items to show', function() {
            // Arrange
            suggestionList.visible = true;

            // Act
            loadSuggestions([]);

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestions list when there is no items left to show', function() {
            // Act
            tagsInput.getTags.and.returnValue([{ text: 'Item1' }, { text: 'Item2' }]);
            loadSuggestions(2);

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the input field becomes empty', function() {
            // Arrange
            changeInputValue('foobar');
            suggestionList.show();
            $scope.$digest();

            // Act
            changeInputValue('');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the escape key is pressed', function() {
            // Arrange
            suggestionList.show();
            $scope.$digest();

            // Act
            sendKeyDown(KEYS.escape);
            $scope.$digest();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when a tag is removed', function() {
            // Arrange
            suggestionList.show();
            $scope.$digest();

            // Act
            eventHandlers.call('tag-removed');
            $scope.$digest();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box after adding the selected suggestion to the input field', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.enter);
            $scope.$digest();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the input field loses focus', function() {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers.call('input-blur');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when a tag is added', function() {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers.call('tag-added');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when an invalid tag is tried to be added', function() {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers.call('invalid-tag');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('adds the selected suggestion when the enter key is pressed and the suggestions box is visible', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.enter);

            // Assert
            expect(tagsInput.addTag).toHaveBeenCalledWith({ text: 'Item1' });
        });

        it('adds the selected suggestion when the tab key is pressed and there is a suggestion selected', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.tab);

            // Assert
            expect(tagsInput.addTag).toHaveBeenCalledWith({ text: 'Item1' });
        });

        it('adds a copy of the selected suggestion', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);
            var item = suggestionList.items[0];

            // Act
            isolateScope.addSuggestion();

            // Assert
            expect(tagsInput.addTag.calls.argsFor(0)[0]).not.toBe(item);
        });

        it('does not change the input value when the enter key is pressed and there is nothing selected', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.selected = null;

            // Act
            sendKeyDown(KEYS.enter);

            // Assert
            expect(tagsInput.addTag).not.toHaveBeenCalled();
        });

        it('sets the selected suggestion to null after adding it to the input field', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            isolateScope.addSuggestion();

            // Assert
            expect(suggestionList.selected).toBeNull();
        });

        it('does not call the load function after adding the selected suggestion to the input field', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.enter);

            // Assert
            expect($scope.loadItems.calls.count()).toBe(1);
        });

        it('highlights the selected suggestion only', function() {
            // Arrange
            loadSuggestions(3);

            // Act
            suggestionList.select(1);
            $scope.$digest();

            // Assert
            expect(getSuggestion(0).hasClass('selected')).toBe(false);
            expect(getSuggestion(1).hasClass('selected')).toBe(true);
            expect(getSuggestion(2).hasClass('selected')).toBe(false);
        });

        it('discards all load calls but the last one', function() {
            // Arrange
            var deferred1 = $q.defer(), deferred2 = $q.defer(), deferred3 = $q.defer();
            var promises = [deferred1.promise, deferred2.promise, deferred3.promise];

            $scope.loadItems = jasmine.createSpy().and.callFake(function() {
                return promises.shift();
            });
            spyOn(suggestionList, 'show');

            // Act
            // First we need to register all promises
            suggestionList.load('foobar', tagsInput.getTags());
            $timeout.flush();

            suggestionList.load('foobar', tagsInput.getTags());
            $timeout.flush();

            suggestionList.load('foobar', tagsInput.getTags());
            $timeout.flush();

            // Now we resolve each promise which was previously created
            deferred1.resolve([{ text: 'Item1' }]);
            deferred2.resolve([{ text: 'Item2' }]);
            deferred3.resolve([{ text: 'Item3' }]);

            $scope.$digest();

            // Assert
            expect(suggestionList.show.calls.count()).toBe(1);
        });

        it('discards all load calls after the suggestion list is reset', function() {
            // Arrange
            spyOn(suggestionList, 'show');
            suggestionList.load('foobar', tagsInput.getTags());
            $timeout.flush();

            // Act
            suggestionList.reset();

            resolve([{ text: 'Item3'}]);

            // Assert
            expect(suggestionList.show).not.toHaveBeenCalled();
        });

        it('converts an array of strings into an array of objects', function() {
            // Arrange/Act
            loadSuggestions(['Item1', 'Item2', 'Item3']);

            // Assert
            expect(suggestionList.items).toEqual([
                { text: 'Item1' },
                { text: 'Item2' },
                { text: 'Item3' }
            ]);
        });

        describe('auto scrolling', function() {
            var style;

            beforeEach(function() {
                style = angular.element('<style> .suggestion-list { position: relative; overflow-y: auto; max-height: 100px }</style>').appendTo('head');
                element.appendTo('body');
            });

            afterEach(function() {
                style.remove();
                element.remove();
            });

            function isVisible(index) {
                var suggestion = getSuggestion(index),
                    container = suggestion.parent();

                return suggestion.prop('offsetTop') + suggestion.prop('offsetHeight') <= container.prop('clientHeight') + container.scrollTop() &&
                    suggestion.prop('offsetTop') >= container.scrollTop();
            }

            range(5).forEach(function(index) {
                index += 5;

                it('scrolls the container down so the selected suggestion is visible #' + index, function() {
                    // Arrange
                    loadSuggestions(10);

                    // Act
                    suggestionList.select(index);

                    // Assert
                    expect(isVisible(index)).toBe(true);
                });
            });

            range(5).forEach(function(index) {
                it('scrolls the container up so the selected suggestion is visible #' + index, function() {
                    // Arrange
                    loadSuggestions(10);
                    getSuggestionsBox().find('ul').scrollTop(100);

                    // Act
                    suggestionList.select(index);

                    // Assert
                    expect(isVisible(index)).toBe(true);
                });
            });
        });
    });

    describe('navigation through suggestions', function() {
        beforeEach(function() {
            loadSuggestions(3);
        });

        describe('downward', function() {
            it('selects the next suggestion when the down arrow key is pressed and there\'s something selected', function() {
                // Arrange
                suggestionList.select(0);

                // Act
                sendKeyDown(KEYS.down);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item2' });
            });

            it('selects the first suggestion when the down arrow key is pressed and the last item is selected', function() {
                // Arrange
                suggestionList.select(2);

                // Act
                sendKeyDown(KEYS.down);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item1' });
            });
        });

        describe('upward', function() {
            it('selects the prior suggestion when the down up key is pressed and there\'s something selected', function() {
                // Arrange
                suggestionList.select(1);

                // Act
                sendKeyDown(KEYS.up);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item1' });
            });

            it('selects the last suggestion when the up arrow key is pressed and the first item is selected', function() {
                // Arrange
                suggestionList.select(0);

                // Act
                sendKeyDown(KEYS.up);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item3' });
            });
        });

        describe('mouse', function() {
            it('selects the suggestion under the mouse pointer', function() {
                // Act
                getSuggestion(1).mouseenter();

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item2' });
            });

            it('adds the selected suggestion when a mouse click is triggered', function() {
                // Arrange
                suggestionList.selected = null;

                // Act
                getSuggestion(0).click();

                // Assert
                expect(tagsInput.addTag).toHaveBeenCalledWith({ text: 'Item1' });
            });

            it('focuses the input field when a suggestion is added via a mouse click', function() {
                // Arrange
                suggestionList.select(0);

                // Act
                getSuggestion(1).click();

                // Assert
                expect(tagsInput.focusInput).toHaveBeenCalled();
            });
        });
    });

    describe('keys propagation handling', function() {
        describe('hotkeys - suggestion box is visible', function() {
            beforeEach(function() {
                suggestionList.show();
            });

            it('prevents the down arrow keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.down);

                // Assert
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isPropagationStopped()).toBe(true);
            });

            it('prevents the up arrow keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.up);

                // Assert
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isPropagationStopped()).toBe(true);
            });

            it('prevents the enter keydown event from being propagated if there is a suggestion selected', function() {
                // Arrange
                suggestionList.selected = 'suggestion';

                // Act
                var event = sendKeyDown(KEYS.enter);

                // Assert
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isPropagationStopped()).toBe(true);
            });

            it('does not prevent the enter keydown event from begin propagated if there is no suggestion selected', function() {
                // Arrange
                suggestionList.selected = null;

                // Act
                var event = sendKeyDown(KEYS.enter);

                // Assert
                expect(event.isDefaultPrevented()).toBe(false);
                expect(event.isPropagationStopped()).toBe(false);
            });

            it('prevents the tab keydown event from being propagated if there is a suggestion selected', function() {
                // Arrange
                suggestionList.selected = 'suggestion';

                // Act
                var event = sendKeyDown(KEYS.tab);

                // Assert
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isPropagationStopped()).toBe(true);
            });

            it('does not prevent the tab keydown event from being propagated if there is no suggestion selected', function() {
                // Arrange
                suggestionList.selected = null;

                // Act
                var event = sendKeyDown(KEYS.tab);

                // Assert
                expect(event.isDefaultPrevented()).toBe(false);
                expect(event.isPropagationStopped()).toBe(false);
            });

            it('prevents the escape keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.escape);

                // Assert
                expect(event.isDefaultPrevented()).toBe(true);
                expect(event.isPropagationStopped()).toBe(true);
            });
        });

        describe('hotkeys - suggestion box is hidden', function() {
            beforeEach(function() {
                suggestionList.reset();
            });

            it('does not prevent the down arrow keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.down);

                // Assert
                expect(event.isDefaultPrevented()).toBe(false);
                expect(event.isPropagationStopped()).toBe(false);
            });

            it('does not prevent the up arrow keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.up);

                // Assert
                expect(event.isDefaultPrevented()).toBe(false);
                expect(event.isPropagationStopped()).toBe(false);
            });

            it('does not prevent the enter keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.enter);

                // Assert
                expect(event.isDefaultPrevented()).toBe(false);
                expect(event.isPropagationStopped()).toBe(false);
            });

            it('does not prevent the tab keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.tab);

                // Assert
                expect(event.isDefaultPrevented()).toBe(false);
                expect(event.isPropagationStopped()).toBe(false);
            });

            it('does not prevent the escape keydown event from being propagated', function() {
                // Act
                var event = sendKeyDown(KEYS.escape);

                // Assert
                expect(event.isDefaultPrevented()).toBe(false);
                expect(event.isPropagationStopped()).toBe(false);
            });
        });

        describe('non-hotkeys', function() {
            it('does not prevent non-hotkeys keystrokes from being propagated', function() {
                // Act
                var events = [sendKeyDown(65), sendKeyDown(66), sendKeyDown(67)];

                // Assert
                expect(events[0].isDefaultPrevented()).toBe(false);
                expect(events[0].isPropagationStopped()).toBe(false);

                expect(events[1].isDefaultPrevented()).toBe(false);
                expect(events[1].isPropagationStopped()).toBe(false);

                expect(events[2].isDefaultPrevented()).toBe(false);
                expect(events[2].isPropagationStopped()).toBe(false);
            });
        });
    });

    describe('load-on-down-arrow option', function() {
        it('initializes the option to false', function() {
           // Arrange
            compile();

            // Assert
            expect(isolateScope.options.loadOnDownArrow).toBe(false);
        });

        describe('suggestion box is hidden', function() {
            beforeEach(function() {
                suggestionList.visible = false;
            });

            it('calls the load function passing the current tag text when the down arrow key is pressed and the option is true', function() {
                // Arrange
                compile('load-on-down-arrow="true"');
                tagsInput.getCurrentTagText.and.returnValue('ABC');

                // Act
                sendKeyDown(KEYS.down);
                $timeout.flush();

                // Assert
                expect($scope.loadItems).toHaveBeenCalledWith('ABC');
            });

            it('doesn\'t call the load function when the down arrow key is pressed and the option is false', function() {
                compile('load-on-down-arrow="false"');

                // Act
                sendKeyDown(KEYS.down);
                $timeout.flush();

                // Assert
                expect($scope.loadItems).not.toHaveBeenCalled();
            });
        });

        describe('suggestion box is visible', function() {
            it('doesn\'t call the load function when the down arrow key is pressed', function() {
                // Arrange
                compile('load-on-down-arrow="true"');
                suggestionList.visible = true;

                // Act
                sendKeyDown(KEYS.down);
                $timeout.flush();

                // Assert
                expect($scope.loadItems).not.toHaveBeenCalled();
            });
        });
    });

    describe('load-on-empty option', function(){
        it('initialize the option to false', function(){
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.loadOnEmpty).toBe(false);
        });

        it('calls the load function when the input field becomes empty and the option is true', function(){
            // Arrange
            compile('load-on-empty="true"');

            // Act
            changeInputValue('');
            $timeout.flush();

            // Assert
            expect($scope.loadItems).toHaveBeenCalledWith('');
        });

        it('doesn\'t call the load function when the input field becomes empty and the option is false', function(){
            // Arrange
            compile('load-on-empty="false"');

            // Act
            changeInputValue('');
            $timeout.flush();

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });
    });

    describe('load-on-focus option', function() {
        it('initializes the option to false', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.loadOnFocus).toBe(false);
        });

        it('calls the load function when the input element gains focus and the option is true', function() {
            // Arrange
            compile('load-on-focus="true"');
            tagsInput.getCurrentTagText.and.returnValue('ABC');

            // Act
            eventHandlers.call('input-focus');
            $timeout.flush();

            // Assert
            expect($scope.loadItems).toHaveBeenCalledWith('ABC');
        });

        it('doesn\' call the load function when the input element gains focus and the option is false', function() {
            // Arrange
            compile('load-on-focus="false"');
            tagsInput.getCurrentTagText.and.returnValue('ABC');

            // Act
            eventHandlers.call('input-focus');
            $timeout.flush();

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });
    });

    describe('debounce-delay option', function() {
        it('initializes the option to 100 milliseconds', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.debounceDelay).toBe(100);
        });

        it('doesn\'t call the load function immediately', function() {
            // Arrange
            compile('debounce-delay="100"');

            // Act
            changeInputValue('A');
            changeInputValue('AB');
            changeInputValue('ABC');

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });

        it('calls the load function only after a delay has passed', function() {
            // Arrange
            compile('debounce-delay="100"');

            // Act
            changeInputValue('A');
            changeInputValue('AB');
            changeInputValue('ABC');

            $timeout.flush(100);

            // Assert
            expect($scope.loadItems).toHaveBeenCalledWith('ABC');
        });

        it('doesn\'t call the load function when the reset method is called', function() {
            // Arrange
            compile();
            changeInputValue('A');

            // Act
            suggestionList.reset();
            $timeout.flush();

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });
    });

    describe('min-length option', function() {
        it('initializes the option to 3', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.minLength).toBe(3);
        });

        it('calls the load function only after the minimum amount of characters has been entered', function() {
            // Arrange
            compile('min-length="3"');

            // Act
            changeInputValue('A');
            changeInputValue('AB');
            changeInputValue('ABC');

            $timeout.flush();

            // Assert
            expect($scope.loadItems.calls.count()).toBe(1);
            expect($scope.loadItems.calls.argsFor(0)).toEqual(['ABC']);
        });

        it('doesn\'t call the load function when the minimum amount of characters isn\'t entered', function() {
            // Arrange
            compile('min-length="3"');

            // Act
            changeInputValue('A');
            changeInputValue('AB');

            $timeout.flush();

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });

        it('hides the suggestion box when the number of entered characters is less than the option value', function() {
            // Arrange
            compile('min-length="5"');
            suggestionList.show();

            // Act
            changeInputValue('ABCD');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });
    });

    describe('highlight-matched-text option', function() {
        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.highlightMatchedText).toBe(true);
        });

        it('highlights the matched text in the suggestions list', function() {
            // Arrange
            compile('highlight-matched-text="true"', 'min-length="1"');

            // Act
            loadSuggestions([
                { text: 'a' },
                { text: 'ab' },
                { text: 'ba' },
                { text: 'aba' },
                { text: 'bab' }
            ], 'a');

            // Assert
            expect(getSuggestionText(0)).toBe('<em>a</em>');
            expect(getSuggestionText(1)).toBe('<em>a</em>b');
            expect(getSuggestionText(2)).toBe('b<em>a</em>');
            expect(getSuggestionText(3)).toBe('<em>a</em>b<em>a</em>');
            expect(getSuggestionText(4)).toBe('b<em>a</em>b');
        });

        it('highlights the matched text in the suggestions list when it contains special chars', function() {
            // Arrange
            compile('highlight-matched-text="true"', 'min-length="1"');

            // Act
            loadSuggestions([
                { text: 'a**b++c..' }
            ], 'a**b++c..');

            // Assert
            expect(getSuggestionText(0)).toBe('<em>a**b++c..</em>');
        });

        it('doesn\'t highlight anything when the matching text is empty', function() {
            // Arrange
            compile('highlight-matched-text="true"', 'min-length="0"');

            // Act
            loadSuggestions([
                { text: 'a' },
                { text: 'ab' },
                { text: 'ba' },
                { text: 'aba' },
                { text: 'bab' }
            ], '');

            // Assert
            expect(getSuggestionText(0)).toBe('a');
            expect(getSuggestionText(1)).toBe('ab');
            expect(getSuggestionText(2)).toBe('ba');
            expect(getSuggestionText(3)).toBe('aba');
            expect(getSuggestionText(4)).toBe('bab');
        });

        it('doesn\'t highlight the matched text in the suggestions list when the option is false', function() {
            // Arrange
            compile('highlight-matched-text="false"', 'min-length="1"');

            // Act
            loadSuggestions([
                { text: 'a' },
                { text: 'ab' },
                { text: 'ba' },
                { text: 'aba' },
                { text: 'bab' }
            ], 'a');

            // Assert
            expect(getSuggestionText(0)).toBe('a');
            expect(getSuggestionText(1)).toBe('ab');
            expect(getSuggestionText(2)).toBe('ba');
            expect(getSuggestionText(3)).toBe('aba');
            expect(getSuggestionText(4)).toBe('bab');
        });

        it('encodes HTML characters in suggestions list', function() {
            // Act
            loadSuggestions([
                { text: '<Item 1>' },
                { text: 'Item <2>' },
                { text: 'Item &3' }
            ]);

            // Assert
            expect(getSuggestionText(0)).toBe('&lt;Item 1&gt;');
            expect(getSuggestionText(1)).toBe('Item &lt;2&gt;');
            expect(getSuggestionText(2)).toBe('Item &amp;3');
        });

        it('highlights encoded HTML characters in suggestions list', function() {
            // Arrange
            compile('highlight-matched-text="true"', 'min-length="1"');

            // Act
            loadSuggestions([
                { text: '<Item 1>' },
                { text: 'Item <2>' },
                { text: 'Item &3' }
            ], '>');

            // Assert
            expect(getSuggestionText(0)).toBe('&lt;Item 1<em>&gt;</em>');
            expect(getSuggestionText(1)).toBe('Item &lt;2<em>&gt;</em>');
            expect(getSuggestionText(2)).toBe('Item &amp;3');
        });

        it('doesn\'t highlight HTML entities in suggestions list', function() {
            // Arrange
            compile('highlight-matched-text="true"', 'min-length="1"');

            // Act
            loadSuggestions([
                { text: 'a&a' },
                { text: '&a' },
                { text: 'a&' }
            ], 'a');

            // Assert
            expect(getSuggestionText(0)).toBe('<em>a</em>&amp;<em>a</em>');
            expect(getSuggestionText(1)).toBe('&amp;<em>a</em>');
            expect(getSuggestionText(2)).toBe('<em>a</em>&amp;');
        });
    });

    describe('max-results-to-show option', function() {
        it('initializes the option to 10', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.maxResultsToShow).toBe(10);
        });

        it('limits the number of results to be displayed at a time', function() {
            // Arrange
            compile('max-results-to-show="3"');

            // Act
            loadSuggestions(5);

            // Assert
            expect(getSuggestions().length).toBe(3);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
            expect(getSuggestionText(2)).toBe('Item3');
        });
    });

    describe('select-first-match option', function() {
        it('initializes the option to true', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.selectFirstMatch).toBe(true);
        });

        it('selects the first suggestion after the suggestion box is shown if the option is true', function() {
            // Arrange
            compile('select-first-match="true"');

            //Act
            loadSuggestions(3);

            // Assert
            expect(getSuggestion(0)).toHaveClass('selected');
            expect(getSuggestion(1)).not.toHaveClass('selected');
            expect(getSuggestion(2)).not.toHaveClass('selected');

        });

        it('doesn\'t select any suggestion after the suggestion box is shown if the option is false', function() {
            // Arrange
            compile('select-first-match="false"');

            //Act
            loadSuggestions(3);

            // Assert
            expect(getSuggestion(0)).not.toHaveClass('selected');
            expect(getSuggestion(1)).not.toHaveClass('selected');
            expect(getSuggestion(2)).not.toHaveClass('selected');

        });
    });

    describe('display-property option', function() {
        it('initializes the option to an empty string', function() {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.displayProperty).toBe('');
        });

        it('renders the correct display text', function() {
            // Arrange
            compile('display-property="label"');

            // Act
            loadSuggestions([
                { text: '1', label: 'Item1' },
                { text: '2', label: 'Item2' },
                { text: '3', label: 'Item3' }
            ]);

            // Assert
            expect(getSuggestions().length).toBe(3);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
            expect(getSuggestionText(2)).toBe('Item3');
        });
    });

    describe('template option', function() {
        var $templateCache;

        function getSuggestionContent(index) {
            return getSuggestion(index)
                .find('ti-autocomplete-match > ng-include')
                .children()
                .removeAttr('class')
                .parent()
                .html();
        }

        function getSuggestionScope(index) {
            return getSuggestion(index)
                .find('ti-autocomplete-match > ng-include')
                .children()
                .scope();
        }

        beforeEach(function() {
            inject(function(_$templateCache_) {
                $templateCache = _$templateCache_;
            });
        });

        it('initializes the option to the default template file', function() {
            expect(isolateScope.options.template).toBe('ngTagsInput/auto-complete-match.html');
        });

        it('loads and uses the provided template', function() {
            // Arrange
            $templateCache.put('customTemplate', '<span>{{data.id}}</span><span>{{data.text}}</span>');
            compile('template="customTemplate"');

            // Act
            loadSuggestions([
                { id: 1, text: 'Item1' },
                { id: 2, text: 'Item2' },
                { id: 3, text: 'Item3' }
            ]);

            // Assert
            expect(getSuggestionContent(0)).toBe('<span>1</span><span>Item1</span>');
            expect(getSuggestionContent(1)).toBe('<span>2</span><span>Item2</span>');
            expect(getSuggestionContent(2)).toBe('<span>3</span><span>Item3</span>');
        });

        it('makes the match data available to the template', function() {
            // Arrange
            compile();

            // Act
            loadSuggestions([
                { id: 1, text: 'Item1', image: 'item1.jpg' },
                { id: 2, text: 'Item2', image: 'item2.jpg' },
                { id: 3, text: 'Item3', image: 'item3.jpg' }
            ]);

            // Assert
            expect(getSuggestionScope(0).data).toEqual({ id: 1, text: 'Item1', image: 'item1.jpg' });
            expect(getSuggestionScope(1).data).toEqual({ id: 2, text: 'Item2', image: 'item2.jpg' });
            expect(getSuggestionScope(2).data).toEqual({ id: 3, text: 'Item3', image: 'item3.jpg' });
        });

        it('makes suggestions\' indexes available to the template', function() {
            // Arrange
            compile();

            // Act
            loadSuggestions(3);

            // Assert
            expect(getSuggestionScope(0).$index).toBe(0);
            expect(getSuggestionScope(1).$index).toBe(1);
            expect(getSuggestionScope(2).$index).toBe(2);
        });

        it('makes helper functions available to the template', function() {
            // Arrange
            compile();

            // Act
            loadSuggestions(1);

            // Assert
            var scope = getSuggestionScope(0);
            expect(scope.$highlight).not.toBeUndefined();
            expect(scope.$getDisplayText).not.toBeUndefined();
        });
    });
});
