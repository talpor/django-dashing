## 0.3.3
- Fix bug when many widgets try to load the same dependency
- Update test suite

## 0.3.2
- Add option to set a background icon in the number widget
- Add setting to add google maps API key for the map widget
- Bug fixes

## 0.3.1
- Ability to set permission for each widget
- Bug fixes

## 0.3
- Add KnobWidget and MapWidget python classes
- Fix several bugs
- Remove backward compatibility code

## 0.2.8
- Add `getDashboards` method in **DashboardSet** object and `getWidgets` method in **Dashboard** object
- Improve resource loading adding some minified libraries and using preloadjs to load the libs requires by the widgets
- Fix some design issues
- Add Knob and Map plugins [docs](https://github.com/talpor/django-dashing/pull/20)

## 0.2.7
- Add hash based navigation in multiple dashboards
- Add again option to change the background color of a widget

## 0.2.6
- Add django compressor as an optional dependency
- Migrate dashing.js towards an data binding model using rivetsjs
- Change the naming pattern to refer widgets environments as `data.data` to simply use `scope` (backward compatible)

## 0.2.5

- Add triggers **shown** and **hidden** to grid wrappers which can be used for specific actions when dashboards in a dashboardset are loaded or unloaded
- Dashboard has **activeWidgets** array property for direct access to the widgets
- Manage Rickshaw.Graph properties [details](https://github.com/talpor/django-dashing/pull/20)
- Change to camel case the name of default widget properties (backward compatible)
- Add custom actions in overlay menu of multiple dashboards

## 0.2.4

- Add rivets to manage the main template
- Fix bug in graph chart, not displayed correctly when not on first dashboard set
- Fix issue with awesome fonts when isn't loading from a static url called 'static'

## 0.2.3

- Fix bug related rolling feature

## 0.2.2

- Add rolling through dashboards automatically through url parameter

## 0.2.1

- Fix bug 'more_info' not being displayed for the graph widget. Ty @torstenfeld

## 0.2

- Add data binding + templating solution provided by rivets
- Add permission classes for dashboard view
- Add parameters to the method of registration widget URLs
- Allow load external widgets from [django_dashing_channel](https://github.com/talpor/django-dashing-channel)
- Breaking change: **Custom Widgets** Now the templates are loaded by specifying of a link tag type text/html
- Breaking change: **Custom Widgets** Should be rewritten the templates using the rivets binders
- Breaking change: **Custom Widgets** Is no longer necessary to call the render event when run getData
- Breaking change: **Custom Widgets** Custom widgets extend from Dashing object instead of Dashboard
- Breaking change: **List Widget** Data format expected was changed from [{'Some Label': 'value'}, ...] to [{label: 'Some Label', value: 'value'}, ...]

See [Django Dashing 0.2 release notes](https://github.com/talpor/django-dashing/wiki/Django-Dashing-0.2-release-notes)

## 0.1.2

- Breaking change: Add url registration pattern to access our python widget classes
- Replaced {{ STATIC_URL }} variable by Django 1.5 new {% static %} tag

## 0.1.1

- Fix some bugs

## 0.1.0

- Initial release
