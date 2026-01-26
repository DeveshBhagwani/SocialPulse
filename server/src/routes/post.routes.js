import express from "express";
import {
  createPost,
  getFeed,
  likePost,
  commentPost
} from "../controllers/post.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getFeed);
router.put("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);

export default router;
