/**
 * Form extra events
 * @see https://github.com/paulzi/form-extra-events
 * @license MIT (https://github.com/paulzi/form-extra-events/blob/master/LICENSE)
 * @version 1.0.1
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root.jQuery);
  }
}(this, function ($) {

'use strict';

$(document).on('submit', 'form', function (e) {
    if (!e.isDefaultPrevented()) {
        var $form   = $(this),
            $window = $(window);
        $window.off('submit');
        $window.one('submit', function () {
            var event = $.Event("submitlast");
            $form.trigger(event);
            if (event.isDefaultPrevented()) {
                e.preventDefault();
            } else {
                $form.trigger({
                    type:      'submitbefore',
                    transport: 'default'
                });

                var timerProp = 'formExtraEvents';
                var processTimer = function () {
                    var timer = $form.data(timerProp);
                    if (timer) {
                        clearTimeout(timer);
                    }
                    if (timer !== false) {
                        $form.data(timerProp, false);
                        $form.trigger({
                            type:      'submitstart',
                            transport: 'default'
                        });
                    }
                };

                // beforeunload event polyfill
                $form.data(timerProp, setTimeout(processTimer, 100));

                // standard beforeunload
                $window.one('beforeunload', processTimer);

                $window.one('unload', function () {
                    processTimer();
                    $form.trigger({
                        type:      'submitend',
                        transport: 'default'
                    });
                });
            }
        });
    }
});

}));

/**
 * Form association polyfill
 * @see https://github.com/paulzi/form-association-polyfill
 * @license MIT (https://github.com/paulzi/form-association-polyfill/blob/master/LICENSE)
 * @version 1.0.2
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root.jQuery);
  }
}(this, function ($) {

'use strict';

var pluginName = 'formAssociationPolyfill';
var submitSelector = 'input[type="submit"],input[type="image"],button[type="submit"]';
// safari button document.activeElement fix
$(document).on('click', 'input,button', function () {
    if (!document.activeElement || document.activeElement === document.body) {
        $(this).focus();
    }
});
var hide = function () {
    this.style.display = 'none';
};

var associationSupport = function () {
    var $body  = $(document.body),
        $form  = $('<form>').prop('id', pluginName).each(hide).appendTo($body),
        $input = $('<input form="' + pluginName + '">').each(hide).appendTo($body),
        result = $input.prop('form') === $form[0];
    $form.add($input).remove();
    return result;
};

var associationClickOnSubmit = function (e) {
    var form = $(this).attr('form');
    if (form) {
        var $form = $(this).closest('form');
        if (!$form.length || $form[0].id !== form) {
            e.preventDefault();
            $form.one('submit', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });
            $('form#' + form).trigger('submit');
        }
    }
};

var associationSubmit = function () {
    var i, element,
        form = this;

    // remove from form
    var target, removed = [];
    for (i = 0; i < form.elements.length; i++) {
        element = form.elements[i];
        target  = $(element).attr('form');
        if (target && target !== form.id && !element.disabled) {
            element.disabled = true;
            removed.push(element);
        }
    }

    // add other
    var $added = $();
    if (form.id) {
        var createDiv = function (form, action) {
            var $div = $('<div>').each(hide);
            $div[action](form);
            $added = $added.add($div);
            return $div;
        };

        var $div = createDiv(form, 'prependTo');
        $('[form="' + form.id + '"], form[id="' + form.id + '"]').each(function () {
            if (this === form) {
                $div = createDiv(form, 'appendTo');
            } else if ($.inArray(form.elements, this) === -1 && !this.disabled) {
                var clone = this.cloneNode(true);
                $(this)
                    .replaceWith(clone)
                    .prop(pluginName, clone)
                    .appendTo($div);
            }
        });
    }

    form[pluginName] = [removed, $added];
};

var associationAfterSubmit = function () {
    var data = this[pluginName];
    if (data) {
        var i;

        // revert removed
        for (i = 0; i < data[0].length; i++) {
            data[0][i].disabled = false;
        }

        // revert added
        data[1].children()
            .each(function () {
                $(this[pluginName]).replaceWith(this);
                this[pluginName] = null;
            })
            .end()
            .remove();
    }
};

if (!associationSupport()) {
    $(document).on('click', submitSelector, associationClickOnSubmit);
    $(document).on('submitbefore', 'form', associationSubmit);
    $(document).on('submitstart',  'form', associationAfterSubmit);
}
var submissionData = pluginName + 'Submission';
var attrList = ['action', 'enctype', 'method', 'target'];

var submissionSupport = function () {
    var input = $('<input>')[0];
    return !!('formAction' in input);
};

var submissionSubmit = function () {
    var $form = $(this),
        $btn  = $(document.activeElement).filter(submitSelector);
    if (!$btn.length) {
        $.each(this.elements, function (i, input) {
            input = $(input).filter(submitSelector);
            if (!$btn.length && input.length) {
                $btn = input;
            }
        });
    }
    if ($btn.length) {
        var attrNew = {}, attrOld = {};
        $.each(attrList, function (i, attr) {
            attrNew[attr] = $btn.attr('form' + attr);
            attrOld[attr] = $form.attr(attr);
        });
        $form.prop(submissionData, attrOld);
        $form.attr(attrNew);
    }
};

var submissionAfterSubmit = function () {
    var attrOld = $(this).prop(submissionData);
    if (attrOld) {
        $(this).attr(attrOld);
    }
};

if (!submissionSupport()) {
    $(document).on('submitbefore', 'form', submissionSubmit);
    $(document).on('submitstart',  'form', submissionAfterSubmit);
}

}));

/**
 * jQuery IFrame AJAX
 * @see https://github.com/paulzi/jquery-iframe-ajax
 * @license MIT (https://github.com/paulzi/jquery-iframe-ajax/blob/master/LICENSE)
 * @version 1.0.1
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(root.jQuery);
  }
}(this, function ($) {

'use strict';

var pluginName     = 'jqueryIframeAjax';
var styleHidden    = 'position: absolute; z-index: -1000; width: 0; height: 0; overflow: hidden; border: none;';
var deserialize = function (s) {
    var result = [];
    var list   = s.split('&');
    var decode = function (v) {
        return decodeURIComponent(v).replace('+', ' ');
    };
    var split;
    for (var i = 0; i < list.length; i++) {
        split = list[i].split('=');
        if (split[0] !== '') {
            result.push($.map(split, decode));
        }
    }
    return result;
};
$.ajaxTransport('+*', function(options) {

    if (!options.iframe) {
        return;
    }

    var $iframe;

    return {
        send: function (headers, complete) {
            var i;
            var id = pluginName + '-' + $.now();
            $iframe = $('<iframe name="' + id + '" style="' + styleHidden + '">');

            // get form
            var $form;
            if (options.form) {
                $form = $(options.form);
            } else {
                $form = $('<form>').attr('style', styleHidden).appendTo(document.body);
                if (options.files) {
                    $form.attr('enctype', 'multipart/form-data');
                }
            }
            var form = $form[0];

            // save old attributes
            var old = {
                action: form.action,
                method: form.method,
                target: form.target
            };

            // set new attribute
            $form.prop({
                action:  options.url,
                method:  options.method,
                target:  id
            });

            // adding params
            var params = [];
            var data = options.data || '';
            if (data && typeof data !== "string") {
                data = $.param(data, options.traditional);
            }
            data = $.merge([['X-Requested-With', 'IFrame']], deserialize(data));
            for (i = 0; i < data.length; i++) {
                params.push(
                    $('<input type="hidden">')
                        .attr('name', data[i][0])
                        .val(data[i][1])
                        .appendTo($form)
                );
            }

            // adding files
            var helpers = [];
            if (options.files) {
                var $file, $helper;
                for (i = 0; i < options.files.length; i++) {
                    $file = $(options.files[i]);
                    $helper = $file.clone().data(pluginName, $file);
                    helpers.push($helper);
                    $file.replaceWith($helper);
                    $file.appendTo($form);
                }
            }

            // load handler
            $iframe.one('load', function () {
                $iframe.one('load', function () {
                    try {
                        var doc = this.contentWindow ? this.contentWindow.document : (this.contentDocument ? this.contentDocument : this.document);
                        var root = doc.body ? doc.body : doc.documentElement;
                        var $textarea = $(root).find('textarea[data-status]');
                        var status = parseInt($textarea.data('status') || 200, 10);
                        var statusText = $textarea.data('statusText') || 'OK';
                        var type = $textarea.data('contentType');
                        var headers = $textarea.data('headers') || null;
                        if (headers && typeof headers === 'object') {
                            var list = [];
                            $.each(headers, function (k, v) {
                                list.push(k + ': ' + v);
                            });
                            headers = list.join("\r\n");
                        }
                        if (type) {
                            type = "Content-Type: " + type;
                            headers = headers ? type + "\r\n" + headers : type;
                        }
                        var content;
                        if ($textarea.size()) {
                            content = {text: $textarea.val()};
                        } else {
                            content = {
                                html: root.innerHTML,
                                text: root.textContent || root.innerText
                            };
                        }
                        $iframe.remove();
                        complete(status, statusText, content, headers);
                    } catch (e) {
                        $iframe.remove();
                        complete(0, 'IFrame error');
                    }
                });

                var submitHandler = function () {
                    var i;
                    form.submit();
                    $form.prop(old);
                    for (i = 0; i < helpers.length; i++) {
                        helpers[i].replaceWith(helpers[i].data(pluginName));
                    }
                    if (!options.form) {
                        $form.remove();
                    } else {
                        for (i = 0; i < params.length; i++) {
                            params[i].remove();
                        }
                    }
                    if (options.iframeOnSubmit) {
                        options.iframeOnSubmit();
                    }
                };

                if (options.form) {
                    setTimeout(submitHandler, 1);
                } else {
                    submitHandler();
                }
            });

            $(document.body).append($iframe);
        },


        abort: function () {
            $iframe.off('load');
            $iframe.remove();
        }
    };
});

}));

/**
 * PaulZi Form
 * @see https://github.com/paulzi/paulzi-form
 * @license MIT (https://github.com/paulzi/paulzi-form/blob/master/LICENSE)
 * @version 3.0.0
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
}, window.PaulZiForm || {});

var pluginName     = 'paulziForm',
    eventNamespace = '.' + pluginName,
    classes        = PaulZiForm.classes,
    attributes     = PaulZiForm.attributes,
    defaults       = PaulZiForm.defaults;

var getSubmitButton = function (form) {
    var selector = 'input[type="submit"],input[type="image"],button[type="submit"]',
        $btn     = $(document.activeElement).filter(selector);
    $.each(form.elements, function (i, input) {
        input = $(input).filter(selector);
        if (!$btn.length && input.length) {
            $btn = input;
        }
    });
    return $btn;
};
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

$(document).on('submitbefore' + eventNamespace, noEmptySubmit);
$(document).on('submitstart'  + eventNamespace, noEmptySubmitEnd);
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

$(document).on('submitlast'   + eventNamespace, lockSubmitLast);
$(document).on('submitbefore' + eventNamespace, lockSubmitBefore);
$(document).on('submitend'    + eventNamespace, lockSubmitEnd);
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

$(document).on('submitbefore' + eventNamespace, scenarioSubmit);
$(document).on('submitstart'  + eventNamespace, scenarioSubmitStart);
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

        var event = $.Event("submitajax");
        $form.trigger(event);
        if (!event.isDefaultPrevented()) {

            $form.trigger({
                type:      'submitbefore',
                transport: 'ajax'
            });

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

            var submitStart = function () {
                $form.trigger({
                    type:      'submitstart',
                    transport: 'ajax'
                });
            };

            // XHR2 or IFrame
            if (options.contentType === 'multipart/form-data') {
                if ('FormData' in window) {
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
                    options.iframeOnSubmit = submitStart;
                }
            } else {
                options.data = $.merge($form.serializeArray(), data);
            }

            // make ajax
            $.ajax(options)
                .done(function (data, statusText, jqXHR) {
                    $form.trigger({
                        type: 'submitdone',
                        transport: 'ajax'
                    }, [data, jqXHR]);
                })
                .fail(function (jqXHR, statusText, error) {
                    $form.trigger({
                        type: 'submitfail',
                        transport: 'ajax'
                    }, [jqXHR.responseText, jqXHR, error]);
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
                    $form.trigger({
                        type: 'submitend',
                        transport: 'ajax'
                    }, [data, jqXHR, error]);
                });

            if (!options.iframe) {
                submitStart();
            }
        }
    }
};

$(document).on('click'      + eventNamespace, 'input[type="image"]', inputImageClick);
$(document).on('submitlast' + eventNamespace, ajaxSubmit);
var ajaxResponseAlways = function (e, data, jqXHR, error) {
    if (e.transport === 'ajax') {

        // redirect
        var redirect = jqXHR.getResponseHeader('X-Redirect');
        if (redirect) {
            document.location.href = redirect;
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
                            $context = $(document);
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
    $(document).on('submitend' + eventNamespace, ajaxResponseAlways);
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

$(document).on('submitbefore' + eventNamespace, loadingStateSubmit);
$(document).on('submitend'    + eventNamespace, loadingStateSubmitEnd);
return PaulZiForm;

}));
