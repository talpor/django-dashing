/* global $, rivets, setInterval, alert */

(function(global, console) {
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
                                console.warn(['the widget',
                                              widgetName,
                                              'should be updated to the new',
                                              'naming pattern to be 0.3.x',
                                              'compatible, see http://bit.ly/1dUN4GY'].join(' '));
                            }
                        });
                    if (self.color) template.css('background-color', self.color);
                    dashboard.grid.api.add_widget(template, self.col, self.row);
                };
            },
            get: function(name, options) {
                var success = null;
                options = options || {};
                if (global.dashingUrlBlacklist && global.dashingUrlBlacklist.indexOf(name) !== -1) {
                    return;
                }
                if (options instanceof Function) {
                    success = options;
                    options = {};
                }
                $.ajax(
                    $.extend({
                        url: [location.origin, location.pathname,
                              'widgets/', name].join(''),
                        method: 'GET',
                        success: success,
                        error: function(jqxhr) {
                            if (jqxhr.status === 404) {
                                var msg = 'does not exists a widget registered with the name `' +
                                          name + '` check http://django-dashing.readthedocs.org' +
                                          '/en/latest/getting-started.html#python-widget-classes';
                                global.dashingUrlBlacklist = global.dashingUrlBlacklist ? 
                                        global.dashingUrlBlacklist.push(name) : [name];
                                throw new Error(msg);
                            }
                        }
                    }, options)
                );
            },
            urlify: function(text) {
                return encodeURIComponent(text.toLowerCase()
                                              .replace(/\s+/g,'-')
                                              .replace(/[^\w-]+/g,''));
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
            widgetSet = [];
        options = options || {};
        this.name = options.name || 'unnamed';
        this.slug = options.name ? Dashing.utils.urlify(options.name) : undefined;
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
                        if (!global['warning_' + name]) {
                            console.warn(['the widget', name,
                                          'should be updated to the new',
                                          'naming pattern to be 0.3.x',
                                          'compatible, see http://bit.ly/1zTKOd3'].join(' '));
                        }
                        global['warning_' + name] = true;
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
})(window, window.console || {warn: alert.bind(null), error: alert.bind(null)});
