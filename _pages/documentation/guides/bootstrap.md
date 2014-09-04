---
layout: default
controller: GettingStartedCtrl
title: Integrating with Bootstrap - ngTagsInput
description: Learn how to use Bootstrap along with ngTagsInput
priority: 0.50
bootstrap: true
---

# Integrating with Bootstrap

ngTagsInput ships with a Bootstrap-compatible stylesheet that supports Bootstrap's look-and-feel and most classes related 
to input controls. Contextual classes like *input-group* and *has-feedback* are automatically detected, while for others 
to work you need to use a helper class (a class with the **ti-** prefix).
 
## Requirements

Bootstrap 3.2+

## Installing

Add the `ng-tags-input.bootstrap.min.css` file to your page. Be sure it's placed **after** the main ngTagsInput stylesheet
(which is also required):

```html
<head>
<link rel="stylesheet" href="path/to/ng-tags-input.min.css">     
<link rel="stylesheet" href="path/to/ng-tags-input.bootstrap.min.css">
</head>
```

Once that's done, all *tag-input* elements will be styled according to Bootstrap look-and-feel, as seen below:

<tags-input ng-model="tags">
    <auto-complete source="loadItems($query)"></auto-complete>
</tags-input>

In addition Bootstrap style, the undermentioned features are also supported:

- Sizing
- Input groups
- Validation states

Each one is covered in detail in the following sections.

## Sizing

Bootstrap's *input-sm* and *input-lg* classes are supported via their counterparts *ti-input-sm* and *ti-input-lg*, 
respectively:

<tags-input ng-model="tags" class="ti-input-lg"></tags-input><br/>
<tags-input ng-model="tags"></tags-input><br/>
<tags-input ng-model="tags" class="ti-input-sm"></tags-input><br/>

```html
<tags-input ng-model="tags" class="ti-input-lg"></tags-input>
<tags-input ng-model="tags"></tags-input>
<tags-input ng-model="tags" class="ti-input-sm"></tags-input>
```

## Input groups

Input groups are fully supported via *input-group* and *input-group-addon* classes: 

<div class="input-group">
    <span class="input-group-addon">@</span>
    <tags-input ng-model="tags"></tags-input>
</div><br />  
<div class="input-group">    
    <tags-input ng-model="tags"></tags-input>
    <span class="input-group-addon">.00</span>
</div><br />
<div class="input-group">    
    <span class="input-group-addon">$</span>
    <tags-input ng-model="tags"></tags-input>
    <span class="input-group-addon">.00</span>
</div>
<br/>

```html
<div class="input-group">
    <span class="input-group-addon">@</span>
    <tags-input ng-model="tags"></tags-input>
</div>

<div class="input-group">    
    <tags-input ng-model="tags"></tags-input>
    <span class="input-group-addon">.00</span>
</div>

<div class="input-group">    
    <span class="input-group-addon">$</span>
    <tags-input ng-model="tags"></tags-input>
    <span class="input-group-addon">.00</span>
</div>
```

Sizing is also supported through *input-group-sm* and *input-group-lg* classes:

<div class="input-group input-group-lg">
    <span class="input-group-addon">@</span>
    <tags-input ng-model="tags"></tags-input>
</div><br />  
<div class="input-group">
    <span class="input-group-addon">@</span>
    <tags-input ng-model="tags"></tags-input>
</div><br />
<div class="input-group input-group-sm">
    <span class="input-group-addon">@</span>
    <tags-input ng-model="tags"></tags-input>
</div>
<br/>

```html
<div class="input-group input-group-lg">
    <span class="input-group-addon">@</span>
    <tags-input ng-model="tags"></tags-input>
</div>

<div class="input-group">    
    <span class="input-group-addon">@</span>
    <tags-input ng-model="tags"></tags-input>    
</div>

<div class="input-group input-group-sm">    
    <span class="input-group-addon">@</span>    
    <tags-input ng-model="tags"></tags-input>    
</div>
```

## Validation states

Bootstrap's validation states are supported via *has-success*, *has-warning* and *has-error* classes:

<div class="has-success">
  <label class="control-label">Tags input with success</label>
  <tags-input ng-model="tags"></tags-input>
</div><br/>
<div class="has-warning">
  <label class="control-label">Tags input with warning</label>
  <tags-input ng-model="tags"></tags-input>
</div><br/>
<div class="has-error">
  <label class="control-label">Tags input with error</label>
  <tags-input ng-model="tags"></tags-input>
</div>
<br/>

```html
<div class="has-success">
  <label class="control-label">Tags input with success</label>
  <tags-input ng-model="tags"></tags-input>
</div>

<div class="has-warning">
  <label class="control-label">Tags input with warning</label>
  <tags-input ng-model="tags"></tags-input>
</div>

<div class="has-error">
  <label class="control-label">Tags input with error</label>
  <tags-input ng-model="tags"></tags-input>
</div>
```

Icons are supported as well:

<div class="has-success has-feedback">
  <label class="control-label">Tags input with success</label>
  <tags-input ng-model="tags"></tags-input>
  <span class="glyphicon glyphicon-ok form-control-feedback"></span>
</div><br/>
<div class="has-warning has-feedback">
  <label class="control-label">Tags input with warning</label>
  <tags-input ng-model="tags"></tags-input>
  <span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>
</div><br/>
<div class="has-error has-feedback">
  <label class="control-label">Tags input with error</label>
  <tags-input ng-model="tags"></tags-input>
  <span class="glyphicon glyphicon-remove form-control-feedback"></span>
</div>
<br/>

```html
<div class="has-success has-feedback">
  <label class="control-label">Input with success</label>
  <tags-input ng-model="tags"></tags-input>
  <span class="glyphicon glyphicon-ok form-control-feedback"></span>
</div>

<div class="has-warning has-feedback">
  <label class="control-label">Tags input with warning</label>
  <tags-input ng-model="tags"></tags-input>
  <span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>
</div>

<div class="has-error has-feedback">
  <label class="control-label">Tags input with error</label>
  <tags-input ng-model="tags"></tags-input>
  <span class="glyphicon glyphicon-remove form-control-feedback"></span>
</div>
```