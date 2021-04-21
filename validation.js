const { body } = require("express-validator");

exports.min = (key, min) =>
  body(key).isLength({ min: min }).withMessage(`${key} should be > ${min}`);
