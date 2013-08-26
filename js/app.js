angular.module("ngTagsInputSite", ['tags-input'])
    .controller('HomeCtrl', function($scope, $window) {
        $scope.tags = ['some', 'cool', 'tags'];

        $scope.goToDownload = function() {
            $window.location = 'download.html';
        };

        $scope.goToGitHub = function() {
            $window.location = 'http://github.com/mbenford/ngTagsInput';
        };
    });
