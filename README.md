# ngTagsInput [![Build Status](https://travis-ci.org/mbenford/ngTagsInput.png?branch=master)](https://travis-ci.org/mbenford/ngTagsInput) [![Coverage Status](https://coveralls.io/repos/mbenford/ngTagsInput/badge.png?branch=master)](https://coveralls.io/r/mbenford/ngTagsInput?branch=master) [![devDependency Status](https://david-dm.org/mbenford/ngTagsInput/dev-status.png)](https://david-dm.org/mbenford/ngTagsInput#info=devDependencies)

Tags input directive for AngularJS. Check out the [ngTagsInput website](http://mbenford.github.io/ngTagsInput) for more information.

## Requirements

 - AngularJS 1.2.1+ (v1.2.0 **is not** supported due to [an API change](https://github.com/angular/angular.js/commit/90f870) in Angular)
 - A modern browser

## Installing

Download either `ng-tags-input.min.zip` or `ng-tags-input.zip` from the [Releases page](https://github.com/mbenford/ngTagsInput/releases) and add its content files to your web application. Make sure the JavaScript file is included after the AngularJS script.

You can also use Bower to install all files at once. Just run `bower install ng-tags-input`.

## Usage

 1. Add the `ngTagsInput` module as a dependency in your AngularJS app;
 2. Add the custom directive `<tags-input>` to the HTML file where you want to use an input tag control and bind it to a property of your model. That property, if it exists, must be an array of objects and each object must have a property named `text` containing the tag text;
 3. Set up the options that make sense to your application;
 4. Enable autocomplete, if you want to use it, by adding the directive `<auto-complete>` inside the `<tags-input>` tag, and bind it to a function of your model. That function must return a promise that eventually resolves to an array of objects (same rule from step 2 applies here);
 5. Customize the CSS classes, if you want to.
 6. You're done!

**Note:** There's a more detailed [getting started](http://mbenford.github.io/ngTagsInput/gettingstarted.html) guide on the ngTagsInput website.

## Example
    <html>
    <head>
        <script src="angular.min.js"></script>
        <script src="ng-tags-input.min.js"></script>
        <link rel="stylesheet" type="text/css" href="ng-tags-input.min.css">               
        <script>
            angular.module('myApp', ['ngTagsInput'])
                .controller('MyCtrl', function($scope, $http) {
                    $scope.tags = [
                        { text: 'just' },
                        { text: 'some' },
                        { text: 'cool' },
                        { text: 'tags' }
                    ];
                    $scope.loadTags = function(query) {
                         return $http.get('/tags?query=' + query);
                    };
                });
        </script>
    </head>
    <body ng-app="myApp" ng-controller="MyCtrl">
        <tags-input ng-model="tags">
            <auto-complete source="loadTags($query)"></auto-complete>
        </tags-input>
    </body>
    </html>    

## Options

Check out the [documentation](http://mbenford.github.io/ngTagsInput/documentation.html) page for a detailed view of all available options.

## Demo

You can see the directive in action in the [demo page](http://mbenford.github.io/ngTagsInput/demos.html).

## Contributing

See the [CONTRIBUTING](https://github.com/mbenford/ngTagsInput/blob/master/CONTRIBUTING.md) file.

## License

See the [LICENSE](https://github.com/mbenford/ngTagsInput/blob/master/LICENSE) file.

## Changelog

See the [CHANGELOG](https://github.com/mbenford/ngTagsInput/blob/master/CHANGELOG.md) page.

---

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/mbenford/ngtagsinput/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
