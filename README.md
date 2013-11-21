ngTagsInput
===========
[![Build Status](https://travis-ci.org/mbenford/ngTagsInput.png?branch=master)](https://travis-ci.org/mbenford/ngTagsInput)

Tags input directive for AngularJS. Check out the [ngTagsInput website](http://mbenford.github.io/ngTagsInput) for more information.

## Requirements

 - AngularJS 1.0.5+ (**v1.2+ isn't supported yet**)
 - A modern browser

## Installing

Download either `ng-tags-input.min.zip` or `ng-tags-input.zip` from the [Releases page](https://github.com/mbenford/ngTagsInput/releases) and add its content files to your web application. Make sure the JavaScript file is included after the AngularJS script.

## Usage

 1. Add the `tags-input` module as a dependency in your AngularJS app;
 2. Add the custom directive `<tags-input>` to the HTML file where you want to use an input tag control and bind it to a property of your model. That property, if it exists, must be an array of strings;
 3. Set up the options that make sense to your application;
 4. Customize the CSS classes, if you want to.
 3. You're done!

## Example
    <html>
    <head>
        <script type="text/javascript" src="angular.min.js"></script>
        <script type="text/javascript" src="ng-tags-input.min.js"></script>
        <link rel="stylesheet" type="text/css" href="ng-tags-input.min.css">               
        <script>
            angular.module('myApp', ['tags-input'])
                .controller('MyCtrl', function($scope) {
                    $scope.tags = ['just','some','cool','tags'];
                });
        </script>
    </head>
    <body ng-app="myApp" ng-controller="MyCtrl">
        <tags-input ng-model="tags"></tags-input>
    </body>
    </html>    

## Options

Check out the [documentation](http://mbenford.github.io/ngTagsInput/documentation.html) page for a detailed view of all available options.

## Demo

You can see the directive in action in the [demo page](http://mbenford.github.io/ngTagsInput/demos.html).

## Building from the source code

Building the directive is a five-step process:

- Install Node.js;
- Install PhantomJS;
- Run `npm install -g grunt-cli karma` to install grunt-cli and karma globally;
- Run `npm install` to install the development dependencies;
- Run `grunt` to build the directive.

While coding you can execute `grunt test` to run the tests or `grunt watch` to run them automatically every time the source code files change.

## License

See the [LICENSE](https://github.com/mbenford/ngTagsInput/blob/master/LICENSE "") file.

## Changelog

See the [ChangeLog](https://github.com/mbenford/ngTagsInput/blob/master/ChangeLog) file.