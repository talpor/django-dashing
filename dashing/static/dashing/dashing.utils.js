/* global $, rivets, console, createjs */

(function(global, Dashing) {
    Dashing.utils = {
        loadTemplate: function(name, callback) {
            var src = $('link[rel=resource][data-widget=' + name + ']').attr('href');
            return $('<li class="widget widget-' + name + '">').load(src, callback); 
        },
        widgetInit: function(dashboard, widgetName, options) {
            'use strict';
            /* jshint camelcase: false */
            return function() {
                var self = this,
                    template = Dashing.utils.loadTemplate(widgetName, function() {
                        if (self.scope) {
                            rivets.bind(template, self.scope);
                        }
                        else {
                            console.warn(['the widget',
                                          widgetName,
                                          'should be updated to the new',
                                          'naming pattern to be 0.3.x',
                                          'compatible, see http://bit.ly/1dUN4GY'].join(' '));
                        }
                    });
                if (self.color) template.css('background-color', self.color);
                self.__widget__ = dashboard.grid.api.add_widget(
                                                template, self.col, self.row);
                options = options || {};
                if (!options.require) return;

                (function loadResource(name) {
                    if (!name) return;
                    var resource = Dashing.resources[name];
                    if (resource.loaded && options.require.length) {
                        loadResource(options.require.shift());
                        return;
                    } else if (resource.loaded) {
                        return;
                    }

                    resource.loader = resource.Loader ? new resource.Loader() :
                             new createjs.JavaScriptLoader({src: resource.src});
                    resource.loader.on('complete', function() {
                        resource.loaded = true;
                        $(document).trigger('libs/' + name + '/loaded');
                        loadResource(options.require.shift());
                    });
                    resource.loader.load();
                })(options.require.shift());

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
        getId: function() {
            if (Dashing.__id__ === undefined) {
                Dashing.__id__ = 0;
            }
            var aux = Dashing.__id__;
            Dashing.__id__++;
            return 'dh' + aux;
        },
        getVersion: function() {
            return global.__dashingversion__;
        },
        Version: global.__dashingversion__.constructor
    };
})(window, window.Dashing);

