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

rivets.id = 0;
rivets.getId = function() {
    var o = rivets.prefix + rivets.id;
    rivets.id++;
    return o;
};

rivets.binders['dashing-graph'] = function(el, data) {
    var container = el.parentNode, id, graph, xAxis, yAxis;
    if (!data) return;
    if (data.beforeRender) data.beforeRender();
    if (/rickshaw_graph/.test(container.className)) {
        graph = window[container.dataset.id]
        graph.series[0].data = data;
        graph.update();
        return;
    }
    id = rivets.getId();
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

    xAxis = new Rickshaw.Graph.Axis.X({
        graph: graph,
        tickFormat: data.xFormat || Rickshaw.Fixtures.Number.formatKMBT
    });
    yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: data.yFormat || Rickshaw.Fixtures.Number.formatKMBT
    });
    xAxis.render();
    yAxis.render();
    if (data.afterRender) data.afterRender();
    window[id] = graph;
    container.dataset.id = id;
}
