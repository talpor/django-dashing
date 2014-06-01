/*global $, document, setInterval*/
var Dashboard = function () {
    this.grid = undefined;
    this.__widgets__ = [];
    this.__init__ = function (options) {
        var self = this;
        options = options || {};
        
        self.grid = $(options.selector || ".gridster ul").gridster({
            widget_margins: options.widget_margins || [5, 5],
            widget_base_dimensions: options.widget_base_dimensions || [370, 340]
        }).data('gridster');
        
        this.widgets = {};
        for (var key in Dashboard.widgets) {
            this.widgets[key] = Dashboard.widgets[key];
        }
    };
    this.add_widget = function (name, type, options) {
        var self = this, widget;
        
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
        
        self.__widgets__.push({
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
    this.list_widgets = function() {
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
    this.__init__();
};

Dashboard.widgets = {};
