/* global Dashing, $ */

Dashing.widgets.Clock = function(dashboard) {
    var widget;
    this.__init__ = Dashing.utils.widgetInit(dashboard, 'clock');
    this.row = 1;
    this.col = 1;
    this.data = {};
    this.getWidget = function () {
        return widget;
    };
    this.getData = function () {
        var self = this,
            formatTime = function(i) {
                return i < 10 ?  '0' + i : i;
            },
            today = new Date(),
            h = today.getHours(),
            m = today.getMinutes(),
            s = today.getSeconds();

        $.extend(self.data, {
            time: h + ':' + formatTime(m) + ':' + formatTime(s),
            date: today.toDateString()
        });
    };
    this.interval = 500;
};
