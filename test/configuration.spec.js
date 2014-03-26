'use strict';

describe('configuration service', function() {
    var $scope,
        attrs, provider, service;

    beforeEach(function() {
        module('ngTagsInput', function(tagsInputConfigProvider) {
            provider = tagsInputConfigProvider;
        });

        inject(function($rootScope, tagsInputConfig) {
            $scope = $rootScope.$new();
            service = tagsInputConfig;
        });

        attrs = {};
        $scope.options = {};
    });

    it('loads literal values from attributes', function() {
        // Arrange
        attrs.prop1 = 'foobar';
        attrs.prop2 = '42';
        attrs.prop3 = 'true';
        attrs.prop4 = '.*';

        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String],
            prop2: [Number],
            prop3: [Boolean],
            prop4: [RegExp]
        });

        // Assert
        expect($scope.options).toEqual({
            prop1: 'foobar',
            prop2: 42,
            prop3: true,
            prop4: /.*/
        });
    });

    it('loads interpolated values from attributes', function() {
        // Arrange
        $scope.$parent.prop1 = 'barfoo';
        $scope.$parent.prop2 = 24;
        $scope.$parent.prop3 = false;
        $scope.$parent.prop4 = '.+';

        attrs.prop1 = '{{ prop1 }}';
        attrs.prop2 = '{{ prop2 }}';
        attrs.prop3 = '{{ prop3 }}';
        attrs.prop4 = '{{ prop4 }}';

        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String],
            prop2: [Number],
            prop3: [Boolean],
            prop4: [RegExp]
        });

        // Assert
        expect($scope.options).toEqual({
            prop1: 'barfoo',
            prop2: 24,
            prop3: false,
            prop4: /.+/
        });
    });

    it('loads interpolated values from attributes as they change', function() {
        // Arrange
        provider.setActiveInterpolation('foo', { prop2: true, prop4: true });

        $scope.$parent.prop1 = 'barfoo';
        $scope.$parent.prop3 = false;

        attrs.prop1 = '{{ prop1 }}';
        attrs.prop3 = '{{ prop3 }}';

        var callbacks = [];
        attrs.$observe = jasmine.createSpy().and.callFake(function(name, cb) {
            callbacks.push(cb);
        });

        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String],
            prop2: [Number],
            prop3: [Boolean],
            prop4: [RegExp, /.*/]
        });

        callbacks[0](42);
        callbacks[1](null);

        // Assert
        expect($scope.options).toEqual({
            prop1: 'barfoo',
            prop2: 42,
            prop3: false,
            prop4: /.*/
        });
    });

    it('loads default values when attributes are missing', function() {
        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String, 'foobaz'],
            prop2: [Number, 84],
            prop3: [Boolean, true],
            prop4: [RegExp, /.?/]
        });

        // Assert
        expect($scope.options).toEqual({
            prop1: 'foobaz',
            prop2: 84,
            prop3: true,
            prop4: /.?/
        });
    });

    it('overrides default values with global ones', function() {
        // Arrange
        provider.setDefaults('foo', {
            prop1: 'foobar',
            prop3: false
        });

        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String, 'foobaz'],
            prop2: [Number, 84],
            prop3: [Boolean, true],
            prop4: [RegExp, /.?/]
        });

        // Assert
        expect($scope.options).toEqual({
            prop1: 'foobar',
            prop2: 84,
            prop3: false,
            prop4: /.?/
        });
    });

    it('overrides global configuration with local values', function() {
        // Arrange
        provider.setDefaults('foo', {
            prop1: 'foobar',
            prop2: 42,
            prop3: true,
            prop4: /.*/
        });

        attrs.prop1 = 'foobaz';
        attrs.prop2 = '84';
        attrs.prop3 = 'false';
        attrs.prop4 = '.?';

        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String],
            prop2: [Number],
            prop3: [Boolean],
            prop4: [RegExp]
        });

        // Assert
        expect($scope.options).toEqual({
            prop1: 'foobaz',
            prop2: 84,
            prop3: false,
            prop4: /.?/
        });
    });

    it('returns the same object so calls can be chained', function() {
        expect(provider.setDefaults('foo', {})).toBe(provider);
        expect(provider.setActiveInterpolation('foo', {})).toBe(provider);
    });
});
