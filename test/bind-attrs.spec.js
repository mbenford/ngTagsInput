'use strict';

describe('bind-attrs directive', function() {
    var $scope, $compile,
        element;

    beforeEach(function() {
        module('ngTagsInput');

        inject(function($rootScope, _$compile_) {
            $scope = $rootScope;
            $compile = _$compile_;
        });
    });

    function compile(value) {
        element = $compile('<span ti-bind-attrs="' + value + '">')($scope);
        $scope.$digest();
    }

    it('sets the element attributes according to the provided parameters', function() {
        // Arrange
        $scope.prop1 = 'Foobar';
        $scope.prop2 = 42;

        // Act
        compile('{attr1: prop1, attr2: prop2}');

        // Assert
        expect(element.attr('attr1')).toBe('Foobar');
        expect(element.attr('attr2')).toBe('42');
    });

    it('updates the element attributes when provided parameters change', function() {
        // Arrange
        $scope.prop1 = 'Foobar';
        $scope.prop2 = 42;
        compile('{attr1: prop1, attr2: prop2}');

        // Act
        $scope.prop1 = 'Barfoo';
        $scope.prop2 = 24;
        $scope.$digest();

        // Assert
        expect(element.attr('attr1')).toBe('Barfoo');
        expect(element.attr('attr2')).toBe('24');
    });
});
