import mongoose from "mongoose";
import EngagementEvent from "../models/engagementEvent.model.js";
import FollowerEvent from "../models/followerEvent.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getOrSetCache } from "../utils/cache.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const parseDays = (value) => {
  const days = Number(value) || 7;
  return Math.min(Math.max(days, 1), 30);
};

const getDateWindow = (days) => {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (days - 1));

  return startDate;
};

const buildDateSeries = (days) => {
  const dates = [];
  const cursor = getDateWindow(days);

  for (let index = 0; index < days; index += 1) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const fillSeries = (days, rows, defaults) => {
  const rowsByDate = new Map(rows.map((row) => [row.date, row]));

  return buildDateSeries(days).map((date) => ({
    date,
    ...defaults,
    ...rowsByDate.get(date)
  }));
};

export const getEngagementOverTime = async (req, res, next) => {
  try {
    const days = parseDays(req.query.days);
    const userId = toObjectId(req.user._id);
    const cacheKey = `analytics:${req.user._id}:engagement:${days}`;

    const data = await getOrSetCache(cacheKey, 120, async () => {
      const rows = await EngagementEvent.aggregate([
        {
          $match: {
            postOwner: userId,
            createdAt: { $gte: getDateWindow(days) }
          }
        },
        {
          $project: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            },
            type: 1
          }
        },
        {
          $group: {
            _id: "$date",
            likes: {
              $sum: { $cond: [{ $eq: ["$type", "like"] }, 1, 0] }
            },
            comments: {
              $sum: { $cond: [{ $eq: ["$type", "comment"] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            likes: 1,
            comments: 1,
            totalEngagement: { $add: ["$likes", "$comments"] }
          }
        },
        { $sort: { date: 1 } }
      ]);

      return fillSeries(days, rows, {
        likes: 0,
        comments: 0,
        totalEngagement: 0
      });
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTopPosts = async (req, res, next) => {
  try {
    const userId = toObjectId(req.user._id);
    const cacheKey = `analytics:${req.user._id}:top-posts`;

    const posts = await getOrSetCache(cacheKey, 300, async () =>
      Post.aggregate([
        {
          $match: {
            user: userId
          }
        },
        {
          $project: {
            text: 1,
            likes: { $size: "$likes" },
            comments: { $size: "$comments" },
            engagement: {
              $add: [{ $size: "$likes" }, { $size: "$comments" }]
            }
          }
        },
        {
          $project: {
            text: {
              $cond: [
                { $gt: [{ $strLenCP: { $ifNull: ["$text", ""] } }, 0] },
                { $substrCP: [{ $ifNull: ["$text", ""] }, 0, 64] },
                "Image post"
              ]
            },
            likes: 1,
            comments: 1,
            engagement: 1
          }
        },
        { $sort: { engagement: -1, _id: -1 } },
        { $limit: 5 }
      ])
    );

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const days = parseDays(req.query.days);
    const userId = toObjectId(req.user._id);
    const cacheKey = `analytics:${req.user._id}:summary:${days}`;

    const summary = await getOrSetCache(cacheKey, 120, async () => {
      const [postStats, user, followerStats] = await Promise.all([
        Post.aggregate([
          {
            $match: {
              user: userId
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
        ]),
        User.findById(userId).select("followers following"),
        FollowerEvent.aggregate([
          {
            $match: {
              user: userId,
              createdAt: { $gte: getDateWindow(days) }
            }
          },
          {
            $project: {
              eventType: { $ifNull: ["$type", "follow"] }
            }
          },
          {
            $group: {
              _id: null,
              newFollowers: {
                $sum: { $cond: [{ $eq: ["$eventType", "follow"] }, 1, 0] }
              },
              lostFollowers: {
                $sum: { $cond: [{ $eq: ["$eventType", "unfollow"] }, 1, 0] }
              }
            }
          }
        ])
      ]);

      const posts = postStats[0] || {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0
      };
      const followers = followerStats[0] || {
        newFollowers: 0,
        lostFollowers: 0
      };

      return {
        ...posts,
        currentFollowers: user?.followers.length || 0,
        currentFollowing: user?.following.length || 0,
        newFollowers: followers.newFollowers,
        lostFollowers: followers.lostFollowers,
        followerDelta: followers.newFollowers - followers.lostFollowers
      };
    });

    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const getAudienceGrowth = async (req, res, next) => {
  try {
    const days = parseDays(req.query.days);
    const userId = toObjectId(req.user._id);
    const cacheKey = `analytics:${req.user._id}:audience-growth:${days}`;

    const data = await getOrSetCache(cacheKey, 120, async () => {
      const rows = await FollowerEvent.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: getDateWindow(days) }
          }
        },
        {
          $project: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            },
            eventType: { $ifNull: ["$type", "follow"] }
          }
        },
        {
          $group: {
            _id: "$date",
            newFollowers: {
              $sum: { $cond: [{ $eq: ["$eventType", "follow"] }, 1, 0] }
            },
            lostFollowers: {
              $sum: { $cond: [{ $eq: ["$eventType", "unfollow"] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            newFollowers: 1,
            lostFollowers: 1,
            netFollowers: { $subtract: ["$newFollowers", "$lostFollowers"] }
          }
        },
        { $sort: { date: 1 } }
      ]);

      return fillSeries(days, rows, {
        newFollowers: 0,
        lostFollowers: 0,
        netFollowers: 0
      });
    });

    res.json(data);
  } catch (error) {
    next(error);
  }
};
