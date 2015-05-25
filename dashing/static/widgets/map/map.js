/* global Dashing, $, rivets, google, MarkerClusterer */

Dashing.widgets.Map = function(dashboard) {
    var self = this,
        loadMapLibs = function() {
            var gmScript = document.createElement('script'),
                markerLib = document.createElement('script');
            gmScript.type = markerLib.type = 'text/javascript';
            gmScript.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
                           '&callback=googleMapsLoaded';
            markerLib.src = 'https://cdn.rawgit.com/googlemaps/js-marker-' +
                            'clusterer/gh-pages/src/markerclusterer_compiled.js';

            window.googleMapsLoaded = function() {
                $(document).trigger('load/google-maps');
            };
            document.body.appendChild(gmScript);
            $(document).on('load/google-maps', function() {
                document.body.appendChild(markerLib);
                (function jsMarkerClustererLoaded() {
                    if (window.MarkerClusterer === undefined) {
                        setTimeout(jsMarkerClustererLoaded, 100);
                    }
                    else {
                        $(document).trigger('load/js-marker-clusterer');
                    }
                }());
            });
        };

    self.__init__ = function() {
        Dashing.utils.widgetInit(dashboard, 'map').call(self);
        loadMapLibs();
    };
    self.row = 2;
    self.col = 1;
    self.color = '#96bf48';
    self.scope = {};
    self.getWidget = function () {
        return self.widget;
    };
    self.getData = function () {};
    self.interval = 0;
};


rivets.binders['dashing-map'] = {
    bind: function(el) {
        var container = $(el).parent(),
            self = this;
        $(el).css({
            width: container.css('width'),
            height: container.css('height')

        });
        $(document).on('load/js-marker-clusterer', function() {
            self.binder.routine.call(self, el, self.model.map);
        });
    },
    routine: function(el, data) {
        if (!window.google || !window.MarkerClusterer) return;
        var options = {
                zoom: 8,
                center: new google.maps.LatLng(0, 0),
                disableDefaultUI: true,
                disableDoubleClickZoom: true,
                draggable: false,
                scrollwheel: false
            }, map, mc, lat, lng;

        if (window['map' + this.model._rv]) {
            map = window['map' + this.model._rv].map;
            mc = window['map' + this.model._rv].mc;
        }
        else {
            map = new google.maps.Map(el, options);
            mc = new MarkerClusterer(map, [], {gridSize: 50, maxZoom: 15});
            window['map' + this.model._rv] = {map: map, mc: mc};
        }

        if (data.center && (data.center.lat != map.getCenter().lat() ||
                            data.center.lng != map.getCenter().lng())) {
            lat = Number(data.center.lat);
            lng = Number(data.center.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                map.setCenter(new google.maps.LatLng(lat, lng));
            }
        }
        mc.clearMarkers();
        if (data.markers) {
            data.markers.forEach(function(pos) {
                var lat = Number(pos.lat), lng = Number(pos.lng);
                if (isNaN(lat) || isNaN(lng)) return;

                mc.addMarker(new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    title: pos.title || ''
                }));

            });
        }
    }
};
