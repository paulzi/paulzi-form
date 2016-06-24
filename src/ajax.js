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