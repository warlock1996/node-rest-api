const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Post = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  creator: { type: ObjectId, ref: "User", required: true },
  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Post", Post);
