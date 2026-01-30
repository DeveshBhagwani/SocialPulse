import Post from "../models/post.model.js";
import mongoose from "mongoose";
import FollowerEvent from "../models/followerEvent.model.js";

export const getAudienceGrowth = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await FollowerEvent.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          createdAt: { $gte: startDate }
        }
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          }
        }
      },
      {
        $group: {
          _id: "$date",
          newFollowers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getEngagementOverTime = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await Post.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          createdAt: { $gte: startDate }
        }
      },
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          engagement: {
            $add: [{ $size: "$likes" }, { $size: "$comments" }]
          }
        }
      },
      {
        $group: {
          _id: "$date",
          totalEngagement: { $sum: "$engagement" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);
  } 
  catch (error) {
    next(error);
  }
};

export const getTopPosts = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $project: {
          text: 1,
          engagement: {
            $add: [{ $size: "$likes" }, { $size: "$comments" }]
          }
        }
      },
      { $sort: { engagement: -1 } },
      { $limit: 5 }
    ]);

    res.json(posts);
  } 
  catch (error) {
    next(error);
  }
};

export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const summary = await Post.aggregate([
      {
        $match: {
          user: req.user._id
        }
      },
      {
        $project: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" }
        }
      },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: "$likesCount" },
          totalComments: { $sum: "$commentsCount" }
        }
      }
    ]);

    if (!summary.length) {
      return res.json({
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0
      });
    }

    res.json(summary[0]);
  } catch (error) {
    next(error);
  }
};
