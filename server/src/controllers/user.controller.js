import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import FollowerEvent from "../models/followerEvent.model.js";

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

export const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      res.status(404);
      throw new Error("User not found");
    }

    if (userToFollow._id.equals(currentUser._id)) {
      res.status(400);
      throw new Error("You cannot follow yourself");
    }

    if (currentUser.following.includes(userToFollow._id)) {
      res.status(400);
      throw new Error("Already following this user");
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();
    await FollowerEvent.create({
      user: userToFollow._id,
      follower: currentUser._id
    });

    res.json({
      message: "User followed successfully"
    });
  } 
  catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      res.status(404);
      throw new Error("User not found");
    }

    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(userToUnfollow._id)
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(currentUser._id)
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({
      message: "User unfollowed successfully"
    });
  } 
  catch (error) {
    next(error);
  }
};