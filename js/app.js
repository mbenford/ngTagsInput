angular.module("ngTagsInputSite", ['ngTagsInput'])
    .service('data', function($http) {
        var files = {};

        this.load = function(name, file) {
            $http.get(file).success(function(data) {
                files[name] = data;
            });
        };

        this.search = function(name, query) {
            return _.chain(files[name])
                .filter(function(x) { return !query || x.name.toLowerCase().indexOf(query.toLowerCase()) > -1; })
                .sortBy('name')
                .value();
        }
    })
    .controller('HomeCtrl', function(data) {
        data.load('superheroes', 'superheroes.json');

        this.tags = ['Batman', 'Superman', 'Flash'];
        this.loadItems = function($query) {
            return data.search('superheroes', $query);
        }
    })
    .controller('GettingStartedCtrl', function() {
        this.tags = ['Tag1', 'Tag2', 'Tag3'];
        this.loadItems = function($query) {
            return ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
        };
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
    })
    .directive('setActivePage', function() {
        return function(scope, element) {
            element.find('a').each(function() {
                var link = $(this);
                if (location.pathname.indexOf(link.attr('href')) > -1) {
                    link.parents().not('ul').toggleClass('active');
                }
            });
        };
    });