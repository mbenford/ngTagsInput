'use strict';

describe('autoComplete directive', function() {
    var $compile, $scope, $q, $timeout,
        parentCtrl, element, isolateScope, suggestionList, deferred, tagsInput, eventHandlers;

    beforeEach(function() {
        module('ngTagsInput');

        inject(function($rootScope, _$compile_, _$q_, _$timeout_) {
            $scope = $rootScope;
            $compile = _$compile_;
            $q = _$q_;
            $timeout = _$timeout_;
        });

        deferred = $q.defer();
        eventHandlers = {};
        $scope.loadItems = jasmine.createSpy().and.returnValue(deferred.promise);

        compile();
    });

    function compile() {
        var parent, options;

        tagsInput = {
            changeInputValue: jasmine.createSpy(),
            addTag: jasmine.createSpy(),
            focusInput: jasmine.createSpy(),
            on: jasmine.createSpy().and.callFake(function(names, handler) {
                names.split(' ').forEach(function(name) { eventHandlers[name] = handler; });
                return this;
            }),
            getTags: jasmine.createSpy().and.returnValue([]),
            getOptions: jasmine.createSpy().and.returnValue({
                displayProperty: 'text'
            })
        };

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
        eventHandlers['input-keydown'](event);

        return event;
    }

    function changeInputValue(value) {
        eventHandlers['input-change'](value);
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
        return getSuggestion(index).html();
    }

    function isSuggestionsBoxVisible() {
        return !getSuggestionsBox().hasClass('ng-hide');
    }

    function generateSuggestions(count) {
        return generateArray(count, function(index) {
            return { text: 'Item' + index };
        });
    }

    function loadSuggestions(countOrItems, text) {
        var items = angular.isNumber(countOrItems) ? generateSuggestions(countOrItems) : countOrItems;

        suggestionList.load(text || 'foobar', tagsInput.getTags());
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

        it('renders all elements returned by the load function that aren\'t already added ($http promise)', function() {
            // Act
            tagsInput.getTags.and.returnValue([{ text: 'Item3' }]);
            loadSuggestions({ data: generateSuggestions(3)});

            // Assert
            expect(getSuggestions().length).toBe(2);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
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

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the user clicks elsewhere on the page', function() {
            // Arrange
            suggestionList.show();
            $scope.$digest();

            // Act
            $(document).trigger('click');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box after adding the selected suggestion to the input field', function() {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.enter);

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the input field loses focus', function() {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers['input-blur']();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when a tag is added', function() {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers['tag-added']();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when an invalid tag is tried to be added', function() {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers['invalid-tag']();

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

        it('does not change the input value when the enter key is pressed and there is nothing selected', function() {
            // Arrange
            loadSuggestions(2);

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

        it('selects no suggestion after the suggestion box is shown', function() {
            // Arrange/Act
            loadSuggestions(2);

            // Assert
            expect(suggestionList.selected).toBeNull();
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
                getSuggestion(1).mouseenter();

                // Act
                getSuggestion(1).click();

                // Assert
                expect(tagsInput.addTag).toHaveBeenCalledWith({ text: 'Item2' });
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

        it('doesn\'t highlight the matched text in the suggestions list whe the option is false', function() {
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
});
