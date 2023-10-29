const config = require("config");
const express = require("express");

// Instantiate Express app
const app = express();

// Mount static middleware
app.use(express.static(config.get("app.staticFolder")));

// Launch app and display msg
app.listen(config.get("app.port"), () =>
  console.log(`Server running on port ${config.get("app.port")}`),
);
