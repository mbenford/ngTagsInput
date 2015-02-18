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
        $scope.events = { trigger: angular.noop };
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

    it('triggers an event when an interpolated value change', function() {
        // Arrange
        provider.setActiveInterpolation('foo', { prop1: true });
        $scope.$parent.prop1 = 'foobar';
        attrs.prop1 = '{{ prop1 }}';

        $scope.events = jasmine.createSpyObj('events', ['trigger']);

        var callback;
        attrs.$observe = jasmine.createSpy().and.callFake(function(name, cb) {
            callback = cb;
        });

        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String]
        });

        callback('barfoo');

        // Assert
        expect($scope.events.trigger).toHaveBeenCalledWith('option-change', { name: 'prop1', newValue: 'barfoo' });
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

    it('falls back to default values when invalid values are provided', function() {
        // Arrange
        provider.setDefaults('foo', {
            prop1: 'foobar'
        });

        attrs.prop1 = 'foo-bar';
        attrs.prop2 = 'foo-bar';
        attrs.prop3 = 'foo-bar';
        attrs.prop4 = 'foo-bar';

        // Act
        service.load('foo', $scope, attrs, {
            prop1: [String, 'barfoo', function(value) { return !value; }],
            prop2: [String, 'foobar', function(value) { return !value; }],
            prop3: [String, 'foobaz', function(value) { return value; }],
            prop4: [String, 'bazfoo']
        });

        // Assert
        expect($scope.options).toEqual({
            prop1: 'foobar',
            prop2: 'foobar',
            prop3: 'foo-bar',
            prop4: 'foo-bar'
        });
    });

    it('returns the same object so calls can be chained', function() {
        expect(provider.setDefaults('foo', {})).toBe(provider);
        expect(provider.setActiveInterpolation('foo', {})).toBe(provider);
        expect(provider.setTextAutosizeThreshold(10)).toBe(provider);
    });

    it('sets the threshold used to calculate the size of the input element', function() {
        // Act
        provider.setTextAutosizeThreshold(10);

        // Assert
        expect(service.getTextAutosizeThreshold()).toBe(10);
    });

    it('defaults the threshold used to calculate the size of the input element to 3', function() {
        expect(service.getTextAutosizeThreshold()).toBe(3);
    });
});
