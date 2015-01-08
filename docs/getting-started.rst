Getting Started
===============================================

Installation
-----------
1. Install latest stable version from PyPi:

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


To create a custom dashboard you need create a ``dashing-config.js`` file in the static directory and optionally a custom ``dashing/dashboard.html`` template file.

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

If you need to access the values of Django Dashing settings in your project, you should use the dashing_settings object. For example.


.. code-block:: python

    from dashing.settings import dashing_settings

    print dashing_settings.INSTALLED_WIDGETS


Settings
~~~~~~~~~~~

**INSTALLED_WIDGETS**

A list or tuple of name of widgets to load when the dashboard is displayed, searches for resources of widgets (js, css and html) in the static directory, if not found then searches in the remote repository

Default:

.. code-block:: python

    ('number', 'list', 'graph', 'clock',),

**PERMISSION_CLASSES**

A list or tuple of permission classes, that determines the default set of permissions checked when display the dashboard.

The default permissions classes provided are: *AllowAny*, *IsAuthenticated*, and *IsAdminUser*

Default:

.. code-block:: python

    ('dashing.permissions.AllowAny',)

**REPOSITORY**

A remote location with a repositories.json file, here are specified the third-party widgets with the remote location to download the static files


Config File 
-----------

You need put the ``dashing-config.js`` in the static directory to begin creating widgets for your project. You can change the patch and name if you write a template file.

The dashing config file should start with the creation of a new dashboard ``var dashboard = new Dashboard();`` and start to place widgets with the following syntax ``dashboard.addWidget(<name_of_widget>, <type_of_widget>, <options>);`` where `name_of_widget` is the name that describe the objective of the widget (should be unique) `type_of_widget` is a valid widget type (Clock, Graph, List, Number) and options depends of each widget.

This is the default ``dashing-config.js`` file, use as a guide for writing your own:

.. code-block:: javascript

    /* global $, Dashboard */

    var dashboard = new Dashboard();

    dashboard.addWidget('clock_widget', 'Clock');

    dashboard.addWidget('current_valuation_widget', 'Number', {
        getData: function () {
            $.extend(this.data, {
                title: 'Current Valuation',
                more_info: 'In billions',
                updated_at: 'Last updated at 14:10',
                detail: '64%',
                value: '$35'
            });
        }
    });

    dashboard.addWidget('buzzwords_widget', 'List', {
        getData: function () {
            $.extend(this.data, {
                title: 'Buzzwords',
                more_info: '# of times said around the office',
                updated_at: 'Last updated at 18:58',
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
            $.extend(this.data, {
                title: 'Convergence',
                value: '41',
                more_info: '',
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

You can create a `dashboard.html` file to add your custom stylesheets and scripts or specify a custom route to your dashing-config.js file. You will place inside the template directory in ``dashing/dashboard.html``

Your ``dashing/dashing.html`` might looks like this:

.. code-block:: html

    {% extends 'dashing/base.html' %}
    {% load staticfiles %}

    {% block 'stylesheets' %}
    <link rel="stylesheet" href="{% static 'my/custom/style.css' %}">
    {% endblock %}

    {% block 'scripts' %}
    <script type="text/javascript" src="{% static 'my/custom/script.js' %}"></script>
    {% endblock %}

    {% block 'config_file' %}
    <script type="text/javascript" src="{% static 'my/custom/dashing-config.js' %}"></script>
    {% endblock %}

Python Widget Classes
----------------------

Django Dashing provide an useful set of classes to return the expected data for the default widgets, you can create a `widgets.py` file and inherit of these classes or create your own widgets inherit from ``dashing.widgets.Widget``.

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

Now we can access to CustomWidget from '/dashboard/widgets/custom_widget/(?P<eg_kwargs_param>[A-Za-z0-9_-]+)' if '/dashboard/' is the root of our dashboard.

The kwargs are optional and you can add as many as you want.
