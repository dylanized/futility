# Futility UI

### The Simple Web Framework

## Preparation

Download the repo to your local machine. You'll need NodeJS 16+ and Yarn installed.

Run `yarn install` to install packages.

## Part 1 - Explore the Static Files

Look in `/dist` to see the static rendered files.

Notice the HTML templates, along with CSS files in the CSS folder.

Run `yarn start` to serve the static files on http://localhost:2000

## Part 2 - Build a Custom Site

Look in `/themes/alpha` to see the default Futility theme, called Alpha.

Notice the EJS templates, along with dynamic CSS templates in the CSS folder.

Run `yarn dev` to launch the dev server on http://localhost:3000

It will restart when you edit files.

Run `yarn build` to generate new static files in the `/dist` folder.

## Part 3 - Extra Features

Run `yarn minify` to generate minified CSS files in the dist folder.

Change the theme folder like `THEME=foobar yarn dev`.

Explore and customize the static site generation process in `bin/build`.

Format the code with `yarn format`, then validate it with `yarn validate`.
