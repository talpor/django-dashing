Widgets
===============================================

To place widgets in your dashboard you need create a javascript file, where you call each widget that you need to place with the correct options, each widget provide two events that you can call in any javascript file to update the widget data or render the widget with the data that has.

For example if you create a number widget

.. code-block:: javascript

    var dashboard = new Dashboard();
    
    ...
    
    dashboard.addWidget('example_widget', 'Number', {
        getData: function () {
            this.data = {
                title: 'Current Valuation',
                more_info: 'In billions',
                updated_at: 'Last updated at 14:10',
                change_rate: '64%',
                value: '$35'
            };
            dashboard.publish('example_widget/render');
        }
    });

Then you can publish in any moment the events ``dashboard.publish('example_widget/render')`` to update the DOM of the widget and ``dashboard.publish('example_widget/getData')`` to get new data of the widget.

Note that in this example the `getData` method will be executed each 1000 milliseconds because is the default value of `interval` option in a `Number` widget.

Clock Widget
------------

This widget can display an specific day an hour.

**Options**

row
    Number of rows occupied by the widget. *(default: 1)*

col
    Number of columns occupied by the widget. *(default: 1)*

render
    Function responsible of modify the DOM elements of the widget.

data
    JSON object that represent the date and time in format 

    .. code-block:: javascript

        {
            time: 'hh:mm:ss',
            date: 'Month Day DD sYYYY'
        }

getData
    Function responsible to update `data` value, this function is executed each time interval specified in `interval` variable.
    You can rewrite this function to get data from an external source. This function should call render event to update the widget.
    *(default: return the browser time in a valid JSON format)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 500)*

Graph Widget
------------

This widget can display a value with an associate graph as background.

**Options**

row
    Number of rows occupied by the widget. *(default: 1)*

col
    Number of columns occupied by the widget. *(default: 2)*

render
    Function responsible of modify the DOM elements of the widget.

renderGraph
    Function responsible of draw the graph in the widget using Rickshaw_ library.

.. _Rickshaw: http://code.shutterstock.com/rickshaw/

data
    JSON object that represent the date and time in format

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
    You can rewrite this function to get data from an external source. This function should call render event to update the widget.
    *(default: empty function)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 1000)*

**GraphWidget Class**

To use import from ``dashing.widgets.GraphWidget``.

.. code-block:: python

    class GraphWidget(Widget):
        title = ''
        more_info = ''
        value = ''
        data = []

        def get_title(self):
            return self.title

        def get_more_info(self):
            return self.more_info

        def get_value(self):
            return self.value

        def get_data(self):
            return self.data

        def get_context(self):
            return {
                'title': self.get_title(),
                'more_info': self.get_more_info(),
                'value': self.get_value(),
                'data': self.get_data(),
            }


List Widget
------------

This widget can display a list of elements with an associate value.

**Options**

row
    Number of rows occupied by the widget. *(default: 2)*

col
    Number of columns occupied by the widget. *(default: 1)*

render
    Function responsible of modify the DOM elements of the widget.

data
    JSON object that represent the date and time in format

    .. code-block:: javascript

        {
            data: [
                    {/key0/: /value0/},
                    {/key1/: /value1/}
                    ...
                  ],
            title: /string/,
            more_info: /string/,
            updated_at: /string/
        }

getData
    Function responsible to update `data` value, this function is executed each time interval specified in `interval` variable.
    You can rewrite this function to get data from an external source. This function should call render event to update the widget.
    *(default: empty function)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 10000)*

**ListWidget Class**

To use import from ``dashing.widgets.ListWidget``.

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

Number Widget
-------------

This widget can display a value with another interesting information.

**Options**

row
    Number of rows occupied by the widget. *(default: 1)*

col
    Number of columns occupied by the widget. *(default: 1)*

render
    Function responsible of modify the DOM elements of the widget.

data
    JSON object that represent the date and time in format

    .. code-block:: javascript

        {
            value: /string/,
            title: /string/,
            change_rate: /string/,
            more_info: /string/,
            updated_at: /string/
        }

getData
    Function responsible to update `data` value, this function is executed each time interval specified in `interval` variable.
    You can rewrite this function to get data from an external source. This function should call render event to update the widget.
    *(default: empty function)*

getWidget
    Return the DOM element that represent the widget.

interval
    Actualization interval of widget data on milliseconds. *(default: 1000)*

**NumberWidget Class**

To use import from ``dashing.widgets.NumberWidget``.

.. code-block:: python

    class NumberWidget(Widget):
        title = ''
        more_info = ''
        updated_at = ''
        change_rate = ''
        value = ''

        def get_title(self):
            return self.title

        def get_more_info(self):
            return self.more_info

        def get_updated_at(self):
            return self.updated_at

        def get_change_rate(self):
            return self.change_rate

        def get_value(self):
            return self.value

        def get_context(self):
            return {
                'title': self.get_title(),
                'more_info': self.get_more_info(),
                'updated_at': self.get_updated_at(),
                'change_rate': self.get_change_rate(),
                'value': self.get_value(),
            }
