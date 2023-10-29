const express = require("express");

// Set port var to env var or default
const port = process.env.PORT || 3000;

// Load config
const config = require("./app.json");

// Instantiate Express app
const app = express();

// Mount static middleware
app.use(express.static("dist"));

// Launch app and display msg
app.listen(port, () => console.log(`Server running on port ${port}`));
