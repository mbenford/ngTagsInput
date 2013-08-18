ngTagsInput
===========
[![Build Status](https://travis-ci.org/mbenford/ngTagsInput.png?branch=master)](https://travis-ci.org/mbenford/ngTagsInput)

Simple input control with tag editing support for AngularJS.

## Requirements

 - AngularJS 1.0.5+
 - A modern browser

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

The `tags-input` directive comes with lots of options so you can fit it to your needs:

- `ng-class`: CSS class to style the control.
- `tabindex`: Tab index for the new tag input box.
- `placeholder`: Text placeholder for the new tag input box. Defaults to: **Add a tag**
- `remove-tag-symbol`: Character to remove an existing tag. Defaults to: **&times;**
- `replace-spaces-with-dashes`: Flag indicating that all spaces will be replaced with dashes (This behavior will be disabled if the `add-on-space` option is true). Defaults to: **true**
- `min-length`: Minimum length for a new tag. Defaults to: **3**
- `max-length`: Maximum length for a new tag. Defaults to: **The** `placeholder` **length or the** `min-length` **value, whichever is greater.**
- `add-on-enter`: Flag indicating that a new tag will be added on pressing the ENTER key. Defaults to: **true**
- `add-on-space`: Flag indicating that a new tag will be added on pressing the SPACE key. Defaults to: **false**
- `add-on-comma`: Flag indicating that a new tag will be added on pressing the COMMA key. Defaults to: **true**
- `allowed-tags-pattern`: Regular expression that determines the pattern used to validate a tag. Defaults to **^[a-zA-Z0-9\s]+$*** (letters, numbers and spaces)
- `enable-editing-last-tag`: Flag indicating that the last tag will be moved back into the new tag input box instead of being removed when the backspace key is pressed and the input box is empty. Defaults to: **false**

## Demo

You can see the directive in action in the [demo page](http://rawgithub.com/mbenford/ngTagsInput/master/demo.html "").

## Building from the source code

Building the directive is a four-step process:

- Install Node.js;
- Install PhantomJS;
- Run `npm install` to install the development dependencies;
- Run `grunt` to build the directive.

While coding you can execute `grunt test` to run the tests or `grunt watch` to run them automatically every time the source code files change.

## License

See the [LICENSE](https://github.com/mbenford/ngTagsInput/blob/master/LICENSE "") file.

## Changelog

See the [ChangeLog](https://github.com/mbenford/ngTagsInput/blob/master/ChangeLog) file.