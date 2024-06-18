const express = require("express");
const app = express();
const port = 3010;

app.get("/", (req, res) => {
  res.send("Hello, World!\n");
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
