===============================================
django-dashing
===============================================
`django-dashing` is a customisable, modular dashboard application framework for Django to visualize interesting data about your project. Inspired in the exceptionally handsome dashboard framework Dashing_

Check out a demo over `here <https://django-dashing-demo.herokuapp.com/dashboard/>`_.

.. _Dashing: http://shopify.github.io/dashing/

.. image:: https://dl.dropboxusercontent.com/u/5594456/dashing/dashboard.png
    :alt: HTTPie compared to cURL
    :width: 835
    :height: 835
    :align: center

Prerequisites
===============================================
- Django 1.5.+
- Django Compressor (optional)

Key concepts
===============================================
- Use premade widgets, or fully create your own with css, html, and javascript.
- Use the API to push data to your dashboards.
- Drag & Drop interface for re-arranging your widgets.

Installation
===============================================
1. Install latest stable version from PyPi:

.. code-block:: text

    $ pip install django-dashing

2. Add `dashing` to ``INSTALLED_APPS`` of the your projects.

.. code-block:: python

    INSTALLED_APPS = (
        ...
        'dashing',
    )

3. Include the dashboard URLconf in your project urls.py like this:

.. code-block:: python

    from dashing.utils import router
    ...
    url(r'^dashboard/', include(router.urls)),

4. Start the development server and visit http://127.0.0.1:8000/dashboard/
   to view the dummy dashboard.

Quick Start
===============================================

To make your own dashboard and retrieves the data from django you should:

1. Create a django dashboard application with a `widgets.py` file

2. Create your widget extended from **NumberWidget**, **ListWidget**, **GraphWidget** or simply **Widget** (from dashing.widgets), for example `see <https://github.com/individuo7/django-dashing-demo-app/blob/master/django_dashing_demo_app/widgets.py>`_.

.. code-block:: python

3. Register your widget in `urls.py` like:

.. code-block:: python

    from django.conf.urls import url, include
    from dashing.utils import router

    from project.dashboard.widgets import CustomWidget

    router.register(CustomWidget, 'custom_widget')

    urlpatterns = [
        url(r'^dashboard/', include(router.urls)),
    ]

Create a dashing-config.js file with a widget that retrive the data in your static directory like:

.. code-block:: javascript

    var myDashboard = new Dashboard();
    myDashboard.addWidget('customWidget', 'Number', {
        getData: function () {
            var self = this;
            Dashing.utils.get('custom_widget', function(data) {
                $.extend(self.scope, data);
            });
        },
        interval: 3000
    });

Also if you want to locate the config file in a different directory you can create a `dashing/dashboard.html` file in your **TEMPLATE_DIRS** and replace the **config_file** block to the route of your javascript config file, see the `docs <http://django-dashing.readthedocs.org/en/latest/getting-started.html#template-file>`_.

Testing
===============================================

First install any development dependencies.

.. code-block:: text

    $ npm install
    $ pip install -r requirements.txt

Then download and install `PhamtonJS <http://phantomjs.org/download.html>`_

django-dashing uses mocha as the testing framework. Run the following command in the root directory to run the full test suite.

.. code-block:: text

    $ mocha -t 10000

Links
===============================================

- `Documentation <http://django-dashing.readthedocs.org/>`_
- `Example (blog post) <https://blog.talpor.com/2014/06/make-a-metric-dashboard-for-trello-with-django-das/>`_
- `Widget List <https://github.com/talpor/django-dashing-channel/blob/master/repositories.json>`_


