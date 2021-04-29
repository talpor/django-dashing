/* global $, Dashing, Rickshaw, rivets */

Dashing.widgets.Graph = function (dashboard) {
    var self = this;
    self.__init__ = Dashing.utils.widgetInit(dashboard, 'graph', {
        require: ['d3', 'rickshaw']
    });
    self.row = 1;
    self.col = 2;
    self.scope = {};
    self.getWidget = function () {
        return this.__widget__;
    };
    self.getData = function () { };
    self.interval = 3000;
};

rivets.binders['dashing-graph'] = function binder(el, data) {
    if (!data) return;
    if (!window.Rickshaw) {
        $(document).on('libs/rickshaw/loaded',
            binder.bind(this, el, data));
        return;
    }

    var defaultHoverFormatter = function (series, x, y) {
        var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
        var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
        //var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
        var content = swatch + "count" + ": " + parseInt(y) + '<br>' + date;
        return content;
    }

    var container = el.parentNode, id, graph, xAxis, yAxis,
        // added `|| data.whatever` for backward compatibility
        beforeRender = this.model.beforeRender || data.beforeRender,
        afterRender = this.model.afterRender || data.afterRender,
        xFormat = this.model.xFormat || data.xFormat,
        yFormat = this.model.yFormat || data.yFormat,
        properties = this.model.properties || {},
        yAxisType = this.model.yAxisType || 1, //Display Axis.Y default format Number
        xAxisType = this.model.xAxisType || 1, //Display Axis.X default format Number
        hoverFormatter = this.model.hoverFormatter || defaultHoverFormatter;

    if (!$(container).is(':visible')) return;
    if (beforeRender) beforeRender();
    if (/rickshaw_graph/.test(container.className)) {
        graph = window[container.dataset.id];
        graph.series[0].data = data;
        graph.update();
        return;
    }
    id = Dashing.utils.getId();
    graph = new Rickshaw.Graph({
        element: container,
        width: container.width,
        height: container.height,
        series: [{
            color: '#fff',
            data: data
        }]
    });
    graph.configure(properties);
    graph.render();

    data.hoverFormatter = hoverFormatter

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        formatter: data.hoverFormatter
        //xFormatter: function(x) { return x + "seconds" },
        //yFormatter: function(y) { return Math.floor(y) + " percent" }
    });
    //var time = new Rickshaw.Fixtures.Time();
    //var days = time.unit('day');
    //xAxis = new Rickshaw.Graph.Axis.Time( { graph: graph, timeUnit: days } );
    if (xAxisType) {
        xAxis = new Rickshaw.Graph.Axis.X({
            graph: graph,
            tickFormat: xFormat || Rickshaw.Fixtures.Number.formatKMBT
        });
    } else {
        xAxis = new Rickshaw.Graph.Axis.Time({ graph: graph });
    }

    if (yAxisType) {
        yAxis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            tickFormat: yFormat || Rickshaw.Fixtures.Number.formatKMBT
        });
    } else {
        yAxis = new Rickshaw.Graph.Axis.Time({ graph: graph });
    }

    xAxis.render();
    yAxis.render();
    if (afterRender) afterRender();
    window[id] = graph;
    container.dataset.id = id;
};
