import express from "express";
import {
  getEngagementOverTime,
  getTopPosts
} from "../controllers/analytics.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/engagement", protect, getEngagementOverTime);
router.get("/top-posts", protect, getTopPosts);

export default router;
