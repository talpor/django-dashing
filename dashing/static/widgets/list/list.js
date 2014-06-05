/*global Dashboard, $*/
Dashboard.widgets.List = function (dashboard) {
    var self = this,
        widget;
    this.__init__ = function () {
        var html = $('#templates').find('.widget-list').clone();
        widget = dashboard.grid.add_widget(
            html,
            self.col,
            self.row);
    };
    this.row = 2;
    this.col = 1;
    this.render = function () {
        var list = self.getWidget(),
            content = '';
        
        if (self.data.data) {
            for (var i=0; i < self.data.data.length; i++) {
                for (var key in self.data.data[i]) {
                    content += '<li><span class="label">' +
                                key + '</span><span class="value">' +
                                self.data.data[i][key] + '</span></li>';
                }
            }
        }

        list.find('ul').html(content);
        list.find('.title').text(self.data.title);
        list.find('.more-info').text(self.data.more_info);
        list.find('.updated-at').text(self.data.updated_at);
    };
    this.data = {};
    this.getWidget = function () {
        return widget;
    };
    this.getData = function () {};
    this.interval = 10000;
};
