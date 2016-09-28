# -*- coding: utf-8 -*-
import json
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.views.generic.detail import View

from dashing.settings import dashing_settings


class JSONResponseMixin(object):
    """
    A mixin that can be used to render a JSON response.
    """
    def render_to_json_response(self, context, **response_kwargs):
        """
        Returns a JSON response, transforming 'context' to make the payload.
        """
        return HttpResponse(
            self.convert_context_to_json(context),
            content_type='application/json',
            **response_kwargs
        )

    def convert_context_to_json(self, context):
        "Convert the context dictionary into a JSON object"
        return json.dumps(context)


class Widget(JSONResponseMixin, View):
    permission_classes = dashing_settings.PERMISSION_CLASSES

    def check_permissions(self, request):
        """
        Check if the request should be permitted.
        Raises an appropriate exception if the request is not permitted.
        """
        permissions = [permission() for permission in self.permission_classes]
        for permission in permissions:
            if not permission.has_permission(request):
                raise PermissionDenied()

    def get(self, request, *args, **kwargs):
        self.check_permissions(request)
        context = json.dumps(self.get_context())
        return HttpResponse(context, content_type="application/json")

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)


class NumberWidget(Widget):
    title = ''
    more_info = ''
    updated_at = ''
    detail = ''
    value = ''

    def get_title(self):
        return self.title

    def get_more_info(self):
        return self.more_info

    def get_updated_at(self):
        return self.updated_at

    def get_detail(self):
        return self.detail

    def get_value(self):
        return self.value

    def get_context(self):
        return {
            'title': self.get_title(),
            'moreInfo': self.get_more_info(),
            'updatedAt': self.get_updated_at(),
            'detail': self.get_detail(),
            'value': self.get_value(),
        }


class ListWidget(Widget):
    title = ''
    more_info = ''
    updated_at = ''
    data = []

    def get_title(self):
        return self.title

    def get_more_info(self):
        return self.more_info

    def get_updated_at(self):
        return self.updated_at

    def get_data(self):
        return self.data

    def get_context(self):
        return {
            'title': self.get_title(),
            'moreInfo': self.get_more_info(),
            'updatedAt': self.get_updated_at(),
            'data': self.get_data(),
        }


class GraphWidget(Widget):
    title = ''
    more_info = ''
    value = ''
    data = []
    properties = {}

    def get_title(self):
        return self.title

    def get_more_info(self):
        return self.more_info

    def get_value(self):
        return self.value

    def get_data(self):
        return self.data

    def get_properties(self):
        return self.properties

    def get_context(self):
        return {
            'title': self.get_title(),
            'moreInfo': self.get_more_info(),
            'value': self.get_value(),
            'data': self.get_data(),
            'properties': self.get_properties(),
        }


class KnobWidget(Widget):
    title = ''
    value = ''
    data = {}
    detail = ''
    more_info = ''
    updated_at = ''

    def get_title(self):
        return self.title

    def get_data(self):
        return self.data

    def get_detail(self):
        return self.detail

    def get_more_info(self):
        return self.more_info

    def get_value(self):
        return self.value

    def get_updated_at(self):
        return self.updated_at

    def get_context(self):
        return {
            'title': self.get_title(),
            'value': self.get_value(),
            'data': self.get_data(),
            'detail': self.get_detail(),
            'moreInfo': self.get_more_info(),
            'updatedAt': self.get_updated_at(),
        }


class MapWidget(Widget):
    theme = 'blue'
    zoom = 8
    double_click_zoom = True
    default_ui = False
    center = {}
    markers = []

    def get_theme(self):
        return self.theme

    def get_zoom(self):
        return self.zoom

    def get_double_click_zoom(self):
        return self.double_click_zoom

    def get_default_ui(self):
        return self.default_ui

    def get_center(self):
        return self.center

    def get_markers(self):
        return self.markers

    def get_context(self):
        return {
            'theme': self.get_theme(),
            'map': {
                'zoom': self.get_zoom(),
                'doubleClickZoom': self.get_double_click_zoom(),
                'defaultUI': self.get_default_ui(),
                'center': self.get_center(),
                'markers': self.get_markers()
            }
        }
