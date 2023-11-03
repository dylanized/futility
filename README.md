# Minimos

## lightweight ui framework

# Getting Started

Minimos is a very simple frontend web framework, based on utility css principles and a simple Bash build script.

This repo contains the source files for generating static web template files.

To preview your templates, launch the development server with `yarn dev` and visit http://localhost:3000. You will see the Minimos default index page, and can click through your other templates.

To build the static version of your templates, run `yarn build` and explore the generated files in `/dist`. To view these static files, run `yarn start` and visit http://localhost:3000.

# Source Files

HTML Templates:

- 404.ejs (404 Error Page)
- index.ejs (Table of Contents)
- typography.ejs (Typography Examples)

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

- yarn start index.js

- good table of contents

- font awesome (or other icon library)

- for each page in this folder, render it

- styleguide page

- table data styles

- form.html

- yarn start-dist express-static
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
