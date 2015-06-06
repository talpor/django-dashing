/* global $, rivets, Dashing, Dashboard */

Dashing.widgets.Knob = function(dashboard) {
    var self = this,
        widget;
    this.__init__ = Dashing.utils.widgetInit(dashboard, 'knob');
    this.row = 1;
    this.col = 1;
    this.scope = {};
    this.getWidget = function () {
        return widget;
    };
    this.getData = function () {};
    this.interval = 10000;
};

rivets.id = 0;
rivets.getId = function() {
    var o = rivets.prefix + rivets.id;
    rivets.id++;
    return o;
};

rivets.binders['dashing-knob'] = function(el, data) {
    if (!data) return;
    el.id = rivets.getId();

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            // workaround as knob.js needs camel case data attributes
            el.setAttribute('data-' + key, data[key]);
        }
    }
    $('.dashing-knob').knob();
};