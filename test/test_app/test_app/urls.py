from django.conf.urls import include, url
from dashing.utils import router

from .views import MultipleDashboards

urlpatterns = [
    url(r'^dashboard/', include(router.urls)),
    url(r'^multiple_dashboards/$', MultipleDashboards.as_view()),
]
