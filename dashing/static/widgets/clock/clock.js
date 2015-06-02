/* global Dashing, $ */

Dashing.widgets.Clock = function(dashboard) {
    this.__init__ = Dashing.utils.widgetInit(dashboard, 'clock');
    this.row = 1;
    this.col = 1;
    this.scope = {};
    this.getWidget = function () {
        return this.__widget__;
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

        $.extend(self.scope, {
            time: h + ':' + formatTime(m) + ':' + formatTime(s),
            date: today.toDateString()
        });
    };
    this.interval = 500;
};
