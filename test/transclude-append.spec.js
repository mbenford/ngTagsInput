'use strict';

describe('transclude-append-directive', function () {
    var $scope,
        $compile,
        directive,
        element;

    beforeEach(function () {
        module('ngTagsInput');
        module(function($compileProvider) {
            directive = $compileProvider.directive;
        });

        inject(function($rootScope, _$compile_) {
            $scope = $rootScope;
            $compile = _$compile_;
        });
    });

    function compile(template) {
        element = $compile(template)($scope);
    }

    function createDirective(template) {
        directive('foobar', function() {
            return {
                restrict: 'E',
                transclude: true,
                template: template
            };
        });
    }

    it('appends the transcluded content to the end of an empty target element', function() {
        // Arrange
        createDirective('<div transclude-append></div>');

        // Act
        compile('<foobar><p>transcluded content</p></foobar>');

        // Assert
        expect(element.find('p').html()).toBe('transcluded content');
    });

    it('appends the transcluded content to the end of a non-empty target element', function() {
        // Arrange
        createDirective('<div transclude-append><p>existing content</p></div>');

        // Act
        compile('<foobar><p>transcluded content</p></foobar>');

        // Assert
        var content = $.map(element.find('p'), function(e) { return $(e).html(); });
        expect(content).toEqual(['existing content', 'transcluded content']);
    });
});