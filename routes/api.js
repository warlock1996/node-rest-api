const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

router.get("/posts", postController.getAll);

router.get("/post/:postId", postController.getOne);

router.post("/post/create", postController.create);

router.put("/post/update", postController.update);

router.delete("/post/delete", postController.delete);

module.exports = router;
