const Post = require("../models/Post");

exports.getAll = (req, res, next) => {
  Post.find({}).then((posts) => {
    res.json({
      success: true,
      data: posts,
    });
  });
};

exports.getOne = (req, res, next) => {
  Post.findOne({ _id: req.params.postId }).then((post) => {
    if (!post) {
      return res.json({
        success: false,
        message: "post does not exist!",
      });
    }

    res.json({
      success: true,
      data: post,
    });
  });
};

exports.create = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
  });
  post.save().then((post) => {
    res.json({
      success: true,
      message: "Post Created !",
      data: post,
    });
  });
};

exports.update = (req, res, next) => {
  Post.findOne({ _id: req.body._id })
    .then((post) => {
      if (!post) {
        return res.json({
          success: false,
          message: "post does not exist!",
        });
      }

      post.title = req.body.title;
      post.content = req.body.content;
      post.image = req.body.image;
      return post.save();
    })
    .then((post) => {
      res.status(201).json({
        success: true,
        message: "post updated!",
        data: post,
      });
    });
};

exports.delete = (req, res, next) => {
  Post.findOne({ _id: req.query._id })
    .then((post) => {
      if (!post) {
        return res.json({
          success: false,
          message: "post does not exist!",
        });
      }
      return post.delete();
    })
    .then((post) => {
      res.status(200).json({
        success: true,
        message: "post deleted!",
        data: post,
      });
    });
};
