/* global $, rivets, Dashing, Dashboard */

Dashing.widgets.Number = function(dashboard) {
    var self = this,
        widget;
    this.__init__ = Dashing.utils.widgetInit(dashboard, 'number');
    this.row = 1;
    this.col = 1;
    this.color = '#96bf48';
    this.data = {};
    this.getWidget = function () {
        return widget;
    };
    this.getData = function () {};
    this.interval = 1000;
};
