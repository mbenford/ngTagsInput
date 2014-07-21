'use strict';

/**
 * @ngdoc directive
 * @name autoComplete
 * @module ngTagsInput
 *
 * @description
 * Provides autocomplete support for the tagsInput directive.
 *
 * @param {expression} source Expression to evaluate upon changing the input content. The input value is available as
 *                            $query. The result of the expression must be a promise that eventually resolves to an
 *                            array of strings.
 * @param {number=} [debounceDelay=100] Amount of time, in milliseconds, to wait before evaluating the expression in
 *                                      the source option after the last keystroke.
 * @param {number=} [minLength=3] Minimum number of characters that must be entered before evaluating the expression
 *                                 in the source option.
 * @param {boolean=} [highlightMatchedText=true] Flag indicating that the matched text will be highlighted in the
 *                                               suggestions list.
 * @param {number=} [maxResultsToShow=10] Maximum number of results to be displayed at a time.
 * @param {boolean=} [autoSelectFirstSuggestion=false] Flag indicating that the first suggestion will not be
 *                                                     automatically selected once the suggestion box is shown.
 */
tagsInput.directive('autoComplete', function($document, $timeout, $sce, tagsInputConfig) {
    function SuggestionList(loadFn, options) {
        var self = {}, debouncedLoadId, getDifference, lastPromise;

        getDifference = function(array1, array2) {
            return array1.filter(function(item) {
                return !findInObjectArray(array2, item, options.tagsInput.displayProperty);
            });
        };

        self.reset = function() {
            lastPromise = null;

            self.items = [];
            self.visible = false;
            self.index = -1;
            self.selected = null;
            self.query = null;

            $timeout.cancel(debouncedLoadId);
        };
        self.show = function() {
            if (self.items.length > 0 && options.autoSelectFirstSuggestion) {
                self.select(0);
            } else {
                self.selected = null;
            }
            self.visible = true;
        };
        self.load = function(query, tags) {
            if (query.length < options.minLength) {
                self.reset();
                return;
            }

            $timeout.cancel(debouncedLoadId);
            debouncedLoadId = $timeout(function() {
                self.query = query;

                var promise = loadFn({ $query: query });
                lastPromise = promise;

                promise.then(function(items) {
                    if (promise !== lastPromise) {
                        return;
                    }

                    items = makeObjectArray(items.data || items, options.tagsInput.displayProperty);
                    items = getDifference(items, tags);
                    self.items = items.slice(0, options.maxResultsToShow);

                    if (self.items.length > 0) {
                        self.show();
                    }
                    else {
                        self.reset();
                    }
                });
            }, options.debounceDelay, false);
        };
        self.selectNext = function() {
            self.select(++self.index);
        };
        self.selectPrior = function() {
            self.select(--self.index);
        };
        self.select = function(index) {
            if (index < 0) {
                index = self.items.length - 1;
            }
            else if (index >= self.items.length) {
                index = 0;
            }
            self.index = index;
            self.selected = self.items[index];
        };

        self.reset();

        return self;
    }

    function encodeHTML(value) {
        return value.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
    }

    return {
        restrict: 'E',
        require: '^tagsInput',
        scope: { source: '&' },
        templateUrl: 'ngTagsInput/auto-complete.html',
        link: function(scope, element, attrs, tagsInputCtrl) {
            var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down],
                suggestionList, tagsInput, options, getItem, getDisplayText, documentClick;

            tagsInputConfig.load('autoComplete', scope, attrs, {
                debounceDelay: [Number, 100],
                minLength: [Number, 3],
                highlightMatchedText: [Boolean, true],
                maxResultsToShow: [Number, 10],
                autoSelectFirstSuggestion: [Boolean, false]
            });

            options = scope.options;

            tagsInput = tagsInputCtrl.registerAutocomplete();
            options.tagsInput = tagsInput.getOptions();

            suggestionList = new SuggestionList(scope.source, options);

            getItem = function(item) {
                return item[options.tagsInput.displayProperty];
            };

            getDisplayText = function(item) {
                return safeToString(getItem(item));
            };

            scope.suggestionList = suggestionList;

            scope.addSuggestionByIndex = function(index) {
                suggestionList.select(index);
                scope.addSuggestion();
            };

            scope.addSuggestion = function() {
                var added = false;

                if (suggestionList.selected) {
                    tagsInput.addTag(suggestionList.selected);
                    suggestionList.reset();
                    tagsInput.focusInput();

                    added = true;
                }
                return added;
            };

            scope.highlight = function(item) {
                var text = getDisplayText(item);
                text = encodeHTML(text);
                if (options.highlightMatchedText) {
                    text = replaceAll(text, encodeHTML(suggestionList.query), '<em>$&</em>');
                }
                return $sce.trustAsHtml(text);
            };

            scope.track = function(item) {
                return getItem(item);
            };

            tagsInput
                .on('tag-added invalid-tag', function() {
                    suggestionList.reset();
                })
                .on('input-change', function(value) {
                    if (value) {
                        suggestionList.load(value, tagsInput.getTags());
                    } else {
                        suggestionList.reset();
                    }
                })
                .on('input-keydown', function(e) {
                    var key, handled;

                    if (hotkeys.indexOf(e.keyCode) === -1) {
                        return;
                    }

                    // This hack is needed because jqLite doesn't implement stopImmediatePropagation properly.
                    // I've sent a PR to Angular addressing this issue and hopefully it'll be fixed soon.
                    // https://github.com/angular/angular.js/pull/4833
                    var immediatePropagationStopped = false;
                    e.stopImmediatePropagation = function() {
                        immediatePropagationStopped = true;
                        e.stopPropagation();
                    };
                    e.isImmediatePropagationStopped = function() {
                        return immediatePropagationStopped;
                    };

                    if (suggestionList.visible) {
                        key = e.keyCode;
                        handled = false;

                        if (key === KEYS.down) {
                            suggestionList.selectNext();
                            handled = true;
                        }
                        else if (key === KEYS.up) {
                            suggestionList.selectPrior();
                            handled = true;
                        }
                        else if (key === KEYS.escape) {
                            suggestionList.reset();
                            handled = true;
                        }
                        else if (key === KEYS.enter || key === KEYS.tab) {
                            handled = scope.addSuggestion();
                        }

                        if (handled) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            scope.$apply();
                        }
                    }
                })
                .on('input-blur', function() {
                    suggestionList.reset();
                });

            documentClick = function() {
                if (suggestionList.visible) {
                    suggestionList.reset();
                    scope.$apply();
                }
            };

            $document.on('click', documentClick);

            scope.$on('$destroy', function() {
                $document.off('click', documentClick);
            });
        }
    };
});