const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
const multer = require("multer");
const bodyParser = require("body-parser");

const routes = require("./routes/api");
const { fileConfig, accessControlHeaders, errorHandler } = require("./config");

const app = express();
app.use(bodyParser.json());
app.use(multer({ storage: fileConfig }).single("imageUrl"));
app.use(errorHandler);
app.use(accessControlHeaders);
app.use(routes);

module.exports = app;
