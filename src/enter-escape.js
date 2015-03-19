'use strict';

tagsInput.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind('keydown keypress', function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});

tagsInput.directive('ngEscape', function () {
	return function (scope, element, attrs) {
		element.bind('keydown keypress', function (event) {
			if(event.which === 27) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEscape);
				});

				event.preventDefault();
			}
		});
	};
});