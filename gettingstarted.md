---
layout: default
controller: GettingStartedCtrl
title: Getting started - ngTagsInput
description: All you need to know to start using the ngTagsInput directive
priority: 0.80
---
# Getting started

## Installing
Installing ngTagsInput is a 3-step process:

- Add the ngTagsInput script file to your page &ndash; make sure it's added after the Angular script:

    ```html
    <script type="text/javascript" src="path/to/angular.min.js"></script>
    <script type="text/javascript" src="path/to/ng-tags-input.min.js"></script>
    ```

- Add the ngTagsInput style file to your page:

    ```html
    <head>
    <link rel="stylesheet" href="path/to/ng-tags-input.min.css">
    </head>
    ```

- Add the **ngTagsInput** module as a dependency in your Angular application:

    ```javascript
    angular.module('myApp', ['ngTagsInput']);
    ```

## Basic usage

ngTagsInput provides a new HTML element called *tags-input* which can be bind to a property of a scope:

```html
<tags-input ng-model="tags"></tags-input>
```

The property bound to the directive must be an array of objects, if it exists. Otherwise the directive will create the property and initialize it as an empty array.

Assuming that the <em>tags</em> property contains 3 items - say, *{ text: 'Tag1' }*, *{ text: 'Tag2' }* and *{ text: 'Tag3' }* - the above code will produce the following:

<tags-input ng-model="tags"></tags-input>

There are lots of options that you can use to change the default behavior of the directive. You'll find everything you need to know on the documentation page.

## Autocomplete

Autocomplete support is available through the *auto-complete* tag:
 
```html
<tags-input ng-model="tags">
  <auto-complete source="loadItems($query)"></auto-complete>
</tags-input>
```

You should pass a function of the scope to the <em>source</em> attribute. That function will be called for every
keystroke on the input field and will be provided with its current value. That function also must return a promise which
eventually resolves to either an array of objects or an object with a *data* property containing an array of
objects (e.g. *$http promises*).
  
Given the above code and assuming that the *loadItems* function will return a promise that resolves to an array
containing 5 items - say, *{ text: 'Tag1' }*, *{ text: 'Tag2' }*, *{ text: 'Tag3' }*, *{ text: 'Tag4' }*
and *{ text: 'Tag5' }* - the result will be the following (you need to type at least 3 characters before the autocomplete kicks in):

<tags-input ng-model="tags">
  <auto-complete source="loadItems($query)"></auto-complete>
</tags-input>

Just like the *tags-input* directive, several options are available for you to customize how the autocomplete will work.
Check them out on the [documentation](documentation) page.

## Appearance

ngTagsInput comes with a style sheet that tries to mimic the look-and-feel of an ordinary input element. If the default
appearance doesn't fit your application, you can customize it with little effort. Below you can check a Boostrap-like
version of the previous example:

<tags-input ng-model="tags" class="bootstrap">
    <auto-complete source="loadItems($query)"></auto-complete>
</tags-input>

There are two things you can do in order to achieve that:

- Edit the ng-tags-input.css file and globally change the directive's look-and-feel.
- Use a custom class and change the appearance of elements individually.

These options aren't mutually exclusive and you can use them both in order to achieve better results.

## Code Example

Check out below a code example showing how to use the directive:

```html
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
```
