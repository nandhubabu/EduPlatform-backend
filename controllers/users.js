const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");

const usersController = {
  //--register user
  register: asyncHandler(async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      
      console.log("=== BACKEND REGISTRATION DEBUG ===");
      console.log("Request body:", req.body);
      console.log("Received role:", role);
      console.log("Role type:", typeof role);

      // Validate user input
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Please add all fields" });
      }

      // Validate role
      const validRoles = ["student", "instructor"];
      const userRole = role && validRoles.includes(role) ? role : "student";
      
      console.log("Final user role to save:", userRole);

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user (password will be hashed by the pre-save hook)
      const newUser = new User({
        username,
        email,
        password, // Don't hash here, let the pre-save hook handle it
        role: userRole, // Use the role from request or default to student
      });

      await newUser.save();
      
      console.log("User saved to database:");
      console.log("- ID:", newUser._id);
      console.log("- Username:", newUser.username);
      console.log("- Role:", newUser.role);
      console.log("- Role type:", typeof newUser.role);

      // Generate token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // Set token in HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allow cross-site cookies in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      const responseData = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        message: "Registration successful",
      };
      
      console.log("Sending response:", responseData);
      console.log("=== BACKEND REGISTRATION DEBUG END ===");

      res.status(201).json(responseData);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  }),

  //---login user
  login: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt for:", email);

      // Check for user email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // User authenticated, generate a token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // Set token in HttpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allow cross-site cookies in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Send response
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        message: "Login successful",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }),
  //get all users
  getAllUsers: asyncHandler(async (req, res) => {
    const courseId = req.params.courseId; // Get course ID from query parameters

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const users = await User.find({}).populate({
      path: "progress",
      populate: {
        path: "courseId",
        model: "Course",
        match: { _id: courseId },
        populate: {
          path: "sections",
          model: "CourseSection",
        },
      },
    });

    let userProgressData = users
      .map((user) => {
        const courseProgress = user.progress.find(
          (cp) => cp.courseId && cp.courseId._id.toString() === courseId
        );

        if (!courseProgress) {
          return null;
        }

        const totalSections = courseProgress.courseId.sections.length;
        const sectionsCompleted = courseProgress.sections.filter(
          (section) => section.status === "Completed"
        ).length;
        const progressPercentage =
          totalSections > 0
            ? parseFloat(((sectionsCompleted / totalSections) * 100).toFixed(1))
            : 0;

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          totalSections,
          sectionsCompleted,
          progressPercentage,
          position: null, // Position will be determined after sorting
          username: user.username,
          dateJoined: user?.createdAt,
        };
      })
      .filter((item) => item !== null); // Remove users without progress in the specified course

    // Sort users based on sectionsCompleted and assign positions
    // Sort users based on sectionsCompleted
    userProgressData.sort((a, b) => b.sectionsCompleted - a.sectionsCompleted);

    // Assign positions with dense ranking
    let lastRank = 0;
    let lastSectionsCompleted = -1;
    userProgressData.forEach((user) => {
      if (user.sectionsCompleted !== lastSectionsCompleted) {
        lastRank++;
        lastSectionsCompleted = user.sectionsCompleted;
      }
      user.position = `${lastRank}${
        ["st", "nd", "rd"][((((lastRank + 90) % 100) - 10) % 10) - 1] || "th"
      }`;
    });

    res.json(userProgressData);
  }),

  //get user by id
  getUserById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: "progress",
      populate: {
        path: "courseId",
        model: "Course",
        populate: {
          path: "sections",
          model: "CourseSection",
        },
      },
    });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  }),
  //get user progress
  getUserProgress: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id).populate({
      path: "progress",
      populate: {
        path: "courseId",
        model: "Course",
        populate: {
          path: "sections",
          model: "CourseSection",
        },
      },
    });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user.progress);
  }),
  // user profile
  profile: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const courseIdParam = req.query.courseId; // Get the course ID from the request query
    const user = await User.findById(id).populate({
      path: "progress",
      populate: [
        {
          path: "courseId",
          model: "Course",
          populate: {
            path: "sections",
            model: "CourseSection",
          },
        },
        {
          path: "sections.sectionId",
          model: "CourseSection",
        },
      ],
    });
    console.log("user", user);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    console.log("user", user);
    // Filter progress for a specific course if courseIdParam is provided
    const courseProgress = courseIdParam
      ? user?.progress?.find(
          (p) => p.courseId?._id?.toString() === courseIdParam
        )
      : null;

    // If a specific course progress is found, calculate its summary
    let progressSummary = null;
    if (courseProgress) {
      const totalSections = courseProgress.courseId.sections?.length;
      let completed = 0,
        ongoing = 0,
        notStarted = 0;

      courseProgress.sections.forEach((section) => {
        if (section.status === "Completed") completed++;
        else if (section.status === "In Progress") ongoing++;
        else notStarted++;
      });

      progressSummary = {
        courseId: courseProgress.courseId._id,
        courseTitle: courseProgress.courseId.title,
        totalSections,
        completed,
        ongoing,
        notStarted,
      };
    }

    res.json({ user, courseProgress, progressSummary });
  }),
  //private profile
  privateProfile: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id).populate({
      path: "progress",
      populate: {
        path: "courseId",
        model: "Course",
        populate: {
          path: "sections",
          model: "CourseSection",
        },
      },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Calculating the progress statistics for each course
    const coursesProgress = user.progress.map((courseProgress) => {
      const totalSections = courseProgress.courseId.sections.length;
      let completed = 0,
        ongoing = 0,
        notStarted = 0;

      courseProgress.sections.forEach((section) => {
        if (section.status === "Completed") completed++;
        else if (section.status === "In Progress") ongoing++;
        else notStarted++;
      });

      return {
        courseId: courseProgress.courseId._id,
        courseTitle: courseProgress.courseId.title,
        totalSections,
        completed,
        ongoing,
        notStarted,
      };
    });

    // Preparing the response
    const response = {
      totalCourses: user.progress.length,
      coursesProgress,
    };

    res.json(response);
  }),
  // Check if user is authenticated (no auth middleware — must work when logged out)
  checkAuthenticated: asyncHandler(async (req, res) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).populate({
        path: "coursesCreated",
        model: "Course",
        populate: {
          path: "user sections",
          model: "User CourseSection",
        },
      });
      if (!user) {
        return res.status(200).json({ isAuthenticated: false });
      }
      return res.status(200).json({ isAuthenticated: true, user });
    } catch (error) {
      return res.status(200).json({ isAuthenticated: false });
    }
  }),
  logout: asyncHandler(async (req, res) => {
    res.cookie("token", "", { 
      maxAge: 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });
    res.status(200).json({ message: "Logged out successfully" });
  }),

  // Save assessment result
  saveAssessmentResult: asyncHandler(async (req, res) => {
    try {
      const { scores, topInterests, recommendations } = req.body;
      const userId = req.user.id;

      if (!scores || !topInterests) {
        return res.status(400).json({ 
          message: "Assessment scores and top interests are required" 
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create new assessment result
      const assessmentResult = {
        scores,
        topInterests,
        recommendations: recommendations || [],
        completedAt: new Date()
      };

      // Add to user's assessment results
      user.assessmentResults.push(assessmentResult);

      // Keep only the last 10 assessment results to prevent unlimited growth
      if (user.assessmentResults.length > 10) {
        user.assessmentResults = user.assessmentResults.slice(-10);
      }

      await user.save();

      res.status(200).json({
        message: "Assessment result saved successfully",
        result: assessmentResult
      });

    } catch (error) {
      console.error("Save assessment error:", error);
      res.status(500).json({ 
        message: "Failed to save assessment result",
        error: error.message 
      });
    }
  }),

  // Get all assessment results for user
  getAssessmentResults: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).select('assessmentResults');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Sort by completion date (newest first)
      const sortedResults = user.assessmentResults.sort(
        (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
      );

      res.status(200).json({
        message: "Assessment results retrieved successfully",
        results: sortedResults,
        count: sortedResults.length
      });

    } catch (error) {
      console.error("Get assessment results error:", error);
      res.status(500).json({ 
        message: "Failed to retrieve assessment results",
        error: error.message 
      });
    }
  }),

  // Get latest assessment result
  getLatestAssessmentResult: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId).select('assessmentResults');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.assessmentResults.length === 0) {
        return res.status(200).json({
          message: "No assessment results found",
          result: null
        });
      }

      // Get the most recent assessment result
      const latestResult = user.assessmentResults.sort(
        (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
      )[0];

      res.status(200).json({
        message: "Latest assessment result retrieved successfully",
        result: latestResult
      });

    } catch (error) {
      console.error("Get latest assessment error:", error);
      res.status(500).json({ 
        message: "Failed to retrieve latest assessment result",
        error: error.message 
      });
    }
  }),
};

module.exports = usersController;
