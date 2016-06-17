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