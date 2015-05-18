# Form module

## Quick start

### Ajax form send

Add class ```form-ajax``` to form and add ```<output>``` or ```<* class="form-output">``` tag in form.

Response must return correct content-type for append to output. Else response can be processed by script.

When form processing AJAX request his have class ```form-loading```. Until a response is received, the form can not be sent again.

Generate events:
- ```formajaxbefore(jqXHR, settings)``` - you can change setting and cancel request by ```preventDefault()```
- ```formajaxdone(data, textStatus, jqXHR)``` - when ajax receive success response
- ```formajaxfail(jqXHR, textStatus, errorThrown)``` - when ajax receive error response
- ```formajaxalways()``` - always after receive response

When an event occurs ```formajaxdone``` event with the correct content-type of response, the for document generated two events to prepare content:
- ```contentprepare``` - before add content to DOM
- ```contentinit``` - after add content to DOM

You can ```preventDefault()``` ```formajaxdone``` event, then the response processing and adding alert to output will not occur.

### Ajax form with files
With jQuery Form plugin (https://github.com/malsup/form/) you can send files with fallback for browsers, not supported XMLHttpRequest Level 2.
To use, simply specify enctype="multipart/form-data" and connect jQuery Form plug-in, the script will detect that you want to use this plug-in.

Generates additional events:
- ```formajaxprogress(loaded, total, percent)``` - when ajax uploading progress 

### Not send empty fields

Simply add class ```form-no-empty``` to form.


### Change status of submit button
Add class ```.btn-loading``` to submit button. When the button is pressed, it changes the status to disabled automatically. And restores the status only after receiving the AJAX response.

If you add the attribute ```data-loading-icon```, during the process form sending, the button prepended icon. Icon realized by <i> tag with specified classes in attribute.
Example
```html
<!-- font awesome -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-icon="fa fa-refresh fa-spin">Submit</button>

<!-- bootstrap glyph -->
<button type="submit" class="btn btn-primary btn-loading" data-loading-icon="glyphicon glyphicon-refresh">Submit</button>
```

If you add the attribute ```data-loading-test```, during the process form sending, the button text changes to the specified in attribute.


### Form alerts
Use ```$.formAlert(html, type)``` for add the bootstrap alert to form output.