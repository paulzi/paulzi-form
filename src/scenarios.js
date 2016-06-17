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