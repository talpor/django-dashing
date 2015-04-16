/* global Dashing */

Dashing.widgets.List = function (dashboard) {
    var self = this,
        widget;
    self.__init__ = Dashing.utils.widgetInit(dashboard, 'list');
    self.row = 2;
    self.col = 1;
    self.scope = {};
    self.getWidget = function () {
        return widget;
    };
    self.getData = function () {};
    self.interval = 10000;
};
