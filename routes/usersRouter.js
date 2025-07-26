const express = require("express");
const usersController = require("../controllers/users");
const { isAuthenticated } = require("../middlewares/isAuthenticated");
const { body, validationResult } = require("express-validator");

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  usersController.register
);
// user profile
usersRouter.get("/profile", isAuthenticated, usersController.profile);

// Login route with validation
usersRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
  usersController.login
);
// usersRouter.post("/logout", usersController.logoutUser);
usersRouter.get("/position/:courseId", usersController.getAllUsers);
//private profile
usersRouter.get(
  "/profile/private",
  isAuthenticated,
  usersController.privateProfile
);
usersRouter.get(
  "/checkAuthenticated",
  isAuthenticated,
  usersController.checkAuthenticated
);
//logout
usersRouter.post("/logout", usersController.logout);

// Assessment routes
usersRouter.post("/assessment/save", isAuthenticated, usersController.saveAssessmentResult);
usersRouter.get("/assessment/results", isAuthenticated, usersController.getAssessmentResults);
usersRouter.get("/assessment/latest", isAuthenticated, usersController.getLatestAssessmentResult);

//get user by id
// usersRouter.get("/:id", usersController.getUserById);

module.exports = usersRouter;
