import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const stats = await Post.aggregate([
      { $match: { user: req.user._id } },
      {
        $project: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" }
        }
      },
      {
        $group: {
          _id: null,
          posts: { $sum: 1 },
          likes: { $sum: "$likesCount" },
          comments: { $sum: "$commentsCount" }
        }
      }
    ]);

    res.json({
      user,
      stats: stats[0] || { posts: 0, likes: 0, comments: 0 }
    });
  } 
  catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const { bio, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.bio = bio ?? user.bio;
    user.avatar = avatar ?? user.avatar;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });
  } 
  catch (error) {
    next(error);
  }
};
