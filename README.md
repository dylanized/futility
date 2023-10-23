# Minimos

## lightweight ui framework

# Getting Started

Minimos is a very simple frontend web framework, based on utility css principles and a simple Bash build script.

This repo contains the source files for generating static web template files.

To preview your templates, launch the development server with `yarn start` and visit http://localhost:3000. You will see the Minimos default index page, and can click through your other templates.

To build the static version of your templates, run `yarn build` and explore the generated files in `/dist`. To view these static files, run `yarn start-dist` and visit http://localhost:3000.

# Source Files

HTML Templates:

  - index.ejs (Table of Contents)
  - article.ejs (Blog Article)
  - form.ejs (Form Styles)
  - index.ejs (Table of Contents)
  - landing.ejs (Landing Page)
  - layout-2col.ejs (2 Column Example)
  - layout-3col.ejs (3 Column Example)
  - table.ejs (Table Styles)

CSS Templates:

  - base.css.ejs (CSS Variables & Base Elements)
  - util.css.ejs (Utility Classes)

Configuration & Tooling:

  - app.json (App Config)
  - bin/build (Build Script)

# Compiled Files

The compiled version consists of these parts:

  - app.json (application config)
  - src/base.css
  - src/util.css
  - js/app.js (custom JS)

# Tooling

To format & lint the source code, run `yarn validate`.

# Todo

  - font awesome (or other icon library)
  - basic lipsum in index.html
  - table data styles
  - form.html
  - for each page in this folder, render it

  - yarn start-dist express-static
  - yarn dev index.js
  - 2col, 3col

  - add favicon
  - eslint
  - watch for changes
  - lint more file types
  - lib folder
  - img folder
  - reset?
  - validate 404
  - landing page template
  - resume template
  - article template
  - contact form template
  - build-minify
  - start-minify
