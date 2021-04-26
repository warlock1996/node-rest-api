const multer = require("multer");
const socketio = require("socket.io");

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
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
};

module.exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  next();
};

let socket;
module.exports.connect = (httpserver) => {
  socket = socketio(httpserver, {
    cors: {
      origin: "*",
    },
  });
};
module.exports.getSocket = () => {
  if (!socket) {
    throw new Error("Socket Connection Failed !");
  }

  return socket;
};

module.exports.sum = (a, b) => {
  return a + b;
};
