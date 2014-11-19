/* global Dashing, Rickshaw */

Dashing.widgets.Graph = function (dashboard) {
    var self = this,
        widget;
    this.__init__ =  Dashing.utils.widgetInit(dashboard, 'graph');
    this.row = 1;
    this.col = 2;
    this.data = {};
    this.getWidget = function () {
        return widget;
    };
    this.getData = function () {};
    this.interval = 3000;
};

rivets.binders['dashing-graph'] = function(el, data) {
    var container = el.parentNode, id, graph, xAxis, yAxis;
    if (/rickshaw_graph/.test(container.className)) {
        graph = window[container.dataset.id]
        graph.series[0].data = data;
        graph.update();
        return;
    }
    id = 'graph' + data._rv;
    graph = new Rickshaw.Graph({
        element: container, 
        width: container.width, 
        height: container.height, 
        series: [{
            color: '#fff',
            data: data
        }]
    });
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
    window[id] = graph;
    container.dataset.id = id;
}
