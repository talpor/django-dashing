/* global Dashboard */

Dashing.widgets.List = function (dashboard) {
    var self = this,
        widget;
    this.__init__ = Dashing.utils.widgetInit(dashboard, 'list');
    this.row = 2;
    this.col = 1;
    this.data = {};
    this.getWidget = function () {
        return widget;
    };
    this.getData = function () {};
    this.interval = 10000;
};
