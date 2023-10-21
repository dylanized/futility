# Minimos

lightweight ui framework

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

- index.html (source markup)
- css/minimos.css (source framework CSS)
- lib/

To build a new compiled version in the `/dist` folder, run `yarn build`.

To serve the compiled version, run `yarn start` and visit http://localhost:3000.

To format & lint the source code, run `yarn validate`.

# Todo

- add favicon
- eslint
- onchange rebuild
