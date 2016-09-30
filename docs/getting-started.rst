Getting Started
===============================================

Installation
-----------
1. Install the latest stable version from PyPi:

.. code-block:: text

    $ pip install django-dashing

2. Add `dashing` to ``INSTALLED_APPS`` of the your projects.

.. code-block:: python

    INSTALLED_APPS = (
        ...
        'dashing',
    )

3. Include the polls URLconf in your project urls.py like this:

.. code-block:: python

    from dashing.utils import router
    ...

    url(r'^dashboard/', include(router.urls)),

4. Start the development server and visit http://127.0.0.1:8000/dashboard/
   to view the dummy dashboard.


To create a custom dashboard you need to create a ``dashing-config.js`` file in the static directory and a custom ``dashing/dashboard.html`` template file. This is optional.

Django Settings
-----------

Configuration for Django Dashing is all namespaced inside a single Django setting, named DASHING. 

For example your project's ``settings.py`` file might include something like this:

.. code-block:: python

    DASHING = {
        'INSTALLED_WIDGETS': ('number', 'list', 'graph',),
        'PERMISSION_CLASSES':  (
            'dashing.permissions.IsAuthenticated',
        )
    }


Accessing settings
~~~~~~~~~~~

If you need to access the values of Django Dashing settings in your project, you should use the dashing_settings object. For example:


.. code-block:: python

    from dashing.settings import dashing_settings

    print dashing_settings.INSTALLED_WIDGETS


Settings
~~~~~~~~~~~

**INSTALLED_WIDGETS**

A list or tuple of names of widgets loads when the dashboard is displayed,then it searches for the resources of those widgets (js, css and html) in the static directory. If they are not found then search them in the remote repository.

Default:

.. code-block:: python

    ('number', 'list', 'graph', 'clock', 'knob', 'map',)

**PERMISSION_CLASSES**

A list or tuple of permission classes that determine the default set of permissions checked when displaying the dashboard.

The default permissions classes provided are: *AllowAny*, *IsAuthenticated*, and *IsAdminUser*

Default:

.. code-block:: python

    ('dashing.permissions.AllowAny',)

**REPOSITORY**

A remote location with a repositories.json file is specified by the third-party widgets with the remote location to download the static files.

**LOCALES**

A list or tuple of locales to load the neccesary i18n resources to configurate momentjs. You can load more than one but by default, one moment will be configured with the first.

The list of valid locales are:

.. code-block:: text

    af, ar, ar-ma, ar-sa, ar-tn, az, be, bg, bn, bo, br, bs, ca, cs, cv, cy, da,
    de, de-at, el, en-au, en-ca, en-gb, eo, es, et, eu, fa, fi, fo, fr, fr-ca, fy,
    gl, he, hi, hr, hu, hy-am, id, is, it, ja, jv, ka, km, ko, lb, lt, lv, me, mk,
    ml, mr, ms-my, my, nb, ne, nl, nn, pl, pt, pt-br, ro, ru, si, sk, sl, sq, sr,
    sr-cyrl, sv, ta, th, tl-ph, tr, tzm, tzm-latn, uk, uz, vi, zh-cn, zh-tw


Default:

.. code-block:: python

    () # empty tuple, english default


**WIDGET_CONFIGS**

A widget name -> {key: value} dictionary holding any additional configuration values needed for some of your ``INSTALLED_WIDGETS``, such as API keys.

Default:

.. code-block:: python

    {} # empty dict, no additional configuration


Config File 
-----------

You need to put the ``dashing-config.js`` in the static directory to begin creating widgets for your project. You can change the path and name if you write a template file.

The dashing config file should start with the creation of a new dashboard ``var dashboard = new Dashboard();`` and start to place widgets with the following syntax ``dashboard.addWidget(<name_of_widget>, <type_of_widget>, <options>);`` where `name_of_widget` is the name that describes the objective of the widget (it should be unique) `type_of_widget` is a valid widget type (Clock, Graph, List, Number) and the options depend of each widget.

This is the default ``dashing-config.js`` file, use it as a guide for writing your own:

.. code-block:: javascript

    /* global $, Dashboard */

    var dashboard = new Dashboard();

    dashboard.addWidget('clock_widget', 'Clock');

    dashboard.addWidget('current_valuation_widget', 'Number', {
        getData: function () {
            $.extend(this.scope, {
                title: 'Current Valuation',
                moreInfo: 'In billions',
                updatedAt: 'Last updated at 14:10',
                detail: '64%',
                value: '$35'
            });
        }
    });

    dashboard.addWidget('buzzwords_widget', 'List', {
        getData: function () {
            $.extend(this.scope, {
                title: 'Buzzwords',
                moreInfo: '# of times said around the office',
                updatedAt: 'Last updated at 18:58',
                data: [{label: 'Exit strategy', value: 24},
                       {label: 'Web 2.0', value: 12},
                       {label: 'Turn-key', value: 2},
                       {label: 'Enterprise', value: 12},
                       {label: 'Pivoting', value: 3},
                       {label: 'Leverage', value: 10},
                       {label: 'Streamlininess', value: 4},
                       {label: 'Paradigm shift', value: 6},
                       {label: 'Synergy', value: 7}]
            });
        }
    });

    dashboard.addWidget('convergence_widget', 'Graph', {
        getData: function () {
            $.extend(this.scope, {
                title: 'Convergence',
                value: '41',
                moreInfo: '',
                data: [ 
                        { x: 0, y: 40 }, 
                        { x: 1, y: 49 }, 
                        { x: 2, y: 38 }, 
                        { x: 3, y: 30 }, 
                        { x: 4, y: 32 }
                    ]
                });
        }
    });


Template File
-------------

You can create a `dashboard.html` file to add your custom stylesheets and scripts or specify a custom route to your dashing-config.js file. You will place it inside the template directory in ``dashing/dashboard.html``

Your ``dashing/dashboard.html`` might looks like this:

.. code-block:: html

    {% extends 'dashing/base.html' %}
    {% load staticfiles %}

    {% block stylesheets %}
    <link rel="stylesheet" href="{% static 'my/custom/style.css' %}">
    {% endblock %}

    {% block scripts %}
    <script type="text/javascript" src="{% static 'my/custom/script.js' %}"></script>
    {% endblock %}

    {% block config_file %}
    <script type="text/javascript" src="{% static 'my/custom/dashing-config.js' %}"></script>
    {% endblock %}

Also make sure the app which hosts the ``dashing/dashboard.html`` template is listed before ``dashing`` in ``INSTALLED_APPS``, since you are overriding the default template.

Python Widget Classes
----------------------

Django Dashing provides a useful set of classes to return the expected data for the default widgets. You can create a `widgets.py` file and inherit these classes or create your own widgets inherited from ``dashing.widgets.Widget``.

A custom widget can look like this:

.. code-block:: python

    class CustomWidget(NumberWidget):
        title = 'My Custom Widget'
        value = 25

        def get_more_info(self):
            more_info = 'Random additional info'
            return more_info

To register the url to serve this widget you must use the register method from ``dashing.utils.router``, then in `urls.py` file put

.. code-block:: python

    from dashing.utils import router

    router.register(CustomWidget, 'custom_widget', eg_kwargs_param="[A-Za-z0-9_-]+")

Now we can access CustomWidget from '/dashboard/widgets/custom_widget/(?P<eg_kwargs_param>[A-Za-z0-9_-]+)' if '/dashboard/' is the root of our dashboard.

The kwargs are optional and you can add as many as you want.
