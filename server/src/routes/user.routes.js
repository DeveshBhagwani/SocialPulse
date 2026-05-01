import express from "express";
import {
  followUser,
  getMyProfile,
  getPublicProfile,
  unfollowUser,
  updateMyProfile
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/:id", protect, getPublicProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

export default router;
