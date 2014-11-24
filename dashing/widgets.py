# -*- coding: utf-8 -*-
import json
from django.http import HttpResponse
from django.views.generic.detail import View


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
    def get(self, request, *args, **kwargs):
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
            'more_info': self.get_more_info(),
            'updated_at': self.get_updated_at(),
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
            'more_info': self.get_more_info(),
            'updated_at': self.get_updated_at(),
            'data': self.get_data(),
        }


class GraphWidget(Widget):
    title = ''
    more_info = ''
    value = ''
    data = []

    def get_title(self):
        return self.title

    def get_more_info(self):
        return self.more_info

    def get_value(self):
        return self.value

    def get_data(self):
        return self.data

    def get_context(self):
        return {
            'title': self.get_title(),
            'more_info': self.get_more_info(),
            'value': self.get_value(),
            'data': self.get_data(),
        }
