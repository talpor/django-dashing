Getting Started
===============================================

To create a custom dashboard you need create a ``dashing-config.js`` file in the static directory and optionally a custom ``dashing/dashboard.html`` template file.

Config File 
-----------

You need put the ``dashing-config.js`` in the static directory (you can change the patch and name if you wrote a template file and start to create widgets for your project.

The dashing config file should start with the creation of a new dashboard ``var dashboard = new Dashboard();`` and start to place widgets with the following syntax ``dashboard.addWidget(<name_of_widget>, <type_of_widget>, <options>);`` where `name_of_widget` is the name that describe the objective of the widget (should be unique) `type_of_widget` is a valid widget type (Clock, Graph, List, Number) and options depends of each widget.

Template File
-------------

You can create a `dashboard.html` file to specify which widgets you can use or add your custom widgets, also add stylesheets and extra scripts. You will place inside the template directory in ``dashing/dashboard.html``

Python Widget Classes
----------------------

Optionally this app provide an useful set of classes to return the expected data for the default widgets, you can create a `widgets.py` file and inherit of these classes or create your own widgets inherit from ``dashing.widgets.Widget``.

.. code-block:: python

    class Widget(JSONResponseMixin, View):
        def get(self, request, *args, **kwargs):
            context = self.get_context()
            return HttpResponse(json.dumps(context), content_type="application/json")

        def render_to_response(self, context, **response_kwargs):
            return self.render_to_json_response(context, **response_kwargs)

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

Now we can access to CustomWidget from '/dashboard/widgets/custom_widget/(?P<eg_kwargs_param>[A-Za-z0-9_-]+)' if '/dashboard/' is the root of our dashboard

The kwargs are optional and you can add as many as you want
