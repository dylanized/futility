# Minimos

## lightweight ui framework

# Getting Started

Minimos is a very simple frontend web framework, based on utility css principles.

This repo contains the default version of minimos in the `/dist` folder.

The compiled version consists of these parts:

  - index.html (basic page markup with styleguide components)
  - css/minimos.css (framework CSS)
  - css/app.css (custom CSS)
  - js/app.js (custom JS)
  - lib/ (common JS libraries)

# Building Minimos

This repo also contains the source code to build a custom version of Minimos.

The source contains these parts:

  - project config file (app.json)
  - html templates (index.ejs and 404.ejs)
  - css templates (css/base.css.ejs and css/util.css.ejs)
  - js placeholder file (js/app.js)
  - build script (bin/build)

To build a new compiled version in the `/dist` folder, run `yarn build`.

To serve the built version, run `yarn start` and visit http://localhost:3000.

To format & lint the source code, run `yarn validate`.

# Todo

  - add favicon
  - eslint
  - watch for changes
  - styleguide pages
  - dynamically generate spacers
  - dynamically generate widths
  - dynamically generate border widths
  - validate markup
  - lint more file types
  - lib folder
  - img folder
  - reset?
