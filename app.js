const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const routes = require("./routes/api");
const { fileConfig, accessControlHeaders, errorHandler } = require("./config");

const app = express();

app.use(bodyParser.json());
app.use(multer({ storage: fileConfig }).single("imageUrl"));

app.use(errorHandler);
app.use(accessControlHeaders);
app.use(routes);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("ERROR: ", err);
  });
