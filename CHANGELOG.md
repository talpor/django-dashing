## feature/rivetsjs

- Add data binding + templating solution provided by rivets
- Breaking change: [Custom Widgets] Now the templates are loaded by specifying of a link tag type text/html
- Breaking change: [Custom Widgets] Should be rewritten the templates using the rivets binders
- Breaking change: [Custom Widgets] Is no longer necessary to call the render event when run getData
- Breaking change: [Custom Widgets] Custom widgets extend from Dashing object instead of Dashboard
- Breaking change: [List Widget] Data format expected was changed from [{'Some Label': 'value'}, ...] to [{label: 'Some Label', value: 'value'}, ...] 

## master

- Add parameters to the method of registration widget URLs
- Provide an overrideable way to set user permissions for dashboard

## 0.1.2

- Breaking change: Add url registration pattern to access our python widget classes
- Replaced {{ STATIC_URL }} variable by Django 1.5 new {% static %} tag

## 0.1.1

- Fix some bugs

## 0.1.0

- Initial release
