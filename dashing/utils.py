from django.urls import path, re_path
from .views import Dashboard


class Router(object):
    def __init__(self):
        self.registry = []

    def register(self, widget, basename, **parameters):
        """ Register a widget, URL basename and any optional URL parameters.

        Parameters are passed as keyword arguments, i.e.
            >>> router.register(MyWidget, 'mywidget', my_parameter="[A-Z0-9]+")

        This would be the equivalent of manually adding the following
        to urlpatterns:
            >>> re_path(r"^widgets/mywidget/(P<my_parameter>[A-Z0-9]+)/?",
                                         MyWidget.as_view(), "widget_mywidget")

        """
        self.registry.append((widget, basename, parameters))

    def get_urls(self):
        urlpatterns = [
            path('', Dashboard.as_view(), name='dashboard'),
        ]

        for widget, basename, parameters in self.registry:
            urlpatterns += [
                re_path(r'/'.join((
                    r'^widgets/{}'.format(basename),
                    r'/'.join((r'(?P<{}>{})'.format(parameter, regex)
                               for parameter, regex in parameters.items())),
                )),
                    widget.as_view(),
                    name='widget_{}'.format(basename)),
            ]

        return urlpatterns

    @property
    def urls(self):
        return self.get_urls()


router = Router()
