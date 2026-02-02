import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import postRoutes from "./routes/post.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();
app.use(cors());
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.options("*", cors(corsOptions));
app.use(express.json());
// Routes FIRST
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/analytics", analyticsRoutes);
// Error middleware LAST (always)
app.use(errorHandler);

export default app;
