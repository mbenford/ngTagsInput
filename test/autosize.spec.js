'use strict';

describe('autosize directive', function() {
    var $scope, $compile,
        element, style, container;

    beforeEach(function() {
        module('ngTagsInput');

        inject(function($rootScope, _$compile_) {
            $scope = $rootScope;
            $compile = _$compile_;
        });

        style = angular.element('<style> .input { box-sizing: border-box; border: 1px; padding: 2px; font: Arial 18px; }</style>').appendTo('head');
        container = angular.element('<div></div>').appendTo('body');
    });

    afterEach(function() {
        style.remove();
        container.remove();
    });

    function compile() {
        var attributes = $.makeArray(arguments).join(' ');

        element = angular.element('<input class="input" ng-model="model" ng-trim="false" ti-autosize ' + attributes + '>');
        container.append(element);

        $compile(element)($scope);
        $scope.$digest();
    }

    function getTextWidth(text) {
        var width, span = angular.element('<span class="input"></span>');

        span.css('white-space', 'pre');
        span.text(text);
        container.append(span);
        width = parseInt(span.prop('offsetWidth'), 10) + 3;

        span.remove();

        return width + 'px';
    }

    it('re-sizes the input width when its view content changes', function() {
        // Arrange
        var text = 'AAAAAAAAAA';
        compile();

        // Act
        element.val(text);
        element.trigger('input');

        // Arrange
        expect(element.css('width')).toBe(getTextWidth(text));
    });

    it('re-sizes the input width when its model value changes', function() {
        // Arrange
        var text = 'AAAAAAAAAAAAAAAAAAAA';
        compile();

        // Act
        $scope.model = text;
        $scope.$digest();

        // Arrange
        expect(element.css('width')).toBe(getTextWidth(text));
    });

    it('sets the input width as the placeholder width when the input is empty', function() {
        // Arrange
        $scope.placeholder = 'Some placeholder';
        compile('placeholder="{{placeholder}}"');

        // Act
        $scope.model = '';
        $scope.$digest();

        // Assert
        expect(element.css('width')).toBe(getTextWidth('Some placeholder'));
    });

    it('clears the input width when it cannot be calculated', function() {
        // Arrange
        container.hide();
        compile();

        // Act
        element.val('AAAAAAAAAAAAAA');
        element.trigger('input');

        // Assert
        expect(element.prop('style').width).toBe('');
    });
});