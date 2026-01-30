import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";
import { followUser, unfollowUser } from "../controllers/user.controller.js";
import { getPublicProfile } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);
router.get("/:id", protect, getPublicProfile);

export default router;
