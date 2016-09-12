/* global $, rivets, setInterval, alert, DASHING_STATIC */

(function(global, console) {
    var Dashboard, Dashing, DashboardSet,
        scope = {grids: [], toggleOverlay: function() {}};
    Dashing = {
        resources: {
            d3: DASHING_STATIC + 'libs/d3/d3.min.js',
            rickshaw: DASHING_STATIC + 'libs/rickshaw/rickshaw.min.js',
            jqueryKnob: DASHING_STATIC + 'libs/jquery-knob/jquery.knob.min.js',
            googleMaps: {
                Loader: function() {
                    this.on = function(id, func) {
                        $(document).on('googleMaps/' + id, function(e, args) {
                            func.apply(this, args);
                        });
                    };
                    this.publish = function(id, args) {
                        $(document).trigger('googleMaps/' + id, args);
                    };
                    this.load = function() {
                        var self = this,
                            googleMapsScript = document.createElement('script');
                        googleMapsScript.type = 'text/javascript';
                        googleMapsScript.src = 'https://maps.googleapis.com/maps/api/js' +
                                               '?v=3.exp&callback=__googlemapscallbackfunc__' +
                                               '&key=' + GOOGLE_MAPS_API_KEY;
                        window.__googlemapscallbackfunc__ = function() {
                            self.publish('complete');
                        };
                        document.body.appendChild(googleMapsScript);
                    };
                },
            },
            markerClusterer: DASHING_STATIC + 'libs/markerclusterer/markerclusterer.min.js'
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
                        goToDashboard(model.dashboard);
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
                            setRolling(seconds*1000);
                            scope.showingOverlay =
                            scope.rollingMenu.showing = false;
                        }
                    };
                }
                global.onhashchange = function() {
                    var opt = /\?roll\=(\d+)/.exec(location.hash), interval;
                    // show active dashboard
                    scope.dashboards.some(function(dashboard) {
                        if (location.hash.match('#/' + dashboard.slug + '/')) {
                            // this automatically changes all other active
                            // properties in scope.grids elements to false
                            dashboard.grid.active = true;
                            return true;
                        }
                    });
                    // set rolling if it is necessary
                    interval = opt ? Number(opt[1]) : 0;
                    if (isNaN(interval)) return;
                    clearInterval(global.rollingInterval);
                    if (interval === 0) return;
                    global.rollingInterval = setInterval(function() {
                        // go to next dashboard
                        var len = scope.dashboards.length,
                            isPreviousActive = function(d, index) {
                                var previous = index === 0 ? len - 1 : index - 1;
                                return scope.dashboards[previous].grid.active;
                            },
                            nextDashboard = $.grep(scope.dashboards, isPreviousActive)[0];
                        goToDashboard(nextDashboard);
                    }, interval);
                };
            },
            setRolling = function(ms) {
                var lhash = /(\#\/.+\/).*/.exec(location.hash) || [null, ''];
                location.hash = lhash[1] + '?roll=' + ms;
            },
            goToDashboard = function(dashboard) {
                var lhash = /.+(\?roll\=\d+)/.exec(location.hash) || [null, ''];
                location.hash = '#/' + dashboard.slug + '/' + lhash[1];
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
        this.getDashboards = function() {
            return scope.dashboards;
        };
        init();
    };
    Dashboard = function (options) {
        'use strict';
        var self = this,
            init = function () {
                var expectedPath = self.slug ? '#/' + self.slug + '/' : null;
                self.grid = {
                    width: options.viewportWidth,
                    height: options.viewportHeight,
                    widgetMargins: options.widgetMargins,
                    widgetBaseDimensions: options.widgetBaseDimensions,
                    active: !Boolean(expectedPath),
                    siblings: function() {
                        return scope.grids.filter(function(grid) {
                            return grid._rv !== self.grid._rv;
                        });
                    }
                };
                scope.grids.push(self.grid);

                if (expectedPath) {
                    if (location.hash === '') {
                        location.hash = expectedPath;
                    }
                    else if (location.hash.match(expectedPath)) {
                        // wait until it is added
                        setTimeout(global.onhashchange);
                    }
                }
                self.widgets = {};
                for (var key in Dashing.widgets) {
                    self.widgets[key] = Dashing.widgets[key];
                }
            },
            urlify = function(text) {
                return encodeURIComponent(text.toLowerCase()
                                              .replace(/\s+/g,'-')
                                              .replace(/[^\w-]+/g,''));
            },
            widgetSet = [];
        options = options || {};
        this.name = options.name || 'unnamed';
        this.slug = options.name ? urlify(options.name) : undefined;
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

            widgetSet.push({
                name: name,
                type: type,
                widget: widget
            });

            self.subscribe(name + '/getData', widget.getData.bind(widget));
            self.publish(name + '/getData');


            widget.interval = Number(widget.interval);
            if (isNaN(widget.interval) || widget.interval === 0) return;
            setInterval(self.publish.bind(null, name + '/getData'),
                        widget.interval || 1000);

        };
        this.getWidgets = function() {
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
            width: grid.width ? grid.width + 'px' : window.innerWidth + 'px',
            height: grid.height ? grid.height + 'px' : window.innerHeight + 'px',
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
})(window, window.console || {warn: alert.bind(null), error: alert.bind(null)});
