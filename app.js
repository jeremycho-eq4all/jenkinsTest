const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const server = app.listen(3010, () => {
  console.log("Server is running on port 3010");
});

module.exports = server; // server 객체를 내보냅니다.
