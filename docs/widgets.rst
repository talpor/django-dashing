Widgets
===============================================

To place widgets in your dashboard you need create a javascript file, where you call each widget that you need to place with the correct options, each widget provide an events that you can call in any javascript file to update the data.

For example if you create a number widget

.. code-block:: javascript

    var dashboard = new Dashboard();
    
    ...
    
    dashboard.addWidget('current_valuation_widget', 'Number', {
        getData: function () {
            $.extend(this.data, {
                title: 'Current Valuation',
                more_info: 'In billions',
                updated_at: 'Last updated at 14:10',
                value: '$35',
                detail: '64%'
            });
        }
    });

Then you can publish in any moment the event ``dashboard.publish('example_widget/getData')`` to get new data and update the widget.

Note that in this example the `getData` method will be executed each 1000 milliseconds because is the default value of `interval` option in a `Number` widget.

Clock Widget
------------

This widget can display an specific day an hour.

Options
~~~~~~~~~~~~

row
    Number of rows occupied by the widget. *(default: 1)*

col
    Number of columns occupied by the widget. *(default: 1)*

data
    JSON object that represent the date and time in format 

    .. code-block:: javascript

        {
            time: 'hh:mm:ss',
            date: 'Month Day DD sYYYY'
        }

getData
    Function responsible to update `data` value, this function is executed each time interval specified in `interval` variable.
    You can rewrite this function to get data from an external source.
    *(default: return the browser time in a valid JSON format)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 500)*

Graph Widget
------------

This widget can display a value with an associate graph as background.

Options
~~~~~~~~~~~~

row
    Number of rows occupied by the widget. *(default: 1)*

col
    Number of columns occupied by the widget. *(default: 2)*

data
    JSON object in this format

    .. code-block:: javascript

        {
            data: [
                    {x: /x0/, y: /y0/},
                    {x: /x1/, y: /y1/}
                    ...
                  ],
            value: /string/
            title: /string/,
            more_info: /string/
        }

getData
    Function responsible to update `data` value, this function is executed each time interval specified in `interval` variable.
    You can rewrite this function to get data from an external source.
    *(default: empty function)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 1000)*

Graph options
~~~~~~~~~~~~

To render the graph this widget use Rickshaw_ library, for now the config options are quite limited, if you need be more specific you can overwrite the rivetsjs binder (rv-dashing-graph) or write a custom widget use this as guide.

To configure the X and Y axis must be passed as extra aparameters in the data *xFormat* and *yFormat* methods, also you can use the methods beforeRender and afterRender to execute arbitrary javascript before or after of render, for example:


.. code-block:: javascript

    var xFormat = function(n) {
            return '(' + n + ')';
        };
    $.get('/my/api/url/', function(data) {
        data.data.xFormat = xFormat;
        data.data.afterRender = function() {
            alert('graph shown');
        };
        $.extend(self.data, data);
    });

.. _Rickshaw: http://code.shutterstock.com/rickshaw/

Python Class
~~~~~~~~~~~~

This class helps to return valid data to be use by the widget, you can see the definition in GitHub__

.. _GraphWidgetDefinition: https://github.com/talpor/django-dashing/blob/59def5a53d5b76db232196f2fffacd49270b27e1/dashing/widgets.py#L94-118

__ GraphWidgetDefinition_

Here's an example of a graph widget where in `value` is displayed the total of Errands and in `data` is returned an array with the last two hour of activity

.. code-block:: python
    
    from dashing.widgets import GraphWidget

    class HourlyErrandsWidget(GraphWidget):
        title = 'Hourly Errands'
        more_info = ''

        def get_value(self):
            return SearchQuerySet().filter(django_ct='errands.errand').count()

        def get_data(self):
            latest_hours = datetime.now() - timedelta(hours=2)
            latest_errands = SearchQuerySet().filter(
                                django_ct='errands.errand',
                                created__gt=latest_hours).values('created')
            intervals = []
            for errand in latest_errands:
                delta = datetime.now() - errand['created']

                for m in range(10, 120, 10):
                    if delta < timedelta(minutes=m):
                        intervals.append(13 - m/10)
                        break

            rlist = Counter([x for x in intervals])
            return [{'x': x, 'y': y} for x, y in rlist.most_common()]



List Widget
------------

