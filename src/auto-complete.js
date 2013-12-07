'use strict';

/**
 * @ngdoc directive
 * @name tagsInput.directive:autoComplete
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
 */
tagsInput.directive('autoComplete', function($document, $timeout, $sce, tagsInputConfig) {
    function SuggestionList(loadFn, options) {
        var self = {}, debouncedLoadId, getDifference;

        getDifference = function(array1, array2) {
            var result = [];

            array1.forEach(function(item) {
                if (array2.indexOf(item) === -1) {
                    result.push(item);
                }
            });

            return result;
        };

        self.reset = function() {
            self.items = [];
            self.visible = false;
            self.index = -1;
            self.selected = null;
            self.query = null;

            $timeout.cancel(debouncedLoadId);
        };
        self.show = function() {
            self.selected = null;
            self.visible = true;
        };
        self.hide = function() {
            self.visible = false;
        };
        self.load = function(query, tags) {
            if (query.length < options.minLength) {
                self.reset();
                return;
            }

            $timeout.cancel(debouncedLoadId);
            debouncedLoadId = $timeout(function() {
                self.query = query;
                loadFn({ $query: query }).then(function(items) {
                    self.items = getDifference(items, tags);
                    if (self.items.length > 0) {
                        self.show();
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

    return {
        restrict: 'E',
        require: '?^tagsInput',
        scope: { source: '&' },
        templateUrl: 'ngTagsInput/auto-complete.html',
        link: function(scope, element, attrs, tagsInputCtrl) {
            var hotkeys = [KEYS.enter, KEYS.tab, KEYS.escape, KEYS.up, KEYS.down],
                suggestionList, tagsInput, highlight;

            tagsInputConfig.load(scope, attrs, {
                debounceDelay: { type: Number, defaultValue: 100 },
                minLength: { type: Number, defaultValue: 3 },
                highlightMatchedText: { type: Boolean, defaultValue: true },
                maxResultsToShow: { type: Number, defaultValue: 10 }
            });

            tagsInput = tagsInputCtrl.registerAutocomplete();
            suggestionList = new SuggestionList(scope.source, scope.options);

            if (scope.options.highlightMatchedText) {
                highlight = function(item, text) {
                    var expression = new RegExp(text, 'gi');
                    return item.replace(expression, '<em>$&</em>');
                };
            }
            else {
                highlight = function(item) {
                    return item;
                };
            }

            scope.suggestionList = suggestionList;

            scope.addSuggestion = function() {
                var added = false;

                if (suggestionList.selected) {
                    tagsInput.tryAddTag(suggestionList.selected);
                    suggestionList.reset();
                    tagsInput.focusInput();

                    added = true;
                }
                return added;
            };

            scope.highlight = function(item) {
                return $sce.trustAsHtml(highlight(item, suggestionList.query));
            };

            tagsInput
                .on('input-changed', function(value) {
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
                });

            $document.on('click', function() {
                if (suggestionList.visible) {
                    suggestionList.reset();
                    scope.$apply();
                }
            });
        }
    };
});