const express = require("express");
const courseController = require("../controllers/course");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { isInstructor } = require("../middlewares/roleAccessMiddleware");

//course Router
const courseRouter = express.Router();

//create course
courseRouter.post(
  "/",
  isAuthenticated,
  isInstructor,
  courseController.createCourse
);
//get all courses
courseRouter.get("/", courseController.getAllCourses);

// Get personalized course recommendations based on assessment
courseRouter.get("/recommendations/personalized", isAuthenticated, courseController.getPersonalizedRecommendations);

// Search courses with AI enhancement
courseRouter.get("/search", courseController.searchCourses);

// Enroll in a course
courseRouter.post("/:courseId/enroll", isAuthenticated, courseController.enrollInCourse);

// Get user's enrolled courses
courseRouter.get("/user/enrolled", isAuthenticated, courseController.getEnrolledCourses);

//update course
courseRouter.put("/:courseId", isInstructor, courseController.update);
//delete course
courseRouter.delete("/:courseId", isInstructor, courseController.delete);
//get a single course
courseRouter.get("/:courseId", courseController.getCourseById);

module.exports = courseRouter;
