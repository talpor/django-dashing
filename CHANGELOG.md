## 0.2.4

- Add rivets to manage the main template
- Fix bug in graph chart, not displayed correctly when not on first dashboard set
- Fix issue with awesome fonts when isn't loading from a static url called 'static'

## 0.2.3

- Fix bug related rolling feature

## 0.2.2

- Added rolling through dashboards automatically through url parameter

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
