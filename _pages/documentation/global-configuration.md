---
layout: default
title: Advanced configuration - ngTagsInput
description:
priority: 0.80
---
# Global configuration

## Configuration service

ngTagsInput provides a configuration service that you can use to globally change several aspects of the directive. That
service is called *tagsInputConfigProvider*, and as its name implies, it must be used within a module's *config* function:

```javascript
app.config(function(tagsInputConfigProvider) {
  ...
});
```

## Default values

Most configuration options come with default values that are used when nothing is provided. You can replace them with
your own values by using the `setDefaults` method, passing the directive's name and an object containing the option names and the
new default values:

```javascript
app.config(function(tagsInputConfigProvider) {
  tagsInputConfigProvider
    .setDefaults('tagsInput', {
      placeholder: 'New tag',
      minLength: 5,
      addOnEnter: false
    })
    .setDefaults('autoComplete', {
      debounceDelay: 200,
      loadOnDownArrow: true,
      loadOnEmpty: true
    })
});
```

**IMPORTANT**: Options can always be locally overridden.

You can see a working example on the [Demos page](/demos).

## Active interpolation

As you know, Angular makes it very easy to bind expressions to elements by using the double curly braces notation. You might
want to bind an expression to some option of ngTagsInput, but it may not work as you'd expect. For instance, consider the
following markup:

{% raw %}
<div ng-non-bindable>

```html
<tags-input ng-model="tags" placeholder="{{placeholder}}"></tags-input>
```

<div>
{% endraw %}

If the `placeholder` property is set by the time the markup is compiled by Angular, then its value will be used by the
`tagsInput` directive. But if that value later changes, it won't be used by the directive. That happens because **all**
options are expected to be immutable (after all, they are *configuration values*) and so they aren't monitored.

But if you *really* need some option to be dynamic, you can set it as *actively interpolated*, which is a fancy term
meaning that option should be monitored. To do that, you should use the `setActiveInterpolation` method, passing the
directive's name and what options should be watched:

```javascript
app.config(function(tagsInputConfigProvider) {
  tagsInputConfigProvider.setActiveInterpolation('tagsInput', { placeholder: true });
});
```

**IMPORTANT**: Keep in mind the every *actively interpolated* option has its own watcher and it adds up to the list of watchers that
Angular needs to check at every digest cycle.

You can see a working example on the [Demos page](/demos).

## Autosize threshold

ngTagsInput automatically re-sizes its inner input's length as the user types so all text remains visible. Most of the
time you don't have to worry about it. But there are some cases where you may need to manually increase the default
threshold used (e.g. you need to support Korean characters). To do that, you need to use the `setTextAutosizeThreshold`
method, passing the new threshold value, in pixels:

```javascript
app.config(function(tagsInputConfigProvider) {
  tagsInputConfigProvider.setTextAutosizeThreshold(30);
});
```
