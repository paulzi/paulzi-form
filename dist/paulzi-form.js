/**
 * PaulZi Form
 * @see https://github.com/paulzi/paulzi-form
 * @license MIT (https://github.com/paulzi/paulzi-form/blob/master/LICENSE)
 * @version 3.0.1
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (root['PaulZiForm'] = factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    root['PaulZiForm'] = factory(root.jQuery);
  }
}(this, function ($) {

'use strict';

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
var noEmptyData = pluginName + 'NoEmpty';

var noEmptySubmit = function (e) {
    var $form = $(e.target),
        list  = [];
    $.each($form.prop('elements'), function (i, input) {
        if (input.value === '' && !input.disabled && input.type !== 'submit') {
            var value = $(input).closest('[' + attributes.submitEmpty + ']').attr(attributes.submitEmpty) || $form.attr(attributes.submitEmpty);
            value = value ? $.inArray(value, ['1', 'true']) !== -1 : defaults.submitEmpty;
            if (!value) {
                input.disabled = true;
                list.push(input);
            }
        }
    });
    $form.data(noEmptyData, list);
};

var noEmptySubmitEnd = function (e) {
    var list = $(e.target).data(noEmptyData);
    if (list) {
        $.each(list, function (e, input) {
            input.disabled = false;
        });
    }
};

$d.on(submitBefore + eventNamespace, noEmptySubmit);
$d.on(submitStart  + eventNamespace, noEmptySubmitEnd);
var lockData = pluginName + 'Lock';

var lockSubmitLast = function (e) {
    var $form = $(e.target);
    if ($form.data(lockData)) {
        var value = $form.attr(attributes.lock);
        if (typeof value !== 'undefined' ? $.inArray(value, ['1', 'true']) !== -1 : defaults.lock) {
            e.preventDefault();
        }
    }
};

var lockSubmitBefore = function (e) {
    $(e.target).data(lockData, true);
};

var lockSubmitEnd = function (e) {
    $(e.target).data(lockData, false);
};

$d.on(submitLast   + eventNamespace, lockSubmitLast);
$d.on(submitBefore + eventNamespace, lockSubmitBefore);
$d.on(submitEnd    + eventNamespace, lockSubmitEnd);
var scenarioData = pluginName + 'Scenario';

var scenarioSubmit = function (e) {
    var $form = $(e.target),
        list  = [];
    $.each($form.prop('elements'), function (i, input) {
        var value = $(input).closest('[' + attributes.via + ']').attr(attributes.via);
        if (value && value !== 'all' && value !== e.transport && !input.disabled && input.type !== 'submit') {
            input.disabled = true;
            list.push(input);
        }
    });
    $form.data(scenarioData, list);
};

var scenarioSubmitStart = function (e) {
    var list = $(e.target).data(scenarioData);
    if (list) {
        $.each(list, function (e, input) {
            input.disabled = false;
        });
    }
};

$d.on(submitBefore + eventNamespace, scenarioSubmit);
$d.on(submitStart  + eventNamespace, scenarioSubmitStart);
var catchDownloadData = pluginName + 'Catch';

var catchDownloadSubmit = function (e) {
    var $form    = $(e.target),
        $btn     = getSubmitButton(e.target),
        dataAttr = w.FormExtraEvents.dataAttribute,
        data     = $btn.data(dataAttr);
    if (typeof data !== 'undefined') {
        $form.data(catchDownloadData, $form.data(dataAttr) || {});
        $form.data(dataAttr, data);
    }
};

var catchDownloadSubmitStart = function (e) {
    var $form    = $(e.target),
        dataAttr = w.FormExtraEvents.dataAttribute,
        data     = $form.data(catchDownloadData);
    if (typeof data !== 'undefined') {
        $form.data(dataAttr, data || {});
        $form.removeData(catchDownloadData);
    }
};

$d.on(submitBefore + eventNamespace, catchDownloadSubmit);
$d.on(submitStart  + eventNamespace, catchDownloadSubmitStart);
var inputImageClick = function (e) {
    var $this  = $(this),
        offset = $this.offset();
    $this
        .data(pluginName + 'X', Math.round(e.pageX - offset.left))
        .data(pluginName + 'Y', Math.round(e.pageY - offset.top));
};

var ajaxSubmit = function (e) {
    var $form   = $(e.target),
        $btn    = getSubmitButton(e.target),
        viaForm = $form.attr(attributes.via),
        viaBtn  = $btn.attr(attributes.via);
    if (!e.isDefaultPrevented() && ((viaForm === 'ajax' && !viaBtn) || viaBtn === 'ajax')) {
        e.preventDefault();

        var event = $.Event('submitajax');
        $form.trigger(event);
        if (!event.isDefaultPrevented()) {

            var trigger = function (type, data) {
                $form.trigger({
                    type:      type,
                    transport: 'ajax'
                }, data);
            };

            trigger(submitBefore);

            var options = {
                url:         $btn.attr('formaction')  || $form.attr('action'),
                method:      $btn.attr('formmethod')  || $form.attr('method') || 'GET',
                contentType: $btn.attr('formenctype') || $form.attr('enctype'),
                xhr:         function () {
                    var xhr = $.ajaxSettings.xhr(),
                        listener = function (type) {
                            return function (e) {
                                var event = $.Event(e, {
                                    type:             type,
                                    loaded:           e.loaded,
                                    total:            e.total,
                                    lengthComputable: e.lengthComputable
                                });
                                $form.trigger(event);
                            };
                        };

                    if (xhr.addEventListener) {
                        xhr.addEventListener('progress',  listener('downloadprogress'));
                    }
                    if (xhr.upload && xhr.upload.addEventListener) {
                        xhr.upload.addEventListener('progress', listener('uploadprogress'));
                        xhr.upload.addEventListener('loadend',  listener('uploadend'));
                    }
                    return xhr;
                }
            };

            // add submit button name
            var data = [],
                name = $btn.attr('name');
            if (name) {
                var value;
                value = $btn.data(pluginName + 'X');
                if (typeof value !== 'undefined') {
                    data.push({ name: name + '.x', value: value });
                } else {
                    data.push({ name: name, value: $btn.val() });
                }
                value = $btn.data(pluginName + 'Y');
                if (typeof value !== 'undefined') {
                    data.push({ name: name + '.y', value: value });
                }
            }

            // XHR2 or IFrame
            if (options.contentType === 'multipart/form-data') {
                if ('FormData' in w) {
                    var formData = new FormData($form[0]);
                    $.each(data, function (i, item) {
                        formData.append(item.name, item.value);
                    });
                    options.data        = formData;
                    options.processData = false;
                    options.contentType = false;
                } else {
                    options.data           = data;
                    options.form           = $form[0];
                    options.iframe         = true;
                    options.iframeOnSubmit = trigger(submitStart);
                }
            } else {
                options.data = $.merge($form.serializeArray(), data);
            }

            // make ajax
            $.ajax(options)
                .done(function (data, statusText, jqXHR) {
                    trigger('submitdone', [data, jqXHR]);
                })
                .fail(function (jqXHR, statusText, error) {
                    trigger('submitfail', [jqXHR.responseText, jqXHR, error]);
                })
                .always(function () {
                    var data, jqXHR, error;
                    if (typeof arguments[2] === 'object') {
                        data  = arguments[0];
                        jqXHR = arguments[2];
                    } else {
                        data  = arguments[0].responseText;
                        jqXHR = arguments[0];
                        error = arguments[2];
                    }
                    trigger(submitEnd, [data, jqXHR, error]);
                });

            if (!options.iframe) {
                trigger(submitStart);
            }
        }
    }
};

$d.on('click'    + eventNamespace, 'input[type="image"]', inputImageClick);
$d.on(submitLast + eventNamespace, ajaxSubmit);
var ajaxResponseAlways = function (e, data, jqXHR, error) {
    if (e.transport === 'ajax') {

        // redirect
        var redirect = jqXHR.getResponseHeader('X-Redirect');
        if (redirect) {
            d.location.href = redirect;
            e.preventDefault();
        }

        // process
        var contentType = jqXHR.getResponseHeader('Content-Type');
        if (!e.isDefaultPrevented() && (contentType === null || /^text\/html(;|$)/.test(contentType))) {
            var $form = $(e.target),
                $data = $($.parseHTML(data, true));
            if (!error || !defaults.skipOnError) {
                $data.each(function () {
                    var $this     = $(this),
                        $target   = $this.attr(attributes.to)      || $form.attr(attributes.to)      || defaults.to,
                        $context  = $this.attr(attributes.context) || $form.attr(attributes.context) || defaults.context,
                        operation = $this.attr(attributes.mode)    || $form.attr(attributes.mode)    || defaults.mode;
                    if ($context && $target) {
                        if ($context === 'document') {
                            $context = $d;
                        } else if ($context === 'this') {
                            $context = $form;
                        } else {
                            $context = $form.closest($context);
                        }
                        $target = $target === 'context' ? $context : $context.find($target);
                    }
                    if ($target && $target.length && $target[operation]) {
                        $form.trigger('contentprepare', [$data, operation, $target]);
                        $target[operation](this);
                        $form.trigger('contentinit', [$data, operation, $target]);
                    }
                });
            }
        }
    }
};

if (attributes.via !== false) {
    $d.on(submitEnd + eventNamespace, ajaxResponseAlways);
}
var loadingStateSubmit = function (e) {
    var $form = $(e.target).addClass(classes.formLoading),
        $btn  = getSubmitButton(e.target).addClass(classes.btnLoading),
        data  = {
            form: $form[0],
            btn:  $btn[0],
            text: $btn.attr(attributes.loadingText),
            icon: $btn.attr(attributes.loadingIcon)
        };
    $form.data(pluginName + 'Btn', $btn);
    if (data.text || data.icon || PaulZiForm.buttonLoadingForce) {
        var $content = PaulZiForm.buttonLoadingTemplate(data);
        if ($content) {
            $btn.data(pluginName + 'Old', $btn.contents());
            $btn.html($content);
        }
    }
};

var loadingStateSubmitEnd = function (e) {
    var $form = $(e.target).removeClass(classes.formLoading),
        $btn  = $form.data(pluginName + 'Btn');
    if ($btn) {
        var $old = $btn.data(pluginName + 'Old');
        $btn.html($old);
        $btn.removeClass(classes.btnLoading);
    }
};

$d.on(submitBefore + eventNamespace, loadingStateSubmit);
$d.on(submitEnd    + eventNamespace, loadingStateSubmitEnd);
return PaulZiForm;

}));
