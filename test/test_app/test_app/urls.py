from django.urls import include, path
from dashing.utils import router

from .views import MultipleDashboards

urlpatterns = [
    path('dashboard/', include(router.urls)),
    path('multiple_dashboards/', MultipleDashboards.as_view()),
]
