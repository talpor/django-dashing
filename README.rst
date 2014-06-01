=====
Dashing
=====

Dashing is a simple Django app to create widgets to visualize
interesting data about your project.

Detailed documentation is in the "docs" directory.

Quick start
-----------

1. Add "dashing" to your INSTALLED_APPS setting like this::

      INSTALLED_APPS = (
          ...
          'dashing',
      )

2. Include the polls URLconf in your project urls.py like this::

      url(r'^dashboard/', include('dashing.urls')),

3. Start the development server and visit http://127.0.0.1:8000/dashboard/
   to view the dummy dashboard.