# SocialPulse

SocialPulse is a MERN social media dashboard with authentication, post creation, image uploads, social interactions, and an analytics dashboard that turns raw engagement events into chart-ready insights.

## Features

- JWT authentication with bcrypt password hashing
- Protected React routes with persisted auth state
- Create, read, update, and delete posts
- Cloudinary-backed image uploads for post media
- Personalized feed with pagination and infinite scroll
- Like and comment interactions
- Public profile pages with follow and unfollow actions
- Editable user profile with profile statistics
- Analytics dashboard built with MongoDB aggregation pipelines
- Optional Redis caching for analytics endpoints
- Responsive SaaS-style UI built with Tailwind CSS and Recharts

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Recharts, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Storage | Cloudinary, multer |
| Cache | Redis, optional |

## Architecture

```text
SocialPulse/
  client/                  React application
    src/api/               Axios API client
    src/components/        Reusable UI and chart components
    src/context/           Auth and theme providers
    src/pages/             Dashboard, Feed, Profile, Login
  server/                  Express API
    src/config/            MongoDB and Redis configuration
    src/controllers/       Request handlers
    src/middleware/        Auth, upload, and error middleware
    src/models/            Mongoose schemas
    src/routes/            REST API routes
    src/utils/             JWT, Cloudinary, and cache helpers
```

## Analytics Engine

The dashboard is backed by aggregation-friendly event models:

- `EngagementEvent` records likes and comments with timestamps, actors, posts, and post owners.
- `FollowerEvent` records follow and unfollow events for audience growth.
- MongoDB aggregation pipelines group events by date for 7-day and 30-day charts.
- Summary endpoints combine post totals, current follower counts, and follower deltas.
- Redis caching can be enabled for expensive analytics reads and is invalidated after post interactions or follow changes.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Login and receive a JWT |
| `GET` | `/api/posts/feed` | Paginated personalized feed |
| `POST` | `/api/posts` | Create a text/image post |
| `PUT` | `/api/posts/:id` | Update your post |
| `DELETE` | `/api/posts/:id` | Delete your post |
| `PUT` | `/api/posts/:id/like` | Toggle like on a post |
| `POST` | `/api/posts/:id/comment` | Add a comment |
| `GET` | `/api/users/me` | Current user profile |
| `PUT` | `/api/users/me` | Update profile |
| `GET` | `/api/users/:id` | Public profile |
| `POST` | `/api/users/:id/follow` | Follow a user |
| `POST` | `/api/users/:id/unfollow` | Unfollow a user |
| `GET` | `/api/analytics/summary?days=7` | KPI summary |
| `GET` | `/api/analytics/engagement?days=30` | Like/comment time series |
| `GET` | `/api/analytics/top-posts` | Top five posts |
| `GET` | `/api/analytics/audience-growth?days=7` | Follower growth series |

