const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const User = require("../models/User");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/posts", postController.getAll);

router.get("/post/:postId", postController.getOne);

router.post("/post/create", auth, postController.create);

router.put("/post/update", auth, postController.update);

router.delete("/post/delete", auth, postController.delete);

router.post(
  "/signup",
  [
    body("name").isLength({ min: 3 }),
    body("email")
      .isEmail()
      .withMessage("Invalid Email !")
      .bail()
      .custom((value, { req, next }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) return Promise.reject("email already in use !");
          return true;
        });
      }),
    body("password").isString().isLength({ min: 8 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("passwords do not match !");
      return true;
    }),
  ],
  userController.signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid Email !")
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) return Promise.reject("email doesn not exist !");
          return true;
        });
      }),
    body("password")
      .isString()
      .isLength({ min: 8 })
      .withMessage("password must be >= 8 chars !"),
  ],
  userController.login
);

// fallback handler
router.all("*", (req, res, next) => {
  res.json({
    message: "route doesnt exists !, dont wander around...",
  });
});

module.exports = router;
