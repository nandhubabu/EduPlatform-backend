# EduPlatform Backend (MERN Dev Journey)

> Personalized Pathways in Tech Learning for students taking our fullstack MERN course.

This repository contains the backend service for the EduPlatform (MERN Dev Journey) application. It is built using Node.js and Express.js, providing robust APIs for user management, course content delivery, progress tracking, and AI-driven interactions.

## 🚀 Features

- **Authentication & Authorization**: Secure user registration, login, and role-based access control using JWT and bcrypt.
- **Course Management**: APIs for retrieving courses, detailed sections, and structured learning paths.
- **Progress Tracking**: Track user progress across different courses and modules.
- **AI Integration**: Built-in chatbot router utilizing `@google/generative-ai` (Gemini).
- **Security**: Hardened with `helmet`, `cors`, and `express-rate-limit` to protect against common web vulnerabilities and abuse.
- **File Uploads**: Supports multipart/form-data for file uploads using `multer`.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Security**: Helmet, Express Rate Limit, CORS
- **AI Tools**: Google Generative AI

## 📁 Project Structure

```
.
├── controllers/          # Request handlers for various routes
├── middlewares/          # Custom Express middlewares (e.g., error handling, auth)
├── models/               # Mongoose schemas (User, Course, CourseSection)
├── routes/               # API route definitions (users, courses, chatbot, etc.)
├── services/             # Core business logic and external service integrations
├── utils/                # Helper functions and database connection logic
├── server.js             # Application entry point
└── package.json          # Project metadata and dependencies
```

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)

## 💻 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tweneboah/mern-dev-journey-backend.git
   cd mern-dev-journey-backend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following required environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# External APIs
# GEMINI_API_KEY=your_google_gemini_api_key (if applicable)
```

## 🚀 Running the Application

**Development Mode:**
Runs the server with Nodemon, automatically restarting on file changes.
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## 📡 API Endpoints Overview

The API is mounted at `/api/v1/`.

- **Users**: `/api/v1/users` - Registration, login, profile management.
- **Courses**: `/api/v1/courses` - Fetching course listings and details.
- **Course Sections**: `/api/v1/course-sections` - Managing sections within courses.
- **Progress**: `/api/v1/progress` - Tracking and updating user progress.
- **Chatbot**: `/api/v1/chatbot` - Endpoints for AI chatbot interactions.

## 🛡️ Error Handling

The application uses a centralized error-handling middleware (`middlewares/errorMiddleware.js`) to ensure consistent API responses. All unhandled routes will return a standardized `404 Route not found` response containing a list of available endpoints.

## 📄 License

This project is licensed under the ISC License.
