from django.conf.urls import patterns, include, url
from dashing import utils
from dashing.utils import router

urlpatterns = patterns('',
    url(r'^dashboard/', include(router.urls)),
)
