/* global $, rivets, setInterval, console, alert */
/* exported Dashboard, DashboardSet */

var Dashing = {
        utils: {
            loadTemplate: function(name, callback) {
                var src = $('link[rel=resource][data-widget=' + name + ']').attr('href');
                return $('<li class="widget widget-' + name + '">').load(src, callback); 
            },
            widgetInit: function(dashboard, widgetName) {
                'use strict';
                /* jshint camelcase: false, unused: false */
                return function() {
                    var self = this,
                        template = Dashing.utils.loadTemplate(widgetName, function() {
                            rivets.bind(template, {data: self.data});
                        }),
                        widget = dashboard.grid.add_widget(
                            template,
                            self.col,
                            self.row);
                };
            }
        },
        widgets: {}
    },
    DashboardSet = function() {
        'use strict';
        var self = this,
            app = $('#app'),
            scope = {
                dashboards: [],
                swapDashboard: function(e, el) {
                    var name = el.dashboard.name,
                        dash = self.getDashboard(name);
                        $('.gridster:visible').hide(function() {
                            dash.show();
                            scope.showingOverlay = false;
                        });
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
            },
            init = function() {
                rivets.bind(app, scope);
            },
            setupRolling = function() {
                var set = scope.dashboards, parameterValue, interval;
                if (set.length > 1) {
                    parameterValue = getUrlParameter('roll');
                    if (parameterValue !== null) {
                        interval = parseInt(parameterValue);
                        if (isNaN(interval)) {
                            console.warn('roll parameter must be a number');
                            return;
                        }
                        setInterval(function() {switchDashboards()}, interval);
                    }
                }
            },
            switchDashboards = function() {
                var set = scope.dashboards,
                    currentDashboardId = set.map(function(e) {
                        return e.name;
                    }).indexOf(activeDashboardName),
                    nextDashboardId = currentDashboardId + 1 ==
                                        set.length ? 0 : currentDashboardId + 1,
                    newDashboardName = set[nextDashboardId].name;
                self.getDashboard(activeDashboardName).hide(function() {
                    self.getDashboard(newDashboardName).show();
                    activeDashboardName = newDashboardName;
                });
            },
            getUrlParameter = function(name) {
                name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
                var regexS = '[\\?&]' + name + '=([^&#]*)',
                    regex = new RegExp( regexS ),
                    results = regex.exec( window.location.href );
                return (results === null) ? null : results[1];
            },
            activeDashboardName = '',
            timeoutForDashboardsSet = null;
        this.addDashboard = function(name, options) {
            var set = scope.dashboards, dash;
            if (!name || typeof name !== 'string') {
                console.warn('You need to specify a name for the dashboard ' +
                             'and it must be a string');
                return;
            }
            options = options || {};
            options.name = name;
            options.hidden = Boolean(set.length);
            dash = new Dashboard(options);

            set.push(dash);
            if (timeoutForDashboardsSet !== null) {
                clearTimeout(timeoutForDashboardsSet);
            }
            timeoutForDashboardsSet = setTimeout(setupRolling, 1000);
            if (set.length === 1) activeDashboardName = name;
            return dash;
        };
        this.getDashboard = function(name) {
            var set = scope.dashboards;
            for (var i=0; i<set.length; i++) {
                if (set[i].hasOwnProperty('name') && set[i].name === name)
                    return set[i];
            }
        };
        init();
    },
    Dashboard = function (options) {
        'use strict';
        /* jshint camelcase: false */
        var self = this,
            init = function () {
                options = options || {};
                var $wrapper = $('<div class="gridster"><ul></ul></div>');
                if (!options.hidden) {
                    $wrapper.css('display', 'block');
                }
                $wrapper.css({
                    width: options.viewportWidth ? options.viewportWidth +
                                                'px' : $(window).width() + 'px',
                    height: options.viewportHeight ? +
                        options.viewportWidth + 'px' : $(window).height() + 'px'
                });
                
                self.grid = $wrapper.find('ul').gridster({
                    widget_margins: options.widgetMargins || [5, 5],
                    widget_base_dimensions: options.widgetBaseDimensions || [370, 340]
                }).data('gridster');
                
                $(options.selector || '#container').append($wrapper);

                self.widgets = {};
                for (var key in Dashing.widgets) {
                    self.widgets[key] = Dashing.widgets[key];
                }
            },
            widgetSet = [];
        this.name = options ? options.name : 'unnamed';
        this.show = function(func) {
            self.grid.$wrapper.fadeIn(func);
        };
        this.hide = function(func) {
            self.grid.$wrapper.fadeOut(func);
        };
        this.grid = undefined;
        this.addWidget = function (name, type, options) {
            var widget;

            if (self.widgets && self.widgets[type]) {
                widget = new self.widgets[type](self);
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
            setInterval(function () {
                self.publish(name + '/getData');
            }, widget.interval || 1000);
        };
        this.listWidgets = function() {
            return widgetSet;
        };
        this.subscribe = function(id, func) {
            $(document).on(id, function(e, args){
                func.apply(this, args);
            });
        };
        this.publish = function(id, args) {
            $(document).trigger(id, args);
        };
        init();
    };

// rivets formatters
rivets.binders.fade = function(el, value) {
    /* jshint -W030 */
    value ? $(el).fadeIn() : $(el).fadeOut();
};

// polyfill
(function(global) {
    var alrt = alert.bind(null);
    global.console = global.console || {warn: alrt, error: alrt};
}(window));
