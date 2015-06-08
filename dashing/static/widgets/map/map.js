/* global Dashing, $, rivets, google, MarkerClusterer */
Dashing.widgets.Map = function(dashboard) {
    var self = this;
    self.__init__ =  Dashing.utils.widgetInit(dashboard, 'map', {
        require: ['googleMaps', 'markerClusterer']
    });
    self.row = 2;
    self.col = 1;
    self.color = '#96bf48';
    self.scope = {};
    self.getWidget = function () {
        return this.__widget__;
    };
    self.getData = function () {};
    self.interval = 0;
};

Dashing.widgets.Map.styles = {
    'black': [{'featureType':'water','elementType':'all','stylers':[{'hue':'#000000'},{'saturation':-100},{'lightness':-100},{'visibility':'simplified'}]},{'featureType':'landscape','elementType':'all','stylers':[{'hue':'#FFFFFF'},{'saturation':-100},{'lightness':100},{'visibility':'simplified'}]},{'featureType':'landscape.man_made','elementType':'all','stylers':[]},{'featureType':'landscape.natural','elementType':'all','stylers':[]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'hue':'#333333'},{'saturation':-100},{'lightness':-69},{'visibility':'simplified'}]},{'featureType':'poi.attraction','elementType':'geometry','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'off'}]},{'featureType':'administrative.locality','elementType':'geometry','stylers':[{'hue':'#ffffff'},{'saturation':0},{'lightness':100},{'visibility':'off'}]},{'featureType':'poi.government','elementType':'geometry','stylers':[{'hue':'#ffffff'},{'saturation':-100},{'lightness':100},{'visibility':'off'}]}],
    'blue': [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#46bcec'},{'visibility':'on'}]}],
    'gray': [{'featureType':'landscape','stylers':[{'saturation':-100},{'lightness':65},{'visibility':'on'}]},{'featureType':'poi','stylers':[{'saturation':-100},{'lightness':51},{'visibility':'simplified'}]},{'featureType':'road.highway','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'road.arterial','stylers':[{'saturation':-100},{'lightness':30},{'visibility':'on'}]},{'featureType':'road.local','stylers':[{'saturation':-100},{'lightness':40},{'visibility':'on'}]},{'featureType':'transit','stylers':[{'saturation':-100},{'visibility':'simplified'}]},{'featureType':'administrative.province','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':-25},{'saturation':-100}]},{'featureType':'water','elementType':'geometry','stylers':[{'hue':'#ffff00'},{'lightness':-25},{'saturation':-97}]}],
    'green': [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'administrative.locality','elementType':'labels.icon','stylers':[{'visibility':'on'},{'color':'#000000'}]},{'featureType':'administrative.land_parcel','elementType':'labels.text.stroke','stylers':[{'saturation':'-23'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#32c11f'},{'visibility':'on'}]}],
    'orange': [{'featureType':'administrative','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#000000'}]},{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'administrative','elementType':'labels.icon','stylers':[{'hue':'#ff0000'}]},{'featureType':'administrative.province','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'landscape.man_made','elementType':'labels','stylers':[{'saturation':'36'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#ff9100'},{'visibility':'on'}]}],
    'red': [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#e2231a'},{'visibility':'on'}]}],
    'white': [{'elementType':'labels','stylers':[{'visibility':'off'}]},{'elementType':'geometry','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'geometry','stylers':[{'visibility':'on'},{'color':'#000000'}]},{'featureType':'landscape','stylers':[{'color':'#ffffff'},{'visibility':'on'}]},{}],
    'yellow': [{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2f2f2'}]},{'featureType':'poi','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'all','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','elementType':'all','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'all','stylers':[{'visibility':'off'}]},{'featureType':'water','elementType':'all','stylers':[{'color':'#fdeb06'},{'visibility':'on'}]}],
};

rivets.binders['dashing-map'] = {
    bind: function(el) {
        var container = $(el).parent();
        $(el).css({
            width: container.css('width'),
            height: container.css('height')
        });
    },
    routine: function routine(el, data) {
        if (!window.MarkerClusterer) {
            $(document).on('libs/markerClusterer/loaded',
                           routine.bind(this, el, data));
            return;
        }
        var scope = this.model,
            options = {
                zoom: data.zoom || 8,
                center: new google.maps.LatLng(0, 0),
                disableDefaultUI:  !data.defaultUI || false,
                disableDoubleClickZoom: !data.doubleClickZoom || false,
                draggable: false,
                scrollwheel: false,
                styles: Dashing.widgets.Map.styles[scope.theme]
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
