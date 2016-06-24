// shortcut for uglifyjs
var w  = window,
    d  = document,
    $d = $(d);

var defaultTemplate = function (data) {
    var $result = $();
    if (data.icon) {
        $result = $result.add($('<i>').addClass(data.icon));
    }
    if (data.text) {
        $result = $result.add($('<span>').text(data.text));
    }
    return $result;
};

var PaulZiForm = $.extend(true, {
    classes: {
        formLoading: 'form-loading',
        btnLoading:  'btn-loading'
    },
    attributes: {
        via:         'data-via',
        lock:        'data-lock',
        submitEmpty: 'data-submit-empty',
        to:          'data-insert-to',
        context:     'data-insert-context',
        mode:        'data-insert-mode',
        loadingText: 'data-loading-text',
        loadingIcon: 'data-loading-icon'
    },
    defaults: {
        lock:        true,
        submitEmpty: true,
        to:          'output',
        context:     'this',
        mode:        'html',
        skipOnError: false
    },
    defaultTemplate: defaultTemplate,
    buttonLoadingTemplate: defaultTemplate,
    buttonLoadingForce: false
}, w.PaulZiForm || {});

var getSubmitButton = function (form) {
    var selector = 'input[type="submit"],input[type="image"],button[type="submit"]',
        $btn     = $(d.activeElement).filter(selector);
    $.each(form.elements, function (i, input) {
        input = $(input).filter(selector);
        if (!$btn.length && input.length) {
            $btn = input;
        }
    });
    return $btn;
};

var pluginName     = 'paulziForm',
    eventNamespace = '.' + pluginName,
    submitLast     = 'submitlast',
    submitBefore   = 'submitbefore',
    submitStart    = 'submitstart',
    submitEnd      = 'submitend',
    classes        = PaulZiForm.classes,
    attributes     = PaulZiForm.attributes,
    defaults       = PaulZiForm.defaults;