'use strict';

describe('autoCompleteTrigger directive', function() {
    var $compile, $scope, $q, $timeout,
        autocompleteElement, suggestionList, element, deferred, isolateScope;

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
        $scope.loadItems = jasmine.createSpy().and.returnValue(deferred.promise);

        compile();
    });

    function compile() {
        var parent, options;

        parent = $compile('<tags-input ng-model="whatever"></tags-input>')($scope);
        $scope.$digest();

        options = jQuery.makeArray(arguments).join(' ');
        autocompleteElement = angular.element('<auto-complete source="loadItems($query)" ' + options + '></auto-complete>');
        parent.append(autocompleteElement);

        $compile(autocompleteElement)($scope);
        $scope.$digest();

        suggestionList = autocompleteElement.isolateScope().suggestionList;

        element = angular.element('<auto-complete-trigger></auto-complete-trigger>');
        parent.append(element);

        $compile(element)($scope);
        $scope.$digest();

        isolateScope = element.isolateScope();
    }

    function clickOnTrigger() {
        isolateScope.triggerAutocomplete();
    }

    describe('basic features', function() {
        describe('suggestion box is hidden', function() {
            beforeEach(function() {
                suggestionList.visible = false;
            });

            it('calls the load function when the trigger button is clicked', function() {
                // Act
                clickOnTrigger();
                $timeout.flush();

                // Assert
                expect($scope.loadItems).toHaveBeenCalled();
            });
        });
    });
});
