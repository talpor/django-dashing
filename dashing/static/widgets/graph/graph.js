/*global $, Dashboard, Rickshaw*/
Dashboard.widgets.Graph = function (dashboard) {
    this.row = 1;
    this.col = 2;
    this.__widget__ = undefined;
    this.__init__ = function () {
        var self = this,
            html = $('#templates').find('.widget-graph').clone();
        self.__widget__ = dashboard.grid.add_widget(
            html,
            self.col,
            self.row);
    };
    this.render = function () {
        var self = this,
            graph = self.getWidget();

        graph.find('.title').text(self.data.title);
        graph.find('.value').text(self.data.value);
        graph.find('.more-info').text(self.data.more_info);

        if (!graph.find('svg').length) {
            self.renderGraph(graph, self.data);
        }
    };
    this.renderGraph = function (container) {
        var self = this,
            graph = new Rickshaw.Graph({
                element: container[0], 
                width: container.width(), 
                height: container.height(), 
                series: [{
                    color: '#fff',
                    data: self.data.data
                }]
            }), xAxis, yAxis;
        graph.render();

        xAxis = new Rickshaw.Graph.Axis.Time({
            graph: graph
        });
        yAxis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT
        });

        xAxis.render();
        yAxis.render();
    };
    this.data = {};
    this.getWidget = function () {
        return this.__widget__;
    };
    this.getData = function () {};
    this.interval = 1000;
    this.__init__();
};
