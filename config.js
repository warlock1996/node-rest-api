const multer = require("multer");

module.exports.fileConfig = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
  destination: function (req, file, callback) {
    callback(null, "images");
  },
});

module.exports.accessControlHeaders = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
};

module.exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  next();
};
