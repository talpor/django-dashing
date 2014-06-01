from django.conf.urls import patterns, include, url
from django.contrib import admin
from .views import Dashboard

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', Dashboard.as_view(), name='dashboard'),
)
