const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/connectDB");
const { errorHandler } = require("./middlewares/errorMiddleware");
const usersRouter = require("./routes/usersRouter");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const coursesRouter = require("./routes/coursesRouter");
const courseSectionsRouter = require("./routes/courseSectionsRouter");
const progressRouter = require("./routes/progressRouter");
const chatbotRouter = require("./routes/chatbotRouter");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

connectDB();
const app = express();
// Middleware

const corsOptions = {
  origin: [
    "http://localhost:3000",     // React default port
    "http://localhost:5173",     // Vite default port
    "http://localhost:5174",     // Vite alternative port
    "http://127.0.0.1:3000",     // Local IP variants
    "http://127.0.0.1:5173", 
    "http://127.0.0.1:5174",
    process.env.FRONTEND_URL,    // Production frontend URL from Vercel
    "https://edu-platform-frontend-psi.vercel.app", // Vercel production URL
    "https://edu-platform-frontend-git-main-nandhubabus-projects.vercel.app", // Vercel git URL
    "https://edu-platform-frontend-5je9u1qjk-nandhubabus-projects.vercel.app"
  ].filter(Boolean), // Remove undefined values
  credentials: true, // This is important for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  exposedHeaders: ['Set-Cookie']
};

app.use(morgan("dev"));

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for API server
    crossOriginEmbedderPolicy: false
  }));
} else {
  app.use(helmet());
}

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 100, // Higher limit for production
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
}));
app.use(cors(corsOptions));
app.use(express.json()); // Parses incoming JSON requests
// Use cookie-parser
app.use(cookieParser());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/course-sections", courseSectionsRouter);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/chatbot", chatbotRouter);

//--Error handling middleware---
app.use(errorHandler);

// Starting the server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      '/api/v1/users',
      '/api/v1/courses', 
      '/api/v1/course-sections',
      '/api/v1/progress',
      '/api/v1/chatbot'
    ]
  });
});

// Global error handling
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Promise Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
