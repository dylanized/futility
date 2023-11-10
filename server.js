const config = require("config");
const ejs = require("ejs");
const express = require("express");
const fs = require("fs");
const path = require("path");

// Instantiate Express app
const app = express();

// If Prod, configure static server
if (process.env.NODE_ENV === "production") {
  app.use(express.static(config.get("app.staticFolder")));
}
// Else configure SSR server
else {
  // Setup template engine
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, config.get("app.srcFolder")));

  // Load theme config and build locals object, then define locals helper
  const theme = JSON.parse(
    fs.readFileSync(`${config.get("app.srcFolder")}/theme.json`),
  );
  const locals = Object.assign({}, config.util.toObject(), theme);

  const buildLocals = (req) => {
    // If ?theme param and child theme exists, load it and merge it into locals, else return locals unchanged
    if (
      req.query.theme &&
      fs.existsSync(`src/theme-${req.query.theme.toLowerCase()}.json`)
    ) {
      const childTheme = JSON.parse(
        fs.readFileSync(`src/theme-${req.query.theme.toLowerCase()}.json`),
      );
      return Object.assign({}, { req }, locals, childTheme);
    }
    return Object.assign({}, { req }, locals);
  };

  // Mount route for 'When user requests an ejs file, reject it with a bare 404'
  app.get("/*.ejs", (req, res) => {
    res.sendStatus(404);
  });

  // Mount middleware for serving static files if they exist
  app.use(express.static(config.get("app.srcFolder")));

  // Mount route for 'When user requests base domain, serve the index page'
  app.get("/", (req, res) => {
    res.render("index", buildLocals(req));
  });

  // Mount route for 'When user requests a css file, try to dynamically render it'
  app.get("/css/:filename", (req, res, next) => {
    // Calculate CSS template filepath and if it exists, render it with CSS contentType, else proceed
    const filepath = `css/${req.params.filename}.ejs`;
    if (fs.existsSync(`src/${filepath}`)) {
      res.contentType("text/css");
      res.render(filepath, buildLocals(req));
    } else {
      next();
    }
  });

  // Mount route for 'When user requests a template, try to render it'
  app.get("/:slug", (req, res, next) => {
    // If template exists, render it, else proceed
    if (fs.existsSync(`src/${req.params.slug + ".ejs"}`)) {
      res.render(req.params.slug, buildLocals(req));
    } else {
      next();
    }
  });

  // Mount route for 'When a user requests any file that doesn't exist, send bare 404'
  app.get(/\./, (req, res) => {
    res.sendStatus(404);
  });

  // Mount route for 'When a user requests any template that doesn't exist, render 404 template'
  app.get("*", (req, res) => {
    res.statusCode = 404;
    res.render("404", buildLocals(req));
  });
}

// Launch app and display msg
app.listen(config.get("app.port"), () =>
  console.log(`Server running on port ${config.get("app.port")}`),
);
