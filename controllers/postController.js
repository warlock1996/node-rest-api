const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.getAll = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId });
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
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
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
    // find creator by reading the req._id
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({
        success: false,
        message: "user doest not exist!",
      });
    }
    const post = await new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file.path,
      creator: user._id,
      createdAt: Date.now(),
    }).save();
    res.json({
      success: true,
      message: "post created !",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.body._id });
    if (!post) {
      return res.json({
        success: false,
        message: "post does not exist!",
      });
    }
    if (post.creator.toString() !== req.userId.toString()) {
      return res.json({
        success: false,
        message: "unauthorized to edit this post",
      });
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    const updatedPost = await post.save();
    res.status(201).json({
      success: true,
      message: "post updated!",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.query._id });
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
    const deletedPost = await post.delete();
    res.status(200).json({
      success: true,
      message: "post deleted!",
      data: deletedPost,
    });
  } catch (error) {
    next(error);
  }
};
