'use strict';

describe('selectall directive', () => {
  var $scope, $compile, element, $timeout, isolateScope;
  beforeEach(() => {
    module('ngTagsInput');

    inject(($rootScope, _$compile_, _$timeout_) => {
      $scope = $scope = $rootScope.$new();
      $compile = _$compile_;
      $timeout = _$timeout_;
    });

  });

  function compile() {
    let attributes = $.makeArray(arguments).join(' ');

    element = angular.element('<input class="input" ng-model="model" ' + attributes + '>');
    $compile(element)($scope);
    isolateScope = element.isolateScope();
    $scope.$digest();
  }

  it('input select all and focus', () => {
    // Act/Arrange
    compile('ti-selectall="true"');
    $timeout.flush();

    //Assert
    expect(isolateScope.selectAll).toBe(true);
  });

  it('input not select all and focus', () => {
    // Act/Arrange
    compile('ti-selectall="false"');
    $timeout.flush();

    //Assert
    expect(isolateScope.selectAll).toBe(false);
  });


});