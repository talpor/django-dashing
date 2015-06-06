/* global Dashing */

Dashing.widgets.Number = function(dashboard) {
    var self = this;
    self.__init__ = Dashing.utils.widgetInit(dashboard, 'number');
    self.row = 1;
    self.col = 1;
    self.color = '#96bf48';
    self.scope = {};
    self.getWidget = function () {
        return this.__widget__;
    };
    self.getData = function () {};
    self.interval = 1000;
};
