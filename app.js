const mongoose = require("mongoose");
const { connect, getSocket } = require("./config");
const app = require("./express");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const httpserver = app.listen(process.env.PORT, () => {
      console.log(`Server is running at ${process.env.PORT}`);
    });
    connect(httpserver);
    const socket = getSocket();
    socket.on("connection", () => {
      console.log("Connected !");
    });
  })
  .catch((err) => {
    console.log("ERROR: ", err.code);
  });
