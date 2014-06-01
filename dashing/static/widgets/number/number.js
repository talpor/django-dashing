/*global Dashboard, $*/
Dashboard.widgets.Number = function (dashboard) {
    this.row = 1;
    this.col = 1;
    this.__widget__ = undefined;
    this.__init__ = function () {
        var self = this,
            html = $('#templates').find('.widget-number').clone();
        self.__widget__ = dashboard.grid.add_widget(
            html,
            self.col,
            self.row);
    };
    this.render = function () {
        var self = this,
            widget = self.getWidget();
        widget.find('.value').html(self.data.value);
        widget.find('.title').text(self.data.title);
        widget.find('.change-rate').text(self.data.change_rate);
        widget.find('.more-info').text(self.data.more_info);
        widget.find('.updated-at').text(self.data.updated_at);
    };
    this.data = {};
    this.getWidget = function () {
        return this.__widget__;
    };
    this.getData = function () {};
    this.interval = 1000;
    this.__init__();
};
