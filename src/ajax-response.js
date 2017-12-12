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
                        operation = $this.attr(attributes.mode)    || $form.attr(attributes.mode)    || defaults.mode,
                        params    = $this.attr(attributes.params)  || $form.attr(attributes.params)  || defaults.params;
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
                        if (params === 'true') {
                            $target[operation](this);
                        } else if (params === 'false') {
                            $target[operation]();
                        } else {
                            $target[operation](params);
                        }
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