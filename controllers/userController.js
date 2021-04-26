const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { validationResult } = require("express-validator");

const { getSocket } = require("../config");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        errors: errors.array().map(({ param, msg }) => {
          return { [param]: msg };
        }),
      });
    }
    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      createdAt: Date.now(),
    }).save();
    if (!user) {
      return res.json({
        success: false,
        message: "failed to register user !",
        data: user,
      });
    }

    const socket = getSocket();

    socket.emit("signup", { email: user.email });

    res.json({
      success: true,
      message: "successfully registered !",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        success: false,
        errors: errors.array().map(({ param, msg }) => {
          return { [param]: msg };
        }),
      });
    }

    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user) {
      return res.json({
        success: false,
        message: "user doesnt exist!",
        data: {},
      });
    }

    jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        subject: "TOKEN",
        notBefore: 0,
        expiresIn: Number(process.env.JWT_EXPIRES_SEC),
        algorithm: process.env.JWT_ALGO,
      },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            message: "Server Error !",
          });
        }
        return res.json({
          success: true,
          data: {
            token: token,
          },
        });
      }
    );
  } catch (error) {
    next(error);
  }
};
