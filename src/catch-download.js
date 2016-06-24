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