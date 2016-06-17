# PaulZi Form

[![NPM version](http://img.shields.io/npm/v/paulzi-form.svg?style=flat)](https://www.npmjs.org/package/paulzi-form)
![Bower version](http://img.shields.io/bower/v/paulzi-form.svg?style=flat)

JavaScript form helpers.

Demo: http://paulzi.ru/paulzi-form/

[Russian readme](https://github.com/paulzi/paulzi-form/blob/master/README.ru.md)
[v2.x](https://github.com/paulzi/paulzi-form/tree/2.x)

## Install

Install via NPM
```sh
npm install paulzi-form
```

Install via Bower
```sh
bower install paulzi-form
```

Or install manually.

Include library on page after jQuery. Select standalone or separate method:

### standalone (build-in dependencies)

```html
<script src="/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/bower_components/paulzi-form/dist/paulzi-form.all.min.js"></script>
```

### separate (external dependencies)

```html
<script src="/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/bower_components/form-extra-events/dist/form-extra-events.min.js"></script>
<script src="/bower_components/form-association-polyfill/dist/form-association-polyfill.min.js"></script>
<script src="/bower_components/jquery-iframe-ajax/dist/jquery-iframe-ajax.min.js"></script>
<script src="/bower_components/paulzi-form/dist/paulzi-form.min.js"></script>
```

## Features

### Form extra events

It provides extra events for forms: `submitlast`, `submitbefore`, `submitstart`, `submitend`.

See more: [paulzi/form-extra-events](http://github.com/paulzi/form-extra-events)

### HTML5 form attributes polyfill

It provides polyfill for html5 attributes `form`, `formaction`, `formmethod`, `formenctype`, `formtarget`.

See more: [paulzi/form-association-polyfill](http://github.com/paulzi/form-association-polyfill)

### Do not send empty fields

Set the attribute `data-submit-empty="false"` on the field, form or other closest node to do not submit the field if it is empty.

Example:

```html
<form action="action.php" method="post" data-submit-empty="false">
    Price: <input type="text" name="price1" value=""> - <input type="text" name="price2" value=""><br>
    <fieldset data-submit-empty="true">
        <legend>Colors</legend>
        <input type="hidden" name="colors" value="">
        <input type="checkbox" name="colors[]" value="1"> black
        <input type="checkbox" name="colors[]" value="2"> red
    </fieldset>
    <button type="submit">Filter</button>
</form>
```

### Lock re-submit the form

By default, all forms are protected from re-sending, as long as the request is complete. You can disable this default behavior in the global options (see below).

You can also specify attribute `data-lock` for a specific form:

```html
<form action="action.php" method="post" data-lock="false">
    Your name: <input type="text" name="name" value="">
    <button type="submit">Submit</button>
</form>
```

### Displays submitting status of forms

By default, during the process of submitting, in form adding the class `form-loading`. Similarly, adding the class `btn-loading` to the button by means of which this form is sent (default is the first submit button).

In addition, you can specify the attributes `data-loading-text` and `data-loading-icon` for a submit button. Then in during submission, button content will be replaced with the following template:
```html
<button><i class="<%= icon %>"></i><%= text %></button>
```

You can change the template in the global options (see below).

Example:

```html
<!-- font awesome -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-text="Submitting..." data-loading-icon="fa fa-refresh fa-spin">Submit</button>

<!-- bootstrap glyph -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-text="Submitting..." data-loading-icon="glyphicon glyphicon-refresh">Submit</button>
```

### Sending form via AJAX

It provides the ability to send the form via AJAX, including forms with files.

When submitting a form with `input[type="file"]` used XMLHttpRequest 2 or iframe for older browsers. Details of submitting by the iframe, see [paulzi/jquery-iframe-ajax](http://github.com/paulzi/jquery-iframe-ajax).

AJAX request is full equivalent default submit request, with support html5 form attributes, `input[type="image"]` submit button and files.

To send a form via AJAX, add an attribute `data-via="ajax"` to the form:

```html
<form action="action.php" method="post" data-via="ajax">
    Your name: <input type="text" name="name" value="">
    <button type="submit">Submit</button>
</form>
```

When sending via Ajax are additional events:

- `submitajax` - triggered before sending form via ajax, you can cancel submitting by `preventDefault()`;
- `submitbefore`, `submitstart`, `submitend (data, jqXHR)` - also available, as well as in extra events, but the property `transport` of event equal to `'ajax'`;
- `submitdone (data, jqXHR, error)` - triggered when get a successful response;
- `submitfail (data, jqXHR, error)` - triggered when get a error response;
- `uploadprogress` - triggered during uploading form data;
- `downloadprogress` - triggered during downloading response;
- `uploadend` - triggered after end uploading part of request and start download response;

Events `uploadprogress`, `downloadprogress`, `uploadend` available only in browser with support [XMLHttpRequest 2](http://caniuse.com/#feat=xhr2). In the event object are available properties `loaded`, `total`, `lengthComputable`.
 
Example:

```html
<form id="avatar-form" action="action.php" method="post" enctype="multipart/form-data" data-via="ajax">
    Avatar: <input type="file" name="file">
    <button type="submit">Upload</button>
</form>
<script>
$(document).on('submitstart', '#avatar-form', function () {
    $(this).find('button').html('Uploading...');
});
$(document).on('uploadprogress', '#avatar-form', function (e) {
    if (e.lengthComputable) {
        $(this).find('button').html(Math.round(100 * e.loaded / e.total) + '%');
    }
});
$(document).on('submitend', '#avatar-form', function () {
    $(this).find('button').html('Upload');
});
</script>
```

### Scenarios

Set the attribute `data-via` on the submit button to override the dispatch method specified in the form.

Set the attribute `data-via` in input fields, or closest nodes in order to determine in what method you want to submit these fields.

Example:

```html
<form action="action.php" method="post">
    Your name: <input type="text" name="name" value=""><br>
    Export name: <input type="text" name="export_name" value="" data-via="default"><br>
    <fieldset data-via="default">
        <legend>Export settings</legend>
        <input type="checkbox" name="compress" value="1"> compress
    </fieldset>
    <button type="submit" data-via="ajax">Save</button>
    <button type="submit" data-via="default" formaction="save.php">Export</button>
</form>
```

### AJAX response handling

If the `X-Redirect` was set in the response headers, the library will follow browser to the specified url.

If the `Content-Type` is `text/html`, each html node in response will be processed as follows:

- get value of attribute `data-insert-to` (default: `output`) in element or in form - it is selector to search for the output element;
- get value of attribute `data-insert-context` (default: `this`) in element or in form - it is search context;
- get value of attribute `data-insert-method` (default: `html`) in element or in form - it is insert function (defined as `$.fn.functionname`).

Context can have the following values:

- `this` - run the following code: `$form.search(selector).method(element)`;
- `document` - run the following code: `$(selector).method(element)`;
- other values - run the following code: `$form.closest(context).find(selector).method(element)`.

Example form:

```html
<div class="cart-amount">0</div>
<div class="product-card">
    <form action="cart.php" method="post" data-via="ajax">
        <input type="text" name="amount" value="1">
        <button type="submit">Add to cart</button>
        <output></output>
    </form>
</div>
```

Response example:

```html
<div class="cart-amount" data-insert-to=".cart-amount" data-insert-context="document" data-insert-mode="replaceWith">0</div>
<button type="submit" data-insert-to="button" data-insert-mode="replaceWith">Added to cart</button>
<div class="alert alert-success">Product added in cart!</div>
```

For new content generated by the following events:

- `contentprepare` - triggered **before** insert an element into the DOM (event target is form);
- `contentinit` - triggered **after** insert an element into the DOM (event target is form).
 
You can initialize all JavaScript components on page load or AJAX loaded content. Simple use:

```javascript
$(function () {
    $(document).trigger('contentinit', [$(document)]);
});
$(document).on('contentinit', function (e, $elements, operation, $target) {
    $elements.find('.datepicker').datepicker();
});
```

You can cancel this behavior by `preventDefault()` in `submitend` event.

## Global options

You can change the settings by changing the properties of the global object `window.PaulZiForm` (at any time, both before and after the include of the script).

Example:

```javascript
window.PaulZiForm = $.extend(true, window.PaulZiForm || {}, {
    classes: {
        formLoading: 'my-form-class'
    },
    attributes: {
        lock: 'data-may-attribute'
    }
});
```

Options:

- `classes` *(plain object)* - a list of classes overrides
    - `formLoading` *(string) default: 'form-loading'* - class for form submission state
    - `btnLoading` *(string) default: 'btn-loading'* - class for submit button in submission state
- `attributes` *(plain object)* - a list of attributes names overrides
    - `via` *(string) default: 'data-via'* - form submitting method attribute name
    - `lock` *(string) default: 'data-lock'* - form second submitting lock attribute name
    - `submitEmpty` *(string) default: 'data-submit-empty'* - do not submit empty field attribute name
    - `to` *(string) default: 'data-insert-to'* - ajax response handling target attribute name  
    - `context` *(string) default: 'data-insert-context'* - ajax response handling context attribute name
    - `mode` *(string) default: 'data-insert-mode'* - ajax response handling mode attribute name
    - `loadingText` *(string) default: 'data-loading-text'* - set text of submitting state button attribute name
    - `loadingIcon` *(string) default: 'data-loading-icon'* - set icon of submitting state button attribute name
- `defaults` *(plain object)* - a list of default values
    - `lock` *(bool) default: true* - lock second submitting in all form by default
    - `submitEmpty` *(bool) default: true* - submit empty fields in all form by default
    - `to` *(string) default: 'output'* - ajax response handling default target
    - `context` *(string) default: 'this'* - ajax response handling default context
    - `mode` *(string) default: 'html'* - ajax response handling default mode
    - `skipOnError` *(bool) default: false* - ajax response handling skip by error
- `buttonLoadingTemplate` *(function)* - template of submitting button state (more see below)
- `defaultTemplate` *(function)* - store default function for template (you can re-use)
- `buttonLoadingForce` *(bool) default: false* - force using a template, even if the attributes `data-loading-text` and `data-loading-icon` are not set

`buttonLoadingTemplate` in function pass plain object with data:
 
- form - form element;
- btn  - button element;
- text - content of `data-loading-text` attribute;
- icon - content of `data-loading-icon` attribute.

Function must return string (html), jQuery object or `false` (do not apply template).

## Custom build

Install [Grunt](http://gruntjs.com/), comment in `Grunt.js` out unnecessary `src/*` files, and run `grunt` command.

## Requirements

- jQuery 1.7+
- [form-extra-events](https://github.com/paulzi/form-extra-events/) (build-in in standalone version)
- [form-association-polyfill](https://github.com/paulzi/form-association-polyfill/) (build-in in standalone version)
- [jquery-iframe-ajax](https://github.com/paulzi/jquery-iframe-ajax/) (build-in in standalone version)

## Browser support

Tested with browsers:

- Internet Explorer 7+
- Chrome 7+
- Firefox 3+
- Opera 15+
- Safari 5+
- Android Browser 2.2+
- iOS Safari ?