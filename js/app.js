angular.module("ngTagsInputSite", ['tags-input'])
    .controller('HomeCtrl', function($scope) {
        $scope.tags = ['some', 'cool', 'tags'];
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
    })
    .controller('NavCtrl', function($scope, $location) {
        function Link(url, text) {
            this.url = url;
            this.text = text;
            this.cssClass = $location.absUrl().lastIndexOf(url) > -1 ? 'active' : '';

        }
        console.log($location.absUrl());
        $scope.navbar = {
            links: [
                new Link('download.html', 'Download'),
                new Link('gettingstarted.html', 'Getting started'),
                new Link('demos.html', 'Demos'),
                new Link('documentation.html', 'Documentation')
            ]
        };
    });
