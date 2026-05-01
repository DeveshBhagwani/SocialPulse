import express from "express";
import {
  commentPost,
  createPost,
  deletePost,
  getFeed,
  getPersonalizedFeed,
  getPostById,
  likePost,
  updatePost
} from "../controllers/post.controller.js";
import protect from "../middleware/auth.middleware.js";
import { uploadPostImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/feed", protect, getPersonalizedFeed);
router
  .route("/")
  .get(protect, getFeed)
  .post(protect, uploadPostImage.single("image"), createPost);

router
  .route("/:id")
  .get(protect, getPostById)
  .put(protect, uploadPostImage.single("image"), updatePost)
  .delete(protect, deletePost);

router.put("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);

export default router;
