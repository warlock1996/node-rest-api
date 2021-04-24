const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      errors: errors.array().map(({ param, msg }) => {
        return { [param]: msg };
      }),
    });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    token: null,
    createdAt: Date.now(),
  });

  user
    .save()
    .then((user) => {
      if (!user) {
        return res.json({
          success: false,
          message: "failed to register user !",
          data: user,
        });
      }

      res.json({
        success: true,
        message: "successfully registered !",
        data: user,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      errors: errors.array().map(({ param, msg }) => {
        return { [param]: msg };
      }),
    });
  }

  User.findOne({ email: req.body.email, password: req.body.password }).then(
    (user) => {
      if (!user) {
        return res.json({
          success: false,
          message: "user doesnt exist!",
          data: {},
        });
      }

      jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          subject: "TOKEN",
          notBefore: 0,
          expiresIn: 600,
          algorithm: "HS256",
        },
        (err, token) => {
          if (err) {
            return res.status(500).json({
              message: "Server Error !",
            });
          }
          user.token = token;
          user.save().then((user) => {
            res.json({
              success: true,
              data: {
                name: user.name,
                email: user.email,
                token: user.token,
              },
            });
          });
        }
      );
    }
  );
};
