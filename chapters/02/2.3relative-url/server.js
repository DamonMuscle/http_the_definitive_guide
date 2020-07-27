const path = require("path");
const express = require("express");
const serveStatic = require("serve-static");
const app = express();

const { findAvailablePort } = require("../../../utils");

app.use(serveStatic(path.resolve(__dirname, "public")));

findAvailablePort().then((port) =>
  app.listen(port, () => {
    console.log(`Running @ http://localhost:${port}`);
  })
);
