const asyncHandler = require("express-async-handler");

const Course = require("../models/Course");
const User = require("../models/User");
const geminiService = require("../services/geminiService");

// Helper function to filter courses based on assessment results
const filterCoursesByRecommendations = async (courses, assessment) => {
  try {
    const { topInterests, scores } = assessment;
    
    // Interest area to course category mapping
    const interestCourseMap = {
      'Realistic': ['engineering', 'development', 'technical', 'programming', 'web development'],
      'Investigative': ['data science', 'analytics', 'research', 'machine learning', 'python'],
      'Artistic': ['design', 'creative', 'ui/ux', 'graphic design', 'content creation'],
      'Social': ['marketing', 'social media', 'communication', 'leadership', 'business'],
      'Enterprising': ['business', 'entrepreneurship', 'management', 'leadership', 'sales'],
      'Conventional': ['project management', 'operations', 'finance', 'administration', 'compliance']
    };

    // Get relevant course categories based on top interests
    let relevantCategories = [];
    topInterests.forEach(interest => {
      if (interestCourseMap[interest]) {
        relevantCategories = [...relevantCategories, ...interestCourseMap[interest]];
      }
    });

    // Filter and score courses
    const scoredCourses = courses.map(course => {
      let relevanceScore = 0;
      const courseText = `${course.title} ${course.description}`.toLowerCase();
      
      // Check for category matches
      relevantCategories.forEach(category => {
        if (courseText.includes(category.toLowerCase())) {
          relevanceScore += 1;
        }
      });

      return {
        ...course.toObject(),
        relevanceScore
      };
    });

    // Sort by relevance and return top matches
    return scoredCourses
      .filter(course => course.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6);

  } catch (error) {
    console.error('Error filtering courses:', error);
    return courses.slice(0, 6); // Return first 6 courses as fallback
  }
};

// Helper function to enhance search results with AI
const enhanceSearchWithAI = async (courses, query, assessment) => {
  try {
    const { topInterests } = assessment;
    
    // Use AI to understand user intent and match with assessment
    const enhancementPrompt = `
    User searched for: "${query}"
    User's career interests: ${topInterests.join(', ')}
    
    Available courses: ${courses.map(c => c.title).join(', ')}
    
    Rank these courses by relevance to the user's search and career interests.
    Return course titles in order of relevance.
    `;

    // For now, use the same filtering logic as above
    // In future, could call Gemini for more sophisticated ranking
    return filterCoursesByRecommendations(courses, assessment);

  } catch (error) {
    console.error('Error enhancing search:', error);
    return courses.slice(0, 6);
  }
};

