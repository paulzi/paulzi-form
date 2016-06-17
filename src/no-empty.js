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