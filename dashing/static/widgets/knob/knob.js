/* global $, rivets, Dashing */

Dashing.widgets.Knob = function(dashboard) {
    var self = this,
        widget;
    self.__init__ =  Dashing.utils.widgetInit(dashboard, 'knob', {
        require: ['jqueryKnob']
    });
    this.row = 1;
    this.col = 1;
    this.scope = {};
    this.getWidget = function () {
        return widget;
    };
    this.getData = function () {};
    this.interval = 10000;
};

rivets.binders['dashing-knob'] = function binder(el, data) {
    if (!data) return;
    if (!$.fn.knob) {
        $(document).on('libs/jqueryKnob/loaded', binder.bind(this, el, data));
        return;
    }
    el.id = Dashing.utils.getId();

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            // workaround as knob.js needs camel case data attributes
            el.setAttribute('data-' + key, data[key]);
        }
    }
    $('.dashing-knob').knob();
};