ngTagsInput
===========
[![Build Status](https://travis-ci.org/mbenford/ngTagsInput.png?branch=master)](https://travis-ci.org/mbenford/ngTagsInput)

Simple input control with tag editing support for AngularJS.

## Requirements

 - AngularJS 1.0.5+

## Installing

Download both `ng-tags-input.min.js` and `ng-tags-input.min.css` files from the `build` folder and add them to your web application. Make sure the JavaScript file is included after the AngularJS script.

## Usage

 1. Add the `tags-input` module as a dependency in your AngularJS app;
 2. Add the custom directive `<tags-input>` to the HTML file where you want to use an input tag control and bind it to a property of your model. That property, if it exists, must be an array of strings;
 3. Set up the options that make sense to your application;
 4. Customize the CSS classes, if you want to.
 3. You're done!

## Example
    <html>
    <head>
        <script src="angular.js"></script>
        <script src="ng-tags-input.min.js"></script>
        <script>
            angular.module('myApp', ['tags-input']).controller('MyCtrl', function($scope) {
                    $scope.tags = ['just','some','cool','tags'];
                });
        </script>
    </head>
    <body ng-app="myApp" ng-controller="MyCtrl">
        <tags-input ng-model="tags"></tags-input>
    </body>
    </html>    

## Options

The `tags-input` directive comes with lots of options so you can fit it to your needs:

- `class`: CSS class to be used by the control.
- `placeholder`: Text placeholder for the new tag input box. Defaults to: **Add a tag**
- `remove-tag-symbol`: Character to be used to remove an existing tag. Defaults to: **&times;**
- `replace-spaces-with-dashes`: Flag to indicate that all spaces should be replaced with dashes (This behavior will be disabled if the `add-on-space` option is true). Defaults to: **true**
- `min-length`: Minimum length for a new tag. Defaults to: **3**
- `max-length`: Maximum length for a new tag. Defaults to: **The** `placeholder` **length or the** `min-length` **value, whichever is greater.**
- `add-on-enter`: Flag to indicate that a new tag will be added on pressing the ENTER key. Defaults to: **true**
- `add-on-space`: Flag to indicate that a new tag will be added on pressing the SPACE key. Defaults to: **false**
- `add-on-comma`: Flag to indicate that a new tag will be added on pressing the COMMA key. Defaults to: **true**
- `allowed-chars`: Regular expression to indicate what characters will be accepted for a new tag. Defaults to: **[A-Za-z0-9\s]** (letters, numbers and spaces)

## Demo

You can see the directive in action in the [demo page](http://rawgithub.com/mbenford/ngTagsInput/master/demo.html "").
