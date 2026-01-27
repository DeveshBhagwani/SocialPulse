import express from "express";
import { getAnalyticsSummary } from "../controllers/analytics.controller.js";

import {
  getEngagementOverTime,
  getTopPosts
} from "../controllers/analytics.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/engagement", protect, getEngagementOverTime);
router.get("/top-posts", protect, getTopPosts);
router.get("/summary", protect, getAnalyticsSummary);

export default router;
