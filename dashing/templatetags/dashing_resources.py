from django import template
from django.templatetags.static import static
from django.contrib.staticfiles.finders import find

from dashing.settings import dashing_settings

import json
import urllib2

register = template.Library()

_resource = None

def remote_path(name):
    global _resource
    if not _resource:
        try:
            resource = json.load(urllib2.urlopen(dashing_settings.REPOSITORY))
            _resource = resource
        except ValueError:
            raise ValueError('Repository format is incorrect')
    else:
        resource = _resource

    if 'widgets' in resource:
        repositories = {x['name']:x['repository'] for x in resource['widgets']}
    else:
        raise ValueError('No widgets specified in the repository')

    if name in repositories:
        return repositories[name]
    else:
        return None


def load(template, file_extension):
    widgets = dashing_settings.INSTALLED_WIDGETS
    output = ''
    for name in widgets:
        local_path = '{}/{}/{}.{}'.format('widgets', name, name, file_extension)
        if find(local_path):
            output += template.format(static(local_path), name)
        else:
            path = remote_path(name)
            if path:
                path += '{}.{}'.format(name, file_extension)
                output += template.format(path, name)
    return output


@register.simple_tag
def widget_styles():
    return load('<link rel="stylesheet" href="{}">\n', 'css')


@register.simple_tag
def widget_scripts():
    return load('<script type="text/javascript" src="{}"></script>\n', 'js')


@register.simple_tag
def widget_templates():
    return load('<link rel="resource" type="text/html" '
                'href="{}" data-widget="{}">\n', 'html')
