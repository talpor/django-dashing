/* global Dashing, $, rivets, google */

Dashing.widgets.Map = function(dashboard) {
    var self = this;
    self.__init__ = function() {
        var gmScript = document.createElement('script'),
            init = Dashing.utils.widgetInit(dashboard, 'map');
        gmScript.type = 'text/javascript';
        gmScript.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
                       '&callback=googleMapsLoaded';
        if (window.googleMapsLoaded === undefined) {
            window.googleMapsLoaded = function() {
                $(document).trigger('googleMapsLoaded');
            };
            document.body.appendChild(gmScript);
        }
        $(document).on('googleMapsLoaded', init.bind(self));
    };
    self.row = 2;
    self.col = 1;
    self.color = '#96bf48';
    self.scope = {
        initialized: false
    };
    self.getWidget = function () {
        return self.widget;
    };
    self.getData = function () {};
    self.interval = 0;
};


rivets.binders['dashing-map'] = {
    bind: function(el) {
        var container = $(el).parent();
        $(el).css({
            width: container.css('width'),
            height: container.css('height')

        });

        window['map' + this.model._rv] = new google.maps.Map(el, {
            zoom: 8,
            center: new google.maps.LatLng(0, 0),
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            draggable: false,
            scrollwheel: false
        });
    },
    routine: function(el, data) {
        var map = window['map' + this.model._rv],
            updateCenter = function() {
                console.log('setCenter');
                var pos = new google.maps.LatLng(data.latitude, data.longitude);
                map.setCenter(pos);
            };
        this.observe(data, 'latitude', updateCenter);
        this.observe(data, 'longitude', updateCenter);

        if (!this.model.initialized) {
            updateCenter();
            data.initialized = true;
        }
    }
};
