from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.decorators import user_passes_test

def user_test(view_func, redirect_field_name=REDIRECT_FIELD_NAME, login_url='admin:login'):
    return user_passes_test(
        lambda u: True,
        login_url=login_url,
        redirect_field_name=redirect_field_name
    )(view_func)


_g = globals()
for key, value in _g.items():
    _g[key] = getattr(settings, key, value)


