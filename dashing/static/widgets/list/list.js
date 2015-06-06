/* global Dashing */

Dashing.widgets.List = function (dashboard) {
    var self = this;
    self.__init__ = Dashing.utils.widgetInit(dashboard, 'list');
    self.row = 2;
    self.col = 1;
    self.scope = {};
    self.getWidget = function () {
        return this.__widget__;
    };
    self.getData = function () {};
    self.interval = 10000;
};