This widget can display a list of elements with an associate value.

Options
~~~~~~~~~~~~

row
    Number of rows occupied by the widget. *(default: 2)*

col
    Number of columns occupied by the widget. *(default: 1)*

render
    Function responsible of modify the DOM elements of the widget.

data
    JSON object in this format

    .. code-block:: javascript

        {
            data: [
                    {
                        label: /string/,
                        name: /string/
                    },
                    {
                        label: /string/,
                        name: /string/
                    },
                    ...
                  ],
            title: /string/,
            more_info: /string/,
            updated_at: /string/
        }

getData
    Function responsible to update `data` value, this function is executed each time interval specified in `interval` variable.
    You can rewrite this function to get data from an external source.
    *(default: empty function)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 10000)*

Python Class
~~~~~~~~~~~~

This class helps to return valid data to be use by the widget, you can see the definition in GitHub__

.. _ListWidgetDefinition: https://github.com/talpor/django-dashing/blob/59def5a53d5b76db232196f2fffacd49270b27e1/dashing/widgets.py#L67-91

__ ListWidgetDefinition_

Here's an example of a graph widget where in `data` returns an array with the messengers who have more requests

.. code-block:: python
    
    from dashing.widgets import ListWidget

    class ActiveMessengersWidget(ListWidget):
        title = 'Active Messengers'
        more_info = 'Those who have more requests'

        def get_updated_at(self):
            modified = SearchQuerySet().filter(
                django_ct='errand').order_by('-modified')[0].modified
            return u'Last updated {}'.format(modified)

        def get_data(self):
            messengers = SearchQuerySet().filter(
                                    django_ct='messengers', active=True)
            rlist = Counter([x for x in messengers])
            return [{'label':x, 'value':y} for x, y in rlist.most_common(20)]


Number Widget
-------------

This widget can display a value with another interesting information.

Options
~~~~~~~~~~~~

row
    Number of rows occupied by the widget. *(default: 1)*

col
    Number of columns occupied by the widget. *(default: 1)*

data
    JSON object in this format

    .. code-block:: javascript

        {
            value: /string/,
            title: /string/,
            detail: /string/,
            more_info: /string/,
            updated_at: /string/
        }

getData
    Function responsible to update `data` value, this function is executed each time interval specified in `interval` variable.
    You can rewrite this function to get data from an external source.
    *(default: empty function)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 1000)*

Python Class
~~~~~~~~~~~~

This class helps to return valid data to be use by the widget, you can see the definition in GitHub__

.. _NumberWidgetDefinition: https://github.com/talpor/django-dashing/blob/59def5a53d5b76db232196f2fffacd49270b27e1/dashing/widgets.py#L35-64

__ NumberWidgetDefinition_

Here's an example of a graph widget where in `value` is displayed the total of payments and in the detail and more_info shows other information of interest

.. code-block:: python
    
    from dashing.widgets import NumberWidget

    class PaymentsWidget(NumberWidget):
        title = 'Payments Customers'

        def get_value(self):
            return Payment.objects.all().count()
        
        def get_detail(self):
            payments = Payment.objects.all()
            total = len([x for x in payments if x.status == Payment.STATUS.waiting])
            return '{} to approve'.format(total)

        def get_more_info(self):
            payments = Payment.objects.all()
            total = len([x for x in payments if x.status == Payment.STATUS.rejected])
            return '{} rejected'.format(total)

Custom Widgets
===============================================

To make a custom widget you must create three static files to define configuration parameters and appearance, in addition, you can create a python class to communicate with the Django project.

To name your widgets should follow a naming convention, where the name must by unique for findable through the settings.

Static Files
-------------

Template File
~~~~~~~~~~~~

Its location should be ``<static_directory>/widgets/<widget_name>/<widget_name>.html`` this file describes its UI in plain HTML using the `Rivets.js conventions`__ to bind data to the script file.

.. _RivetsJsTemplates: http://rivetsjs.com/docs/guide/#usage-templates

__ RivetsJsTemplates_

For example ``{% static %}widgets/list/list.html`` looks like this:

.. code-block:: html

    <div>
        <h1>{ data.title }</h1>
        <ul>
          <li rv-each-el="data.data">
            <span class="label">{ el.label }</span>
            <span class="value">{ el.value }</span>
          </li>
        </ul>
        <p class="more-info">{ data.more_info }</p>
        <p class="updated-at">{ data.updated_at }</p>
    </div>

