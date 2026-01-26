import Post from "../models/post.model.js";
import mongoose from "mongoose";

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

