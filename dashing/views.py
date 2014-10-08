# -*- encoding: utf-8 -*-
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator

from .settings import user_test

class Dashboard(TemplateView):
    template_name = 'dashing/dashboard.html'

    @method_decorator(user_test)
    def dispatch(self, *args, **kwargs):
        return super(Dashboard, self).dispatch(*args, **kwargs)
