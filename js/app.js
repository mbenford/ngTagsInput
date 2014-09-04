angular.module("ngTagsInputSite", ['ngTagsInput'])
    .service('data', function($http, $q) {
        var files = {};

        this.load = function(name, file) {
            $http.get(file).success(function(data) {
                files[name] = data;
            });
        };

        this.search = function(name, query) {
            var items, deferred = $q.defer();

            items = _.chain(files[name])
                .filter(function(x) { return x.toLowerCase().indexOf(query.toLowerCase()) > -1; })
                .take(10)
                .value();

            deferred.resolve(items);
            return deferred.promise;
        }
    })
    .controller('HomeCtrl', function($scope, data) {
        data.load('superheroes', 'superheroes.json');

        $scope.tags = ['Batman', 'Superman', 'Flash'];
        $scope.loadItems = function($query) {
            return data.search('superheroes', $query);
        }
    })
    .controller('GettingStartedCtrl', function($scope, $q) {
        $scope.tags = ['Tag1', 'Tag2', 'Tag3'];

        $scope.loadItems = function($query) {
            var deferred = $q.defer();
            deferred.resolve(['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5']);
            return deferred.promise;
        };
    })
    .controller('NavCtrl', function($scope) {
        $scope.isActive = function(currentPage, page) {
            return currentPage === page;
        }
    })
    .directive('stickyOnScroll', function() {
        return function(scope, element) {
            $(window).scroll(function() {
                if ($(window).scrollTop() < element.parent().offset().top) {
                    element.css({
                        position: 'relative',
                        top: '0'
                    });
                }
                else {
                    element.css({
                        position: 'fixed',
                        top: 5 + 'px',
                        width: element.parent().width() + 'px'
                    });

                }
            });
        }
    });