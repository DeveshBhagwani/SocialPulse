import mongoose from "mongoose";

const engagementEventSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    postOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["like", "comment"],
      required: true
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);

engagementEventSchema.index({ postOwner: 1, createdAt: -1 });
engagementEventSchema.index({ post: 1, actor: 1, type: 1 });

export default mongoose.model("EngagementEvent", engagementEventSchema);
