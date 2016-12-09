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
            addTag: jasmine.createSpy().and.callFake(function() {
                return $q.when();
            }),
            on: jasmine.createSpy().and.callFake(function(names, handler) {
                names.split(' ').forEach(function(name) { eventHandlers[name] = handler; });
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

    function sendKeyDown(keyCode, properties) {
        var event = jQuery.Event('keydown', angular.extend({ keyCode: keyCode }, properties || {}));
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
});
