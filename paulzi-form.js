/**
 * PaulZi-Form module
 * Provide: ajax submit, delete empty fields before submit, submit button style, form alert.
 * @module paulzi/form
 * @version 2.1.1
 * @author PaulZi (pavel.zimakoff@gmail.com)
 * @license MIT (https://github.com/Paul-Zi/paulzi-form/blob/master/LICENSE)
 * @see https://github.com/Paul-Zi/paulzi-form
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
}(this, function ($) {

    /**
     * Append alert to form output
     * @memberOf jQuery.fn
     * @param {jQuery} html - alert contents
     * @param {string} type - alert CSS type
     * @return {jQuery} alert element
     */
    $.fn.formAlert = function(html, type)
    {
        var output = $(this).find('output, .form-output').first();
        
        var div;
        if (typeof(html) !== 'string' && $(html).hasClass('alert')) {
            div = html;
        } else {
            type = type || 'info';
            div = $('<div role="alert" class="alert alert-' + type + '">')
                .append(html);
        }
        
        if ($.fn.alert) {
            div.addClass(['alert-dismissible']);
            $('<button type="button" class="close" aria-label="close" data-dismiss="alert">')
                .html('<span aria-hidden="true">&times;</span>')
                .prependTo(div);
        }
        
        div.addClass('fade in').appendTo(output);
        return div;
    };
    
    
    // btn-loading
    var btnLoadingClickHandler = function(e) {
        $(this).addClass('disabled');
        
        var loadingText = $(this).data('loadingText');
        if (loadingText) {
            $(this).data('loadingText', $(this).text());
            $(this).text(loadingText);
        }
        
        var loadingIcon = $(this).data('loadingIcon');
        if (loadingIcon) {
            $('<span>&nbsp;</span>').addClass('btn-loading-space').prependTo(this);
            $('<i>').addClass('btn-loading-icon').addClass(loadingIcon).prependTo(this);
        }
    };
    
    var btnLoadingFormAjaxAlwaysHandler = function(e) {
        var btn = $(this).find('.btn-loading.disabled');
        btn.removeClass('disabled');
        btn.children('.btn-loading-icon, .btn-loading-space').remove();
        btn.each(function(){
            var loadingText = $(this).data('loadingText');
            if (loadingText) {
                $(this).data('loadingText', $(this).text());
                $(this).text(loadingText);
            }
        });
    };
    
    $(document).on('click',             '.btn-loading', btnLoadingClickHandler);
    $(document).on('formajaxalways',    '.form-ajax',   btnLoadingFormAjaxAlwaysHandler);
    
    
    // form-no-empty
    var noEmptySubmitHandler = function(e) {
        $(this)
            .find(':enabled')
            .filter(function(){ return this.value==''; })
            .addClass('form-no-empty-item')
            .each(function(){ this.disabled = true; });
        return true;
    };
    
    var noEmptyFormAjaxAlwaysHandler = function(e) {
        $(this)
            .find('.form-no-empty-item')
            .removeClass('form-no-empty-item')
            .each(function(){ this.disabled = false; });
    };
    
    $(document).on('submit',            '.form-no-empty',   noEmptySubmitHandler);
    $(document).on('formajaxalways',    '.form-no-empty',   noEmptyFormAjaxAlwaysHandler);
    
    
    // form-ajax
    var ajaxSubmitHandler = function(e) {
        if (e.isDefaultPrevented()) return false;
        e.preventDefault();
        
        var form = $(this);
        if (form.hasClass('form-loading')) return false;
        
        form.addClass('form-loading');
        var output = form.find('output').empty();
        
        var doneCallback = function(data, textStatus, jqXHR) {
            var event = jQuery.Event("formajaxdone");
            form.trigger(event, arguments);
            if (event.isDefaultPrevented()) return;
            
            if (typeof(data) !== 'string') return;
            data = $(data);
            var redirect = data.data('redirect');
            if (redirect) {
                document.location.href = redirect;
                return;
            }
            $(document).trigger('contentprepare', [data]);
            if (data.hasClass('form-replace')) {
                form.replaceWith(data);
            } else {
                if (data.hasClass('alert')) {
                    form.formAlert(data);
                } else {
                    output.html(data);
                }
            }
            $(document).trigger('contentinit', [data]);
        };
        
        var failCallback = function(jqXHR, textStatus, errorThrown) {
            var event = jQuery.Event("formajaxfail");
            form.trigger(event, arguments);
            if (event.isDefaultPrevented()) return;
            
            var alert = false;
            if (jqXHR.responseText) alert = $(jqXHR.responseText);
            if (alert && alert.hasClass('alert')) {
                form.formAlert(alert);
            } else {
                form.formAlert(['[' + textStatus + ']', errorThrown, jqXHR.responseText].join(' '), 'danger');
            }
        };
        
        var alwaysCallback = function() {
            var event = jQuery.Event("formajaxalways");
            form.trigger(event, arguments);
            if (event.isDefaultPrevented()) return;
            
            form.removeClass('form-loading');
        };
        
        var beforeSendCallback = function(jqXHR, settings) {
            var event = jQuery.Event("formajaxbefore");
            form.trigger(event, [jqXHR, settings]);
            return !event.isDefaultPrevented();
        };
        
        if (form.attr('enctype') == 'multipart/form-data' && typeof($.fn.ajaxSubmit) === 'function') {
            // if exists file in form and included jquery.form plugin, use it. @see: http://malsup.com/jquery/form/
            form.ajaxSubmit({
                beforeSubmit: function(arr, $form, options) {
                    options.beforeSend = beforeSendCallback;
                },
                success:        doneCallback,
                error:          failCallback,
                complete:       alwaysCallback,
                data:           {"X-Requested-With": "XMLHttpRequest"},
                uploadProgress: function(event) {
                    var percent = 0;
                    var loaded = event.loaded || event.position;
                    var total = event.total;
                    if (event.lengthComputable) {
                        percent = loaded / total * 100;
                    }
                    form.trigger('formajaxprogress', [loaded, total, percent]);
                }
            });
        } else {
            $.ajax({
                method:     form.attr('method') || 'GET',
                url:        form.attr('action'),
                data:       form.serialize(),
                beforeSend: beforeSendCallback
            })
            .done(doneCallback)
            .fail(failCallback)
            .always(alwaysCallback);
        }
            
        return false;
    };
    
    $(document).on('submit', '.form-ajax', ajaxSubmitHandler);
}));