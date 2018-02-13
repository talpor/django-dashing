import codecs
import json

try:
    import urllib.request as urllib2
except ImportError:
    import urllib2

from django import template
from django.conf import settings
from django.template import Node
from django.utils.safestring import mark_safe
from django.templatetags.static import static
from django.contrib.staticfiles.finders import find

from dashing.settings import dashing_settings




register = template.Library()

_resource = None


def remote_path(name):
    global _resource
    if not _resource:
        try:
            reader = codecs.getreader("utf-8")
            resource = json.load(reader(urllib2.urlopen(dashing_settings.REPOSITORY)))
            _resource = resource
        except ValueError:
            raise ValueError('Repository format is incorrect')
    else:
        resource = _resource

    if 'widgets' in resource:
        repositories = {x['name']: x['repository'] for x in resource['widgets']}
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
        local_path = 'dashing/{}/{}/{}.{}'.format('widgets', name, name, file_extension)
        if find(local_path):
            output += template.format(static(local_path), name)
        else:
            path = remote_path(name)
            if path:
                path += '{}.{}'.format(name, file_extension)
                output += template.format(path, name)
    return mark_safe(output)


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


@register.simple_tag
def widget_configs():
    widgets = dashing_settings.INSTALLED_WIDGETS
    output = ''
    for name in widgets:
        if name in dashing_settings.WIDGET_CONFIGS:
            for key, value in dashing_settings.WIDGET_CONFIGS[name].items():
                output += '<script type="text/javascript">var {} = "{}";</script>'.format(key, value)
    return mark_safe(output)


if "compressor" in settings.INSTALLED_APPS:
    @register.tag
    def compress(parser, token):
        """
        Shadows django-compressor's compress tag so it can be
        loaded from ``dashing_tags``, allowing us to provide
        a dummy version when django-compressor isn't installed.
        """
        from compressor.templatetags.compress import compress
        return compress(parser, token)
else:
    @register.tag
    def compress(parser, token):
        """
        Dummy tag for fallback when django-compressor isn't installed.
        """
        class TagNode(Node):
            def __init__(self, nodelist):
                self.nodelist = nodelist

            def render(self, context):
                return self.nodelist.render(context)
        nodelist = parser.parse(('endcompress',))
        parser.delete_first_token()
        return TagNode(nodelist)


@register.simple_tag
def moment_locales():
    locales = dashing_settings.LOCALES
    o = ''
    if len(locales) == 0:
        return o

    for locale in locales:
        src = 'dashing/libs/moment/locale/{}.js'.format(locale)
        o += ('<script type="text/javascript"'
              ' src="{}"></script>\n'.format(static(src)))
    o += ('<script type="text/javascript">'
          'moment.locale("{}");</script>\n'.format(locales[0]))
    return mark_safe(o)
