import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("post", postSchema);
export default Post;