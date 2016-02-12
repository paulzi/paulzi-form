/**
 * PaulZi-Form module
 * Provide: ajax submit, delete empty fields before submit, submit button style, form alert.
 * @module paulzi/paulzi-form
 * @external jQuery
 * @version 2.5.1
 * @author PaulZi (pavel.zimakoff@gmail.com)
 * @license MIT (https://github.com/paulzi/paulzi-form/blob/master/LICENSE)
 * @see https://github.com/paulzi/paulzi-form
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
}(this, function ($) {

    // internal functions
    var getFormOutput = function ($form) {
        var $output = $form.find('output, .form-output').first();
        var sel = $form.data('formOutput');
        if (sel) {
            $output = $(sel);
        }
        return $output;
    };

    var isSubmit = function ($item) {
        return $.inArray($item.prop('tagName'), ['INPUT', 'BUTTON']) !== -1
            && $item.attr('type') && $.inArray($item.attr('type').toLowerCase(), ['submit', 'image']) !== -1;
    };


    /**
     * Append alert to form output
     * @memberOf jQuery.fn
     * @param {jQuery} elem - alert contents
     * @param {string} type - alert CSS type
     * @param {boolean} isJquery - elem is jQuery selector/object
     * @returns {jQuery} alert element
     */
    $.fn.formAlert = function (elem, type, isJquery) {
        var $form = $(this);
        var $elem = isJquery ? $(elem) : $($.parseHTML(elem, true));
        if (!$elem.hasClass('alert')) {
            type = type || 'info';
            $elem = $('<div role="alert" class="alert alert-' + type + '">').append($elem);
        }
        
        if ($.fn.alert && !$elem.hasClass('alert-dismissible')) {
            $elem.addClass('alert-dismissible');
            $('<button type="button" class="close" aria-label="close" data-dismiss="alert">')
                .html('<span aria-hidden="true">&times;</span>')
                .prependTo($elem);
        }
        
        $elem.addClass('fade in').appendTo(getFormOutput($form));
        return $elem;
    };


    // safari fix
    $(document).on('click', function (e) {
        if (document.activeElement === document.body && isSubmit($(e.target))) {
            $(e.target).focus();
        }
    });


    // btn-loading
    var btnLoadingSubmitHandler = function (e) {
        if (e.isDefaultPrevented()) {
            return false;
        }
        var $this = $(this);
        if ($this.hasClass('form-loading') && !$this.hasClass('form-no-block')) {
            e.preventDefault();
            return false;
        }
        $this.addClass('form-loading');

        var $btn = $(document.activeElement).filter('.btn-loading');
        if (!isSubmit($btn)) {
            $btn = $this.find('.btn-loading.btn-submit-default');
        }
        $btn.addClass('disabled');
        
        var loadingText = $btn.attr('data-loading-text');
        if (loadingText) {
            $btn.data('paulziFormLoadingText', $btn.html());
            $btn.html(loadingText);
        }
        
        var loadingIcon = $btn.data('loadingIcon');
        if (loadingIcon) {
            $('<span>&nbsp;</span>').addClass('btn-loading-space').prependTo($btn);
            $('<i>').addClass('btn-loading-icon').addClass(loadingIcon).prependTo($btn);
        }
    };
    
    var btnLoadingFormAjaxAlwaysHandler = function (e) {
        var $btn = $(this).find('.btn-loading.disabled');
        $btn.removeClass('disabled');
        $btn.children('.btn-loading-icon, .btn-loading-space').remove();
        $btn.each(function () {
            var $this = $(this);
            var loadingText = $this.data('paulziFormLoadingText');
            if (loadingText) {
                $this.html(loadingText);
            }
        });
    };
    
    $(document).on('submit.paulzi-form',         'form',         btnLoadingSubmitHandler);
    $(document).on('formajaxalways.paulzi-form', '.form-ajax',   btnLoadingFormAjaxAlwaysHandler);


    // form html5 attributes polyfill
    var _formAttrSupport;

    var formAttrList = ['action', 'enctype', 'method', 'target'];

    var formPolyfillClass = 'paulzi-form-polyfill';
    var formPolyfillClassDisabled = formPolyfillClass + '-disabled';

    var formAttrSupport = function () {
        if (typeof(_formAttrSupport) !== 'undefined') {
            return _formAttrSupport;
        }
        var input   = document.createElement('input');
        var form    = document.createElement('form');
        var formId  = 'paulzi-form-support';
        form.id = formId;
        document.body.appendChild(form);
        document.body.appendChild(input);
        input.setAttribute('form', formId);
        _formAttrSupport = (input.form === form);
        document.body.removeChild(form);
        document.body.removeChild(input);
        return _formAttrSupport;
    };

    var formActionAttrSupport = function () {
        var input = document.createElement("input");
        return !!('formAction' in input);
    };

    var attrPolyfillSubmitHandler = function (e) {
        var that  = this;
        var $form = $(this);
        if (!formAttrSupport()) {
            var list;
            var id = $form.attr('id');

            // remove from form
            list = $form.find('[form]').not(':disabled');
            if (id) {
                list = list.not('[form="' + id + '"]');
            }
            list
                .addClass(formPolyfillClassDisabled)
                .prop('disabled', true);

            // add other
            if (id) {
                $('[form="' + id + '"]')
                    .not('form#' + id + ' [form="' + id + '"]')
                    .filter(function () {
                        return this.name && !$(this).is(':disabled') && (this.checked || (this.type !== 'checkbox' && this.type !== 'radio'));
                    })
                    .each(function () {
                        $('<input type="hidden">')
                            .attr('name', this.name)
                            .val($(this).val())
                            .addClass(formPolyfillClass)
                            .appendTo(that);
                    });
            }
        }
        if (!formActionAttrSupport()) {
            var $btn = $(document.activeElement);
            if (isSubmit($btn)) {
                $.each(formAttrList, function (i, a) {
                    var attr = $btn.attr('form' + a);
                    if (attr) {
                        $form
                            .data('paulziFormPolyfill' + a, attr)
                            .attr(a, attr);
                    }
                });
            }
        }
    };

    var attrPolyfillFormAjaxAlwaysHandler = function (e) {
        var $form = $(this);
        if (!formAttrSupport()) {
            $form.find('.' + formPolyfillClass)
                .remove();
            $form.find('.' + formPolyfillClassDisabled)
                .removeClass(formPolyfillClassDisabled)
                .prop('disabled', false);
        }
        if (!formActionAttrSupport()) {
            $.each(formAttrList, function (i, a) {
                var name = 'paulziFormPolyfill' + a;
                var val  = $form.data(name);
                if (val) {
                    $form.attr(a, val).removeData(name);
                }
            });
        }
    };

    $(document).on('submit.paulzi-form',         'form', attrPolyfillSubmitHandler);
    $(document).on('formajaxalways.paulzi-form', 'form', attrPolyfillFormAjaxAlwaysHandler);


    // form-no-empty
    var noEmptyItemClass = 'paulzi-form-no-empty-item';
    
    var noEmptySubmitHandler = function (e) {
        $(this)
            .find(':enabled')
            .filter(function () { return this.value==''; })
            .addClass(noEmptyItemClass)
            .prop('disabled', true);
        return true;
    };
    
    var noEmptyFormAjaxAlwaysHandler = function (e) {
        $(this)
            .find('.' + noEmptyItemClass)
            .removeClass(noEmptyItemClass)
            .prop('disabled', false);
    };
    
    $(document).on('submit.paulzi-form',         '.form-no-empty',   noEmptySubmitHandler);
    $(document).on('formajaxalways.paulzi-form', '.form-no-empty',   noEmptyFormAjaxAlwaysHandler);
    
    
    // form-ajax
    var inputImageClickHandler = function (e) {
        var offset = $(this).offset();
        $(this)
            .prop('paulziFormX', Math.round(e.pageX - offset.left))
            .prop('paulziFormY', Math.round(e.pageY - offset.top));
    };
    
    var ajaxSubmitHandler = function (e) {
        if (e.isDefaultPrevented()) {
            return false;
        }
        if ($(document.activeElement).hasClass('btn-no-ajax')) {
            return true;
        }
        e.preventDefault();

        var $form = $(this);

        var redirect = function (jqXHR) {
            var redirect = jqXHR.getResponseHeader('X-Redirect');
            if (redirect) {
                document.location.href = redirect;
                return true;
            }
            return false;
        };

        var isJqueryFormPlugin = $form.attr('enctype') == 'multipart/form-data' && typeof($.fn.ajaxSubmit) === 'function';
        
        var doneCallback = function (data, textStatus, jqXHR) {
            var event = jQuery.Event("formajaxdone");
            $form.trigger(event, arguments);
            if (event.isDefaultPrevented()) {
                return;
            }

            if (redirect(jqXHR)) {
                return;
            }

            if (!isJqueryFormPlugin && !/^text\/html(;|$)/.test(jqXHR.getResponseHeader('Content-Type'))) {
                return;
            }

            var $data = $($.parseHTML(data, true));
            $form.trigger('contentprepare', [$data]);
            if ($data.hasClass('form-replace')) {
                $form.replaceWith($data);
            } else {
                var $output = getFormOutput($form);
                var dataOutput = $data.data('formOutput');
                if (dataOutput) {
                    $output = $(dataOutput);
                }
                if ($data.hasClass('alert')) {
                    $data = $form.formAlert($data, false, true);
                }
                $output.html($data);
            }
            $form.trigger('contentinit', [$data]);
        };
        
        var failCallback = function (jqXHR, textStatus, errorThrown) {
            var event = jQuery.Event("formajaxfail");
            $form.trigger(event, arguments);
            if (event.isDefaultPrevented()) {
                return;
            }

            if (redirect(jqXHR)) {
                return;
            }
            
            var $alert = false;
            if (jqXHR.responseText) {
                $alert = $($.parseHTML(jqXHR.responseText, true));
            }
            if ($alert && $alert.hasClass('alert')) {
                $form.formAlert($alert, false, true);
            } else {
                $alert = ['[' + textStatus + ']', errorThrown, jqXHR.responseText].join('<br>');
                $form.formAlert($alert, 'danger');
            }
        };
        
        var alwaysCallback = function () {
            var event = jQuery.Event("formajaxalways");
            $form.trigger(event, arguments);
            if (event.isDefaultPrevented()) {
                return;
            }

            $form.removeClass('form-loading');
        };
        
        var beforeSendCallback = function (jqXHR, settings) {
            var event = jQuery.Event("formajaxbefore");
            $form.trigger(event, [jqXHR, settings]);
            return !event.isDefaultPrevented();
        };

        var event = jQuery.Event("formajaxbeforeparams");
        $form.trigger(event);
        if (event.isDefaultPrevented()) {
            return;
        }

        if (isJqueryFormPlugin) {
            // if exists file in form and included jquery.form plugin, use it. @see: http://malsup.com/jquery/form/
            $form.ajaxSubmit({
                beforeSubmit: function (arr, form, options) {
                    options.beforeSend = beforeSendCallback;
                },
                success:        doneCallback,
                error:          failCallback,
                complete:       alwaysCallback,
                data:           {"X-Requested-With": "XMLHttpRequest"},
                uploadProgress: function (event) {
                    var percent = 0;
                    var loaded = event.loaded || event.position;
                    var total = event.total;
                    if (event.lengthComputable) {
                        percent = loaded / total * 100;
                    }
                    $form.trigger('formajaxprogress', [loaded, total, percent]);
                }
            });
        } else {
            var url     = $form.attr('action');
            var method  = $form.attr('method') || 'GET';
            var data    = $form.serializeArray();
            var $btn    = $(document.activeElement);
            var value;
            var isSubmittable = !$btn.is(":disabled") && isSubmit($btn);
            if (isSubmittable) {
                if (value = $btn.attr('formaction')) {
                    url = value;
                }
                if (value = $btn.attr('formmethod')) {
                    method = value;
                }
                if ($btn.attr('name')) {
                    value = $btn.prop('paulziFormX')
                    if (typeof(value) === 'number') {
                        data.push({name: $btn.attr('name') + '.x', value: value});
                        $btn.removeProp('paulziFormX');
                    } else {
                        data.push({name: $btn.attr('name'), value: $btn.val()});
                    }
                    value = $btn.prop('paulziFormY')
                    if (typeof(value) === 'number') {
                        data.push({name: $btn.attr('name') + '.y', value: value});
                        $btn.removeProp('paulziFormY');
                    }
                }
            }
            $.ajax({
                method:     method,
                url:        url,
                data:       data,
                beforeSend: beforeSendCallback
            })
            .done(doneCallback)
            .fail(failCallback)
            .always(alwaysCallback);
        }
            
        return false;
    };
    
    $(document).on('click.paulzi-form',     'input[type="image"]',  inputImageClickHandler);
    $(document).on('submit.paulzi-form',    '.form-ajax',           ajaxSubmitHandler);


    // form-scenarios
    var scenarioClass = 'paulzi-form-scenario-disabled';

    var scenarioSubmitHandler = function (e) {
        $(this)
            .find('.form-on-none, .form-on-ajax')
            .find(':enabled')
            .addBack(':enabled')
            .addClass(scenarioClass)
            .prop('disabled', true);
        return true;
    };

    var scenarioFormAjaxBeforeHandler = function (e) {
        $(this)
            .find('.form-on-none, .form-on-submit')
            .find(':enabled')
            .addBack(':enabled')
            .addClass(scenarioClass)
            .prop('disabled', true);
        return true;
    };

    var scenarioFormAjaxAlwaysHandler = function (e) {
        $(this)
            .find('.' + scenarioClass)
            .removeClass(scenarioClass)
            .prop('disabled', false);
    };

    $(document).on('submit.paulzi-form',               scenarioSubmitHandler);
    $(document).on('formajaxbeforeparams.paulzi-form', scenarioFormAjaxBeforeHandler);
    $(document).on('formajaxalways.paulzi-form',       scenarioFormAjaxAlwaysHandler);
}));