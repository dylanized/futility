const config = require("config");
const ejs = require("ejs");
const express = require("express");
const path = require("path");

// Instantiate Express app
const app = express();

// Setup template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, config.get("app.srcFolder")));

// Mount static middleware
app.use(express.static(config.get("app.srcFolder")));

// Mount route for 'When user requests base route, serve the index page'
app.get("/", (req, res) => {
  res.render("index", config);
});

// Mount route for 'When user requests a top-level page, try to render it'
app.get(/\/^((?!.).)*$:slug/, (req, res, next) => {
  // TODO - check if file exists
  res.render(req.params.slug, config);
});

// Mount route for 'When a user requests a file that doesn't exist, send 404'
app.get("*", (req, res) => {
  res.sendStatus(404);
});

// Launch app and display msg
app.listen(config.get("app.port"), () =>
  console.log(`Server running on port ${config.get("app.port")}`),
);
