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

Testing
===============================================

First install any development dependencies.

.. code-block:: text

    $ npm install
    $ pip install -r requirements.txt

Then download and install `PhamtonJS <http://phantomjs.org/download.html>`_

django-dashing uses mocha as testing framework. Run the following to run the full test suite.

.. code-block:: text

    $ npm test

Links
===============================================

- `Documentation <http://django-dashing.readthedocs.org/>`_
- `Example (blog post) <https://blog.talpor.com/2014/06/make-a-metric-dashboard-for-trello-with-django-das/>`_
- `Demo application <https://github.com/individuo7/django-dashing-demo-app>`_
- `Widget List <https://github.com/talpor/django-dashing-channel/blob/master/repositories.json>`_


