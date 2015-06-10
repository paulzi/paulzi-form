# Form module

## Quick start


### html5 form* attributes polyfill
Use `form`, `formaction`, `formenctype`, `formmethod`, `formtarget` attributes! This script will support older browsers.


### All forms

When form is processing, it has class ```form-loading```. Until a response is received, the form can not be sent again.

### Ajax form send

This method support active submit button names and `<input type="image">` `x`, `y` parameters. Also support html5 form* attributes for override form action and method.
Add class ```form-ajax``` to form and add ```<output>``` or ```<* class="form-output">``` tag in form.
You can use `data-form-output` for set global output content.
Response must return correct content-type text/html for append to output. Else response can be processed by script.

Generate events:
- ```formajaxbefore(jqXHR, settings)``` - you can change setting and cancel request by ```preventDefault()```
- ```formajaxdone(data, textStatus, jqXHR)``` - when ajax receive success response
- ```formajaxfail(jqXHR, textStatus, errorThrown)``` - when ajax receive error response
- ```formajaxalways()``` - always after receive response

When an event occurs ```formajaxdone``` event with the correct content-type of response, the for document generated two events to prepare content:
- ```contentprepare``` - before add content to DOM
- ```contentinit``` - after add content to DOM

You can ```preventDefault()``` ```formajaxdone``` event, then the response processing and adding alert to output will not occur.
If you specify `form-replace` class to root tag, all form will be replace by output.
If root tag is has class `alert`, it we automate make `alert-dismissible` if bootstrap is included and generate `formAlert()` (see below).

### Redirect after AJAX
Set X-Redirect header in response for redirect page. You can stop redirect, if `preventDefault()` `formajaxdone` or `formajaxfail` event.

### Ajax form with files
With jQuery Form plugin (https://github.com/malsup/form/) you can send files with fallback for browsers, not supported XMLHttpRequest Level 2.
To use, simply specify enctype="multipart/form-data" and connect jQuery Form plug-in, the script will detect that you want to use this plug-in.
Additional send parameter `X-Requested-With` with value `XMLHttpRequest`, for detect iframe method of form submit.

Generates additional events:
- ```formajaxprogress(loaded, total, percent)``` - when ajax uploading progress

### Support submit buttons with name or type=image
Support submit buttons with name and ```input[type="image"]``` mouse click offset.

### Not send empty fields

Simply add class ```form-no-empty``` to form.

### No ajax button

If you want to send a form normally, only some button, simply add `btn-no-ajax` class to this buttons.
 

### Change status of submit button
Add class ```.btn-loading``` to submit button. When the button is pressed, it changes the status to disabled automatically. And restores the status only after receiving the AJAX response.
Add class ```.btn-submit-default``` to submit button, then it will be used as the target of a form submit from the keyboard.

If you add the attribute ```data-loading-icon```, during the process form sending, the button prepended icon. Icon realized by <i> tag with specified classes in attribute.
Example
```html
<!-- font awesome -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-icon="fa fa-refresh fa-spin">Submit</button>

<!-- bootstrap glyph -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-icon="glyphicon glyphicon-refresh">Submit</button>
```

If you add the attribute ```data-loading-text```, during the process form sending, the button text changes to the specified in attribute.


### Form alerts
Use ```$.formAlert(html, type)``` for add the bootstrap alert to form output.