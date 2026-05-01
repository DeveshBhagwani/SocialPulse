import mongoose from "mongoose";

const followerEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["follow", "unfollow"],
      default: "follow"
    }
  },
  { timestamps: true }
);

followerEventSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("FollowerEvent", followerEventSchema);
