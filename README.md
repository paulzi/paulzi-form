# PaulZi Form module

## [DEMO](http://paulzi.ru/paulzi-form/)

## Html5 form* attributes polyfill

Use `form`, `formaction`, `formenctype`, `formmethod`, `formtarget` attributes! This script will provide support for older browsers.

## Changing the behavior of all forms

When form is submitting, it has class `form-loading`. Until a response is received, the form can not be submit again.

## Do not send empty fields

Just add a class `form-no-empty` to form.

## Ajax form send

Provides submit the form via ajax. It supports the transfer of the name active submitting button and `<input type="image">` `x`, `y` parameters. Also support html5 form* attributes for override form action and method.

For use, add class `form-ajax` to form and add `<output>` or `<* class="form-output">` tag in form. You can use `data-form-output` attribute for find output element globally in document.

If you specify a class `form-replace` to root element of response, the form will replace by contents. You can also specify `data-form-output` attribute in root element of response to override the output element.

If the root element has class `alert`, it we automate make `alert-dismissible` if bootstrap javascript is included on page.

Response must return correct content-type `text/html` for append to output, otherwise it can be handled only by JavaScript.

Generate events:
- `formajaxbefore (jqXHR, settings)` - you can change settings and cancel request by `preventDefault()`;
- `formajaxdone (data, textStatus, jqXHR)` - when ajax receive success response;
- `formajaxfail (jqXHR, textStatus, errorThrown)` - when ajax receive error response;
- `formajaxalways()` - always after receive response.

All defined in the script event behavior can be canceled by `preventDefault()`.

At event `formajaxdone`, when the content is added to the output, for form generated two events for initialize JavaScript components in new content:
- `contentprepare` - before add content to DOM
- `contentinit` - after add content to DOM

Through this, you can initialize all JavaScript components such as page load, and when Ajax loading. Simple use:
```javascript
$(function () {
    $(document).trigger('contentinit', [$(document)]);
});
$(document).on('contentinit', function (e, cont) {
    cont.find('.datepicker').datepicker();
});
```

### Ajax form with files

With jQuery Form plugin (https://github.com/malsup/form/) you can send files with fallback for browsers, not supported XMLHttpRequest Level 2.

For use, simply specify `enctype="multipart/form-data"` and include jQuery Form plug-in on page, the script will automatically detect that you want to use this plug-in.

Additionally, sent parameter `X-Requested-With` with value `XMLHttpRequest`, for detect iframe method of form submit.

Generates additional events:
- `formajaxprogress (loaded, total, percent)` - when ajax uploading progress

Note: the transfer form is through a malsup plugin, so support html5 form attributes and pass the name of the active submit button depends of the support of these features by this plugin. While it is not.

### Redirect after AJAX

Set X-Redirect header in response for redirect page. You can stop redirect, if `preventDefault()` in `formajaxdone` or `formajaxfail` events.

### No ajax button

If you want to submit a form normally, but only some buttons, add `btn-no-ajax` class to this buttons.
 
 
## Change status of submit button

Add class `.btn-loading` to submit button. When the button is pressed, it changes the status to disabled automatically, and restores the status only after receiving the AJAX response.

Add class `.btn-submit-default` to submit button, then it will be used as the target of a form submit from the keyboard.

If you add the attribute `data-loading-icon`, during the process form sending, the button prepended icon. Icon realized by `<i>` tag with specified classes in attribute.

Example:
```html
<!-- font awesome -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-icon="fa fa-refresh fa-spin">Submit</button>

<!-- bootstrap glyph -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-icon="glyphicon glyphicon-refresh">Submit</button>
```

If you add the attribute `data-loading-text`, during the process form sending, the button text changes to the specified in attribute.

## Form alerts

Use `$.formAlert(elem, type, isJquery)` for add the bootstrap alert to form output.