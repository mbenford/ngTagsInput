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
    .controller('DemoCtrl', function($scope, data) {
        data.load('superheroes', 'superheroes.json');
        data.load('movies', 'movies.json');

        $scope.tags = ['just','some','cool','tags'];
        $scope.superheroes = ['Batman', 'Superman', 'Flash', 'Iron Man', 'Hulk', 'Wolverine', "Green Lantern", "Green Arrow", "Spiderman"];
        $scope.movies = ['The Dark Knight',
            'Heat',
            'Inception',
            'The Dark Knight Rises',
            'Kill Bill: Vol. 1',
            'Terminator 2: Judgment Day',
            'The Matrix',
            'Minority Report',
            'The Bourne Ultimatum',
            'Kill Bill: Vol. 2',
            'Hot Fuzz',
            'Serpico',
            'The Fugitive',
            'Casino Royale',
            'Ghost Dog: The Way of the Samurai'];

        $scope.loadSuperheroes = function($query) {
            return data.search('superheroes', $query);
        };
        $scope.loadMovies = function($query) {
            return data.search('movies', $query);
        };
    })
    .controller('GettingStartedCtrl', function($scope, $q) {
        $scope.tags = ['Tag1', 'Tag2', 'Tag3'];

        $scope.loadItems = function($query) {
            var deferred = $q.defer();
            deferred.resolve(['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5']);
            return deferred.promise;
        };
    });