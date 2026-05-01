import cloudinary from "../utils/cloudinary.js";
import EngagementEvent from "../models/engagementEvent.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { clearAnalyticsCache } from "../utils/cache.js";

const populatePost = (query) =>
  query
    .populate("user", "username avatar")
    .populate("comments.user", "username avatar");

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 25);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const destroyCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.warn("Cloudinary cleanup skipped:", error.message);
  }
};

const getUploadedImage = (req) => {
  if (!req.file) return null;

  if (!req.file.path) {
    const error = new Error("Cloudinary is not configured for image uploads");
    error.statusCode = 500;
    throw error;
  }

  return {
    image: req.file.path,
    imagePublicId: req.file.filename || ""
  };
};

export const createPost = async (req, res, next) => {
  try {
    const text = req.body.text?.trim() || "";
    const uploadedImage = getUploadedImage(req);
    const image = uploadedImage?.image || req.body.image?.trim() || "";
    const imagePublicId = uploadedImage?.imagePublicId || "";

    if (!text && !image) {
      return res.status(400).json({ message: "Post text or image is required" });
    }

    const post = await Post.create({
      user: req.user._id,
      text,
      image,
      imagePublicId
    });

    const populatedPost = await populatePost(Post.findById(post._id));
    await clearAnalyticsCache(req.user._id);

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [posts, total] = await Promise.all([
      populatePost(Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit)),
      Post.countDocuments()
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPersonalizedFeed = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const user = await User.findById(req.user._id).select("following");
    const feedUserIds = [...user.following, req.user._id];
    const filter = { user: { $in: feedUserIds } };

    const [posts, total] = await Promise.all([
      populatePost(
        Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
      ),
      Post.countDocuments(filter)
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await populatePost(Post.findById(req.params.id));

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your posts" });
    }

    const uploadedImage = getUploadedImage(req);

    if (typeof req.body.text !== "undefined") {
      post.text = req.body.text.trim();
    }

    if (uploadedImage) {
      await destroyCloudinaryImage(post.imagePublicId);
      post.image = uploadedImage.image;
      post.imagePublicId = uploadedImage.imagePublicId;
    } else if (typeof req.body.image !== "undefined") {
      post.image = req.body.image.trim();
      post.imagePublicId = "";
    }

    if (!post.text && !post.image) {
      return res.status(400).json({ message: "Post text or image is required" });
    }

    await post.save();
    await clearAnalyticsCache(post.user);

    const populatedPost = await populatePost(Post.findById(post._id));
    res.json(populatedPost);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your posts" });
    }

    await Promise.all([
      EngagementEvent.deleteMany({ post: post._id }),
      destroyCloudinaryImage(post.imagePublicId)
    ]);

    await post.deleteOne();
    await clearAnalyticsCache(req.user._id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.findIndex((id) => id.equals(req.user._id));
    const liked = likeIndex === -1;

    if (liked) {
      post.likes.push(req.user._id);
      await EngagementEvent.create({
        post: post._id,
        postOwner: post.user,
        actor: req.user._id,
        type: "like"
      });
    } else {
      post.likes.splice(likeIndex, 1);
      await EngagementEvent.deleteOne({
        post: post._id,
        actor: req.user._id,
        type: "like"
      });
    }

    await post.save();
    await clearAnalyticsCache(post.user);

    res.json({
      liked,
      likes: post.likes.length
    });
  } catch (error) {
    next(error);
  }
};

export const commentPost = async (req, res, next) => {
  try {
    const text = req.body.text?.trim();

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      user: req.user._id,
      text
    });

    await post.save();

    const comment = post.comments[post.comments.length - 1];
    await EngagementEvent.create({
      post: post._id,
      postOwner: post.user,
      actor: req.user._id,
      type: "comment",
      comment: comment._id
    });

    await clearAnalyticsCache(post.user);

    const populatedPost = await populatePost(Post.findById(post._id));
    res.status(201).json({
      comment: populatedPost.comments.id(comment._id),
      comments: populatedPost.comments
    });
  } catch (error) {
    next(error);
  }
};
