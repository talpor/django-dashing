/* global $, Dashing, Rickshaw, rivets */

Dashing.widgets.Graph = function (dashboard) {
    var self = this,
        widget;
    self.__init__ =  Dashing.utils.widgetInit(dashboard, 'graph');
    self.row = 1;
    self.col = 2;
    self.data = {};
    self.getWidget = function () {
        return widget;
    };
    self.getData = function () {};
    self.interval = 3000;
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
    if (!$(container).is(':visible')) return;
    if (data.beforeRender) data.beforeRender();
    if (/rickshaw_graph/.test(container.className)) {
        graph = window[container.dataset.id];
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
};
