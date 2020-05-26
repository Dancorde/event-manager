const Utils = require("./utils/utils");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db");

const port = Utils.normalizePort(process.env.PORT);
const server = app.listen(port);

module.exports = server;
