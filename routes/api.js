const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const postController = require("../controllers/postController");
const { min } = require("../validation");

router.get("/posts", postController.getAll);

router.get("/post/:postId", postController.getOne);

router.post(
  "/post/create",
  [(min("title", 3), min("content", 20), body("image"))],
  postController.create
);

router.put("/post/update", postController.update);

router.delete("/post/delete", postController.delete);

module.exports = router;
