import FollowerEvent from "../models/followerEvent.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { clearAnalyticsCache } from "../utils/cache.js";

const getUserPostStats = async (userId) => {
  const stats = await Post.aggregate([
    { $match: { user: userId } },
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

  return stats[0] || { posts: 0, likes: 0, comments: 0 };
};

const buildProfileResponse = async (user, currentUserId) => {
  const stats = await getUserPostStats(user._id);
  const followers = user.followers || [];
  const following = user.following || [];

  return {
    user,
    stats: {
      ...stats,
      followers: followers.length,
      following: following.length
    },
    isFollowing: currentUserId
      ? followers.some((follower) => follower._id.equals(currentUserId))
      : false
  };
};

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("followers", "_id")
      .populate("following", "_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await buildProfileResponse(user);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const bio = req.body.bio?.trim();
    const avatar = req.body.avatar?.trim();

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof req.body.bio !== "undefined") {
      user.bio = bio || "";
    }

    if (typeof req.body.avatar !== "undefined") {
      user.avatar = avatar || "";
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow._id.equals(currentUser._id)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (currentUser.following.some((id) => id.equals(userToFollow._id))) {
      return res.status(409).json({ message: "Already following this user" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
    userToFollow.followersCount = userToFollow.followers.length;

    await Promise.all([
      currentUser.save(),
      userToFollow.save(),
      FollowerEvent.create({
        user: userToFollow._id,
        follower: currentUser._id,
        type: "follow"
      })
    ]);

    await clearAnalyticsCache(userToFollow._id);

    res.json({
      message: "User followed successfully",
      followers: userToFollow.followers.length,
      following: currentUser.following.length
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const wasFollowing = currentUser.following.some((id) =>
      id.equals(userToUnfollow._id)
    );

    if (!wasFollowing) {
      return res.status(409).json({ message: "You are not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(userToUnfollow._id)
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(currentUser._id)
    );
    userToUnfollow.followersCount = userToUnfollow.followers.length;

    await Promise.all([
      currentUser.save(),
      userToUnfollow.save(),
      FollowerEvent.create({
        user: userToUnfollow._id,
        follower: currentUser._id,
        type: "unfollow"
      })
    ]);

    await clearAnalyticsCache(userToUnfollow._id);

    res.json({
      message: "User unfollowed successfully",
      followers: userToUnfollow.followers.length,
      following: currentUser.following.length
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "_id")
      .populate("following", "_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await buildProfileResponse(user, req.user._id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
