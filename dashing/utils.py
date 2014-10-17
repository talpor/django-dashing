from django.conf.urls import url
from .views import Dashboard


class Router(object):
    def __init__(self):
        self.registry = []

    def register(self, widget, base_name):
        self.registry.append((widget, base_name))

    def get_urls(self):
        urlpatterns = [
            url(r'^$', Dashboard.as_view(), name='dashboard'),
        ]

        for widget, basename in self.registry:
            urlpatterns += [
                url(r'^widgets/{}/'.format(basename),
                    widget.as_view(),
                    name='widget_{}'.format(basename)),
            ]

        return urlpatterns

    @property
    def urls(self):
        return self.get_urls()

router = Router()
