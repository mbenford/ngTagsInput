'use strict';

describe('autosize directive', function() {
    var $scope, $document, $compile,
        element;

    // The style tag should be created once, so we can't do it within a beforeEach() callback
    $('<style> .tag-input { box-sizing: border-box; border: 1px; padding: 2px; font: Arial 18px; }</style>').appendTo('head');

    beforeEach(function() {
        module('ngTagsInput');

        inject(function($rootScope, _$document_, _$compile_) {
            $scope = $rootScope;
            $document = _$document_;
            $compile = _$compile_;
        });
    });

    function compile() {
        var attributes = $.makeArray(arguments).join(' ');

        element = angular.element('<input class="tag-input" ng-model="model" ti-autosize ' + attributes + '>');
        $document.find('body').append(element);

        $compile(element)($scope);
        $scope.$digest();
    }

    function getTextWidth(text) {
        var width, span = angular.element('<span class="tag-input"></span>');

        span.text(text);
        $document.find('body').append(span);
        width = span.prop('offsetWidth') + 'px';

        span.remove();

        return width;
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
        compile('placeholder="Some placeholder"');

        // Act
        $scope.model = '';
        $scope.$digest();

        // Assert
        expect(element.css('width')).toBe(getTextWidth('Some placeholder'));
    });
});