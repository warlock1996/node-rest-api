const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized !",
      data: {},
    });
  }

  const bearerToken = req.headers.authorization.trim().split(" ")[1];

  jwt.verify(
    bearerToken,
    process.env.JWT_SECRET,
    { algorithms: "HS256" },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: err.message,
        });
      }
      // save user _id to current request
      req.userId = new ObjectId(decoded._id);
      next();
    }
  );
};
