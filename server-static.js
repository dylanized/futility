const express = require("express");
const config = require("config");

// Instantiate Express app
const app = express();

// Mount static middleware
app.use(express.static(config.get("staticFolder")));

// Launch app and display msg
app.listen(config.get("port"), () =>
  console.log(`Server running on port ${config.get("port")}`),
);
