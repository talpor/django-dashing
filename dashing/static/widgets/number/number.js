/* global Dashing */

Dashing.widgets.Number = function(dashboard) {
    var self = this,
        widget;
    self.__init__ = Dashing.utils.widgetInit(dashboard, 'number');
    self.row = 1;
    self.col = 1;
    self.color = '#96bf48';
    self.data = {};
    self.getWidget = function () {
        return widget;
    };
    self.getData = function () {};
    self.interval = 1000;
};
