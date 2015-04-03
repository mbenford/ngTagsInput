---
layout: default
controller: CustomTemplatesCtrl
title: Using custom templates - ngTagsInput
description: Learn how to use Bootstrap along with ngTagsInput
priority: 0.50
---

# Using custom templates

ngTagsInput comes with default templates for both `tagsInput` and `autoComplete` directives and you can replace them with your own custom templates very easily. This guide will show you how.

## Creating a custom template

Templates can be either remote or inline. A remote template is just an HTML file on your server and an inline template is a piece of markup wrapped within a `script` tag with the type attribute set to `text/ng-template`.

Here is an example of an inline template:

```html
<script type="text/ng-template" id="my-custom-template">
...
</script>
```
It's important to mention that all templates are rendered within an isolate scope and they can access different things depending on the context they are being used (tags or autocomplete).

### Tags template

To use a custom template for each tag you need to set the `template` option to either an id (inline template) or a URL (remote template):

```html
<tags-input ng-model="tags" template="my-custom-template"></tags-input>
<tags-input ng-model="tags" template="/path/to/my-custom-template.html"></tags-input>
```

A tag template has access to the following properties/methods:

- `data`: Contains the current tag data;
- `$index`: Contains the tag index.
- `$getDisplayText()`: Returns the display text according to the `displayProperty` option;
- `$removeTag()`: Removes the current tag.

**IMPORTANT**: If you inspect the template scope you'll notice some properties starting with `$$`. Those properties are considered private and you shouldn't use them in your custom templates because they may change or be removed in the future.

Below you can see a working example of a custom tag template:

<iframe style="border: 1px solid #999;width: 100%; height: 300px"
        src="http://embed.plnkr.co/bz1CtAHrnvjJxucRP4GP/preview" frameborder="0"
        allowfullscreen="allowfullscreen">
</iframe>

### Autocomplete template

Just like the `tags-input` directive, you can change the default autocomplete template by setting the `template` option:

```html
<auto-complete source="loadTags($query)" template="my-custom-template"></auto-complete>
<auto-complete source="loadTags($query)" template="/path/to/my-custom-template"></auto-complete>
```

You can use the following properties/methods to assemble your custom template:

- `data`: Contains the match data;
- `$index`: Contains the match index;
- `$getDisplayText()`: Returns the display text according to the `displayProperty` option;
- `$highlight(text)`: Receives a text and highlights the query typed by the user.

You can see a functional example below:

<iframe style="border: 1px solid #999;width: 100%; height: 400px"
        src="http://embed.plnkr.co/LfBMgU4yPNFMipOhLURM/preview" frameborder="0"
        allowfullscreen="allowfullscreen">
</iframe>

### Putting it all together

Here is a complete example using custom templates for both tags and autocomplete:

<iframe style="border: 1px solid #999;width: 100%; height: 400px"
        src="http://embed.plnkr.co/E0dnRezHPkscG5lP6mFw/preview" frameborder="0"
        allowfullscreen="allowfullscreen">
</iframe>

### Important stuff

Keep in mind that custom templates are rendered for **each tag** and **each autocomplete suggestion**. Complex templates with many bindings should be carefully designed so you don't get yourself in a [sasquatch situation](https://www.youtube.com/watch?v=wbcJfg-d5nI). Try to use one-time bindings instead of regular ones whenever possible.