import express from "express";
import {
  getAnalyticsSummary,
  getAudienceGrowth,
  getEngagementOverTime,
  getTopPosts
} from "../controllers/analytics.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/summary", protect, getAnalyticsSummary);
router.get("/engagement", protect, getEngagementOverTime);
router.get("/top-posts", protect, getTopPosts);
router.get("/audience-growth", protect, getAudienceGrowth);

export default router;
