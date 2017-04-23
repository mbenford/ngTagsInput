describe('transclude-append-directive', () => {
    let $scope, $compile, directive, element;

    beforeEach(() => {
        module('ngTagsInput');

        module($compileProvider => {
            directive = $compileProvider.directive;
        });

        inject(($rootScope, _$compile_) => {
            $scope = $rootScope;
            $compile = _$compile_;
        });
    });

    function compile(template) {
        element = $compile(template)($scope);
    }

    function createDirective(template) {
        directive('foobar', () => ({
            restrict: 'E',
            transclude: true,
            template: template
        }));
    }

    it('appends the transcluded content to the end of an empty target element', () => {
        // Arrange
        createDirective('<div ti-transclude-append></div>');

        // Act
        compile('<foobar><p>transcluded content</p></foobar>');

        // Assert
        expect(element.find('p').html()).toBe('transcluded content');
    });

    it('appends the transcluded content to the end of a non-empty target element', () => {
        // Arrange
        createDirective('<div ti-transclude-append><p>existing content</p></div>');

        // Act
        compile('<foobar><p>transcluded content</p></foobar>');

        // Assert
        let content = $.map(element.find('p'), e => $(e).html());
        expect(content).toEqual(['existing content', 'transcluded content']);
    });
});