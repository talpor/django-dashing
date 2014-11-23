Dashboards
===============================================

Single Dashboard 
----------------

To initialize a single dashboard you need create a Dashboard object and pass valid options as shown below:

.. code-block:: javascript

    var dashboard = new Dashboard(options);

Where the `options` are a json object with the following specifications

**Options**

name `(optional)`
    The name of widget. *(default:* ``undefined`` *)*

viewportWidth `(optional)`
    Width of viewport where expected that the dashboard was displayed. *(default:* ``$(window).width()`` *)*

viewportHeight `(optional)`
    Height of viewport where expected that the dashboard was displayed. *(default:* ``$(window).height()`` *)*

widgetMargins `(optional)`
    Margin between each widget. *(default:* ``[5, 5]`` *)*

widgetBaseDimensions `(optional)`
    Default width and height of each widget in the dashboard. *(default:* ``[370, 340]`` *)*


Multiple Dashboards
-------------------

To initialize a multiple dashboards you need create a DashboardSet object and pass valid options as shown below:

.. code-block:: javascript

    var dashboardSet = new DashboardSet();



**DashboardSet methods**

addDashboard
    To add a new Dashboard:

    .. code-block:: javascript

        dashboardSet.addDashboard(name, options)


    Where `name` is a string with the name of dashboard and `options` is a json object with the same format of the options of the `Dashboard` object.

getDashboard
    To get a Dashboard from the DashboardSet object:

    .. code-block:: javascript

        dashboardSet.getDashboard(name)

**Swap between dashboards**

To swap between dashboards need to press the `ctrl` key to display the menu.
