/* global $, rivets, setInterval, alert, utils */

(function(global, console, getUrlParameter, insertUrlParam) {
    var Dashboard, Dashing, DashboardSet,
        scope = {grids: [], toggleOverlay: function() {}};
    Dashing = {
        utils: {
            loadTemplate: function(name, callback) {
                var src = $('link[rel=resource][data-widget=' + name + ']').attr('href');
                return $('<li class="widget widget-' + name + '">').load(src, callback); 
            },
            widgetInit: function(dashboard, widgetName) {
                'use strict';
                /* jshint camelcase: false */
                return function() {
                    var self = this,
                        template = Dashing.utils.loadTemplate(widgetName, function() {
                            if (self.scope) {
                                rivets.bind(template, self.scope);
                            }
                            else {
                                /* backward compatibility for old widget pattern */
                                rivets.bind(template, {data: self.data});
                            }
                        });
                    dashboard.grid.api.add_widget(template, self.col, self.row);
                };
            }
        },
        widgets: {}
    };
    DashboardSet = function(options) {
        'use strict';
        var init = function() {
                $.extend(scope, {
                    dashboards: [],
                    actions: [],
                    swapDashboard: function(e, model) {
                        // this automatically change all another active
                        // properties in scope.grids elements to false
                        model.dashboard.grid.active = true;
                        scope.showingOverlay = false;
                    },
                    hideOverlay: function(e) {
                        if (e.target.className === e.currentTarget.className) {
                            scope.showingOverlay = false;
                        }
                    },
                    toggleOverlay: function(e) {
                        if (e.which == 17) {
                            scope.showingOverlay = !scope.showingOverlay;
                        }
                    }
                });
                if (options && options.rollingChoices) {
                    scope.rollingMenu = {
                        showing: false,
                        toggle: function() {
                            scope.rollingMenu.showing = !scope.rollingMenu.showing;
                        },
                        set: function(e) {
                            if (!e) return;
                            var seconds = Number(e.target.dataset.time);
                            if (isNaN(seconds)) return;
                            setupRolling(seconds*1000);
                            insertUrlParam('roll', seconds*1000);
                            scope.showingOverlay =
                            scope.rollingMenu.showing = false;
                        }
                    };
                }
                setupRolling();
            },
            setupRolling = function(interval) {
                var parameterValue = getUrlParameter('roll');
                if (interval !== undefined || parameterValue !== null) {
                    interval = interval !== undefined ?
                               Number(interval) : Number(parameterValue);
                    if (isNaN(interval)) {
                        console.warn('roll parameter must be a number');
                        return;
                    }
                    clearInterval(global.rollingInterval);
                    if (interval !== 0) {
                        global.rollingInterval = setInterval(function() {
                            switchDashboards();
                        }, interval);
                    }
                }
            },
            switchDashboards = function() {
                var nextStatus = false, tmp;
                scope.dashboards.forEach(function(dashboard) {
                    tmp = dashboard.grid.active;
                    dashboard.grid.active = nextStatus;
                    nextStatus = tmp;
                });
                if (nextStatus) scope.dashboards[0].grid.active = nextStatus;
            };
        this.addDashboard = function(name, options) {
            var dash;
            if (!name || typeof name !== 'string') {
                console.warn('You need to specify a name for the dashboard ' +
                             'and it must be a string');
                return;
            }
            options = options || {};
            options.name = name;
            dash = new Dashboard(options);

            scope.dashboards.push(dash);
            return dash;
        };
        this.addAction = function(name, func, obj) {
            if (typeof func !== 'function' ||
                typeof name !== 'string') return;
            scope.actions.push($.extend({
                name: name,
                func: func
            }, obj || {}));
        };
        this.getDashboard = function(name) {
            var set = scope.dashboards;
            for (var i=0; i<set.length; i++) {
                if (set[i].hasOwnProperty('name') && set[i].name === name) {
                    return set[i];
                }
            }
        };
        init();
    };
    Dashboard = function (options) {
        'use strict';
        var self = this,
            init = function () {
                options = options || {};
                self.grid = {
                    width: options.viewportWidth,
                    height: options.viewportHeight,
                    widgetMargins: options.widgetMargins,
                    widgetBaseDimensions: options.widgetBaseDimensions,
                    active: options.active,
                    siblings: function() {
                        return scope.grids.filter(function(grid) {
                            return grid._rv !== self.grid._rv;
                        });
                    }
                };
                scope.grids.push(self.grid);

                // show if is the fist dashboard added
                if (scope.grids.length === 1) scope.grids[0].active = true;

                self.widgets = {};
                for (var key in Dashing.widgets) {
                    self.widgets[key] = Dashing.widgets[key];
                }
            },
            widgetSet = [];
        this.name = options ? options.name : 'unnamed';
        this.show = function() {
            self.grid.active = true;
        };
        this.hide = function() {
            self.grid.active = false;
        };
        this.grid = undefined;
        this.activeWidgets = [];
        this.addWidget = function (name, type, options) {
            var widget;

            if (self.widgets && self.widgets[type]) {
                widget = new self.widgets[type](self);
                this.activeWidgets.push(widget);
            }
            else {
                console.error('widget ' + type + ' does not exist');
                return;
            }

            $.extend(widget, options);
            if (widget.__init__) widget.__init__();

            /* backward compatibility for old widget pattern */
            if (widget.scope && !widget.data) {
                Object.defineProperty(widget, 'data', {
                    get: function() {
                        return this.scope;
                    }
                });
            }

            widgetSet.push({
                name: name,
                type: type,
                widget: widget
            });

            self.subscribe(name + '/getData', widget.getData.bind(widget));
            self.publish(name + '/getData');

            setInterval(self.publish.bind(null, name + '/getData'),
                        widget.interval || 1000);

        };
        this.listWidgets = function() {
            return widgetSet;
        };
        this.subscribe = function(id, func) {
            self.grid.api.$wrapper.on(id, function(e, args){
                func.apply(this, args);
            });
        };
        this.publish = function(id, args) {
            self.grid.api.$wrapper.trigger(id, args);
        };
        init();
    };
    rivets.binders.gridsterify = function(el, grid) {
        /* jshint camelcase: false */
        $(el).css({
            width: grid.width ? grid.width + 'px' : $(window).width() + 'px',
            height: grid.height ? grid.height + 'px' : $(window).height() + 'px',
        });
        grid.api = $(el).find('ul').gridster({
            widget_margins: grid.widgetMargins || [5, 5],
            widget_base_dimensions: grid.widgetBaseDimensions || [370, 340]
        }).data('gridster');

        this.observe(grid, 'active', function() {
            if (grid.active) {
                grid.siblings().forEach(function(sibling) {
                    sibling.active = false;
                });
            }
            grid.api.$wrapper.trigger(grid.active ? 'shown' : 'hidden');
        });
    };
    rivets.bind($('#app'), scope);

    global.Dashing = Dashing;
    global.Dashboard = Dashboard;
    global.DashboardSet = DashboardSet;
    global.scope = scope;
})(window, window.console || {warn: alert.bind(null), error: alert.bind(null)},
   utils.getUrlParameter, utils.insertUrlParam);
