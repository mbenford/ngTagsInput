describe('autoComplete directive', () => {
    let $compile, $scope, $q, $timeout,
        parentCtrl, element, isolateScope, suggestionList, deferred, tagsInput, eventHandlers;

    beforeEach(() => {
        jasmine.addMatchers(customMatchers);

        module('ngTagsInput');

        inject(($rootScope, _$compile_, _$q_, _$timeout_) => {
            $scope = $rootScope;
            $compile = _$compile_;
            $q = _$q_;
            $timeout = _$timeout_;
        });

        deferred = $q.defer();
        eventHandlers = {
            call(name, args) {
                if (this[name]) {
                    this[name].call(null, args);
                }
            }
        };
        $scope.loadItems = jasmine.createSpy().and.returnValue(deferred.promise);

        tagsInput = {
            changeInputValue: jasmine.createSpy(),
            addTag: jasmine.createSpy().and.callFake(() => $q.when()),
            on: jasmine.createSpy().and.callFake(function(names, handler) {
                names.split(' ').forEach(name =>{ eventHandlers[name] = handler; });
                return this;
            }),
            getTags: jasmine.createSpy().and.returnValue([]),
            getCurrentTagText: jasmine.createSpy(),
            getOptions: jasmine.createSpy().and.returnValue({
                displayProperty: 'text'
            }),
            getTemplateScope: jasmine.createSpy()
        };

        compile();
    });

    function compile(...args) {
        let parent = $compile('<tags-input ng-model="whatever"></tags-input>')($scope);
        $scope.$digest();

        parentCtrl = parent.controller('tagsInput');
        spyOn(parentCtrl, 'registerAutocomplete').and.returnValue(tagsInput);

        let options = args.join(' ');
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

    function sendKeyDown(keyCode, properties) {
        let event = jQuery.Event('keydown', angular.extend({keyCode: keyCode}, properties || {}));
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
        return range(count, index => ({text: 'Item' + (index + 1)}));
    }

    function loadSuggestions(countOrItems, text) {
        let items = angular.isNumber(countOrItems) ? generateSuggestions(countOrItems) : countOrItems;
        text = angular.isUndefined(text) ? 'foobar' : text;

        suggestionList.load(text, tagsInput.getTags());
        $timeout.flush();
        resolve(items);
    }

    describe('basic features', () => {
        it('ensures that the suggestions list is hidden by default', () => {
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('renders all elements returned by the load function that aren\'t already added', () => {
            // Act
            tagsInput.getTags.and.returnValue([{ text: 'Item3' }]);
            loadSuggestions(3);

            // Assert
            expect(getSuggestions().length).toBe(2);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
        });

        it('renders all elements returned by the load function that aren\'t already added (replaceSpaceWithDashes on)', () => {
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

        it('renders all elements returned by the load function that aren\'t already added ($http promise)', () => {
            // Act
            tagsInput.getTags.and.returnValue([{ text: 'Item3' }]);
            loadSuggestions({ data: generateSuggestions(3)});

            // Assert
            expect(getSuggestions().length).toBe(2);
            expect(getSuggestionText(0)).toBe('Item1');
            expect(getSuggestionText(1)).toBe('Item2');
        });

        it('renders all elements returned by the load function that aren\'t already added (non-string items)', () => {
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

        it('renders all elements returned by the load function that aren\'t already added (non-promise)', () => {
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

        it('renders all elements returned by the load function using the provided display-property option', () => {
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

        it('shows the suggestions list when there are items to show', () => {
            // Act
            loadSuggestions(1);

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(true);
        });

        it('hides the suggestions list when there is no items to show', () => {
            // Arrange
            suggestionList.visible = true;

            // Act
            loadSuggestions([]);

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestions list when there is no items left to show', () => {
            // Act
            tagsInput.getTags.and.returnValue([{ text: 'Item1' }, { text: 'Item2' }]);
            loadSuggestions(2);

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the input field becomes empty', () => {
            // Arrange
            changeInputValue('foobar');
            suggestionList.show();
            $scope.$digest();

            // Act
            changeInputValue('');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the escape key is pressed', () => {
            // Arrange
            suggestionList.show();
            $scope.$digest();

            // Act
            sendKeyDown(KEYS.escape);
            $scope.$digest();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when a tag is removed', () => {
            // Arrange
            suggestionList.show();
            $scope.$digest();

            // Act
            eventHandlers.call('tag-removed');
            $scope.$digest();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box after adding the selected suggestion to the input field', () => {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.enter);
            $scope.$digest();

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when the input field loses focus', () => {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers.call('input-blur');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when a tag is added', () => {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers.call('tag-added');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('hides the suggestion box when an invalid tag is tried to be added', () => {
            // Arrange
            suggestionList.visible = true;

            // Act
            eventHandlers.call('invalid-tag');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });

        it('adds the selected suggestion when the enter key is pressed and the suggestions box is visible', () => {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.enter);

            // Assert
            expect(tagsInput.addTag).toHaveBeenCalledWith({ text: 'Item1' });
        });

        it('adds the selected suggestion when the tab key is pressed and there is a suggestion selected', () => {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.tab);

            // Assert
            expect(tagsInput.addTag).toHaveBeenCalledWith({ text: 'Item1' });
        });

        it('adds a copy of the selected suggestion', () => {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);
            let item = suggestionList.items[0];

            // Act
            isolateScope.addSuggestion();

            // Assert
            expect(tagsInput.addTag.calls.argsFor(0)[0]).not.toBe(item);
        });

        it('does not change the input value when the enter key is pressed and there is nothing selected', () => {
            // Arrange
            loadSuggestions(2);
            suggestionList.selected = null;

            // Act
            sendKeyDown(KEYS.enter);

            // Assert
            expect(tagsInput.addTag).not.toHaveBeenCalled();
        });

        it('sets the selected suggestion to null after adding it to the input field', () => {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            isolateScope.addSuggestion();
            $scope.$digest();

            // Assert
            expect(suggestionList.selected).toBeNull();
        });

        it('does not call the load function after adding the selected suggestion to the input field', () => {
            // Arrange
            loadSuggestions(2);
            suggestionList.select(0);

            // Act
            sendKeyDown(KEYS.enter);

            // Assert
            expect($scope.loadItems.calls.count()).toBe(1);
        });

        it('highlights the selected suggestion only', () => {
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

        it('discards all load calls but the last one', () => {
            // Arrange
            let deferred1 = $q.defer(), deferred2 = $q.defer(), deferred3 = $q.defer();
            let promises = [deferred1.promise, deferred2.promise, deferred3.promise];

            $scope.loadItems = jasmine.createSpy().and.callFake(() => {
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

        it('discards all load calls after the suggestion list is reset', () => {
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

        it('converts an array of strings into an array of objects', () => {
            // Arrange/Act
            loadSuggestions(['Item1', 'Item2', 'Item3']);

            // Assert
            expect(suggestionList.items).toEqual([
                { text: 'Item1' },
                { text: 'Item2' },
                { text: 'Item3' }
            ]);
        });

        describe('auto scrolling', () => {
            let style;

            beforeEach(() => {
                style = angular.element('<style> .suggestion-list { position: relative; overflow-y: auto; max-height: 100px }</style>').appendTo('head');
                element.appendTo('body');
            });

            afterEach(() => {
                style.remove();
                element.remove();
            });

            function isVisible(index) {
                let suggestion = getSuggestion(index);
                let container = suggestion.parent();

                return suggestion.prop('offsetTop') + suggestion.prop('offsetHeight') <= container.prop('clientHeight') + container.scrollTop() &&
                    suggestion.prop('offsetTop') >= container.scrollTop();
            }

            range(5).forEach(index => {
                index += 5;

                it('scrolls the container down so the selected suggestion is visible #' + index, () => {
                    // Arrange
                    loadSuggestions(10);

                    // Act
                    suggestionList.select(index);

                    // Assert
                    expect(isVisible(index)).toBe(true);
                });
            });

            range(5).forEach(index => {
                it('scrolls the container up so the selected suggestion is visible #' + index, () => {
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

    describe('navigation through suggestions', () => {
        beforeEach(() => {
            loadSuggestions(3);
        });

        describe('downward', () => {
            it('selects the next suggestion when the down arrow key is pressed and there\'s something selected', () => {
                // Arrange
                suggestionList.select(0);

                // Act
                sendKeyDown(KEYS.down);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item2' });
            });

            it('selects the first suggestion when the down arrow key is pressed and the last item is selected', () => {
                // Arrange
                suggestionList.select(2);

                // Act
                sendKeyDown(KEYS.down);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item1' });
            });
        });

        describe('upward', () => {
            it('selects the prior suggestion when the down up key is pressed and there\'s something selected', () => {
                // Arrange
                suggestionList.select(1);

                // Act
                sendKeyDown(KEYS.up);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item1' });
            });

            it('selects the last suggestion when the up arrow key is pressed and the first item is selected', () => {
                // Arrange
                suggestionList.select(0);

                // Act
                sendKeyDown(KEYS.up);

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item3' });
            });
        });

        describe('mouse', () => {
            it('selects the suggestion under the mouse pointer', () => {
                // Act
                getSuggestion(1).mouseenter();

                // Assert
                expect(suggestionList.selected).toEqual({ text: 'Item2' });
            });

            it('adds the selected suggestion when a mouse click is triggered', () => {
                // Arrange
                suggestionList.selected = null;

                // Act
                getSuggestion(0).click();

                // Assert
                expect(tagsInput.addTag).toHaveBeenCalledWith({ text: 'Item1' });
            });
        });
    });

    describe('load-on-down-arrow option', () => {
        it('initializes the option to false', () => {
           // Arrange
            compile();

            // Assert
            expect(isolateScope.options.loadOnDownArrow).toBe(false);
        });

        describe('suggestion box is hidden', () => {
            beforeEach(() => {
                suggestionList.visible = false;
            });

            it('calls the load function passing the current tag text when the down arrow key is pressed and the option is true', () => {
                // Arrange
                compile('load-on-down-arrow="true"');
                tagsInput.getCurrentTagText.and.returnValue('ABC');

                // Act
                sendKeyDown(KEYS.down);
                $timeout.flush();

                // Assert
                expect($scope.loadItems).toHaveBeenCalledWith('ABC');
            });

            it('doesn\'t call the load function when the down arrow key is pressed and the option is false', () => {
                compile('load-on-down-arrow="false"');

                // Act
                sendKeyDown(KEYS.down);
                $timeout.flush();

                // Assert
                expect($scope.loadItems).not.toHaveBeenCalled();
            });
        });

        describe('suggestion box is visible', () => {
            it('doesn\'t call the load function when the down arrow key is pressed', () => {
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

    describe('load-on-empty option', () => {
        it('initialize the option to false', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.loadOnEmpty).toBe(false);
        });

        it('calls the load function when the input field becomes empty and the option is true', () => {
            // Arrange
            compile('load-on-empty="true"');

            // Act
            changeInputValue('');
            $timeout.flush();

            // Assert
            expect($scope.loadItems).toHaveBeenCalledWith('');
        });

        it('doesn\'t call the load function when the input field becomes empty and the option is false', () => {
            // Arrange
            compile('load-on-empty="false"');

            // Act
            changeInputValue('');
            $timeout.flush();

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });
    });

    describe('load-on-focus option', () => {
        it('initializes the option to false', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.loadOnFocus).toBe(false);
        });

        it('calls the load function when the input element gains focus and the option is true', () => {
            // Arrange
            compile('load-on-focus="true"');
            tagsInput.getCurrentTagText.and.returnValue('ABC');

            // Act
            eventHandlers.call('input-focus');
            $timeout.flush();

            // Assert
            expect($scope.loadItems).toHaveBeenCalledWith('ABC');
        });

        it('doesn\' call the load function when the input element gains focus and the option is false', () => {
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

    describe('debounce-delay option', () => {
        it('initializes the option to 100 milliseconds', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.debounceDelay).toBe(100);
        });

        it('doesn\'t call the load function immediately', () => {
            // Arrange
            compile('debounce-delay="100"');

            // Act
            changeInputValue('A');
            changeInputValue('AB');
            changeInputValue('ABC');

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });

        it('calls the load function only after a delay has passed', () => {
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

        it('doesn\'t call the load function when the reset method is called', () => {
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

    describe('min-length option', () => {
        it('initializes the option to 3', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.minLength).toBe(3);
        });

        it('calls the load function only after the minimum amount of characters has been entered', () => {
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

        it('doesn\'t call the load function when the minimum amount of characters isn\'t entered', () => {
            // Arrange
            compile('min-length="3"');

            // Act
            changeInputValue('A');
            changeInputValue('AB');

            $timeout.flush();

            // Assert
            expect($scope.loadItems).not.toHaveBeenCalled();
        });

        it('hides the suggestion box when the number of entered characters is less than the option value', () => {
            // Arrange
            compile('min-length="5"');
            suggestionList.show();

            // Act
            changeInputValue('ABCD');

            // Assert
            expect(isSuggestionsBoxVisible()).toBe(false);
        });
    });

    describe('highlight-matched-text option', () => {
        it('initializes the option to true', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.highlightMatchedText).toBe(true);
        });

        it('highlights the matched text in the suggestions list', () => {
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

        it('highlights the matched text in the suggestions list when it contains special chars', () => {
            // Arrange
            compile('highlight-matched-text="true"', 'min-length="1"');

            // Act
            loadSuggestions([
                { text: 'a**b++c..' }
            ], 'a**b++c..');

            // Assert
            expect(getSuggestionText(0)).toBe('<em>a**b++c..</em>');
        });

        it('doesn\'t highlight anything when the matching text is empty', () => {
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

        it('doesn\'t highlight the matched text in the suggestions list when the option is false', () => {
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

        it('encodes HTML characters in suggestions list', () => {
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

        it('highlights encoded HTML characters in suggestions list', () => {
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

        it('doesn\'t highlight HTML entities in suggestions list', () => {
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

    describe('max-results-to-show option', () => {
        it('initializes the option to 10', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.maxResultsToShow).toBe(10);
        });

        it('limits the number of results to be displayed at a time', () => {
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

    describe('select-first-match option', () => {
        it('initializes the option to true', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.selectFirstMatch).toBe(true);
        });

        it('selects the first suggestion after the suggestion box is shown if the option is true', () => {
            // Arrange
            compile('select-first-match="true"');

            //Act
            loadSuggestions(3);

            // Assert
            expect(getSuggestion(0)).toHaveClass('selected');
            expect(getSuggestion(1)).not.toHaveClass('selected');
            expect(getSuggestion(2)).not.toHaveClass('selected');

        });

        it('doesn\'t select any suggestion after the suggestion box is shown if the option is false', () => {
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

    describe('display-property option', () => {
        it('initializes the option to an empty string', () => {
            // Arrange/Act
            compile();

            // Assert
            expect(isolateScope.options.displayProperty).toBe('');
        });

        it('renders the correct display text', () => {
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

    describe('template option', () => {
        let $templateCache;

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

        beforeEach(() => {
            inject(_$templateCache_ => {
                $templateCache = _$templateCache_;
            });
        });

        it('initializes the option to the default template file', () => {
            expect(isolateScope.options.template).toBe('ngTagsInput/auto-complete-match.html');
        });

        it('loads and uses the provided template', () => {
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

        it('makes the match data available to the template', () => {
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

        it('makes suggestions\' indexes available to the template', () => {
            // Arrange
            compile();

            // Act
            loadSuggestions(3);

            // Assert
            expect(getSuggestionScope(0).$index).toBe(0);
            expect(getSuggestionScope(1).$index).toBe(1);
            expect(getSuggestionScope(2).$index).toBe(2);
        });

        it('makes helper functions available to the template', () => {
            // Arrange
            compile();

            // Act
            loadSuggestions(1);

            // Assert
            var scope = getSuggestionScope(0);
            expect(scope.$highlight).not.toBeUndefined();
            expect(scope.$getDisplayText).not.toBeUndefined();
        });

        it('makes the provided scope available to the template', () => {
            // Arrange
            tagsInput.getTemplateScope.and.returnValue({ prop: 'foobar', method: jasmine.createSpy().and.returnValue(42) });
            compile();

            // Act
            loadSuggestions(1);

            // Assert
            expect(getSuggestionScope(0).$scope).toBeDefined();
            expect(getSuggestionScope(0).$scope.prop).toBe('foobar');
            expect(getSuggestionScope(0).$scope.method()).toBe(42);
        });
    });

    describe('match-class option', () => {
        it('allows custom CSS classes to be set for each match (object expression)', () => {
            // Arrange
            compile('match-class="{foo: $match.text == \'Item1\', bar: $match.text != \'Item1\'}"');

            // Act
            loadSuggestions(3);
            suggestionList.select(2);
            $scope.$digest();

            // Assert
            expect(getSuggestion(0)).toHaveClass('foo');
            expect(getSuggestion(1)).toHaveClass('bar');
            expect(getSuggestion(2)).toHaveClass('bar selected');
        });

        it('allows custom CSS classes to be set for each match (array expression)', () => {
            // Arrange
            compile('match-class="[\'foo\', \'bar\']"');

            // Act
            loadSuggestions(3);
            suggestionList.select(2);
            $scope.$digest();

            // Assert
            expect(getSuggestion(0)).toHaveClass('foo bar');
            expect(getSuggestion(1)).toHaveClass('foo bar');
            expect(getSuggestion(2)).toHaveClass('foo bar selected');
        });

        it('allows custom CSS classes to be set for each match (string expression)', () => {
            // Arrange
            compile('match-class="\'foo bar\'"');

            // Act
            loadSuggestions(3);
            suggestionList.select(2);
            $scope.$digest();

            // Assert
            expect(getSuggestion(0)).toHaveClass('foo bar');
            expect(getSuggestion(1)).toHaveClass('foo bar');
            expect(getSuggestion(2)).toHaveClass('foo bar selected');
        });

        it('provides the expression with the current match, its index and its state', () => {
            // Arrange
            $scope.callback = jasmine.createSpy();
            compile('match-class="callback($match, $index, $selected)"');

            // Act
            loadSuggestions(3);
            suggestionList.select(2);
            $scope.$digest();

            // Assert
            var calls = $scope.callback.calls;
            expect(calls.argsFor(calls.count() - 3)).toEqual([suggestionList.items[0], 0, false]);
            expect(calls.argsFor(calls.count() - 2)).toEqual([suggestionList.items[1], 1, false]);
            expect(calls.argsFor(calls.count() - 1)).toEqual([suggestionList.items[2], 2, true]);
        });
    });

    describe('keys propagation handling', () => {
        describe('hotkeys', () => {
            let hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down];

            describe('suggestion box is visible', () => {
                beforeEach(() => {
                    suggestionList.show();
                });

                it('prevents the down arrow keydown event from being propagated', () => {
                    // Act
                    let event = sendKeyDown(KEYS.down);

                    // Assert
                    expect(event.isDefaultPrevented()).toBe(true);
                    expect(event.isPropagationStopped()).toBe(true);
                });

                it('prevents the up arrow keydown event from being propagated', () => {
                    // Act
                    let event = sendKeyDown(KEYS.up);

                    // Assert
                    expect(event.isDefaultPrevented()).toBe(true);
                    expect(event.isPropagationStopped()).toBe(true);
                });

                it('prevents the enter keydown event from being propagated if there is a suggestion selected', () => {
                    // Arrange
                    suggestionList.selected = 'suggestion';

                    // Act
                    let event = sendKeyDown(KEYS.enter);

                    // Assert
                    expect(event.isDefaultPrevented()).toBe(true);
                    expect(event.isPropagationStopped()).toBe(true);
                });

                it('does not prevent the enter keydown event from begin propagated if there is no suggestion selected', () => {
                    // Arrange
                    suggestionList.selected = null;

                    // Act
                    let event = sendKeyDown(KEYS.enter);

                    // Assert
                    expect(event.isDefaultPrevented()).toBe(false);
                    expect(event.isPropagationStopped()).toBe(false);
                });

                it('prevents the tab keydown event from being propagated if there is a suggestion selected', () => {
                    // Arrange
                    suggestionList.selected = 'suggestion';

                    // Act
                    let event = sendKeyDown(KEYS.tab);

                    // Assert
                    expect(event.isDefaultPrevented()).toBe(true);
                    expect(event.isPropagationStopped()).toBe(true);
                });

                it('does not prevent the tab keydown event from being propagated if there is no suggestion selected', () => {
                    // Arrange
                    suggestionList.selected = null;

                    // Act
                    let event = sendKeyDown(KEYS.tab);

                    // Assert
                    expect(event.isDefaultPrevented()).toBe(false);
                    expect(event.isPropagationStopped()).toBe(false);
                });

                it('prevents the escape keydown event from being propagated', () => {
                    // Act
                    let event = sendKeyDown(KEYS.escape);

                    // Assert
                    expect(event.isDefaultPrevented()).toBe(true);
                    expect(event.isPropagationStopped()).toBe(true);
                });
            });

            describe('suggestion box is hidden', () => {
                beforeEach(() => {
                    suggestionList.reset();
                });

                hotkeys.forEach(hotkey => {
                    it('does not prevent the keydown event from being propagated (keycode ' + hotkey + ')', () => {
                        // Act
                        let event = sendKeyDown(hotkey);

                        // Assert
                        expect(event.isDefaultPrevented()).toBe(false);
                        expect(event.isPropagationStopped()).toBe(false);
                    });
                });
            });

            describe('modifier key is on', () => {
                beforeEach(() => {
                    suggestionList.show();
                });

                hotkeys.forEach(hotkey => {
                    it('does not prevent a hotkey from being propagated when the shift key is down (hotkey ' + hotkey + ')', () => {
                        expect(sendKeyDown(hotkey, { shiftKey: true }).isDefaultPrevented()).toBe(false);
                    });

                    it('does not prevent a hotkey from being propagated when the alt key is down (hotkey ' + hotkey + ')', () => {
                        expect(sendKeyDown(hotkey, { altKey: true }).isDefaultPrevented()).toBe(false);
                    });

                    it('does not prevent a hotkey from being propagated when the ctrl key is down (hotkey ' + hotkey + ')', () => {
                        expect(sendKeyDown(hotkey, { ctrlKey: true }).isDefaultPrevented()).toBe(false);
                    });

                    it('does not prevent a hotkey from being propagated when the meta key is down (hotkey ' + hotkey + ')', () => {
                        expect(sendKeyDown(hotkey, { metaKey: true }).isDefaultPrevented()).toBe(false);
                    });
                });
            });
        });

        describe('non-hotkeys', () => {
            it('does not prevent non-hotkeys keystrokes from being propagated', () => {
                // Act
                let events = [sendKeyDown(65), sendKeyDown(66), sendKeyDown(67)];

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
});
