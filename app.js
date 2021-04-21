const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");

const routes = require("./routes/api");

const app = express();

const fileStorage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
  destination: function (req, file, callback) {
    callback(null, "images");
  },
});

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/feed", routes);

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