const courseController = {
  // Create a new course
  createCourse: asyncHandler(async (req, res) => {
    const { title, description, difficulty, duration, category } = req.body;
    //find the user
    const userFound = await User.findById(req.user._id);
    if (!userFound) {
      res.status(404);
      throw new Error("User not found");
    }
    if (userFound?.role !== "instructor") {
      res.status(404);
      throw new Error(
        "You are not authorized to create a course, instructors only"
      );
    }
    //Validate course input
    if (!title || !description || !difficulty || !duration) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    // Check if course already exists

    const courseFound = Course.findOne({ title });
    if (!courseFound) {
      res.status(400);
      throw new Error("Course already exists");
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      difficulty,
      duration,
      user: req.user._id,
    });
    //push course into user courses
    userFound.coursesCreated.push(course._id);
    await userFound.save();

    if (course) {
      res.status(201).json(course);
    } else {
      res.status(400);
      throw new Error("Invalid course data");
    }
  }),
  // Get all courses
  getAllCourses: asyncHandler(async (req, res) => {
    const courses = await Course.find({}).populate({
      path: "user",
      model: "User",
      select: "username email",
    });
    res.json(courses);
  }),
  // Get a single course
  getCourseById: asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId)
      .populate({
        path: "user",
        model: "User",
        select: "username email", // Only select necessary fields
      });
    if (course) {
      res.json(course);
    } else {
      res.status(404);
      throw new Error("Course not found");
    }
  }),
  //update course using mongoose method findByIdAndUpdate
  update: asyncHandler(async (req, res) => {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (course) {
      res.json(course);
    } else {
      res.status(404);
      throw new Error("Course not found");
    }
  }),
  //delete course using mongoose method findByIdAndDelete
  delete: asyncHandler(async (req, res) => {
    //check if a course has students
    const courseFound = await Course.findById(req.params.courseId);

    if (courseFound.students.length > 0) {
      res.status(400);
      throw new Error("Course has students, cannot delete");
    }
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (course) {
      res.json(course);
    } else {
      res.status(404);
      throw new Error("Course not found");
    }
  }),

  // Get personalized course recommendations based on user's assessment
  getPersonalizedRecommendations: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      // Get user's latest assessment results
      const latestAssessment = user.assessmentResults?.length > 0 
        ? user.assessmentResults[user.assessmentResults.length - 1] 
        : null;

      if (!latestAssessment) {
        // Return general course recommendations if no assessment taken
        const courses = await Course.find({}).populate({
          path: "user",
          model: "User",
          select: "username email",
        }).limit(6);
        
        return res.json({
          message: "Take our career assessment to get personalized course recommendations!",
          courses,
          hasAssessment: false
        });
      }

      // Get all available courses
      const allCourses = await Course.find({}).populate({
        path: "user",
        model: "User",
        select: "username email",
      });

      // Use Gemini to analyze assessment and recommend courses
      const topInterests = latestAssessment.topInterests.join(", ");
      const careerGoal = latestAssessment.recommendations?.careerSuggestions?.[0] || "career development";
      
      const aiRecommendations = await geminiService.getCourseRecommendations(careerGoal, topInterests);

      // Match AI recommendations with available courses
      const recommendedCourses = await filterCoursesByRecommendations(allCourses, latestAssessment);

      res.json({
        assessment: latestAssessment,
        aiRecommendations,
        recommendedCourses,
        allCourses: allCourses.slice(0, 8), // Show some general options too
        hasAssessment: true
      });

    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      res.status(500);
      throw new Error("Failed to get course recommendations");
    }
  }),

  // Search courses with AI-enhanced filtering
  searchCourses: asyncHandler(async (req, res) => {
    try {
      const { query, difficulty, category, userInterests } = req.query;
      
      let searchFilter = {};
      
      if (query) {
        searchFilter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }

      if (difficulty) {
        searchFilter.difficulty = difficulty;
      }

      const courses = await Course.find(searchFilter).populate({
        path: "user",
        model: "User",
        select: "username email",
      });

      // If user has interests from assessment, use AI to enhance results
      if (userInterests && req.user) {
        const user = await User.findById(req.user._id);
        const latestAssessment = user.assessmentResults?.length > 0 
          ? user.assessmentResults[user.assessmentResults.length - 1] 
          : null;

        if (latestAssessment) {
          const enhancedResults = await enhanceSearchWithAI(courses, query, latestAssessment);
          return res.json({
            courses: enhancedResults,
            searchQuery: query,
            hasAssessmentData: true
          });
        }
      }

      res.json({
        courses,
        searchQuery: query,
        hasAssessmentData: false
      });

    } catch (error) {
      console.error('Error searching courses:', error);
      res.status(500);
      throw new Error("Failed to search courses");
    }
  }),

  // Enroll user in a course
  enrollInCourse: asyncHandler(async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user._id;

      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404);
        throw new Error("Course not found");
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      // Check if already enrolled
      if (course.students.includes(userId)) {
        return res.status(409).json({
          message: "Already enrolled in this course",
          isEnrolled: true,
          course: await Course.findById(courseId).populate("user", "username email")
        });
      }

      // Check if user is the instructor
      if (course.user.toString() === userId.toString()) {
        return res.status(403).json({
          message: "Instructors cannot enroll in their own courses",
          isInstructor: true,
          course: await Course.findById(courseId).populate("user", "username email")
        });
      }

      // Enroll user
      course.students.push(userId);
      await course.save();

      // Add course to user's enrolled courses
      if (!user.coursesEnrolled) {
        user.coursesEnrolled = [];
      }
      user.coursesEnrolled.push(courseId);
      await user.save();

      res.json({
        message: "Successfully enrolled in course",
        course: await Course.findById(courseId).populate("user", "username email")
      });

    } catch (error) {
      console.error('Error enrolling in course:', error);
      res.status(500);
      throw new Error("Failed to enroll in course");
    }
  }),

  // Get user's enrolled courses
  getEnrolledCourses: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate({
        path: "coursesEnrolled",
        model: "Course",
        populate: {
          path: "user",
          model: "User",
          select: "username email"
        }
      });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      res.json({
        enrolledCourses: user.coursesEnrolled || [],
        totalEnrolled: user.coursesEnrolled?.length || 0
      });

    } catch (error) {
      console.error('Error getting enrolled courses:', error);
      res.status(500);
      throw new Error("Failed to get enrolled courses");
    }
  })
};

module.exports = courseController;
