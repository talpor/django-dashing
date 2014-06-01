# -*- encoding: utf-8 -*-
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.admin.views.decorators import staff_member_required

class Dashboard(TemplateView):
    template_name = 'dashing/dashboard.html'
    
    @method_decorator(staff_member_required)
    def dispatch(self, *args, **kwargs):
        return super(Dashboard, self).dispatch(*args, **kwargs)
