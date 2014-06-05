/*global $, document, setInterval, window*/
/*exported Dashboard, DashboardSet*/
var DashboardSet = function() {
        var self = this,
            init = function() {
                bindEvents();
            },
            modal = {
                $el: undefined,
                show: function() {
                    this.$el.fadeIn();
                },
                hide: function() {
                    var self = this;
                    this.$el.fadeOut(function() {
                        self.$el.remove();
                        self.$el = undefined;
                    });
                },
                toggle: function() {
                    if (this.$el) {
                        this.hide();
                        return;
                    }
                    this.$el = $('<div id="confModal">');
                    for (var i in set) {
                        var box = $('<div class="box">')
                                    .attr('data-name', set[i].name)
                                    .text(set[i].name);
                        this.$el.append(box);
                    }
                    $('body').append(this.$el);
                    this.show();
                }
            },
            bindEvents = function() {
                $(document).keyup(function(e) {
                    if (e.which == 17) {
                        modal.toggle();
                    }
                });
                $(document).on('click', '#confModal .box', function() {
                    var name = $(this).attr('data-name'),
                        dash = self.getDashboard(name);
                        
                        $('.gridster:visible').hide(function() {
                            dash.show();
                            modal.hide();
                        });
                });
            },
            set = [];
        this.addDashboard = function(name, options) {
            if (!name || typeof name !== 'string') {
                console.warn('You need specify a name for the dashboard and must be a string');
                return;
            }
            options = options || {};
            options.name = name;
            options.hidden = set.length;
            var dash = new Dashboard(options);
            set.push(dash);
            return dash;
        };
        this.getDashboard = function(name) {
            for (var i in set) {
                if (set[i].name === name) {
                    return set[i];
                }
            }
        };
        init();
    },
    Dashboard = function (options) {
        var self = this,
            init = function () {
                options = options || {};
                var $wrapper = $('<div class="gridster"><ul></ul></div>');
                if (!options.hidden) {
                    $wrapper.css('display', 'block');
                }
                $wrapper.css({
                    width: options.viewport_width || $(window).width() + 'px',
                    height: options.viewport_height || $(window).height() + 'px'
                });
                
                self.grid = $wrapper.find('ul').gridster({
                    widget_margins: options.widget_margins || [5, 5],
                    widget_base_dimensions: options.widget_base_dimensions || [370, 340]
                }).data('gridster');
                
                $(options.selector || "#container").append($wrapper);
                
                /*if (!options.hidden) {
                    self.show();
                }*/
                
                self.widgets = {};
                for (var key in Dashboard.widgets) {
                    self.widgets[key] = Dashboard.widgets[key];
                }
                bindEvents();
            },
            bindEvents = function() {
                // pass
            },
            widgetSet = [];
        this.name = options ? options.name : undefined;
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
                widget.register = function register(name) {
                    // Usefull function to register event handlers with the 
                    // correct context
                    return function() {
                        register.parent[name]();
                    };
                };
                widget.register.parent = widget;
            }
            else {
                console.error('widget ' + type + ' does not exist');
                return;
            }

            $.extend(widget, options);
            if (widget.__init__) {
                widget.__init__();
            }

            widgetSet.push({
                'name': name,
                'type': type,
                'widget': widget
            });

            self.subscribe(name + '/render', widget.register('render'));
            self.subscribe(name + '/getData', widget.register('getData'));

            self.publish(name + '/getData');
            setInterval(function () {
                self.publish(name + '/getData');
            }, widget.interval || 1000);
        };
        this.listWidgets = function() {
            // raise NotImplemented
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

Dashboard.widgets = {};
