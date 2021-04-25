const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const { validationResult } = require("express-validator");

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      success: false,
      errors: errors.array().map(({ param, msg }) => {
        return { [param]: msg };
      }),
    });
  }
  // find creator by reading the req._id
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        return res.json({
          success: false,
          message: "user doest not exist!",
        });
      }
      // create a new post object with creator data
      const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path,
        creator: user._id,
        createdAt: Date.now(),
      });
      // save the post
      post.save().then((post) => {
        res.json({
          success: true,
          message: "post created !",
          data: post,
        });
      });
    })
    .catch((err) => {
      console.log(err);
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

      if(post.creator.toString() !== req.userId.toString()) {
        return res.json({
          success: false,
          message: 'unauthorized to edit this post'
        })
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

      if (post.creator.toString() !== req.userId.toString()) {
        return res.json({
          success: false,
          message: "unauthorized to delete this post",
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
