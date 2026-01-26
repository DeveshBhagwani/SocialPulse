import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      text: req.body.text,
      image: req.body.image || ""
    });

    res.status(201).json(post);
  } 
  catch (error) {
    next(error);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } 
  catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    if (post.likes.includes(req.user._id)) {
      res.status(400);
      throw new Error("Post already liked");
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({ likes: post.likes.length });
  } 
  catch (error) {
    next(error);
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await post.save();
    res.status(201).json(post.comments);
  } 
  catch (error) {
    next(error);
  }
};
