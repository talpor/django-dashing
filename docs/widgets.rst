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
