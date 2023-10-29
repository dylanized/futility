const express = require("express");
const ejs = require("ejs");
const path = require("path");

// Set port var to env var or default
const port = process.env.PORT || 3000;

// Load config
const config = require("./app.json");

// Instantiate Express app
const app = express();

// Setup template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src"));

// Mount static middleware
app.use(express.static("src"));

// Mount route for 'When user requests base route, serve th index page'
app.get("/", (req, res) => {
  res.render("index", config);
});

// Mount route for 'When user requests a top-level page, try to render it'
app.get(/\/^((?!.).)*$:slug/, (req, res, next) => {
  res.render(req.params.slug, config);
});

// Mount route for 'When a user requests a file that doesn't exist, send 404'
app.get("*", (req, res) => {
  res.sendStatus(404);
});

// Launch app and display msg
app.listen(port, () => console.log(`Server running on port ${port}`));
