from django.conf import settings
from django.utils import six
import importlib

USER_SETTINGS = getattr(settings, 'DASHING', None)

DEFAULTS = {
    'REPOSITORY': 'https://cdn.rawgit.com/talpor/django-dashing-channel/'
                  'master/repositories.json',
    'INSTALLED_WIDGETS': ('number', 'list', 'graph', 'clock', 'knob', 'map',),
    'PERMISSION_CLASSES':  (
        'dashing.permissions.AllowAny',
    ),
    'LOCALES': (),
    'WIDGET_CONFIGS': {},
}

# List of settings that may be in string import notation.
IMPORT_STRINGS = ('PERMISSION_CLASSES',)


def perform_import(val, setting_name):
    """
    If the given setting is a string import notation,
    then perform the necessary import or imports.
    """
    if isinstance(val, six.string_types):
        return import_from_string(val, setting_name)
    elif isinstance(val, (list, tuple)):
        return [import_from_string(item, setting_name) for item in val]
    return val


def import_from_string(val, setting_name):
    """
    Attempt to import a class from a string representation.
    """
    try:
        # Nod to tastypie's use of importlib.
        parts = val.split('.')
        module_path, class_name = '.'.join(parts[:-1]), parts[-1]
        module = importlib.import_module(module_path)
        return getattr(module, class_name)
    except ImportError as e:
        msg = ('Could not import \'{}\' '
               'for setting \'{}\'. {}: {}.').format(val,
                                                     setting_name,
                                                     e.__class__.__name__, e)
        raise ImportError(msg)


class Settings(object):
    """
    A settings object, that allows settings to be accessed as properties.
    For example:
        from dashing.settings import dashing_settings
        print dashing_settings.INSTALLED_WIDGETS
    Any setting with string import paths will be automatically resolved
    and return the class, rather than the string literal.
    """
    def __init__(self, user_settings=None, defaults=None, import_strings=None):
        self.user_settings = user_settings or {}
        self.defaults = defaults or {}
        self.import_strings = import_strings or ()

    def __getattr__(self, attr):
        if attr not in self.defaults.keys():
            raise AttributeError("Invalid setting: '%s'" % attr)

        try:
            # Check if present in user settings
            val = self.user_settings[attr]
        except KeyError:
            # Fall back to defaults
            val = self.defaults[attr]

        # Coerce import strings into classes
        if val and attr in self.import_strings:
            val = perform_import(val, attr)

        # Cache the result
        setattr(self, attr, val)
        return val


dashing_settings = Settings(USER_SETTINGS, DEFAULTS, IMPORT_STRINGS)
