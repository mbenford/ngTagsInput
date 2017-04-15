---
layout: post
title:  Basic support for arrays of strings
date:   2017-04-15
comments: true
categories:
---

Back in 2013 when ngTagsInput was created, it supported array of strings only. But that was quickly proven to be too restrictive, so I decided that supporting arrays of objects would be more flexible and I thought that it would be easy for people that wanted arrays of strings to simply perform a conversion from objects to strings.

I didn't see it back when the decision was made, but it's become clear that forcing a specific model on everyone wasn't a wise idea. To make things worse, the codebase grew around array of objects as the primary data structure of the directive, making it hard to implement support for strings without introducing breaking changes and throwing a bunch of *if* around the code.

Fortunately, after spending some time analyzing the code, I came up with a way to implement support for arrays of strings without making a lot of changes. Basically the directive will keep on using arrays of objects internally, but the model bound to it will see a list of either objects or strings. There is a drawback, though: events and custom templates will still propagate tags as objects, since that's how they see them. I think it's a small price to pay for now while a definitive solution isn't available.

So, in a nutshell, there is now a new option called `use-strings`, that defaults to `false` for backward compatibility. Once it's turned on, the directive will update the model bound to it with strings instead of objects. 

Take a look at the example below:

```html
<div ng-init="tags=['just','some', 'cool', 'tags']">
  <tags-input ng-model="tags" use-strings="true"></tags-input>
</div>
```

{% raw %}
<div ng-init="vm.tags=['just','some', 'cool', 'tags']">
  <tags-input ng-model="vm.tags" use-strings="true"></tags-input>
  <p>Model: {{vm.tags}}</p>
</div>
{% endraw %}

This feature is available in version 3.2.0 of ngTagsInput.