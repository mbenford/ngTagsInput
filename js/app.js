angular.module("ngTagsInputSite", ['tags-input'])
    .controller('HomeCtrl', function($scope, $window) {
        $scope.tags = ['some', 'cool', 'tags'];

        $scope.goToDownload = function() {
            $window.location = 'download.html';
        };

        $scope.goToGitHub = function() {
            $window.location = 'http://github.com/mbenford/ngTagsInput';
        };
    })
    .controller('DemoCtrl', function($scope) {
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
    });