The classes are only for the stylesheet.

Style File
~~~~~~~~~~~~

Your location should be ``<static_directory>/widgets/<widget_name>.css`` in this file defines the styles of widget.

Script File
~~~~~~~~~~~~

Your location should be ``<static_directory>/widgets/<widget_name>.js`` in this file will be defined the configuration options and default values for the new widget, the idea is to create an object using the ``new`` keyword, then we define properties and methods using ``this`` keyword.

We must provide an ``__init__`` method where binding the data with the template and add to the dashboard, this function is quite similar in all widgets, then it is provided by ``Dashing.utils.widgetInit`` to facilitate implementation and improve reading of widgets, also must provide a ``data`` element which will be binded to the template, and a ``getData`` function will surely be the to be overwritten to obtain relevant data as required,

For example ``{% static %}widgets/list/list.js`` looks like this:

.. code-block:: javascript

    /* global Dashboard */

    Dashing.widgets.List = function (dashboard) {
        var self = this,
            widget;
        this.__init__ = Dashing.utils.widgetInit(dashboard, 'list');
        this.row = 2;
        this.col = 1;
        this.data = {};
        this.getWidget = function () {
            return widget;
        };
        this.getData = function () {};
        this.interval = 10000;
    };

if we want to initialize widget with data we can write:


.. code-block:: javascript
    
    ...
        this.col = 1;
        this.data = {
            title: 'Default Title',
            more_info: 'No data to display'
        };
        this.getWidget = function () {
    ...


Python Class
-------------

Surely in many cases may be necessary give the option to get some Dajngo project data into the widget, for this dashing has a Widget class that can be inherited to deliver properly serialized data, also subsequently can be serve the data using the dashing router.

For example ListWidget in ``dashing/widgets.py`` looks like this:

.. code-block:: python

    class ListWidget(Widget):
        title = ''
        more_info = ''
        updated_at = ''
        data = []

        def get_title(self):
            return self.title

        def get_more_info(self):
            return self.more_info

        def get_updated_at(self):
            return self.updated_at

        def get_data(self):
            return self.data

        def get_context(self):
            return {
                'title': self.get_title(),
                'more_info': self.get_more_info(),
                'updated_at': self.get_updated_at(),
                'data': self.get_data(),
            }

If you develop your widget with python classes necessarily going to have to distribute it via PyPI

Distribution
------------

To distribute a widget you have two options, the fastest way is throught  Django Dashing Channel but is a bit limited, and through PyPI a bit trickier to pack but you have more options when developing the widget.

Via Django Dashing Channel
~~~~~~~~~~~~

Using this distribution method the users will only have to add the widget name on ``INSTALLED_WIDGETS`` then to loading the dashboard, this locates the static files from a remote location (specified in the preconfigured repository), if the user creates a copy of the files on your local static directory then these will open locally.

You will have to host your files into a CDN, I recommend creating a github project and use RawGit_ to serve through MaxCDN_, you can take `dj-dashing-weather-widget`__ project as a guide.

.. _RawGit: https://rawgit.com/
.. _MaxCDN: https://www.maxcdn.com/
.. _WeatherWidget: https://github.com/individuo7/dj-dashing-weather-widget
__ WeatherWidget_

Finally to publish your widget in Django Dashing Channel you need to make a fork of `django-dashing-channel`__, add your repository to repositories.json and send a pull request. In the repository root will be sought the widget static files (.js .css and .html)

You should create a README file for installations instructions.

.. _DashingChannel: https://github.com/talpor/django-dashing-channel
__ DashingChannel_

PyPI Package
~~~~~~~~~~~~

If your widget requires python code or just want to provide an easy way to get the widget locally then a PyPI package is the way to go.

As a requirement is necessary follow the widgets naming convention (`see static files`__). To create a PyPI package `see the documentation <https://docs.python.org/2/distutils/packageindex.html>`_, and should create a README file for installations instructions.

This not excluding the previous way, you could create a minimalist version of your widget and upload to django-dashing-channel and in the project instructions leave on how to install the PyPI version

.. _WidgetsNamingConvention: #static-files
__ WidgetsNamingConvention_