angular.module("ngTagsInputSite", ['tags-input'])
    .controller('MainCtrl', function($scope) {
        $scope.tags = ['some', 'cool', 'tags'];
    });
