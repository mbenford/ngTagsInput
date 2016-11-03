'use strict';

describe('autosize directive', function() {
    var $scope, $compile, tagsInputConfigMock,
        element, style, container;

    beforeEach(function() {
        module('ngTagsInput');

        tagsInputConfigMock = jasmine.createSpyObj('tagsInputConfig', ['getTextAutosizeThreshold']);
        tagsInputConfigMock.getTextAutosizeThreshold.and.returnValue(3);

        module(function($provide) {
            $provide.value('tagsInputConfig', tagsInputConfigMock);
        });

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

    function getTextWidth(text, threshold) {
        var width, span = angular.element('<span class="input"></span>');
        threshold = threshold || 3;

        span.css('white-space', 'pre');
        span.text(text);
        container.append(span);
        width = parseInt(span.prop('offsetWidth'), 10) + threshold;

        span.remove();

        return width + 'px';
    }
});