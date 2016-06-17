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