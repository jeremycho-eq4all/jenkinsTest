const express = require("express");
const app = express();

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, World!\n");
});

// Export the app instance
module.exports = app;
