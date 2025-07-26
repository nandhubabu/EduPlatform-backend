const mongoose = require("mongoose");
const Course = require("./models/Course");
const User = require("./models/User");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Advanced course data with comprehensive content
const advancedCourses = [
  {
    title: "Complete Full-Stack Web Development Bootcamp",
    description: "Master modern web development from frontend to backend, including React, Node.js, databases, and deployment. Build 5 real-world projects and learn industry best practices.",
    difficulty: "Intermediate",
    duration: "12 weeks",
    category: "Web Development",
    tags: ["React", "Node.js", "JavaScript", "MongoDB", "Express", "Full Stack"],
    price: 199,
    level: "Intermediate",
    estimatedHours: 120,
    whatYouWillLearn: [
      "Build modern web applications with React and Node.js",
      "Master JavaScript ES6+ features and asynchronous programming",
      "Design and implement RESTful APIs",
      "Work with databases (MongoDB, PostgreSQL)",
      "Implement authentication and authorization",
      "Deploy applications to cloud platforms",
      "Follow industry best practices and coding standards",
      "Use Git and GitHub for version control",
      "Debug and test web applications"
    ],
    prerequisites: [
      "Basic HTML, CSS, and JavaScript knowledge",
      "Understanding of programming fundamentals",
      "Familiarity with command line interface"
    ],
    language: "English",
    subtitleLanguages: ["Spanish", "French", "German"],
    thumbnail: "/images/courses/fullstack-bootcamp.jpg",
    promoVideo: "https://youtube.com/watch?v=example1",
    modules: [
      {
        title: "Frontend Fundamentals",
        description: "Master modern frontend development with HTML5, CSS3, and JavaScript ES6+",
        order: 1,
        estimatedTime: 480, // 8 hours
        learningObjectives: [
          "Create responsive layouts with CSS Grid and Flexbox",
          "Master JavaScript ES6+ features",
          "Understand DOM manipulation and event handling",
          "Work with APIs and asynchronous JavaScript"
        ],
        lessons: [
          {
            title: "Modern HTML5 and Semantic Markup",
            description: "Learn semantic HTML5 elements and accessibility best practices",
            order: 1,
            estimatedTime: 45,
            type: "video",
            difficulty: "easy",
            content: {
              videoUrl: "https://youtube.com/watch?v=html5-example",
              youtubeId: "html5-example",
              videoDuration: 2700, // 45 minutes
              videoQuality: "1080p",
              subtitles: [
                { language: "English", url: "/subtitles/html5-en.vtt" },
                { language: "Spanish", url: "/subtitles/html5-es.vtt" }
              ],
              transcript: "In this lesson, we'll explore the semantic elements introduced in HTML5...",
              tags: ["HTML5", "Semantic Markup", "Accessibility"],
              keywords: ["semantic", "accessibility", "HTML5", "markup"],
              references: [
                "https://developer.mozilla.org/en-US/docs/Web/HTML",
                "https://www.w3.org/WAI/WCAG21/quickref/"
              ]
            }
          },
          {
            title: "CSS Grid and Flexbox Mastery",
            description: "Create complex, responsive layouts with modern CSS",
            order: 2,
            estimatedTime: 60,
            type: "interactive",
            difficulty: "medium",
            content: {
              interactiveType: "code_editor",
              startingCode: `/* Create a responsive grid layout */
.container {
  display: grid;
  /* Add your grid properties here */
}`,
              expectedOutput: "A responsive 3-column grid that adapts to mobile",
              hints: [
                "Use grid-template-columns for column definition",
                "Consider using minmax() for responsiveness",
                "Don't forget about grid-gap for spacing"
              ],
              textContent: `# CSS Grid and Flexbox Mastery

## Learning Objectives
- Understand the difference between Grid and Flexbox
- Create complex layouts with CSS Grid
- Build responsive components with Flexbox
- Combine Grid and Flexbox effectively

## CSS Grid Fundamentals
CSS Grid Layout is a two-dimensional layout system...`,
              tags: ["CSS", "Grid", "Flexbox", "Responsive Design"],
              keywords: ["grid", "flexbox", "responsive", "layout"]
            }
          },
          {
            title: "JavaScript ES6+ Fundamentals Quiz",
            description: "Test your understanding of modern JavaScript features",
            order: 3,
            estimatedTime: 30,
            type: "quiz",
            difficulty: "medium",
            content: {
              questions: [
                {
                  question: "What is the difference between let, const, and var in JavaScript?",
                  type: "multiple_choice",
                  options: [
                    "There is no difference, they all declare variables the same way",
                    "let and const are block-scoped, var is function-scoped, const cannot be reassigned",
                    "var is the newest way to declare variables",
                    "let is for numbers, const is for strings, var is for objects"
                  ],
                  correctAnswer: "let and const are block-scoped, var is function-scoped, const cannot be reassigned",
                  explanation: "let and const introduced in ES6 are block-scoped, while var is function-scoped. const prevents reassignment but allows mutation of objects/arrays.",
                  points: 2
                },
                {
                  question: "Arrow functions automatically bind the 'this' context to the surrounding scope.",
                  type: "true_false",
                  correctAnswer: "true",
                  explanation: "Arrow functions do not have their own 'this' binding and inherit it from the enclosing scope.",
                  points: 1
                }
              ],
              passingScore: 70,
              timeLimit: 30
            }
          }
        ],
        moduleQuiz: {
          title: "Frontend Fundamentals Assessment",
          description: "Comprehensive quiz covering HTML5, CSS3, and JavaScript ES6+",
          timeLimit: 45,
          passingScore: 75,
          maxAttempts: 2,
          questions: [
            {
              question: "Which CSS property is used to create a flexbox container?",
              type: "multiple_choice",
              options: ["display: flex", "flex-container: true", "layout: flexbox", "flex: container"],
              correctAnswer: "display: flex",
              explanation: "The display: flex property creates a flex container.",
              points: 1
            }
          ]
        }
      },
      {
        title: "React Development",
        description: "Build dynamic user interfaces with React, hooks, and state management",
        order: 2,
        estimatedTime: 600, // 10 hours
        learningObjectives: [
          "Master React components and JSX",
          "Implement state management with hooks",
          "Handle side effects with useEffect",
          "Build reusable component libraries"
        ],
        lessons: [
          {
            title: "React Components and JSX",
            description: "Learn the fundamentals of React components and JSX syntax",
            order: 1,
            estimatedTime: 90,
            type: "video",
            difficulty: "medium",
            content: {
              videoUrl: "https://youtube.com/watch?v=react-components",
              youtubeId: "react-components",
              videoDuration: 5400, // 90 minutes
              videoQuality: "1080p",
              transcript: "React is a JavaScript library for building user interfaces...",
              tags: ["React", "Components", "JSX"],
              keywords: ["react", "components", "jsx", "props", "state"]
            }
          },
          {
            title: "State Management with Hooks",
            description: "Master useState, useEffect, and custom hooks",
            order: 2,
            estimatedTime: 120,
            type: "video",
            difficulty: "medium",
            content: {
              videoUrl: "https://youtube.com/watch?v=react-hooks",
              youtubeId: "react-hooks",
              videoDuration: 7200, // 120 minutes
              videoQuality: "1080p",
              tags: ["React", "Hooks", "State Management"],
              keywords: ["useState", "useEffect", "custom hooks", "state"]
            }
          },
          {
            title: "Build a Todo App Assignment",
            description: "Create a fully functional todo application using React hooks",
            order: 3,
            estimatedTime: 180,
            type: "assignment",
            difficulty: "hard",
            content: {
              instructions: `Create a Todo application with the following features:
1. Add new todos
2. Mark todos as complete/incomplete
3. Delete todos
4. Filter todos (all, active, completed)
5. Local storage persistence
6. Responsive design

Requirements:
- Use functional components with hooks
- Implement proper state management
- Add form validation
- Include loading states
- Write clean, commented code`,
              submissionFormat: "link",
              maxFileSize: 50,
              allowedFileTypes: ["zip", "js", "jsx"],
              rubric: [
                { criteria: "Functionality", maxPoints: 40, description: "All features work correctly" },
                { criteria: "Code Quality", maxPoints: 30, description: "Clean, readable, well-commented code" },
                { criteria: "Design", maxPoints: 20, description: "Good UI/UX and responsive design" },
                { criteria: "Best Practices", maxPoints: 10, description: "Follows React best practices" }
              ],
              tags: ["React", "Project", "Todo App"],
              keywords: ["react", "hooks", "todo", "assignment", "project"]
            }
          }
        ]
      },
      {
        title: "Backend Development with Node.js",
        description: "Build scalable server-side applications with Node.js, Express, and databases",
        order: 3,
        estimatedTime: 720, // 12 hours
        learningObjectives: [
          "Set up Node.js servers with Express",
          "Design and implement REST APIs",
          "Work with databases (MongoDB, PostgreSQL)",
          "Implement authentication and security"
        ],
        lessons: [
          {
            title: "Node.js and Express Setup",
            description: "Create your first Node.js server with Express framework",
            order: 1,
            estimatedTime: 75,
            type: "video",
            difficulty: "medium",
            content: {
              videoUrl: "https://youtube.com/watch?v=nodejs-express",
              youtubeId: "nodejs-express",
              videoDuration: 4500,
              videoQuality: "1080p",
              tags: ["Node.js", "Express", "Server"],
              keywords: ["nodejs", "express", "server", "middleware"]
            }
          },
          {
            title: "RESTful API Design Principles",
            description: "Learn to design clean, maintainable REST APIs",
            order: 2,
            estimatedTime: 60,
            type: "text",
            difficulty: "medium",
            content: {
              textContent: `# RESTful API Design Principles

## What is REST?
REST (Representational State Transfer) is an architectural style for designing networked applications...

## Key Principles

### 1. Stateless
Each request must contain all the information needed to understand and process it...

### 2. Resource-Based URLs
URLs should represent resources, not actions...

### 3. HTTP Methods
Use appropriate HTTP methods for different operations:
- GET: Retrieve data
- POST: Create new resources
- PUT: Update entire resources
- PATCH: Partial updates
- DELETE: Remove resources

## Best Practices
1. Use nouns for resource names
2. Use HTTP status codes appropriately
3. Version your APIs
4. Implement proper error handling
5. Use consistent naming conventions`,
              readingTime: 15,
              tags: ["REST", "API Design", "Best Practices"],
              keywords: ["rest", "api", "http", "methods", "resources"]
            }
          }
        ]
      }
    ],
    progressTracking: {
      enabled: true,
      milestones: [
        {
          title: "Frontend Master",
          description: "Completed all frontend modules",
          requiredModules: [0],
          reward: "Frontend Development Badge",
          icon: "/icons/frontend-badge.svg"
        },
        {
          title: "React Developer",
          description: "Mastered React development",
          requiredModules: [0, 1],
          reward: "React Developer Badge",
          icon: "/icons/react-badge.svg"
        },
        {
          title: "Full-Stack Developer",
          description: "Completed the entire bootcamp",
          requiredModules: [0, 1, 2],
          reward: "Full-Stack Development Certificate",
          icon: "/icons/fullstack-certificate.svg"
        }
      ]
    },
    certificate: {
      enabled: true,
      template: "professional",
      minimumScore: 75,
      issuer: "DevJourney Academy",
      accreditation: "Industry Recognized Certification"
    },
    settings: {
      allowDiscussions: true,
      allowDownloads: true,
      certificateEnabled: true,
      autoProgress: false,
      enrollmentType: "paid",
      dripContent: true,
      dripSchedule: [
        { moduleIndex: 0, releaseDays: 0 },
        { moduleIndex: 1, releaseDays: 14 },
        { moduleIndex: 2, releaseDays: 28 }
      ],
      completionCriteria: {
        requireAllLessons: true,
        requireQuizzes: true,
        requireAssignments: true,
        minimumScore: 75
      }
    }
  },
  
  {
    title: "Machine Learning and AI Fundamentals",
    description: "Comprehensive introduction to machine learning, deep learning, and artificial intelligence. Build practical AI applications using Python, TensorFlow, and scikit-learn.",
    difficulty: "Advanced",
    duration: "16 weeks",
    category: "AI/Machine Learning",
    tags: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "AI", "Data Science"],
    price: 299,
    level: "Advanced",
    estimatedHours: 160,
    whatYouWillLearn: [
      "Master machine learning algorithms and techniques",
      "Build neural networks with TensorFlow and Keras",
      "Implement computer vision and NLP applications",
      "Understand deep learning architectures",
      "Work with real-world datasets",
      "Deploy ML models to production",
      "Apply ethical AI principles",
      "Optimize model performance"
    ],
    prerequisites: [
      "Strong Python programming skills",
      "Basic statistics and linear algebra",
      "Understanding of calculus fundamentals",
      "Experience with data manipulation (pandas, numpy)"
    ],
    modules: [
      {
        title: "Machine Learning Foundations",
        description: "Core concepts, algorithms, and mathematical foundations of machine learning",
        order: 1,
        estimatedTime: 600,
        learningObjectives: [
          "Understand supervised vs unsupervised learning",
          "Implement linear and logistic regression",
          "Master decision trees and ensemble methods",
          "Apply cross-validation and model evaluation"
        ],
        lessons: [
          {
            title: "Introduction to Machine Learning",
            description: "Overview of ML types, applications, and the ML workflow",
            order: 1,
            estimatedTime: 90,
            type: "video",
            difficulty: "medium",
            content: {
              videoUrl: "https://youtube.com/watch?v=ml-intro",
              youtubeId: "ml-intro",
              videoDuration: 5400,
              videoQuality: "1080p",
              tags: ["Machine Learning", "Introduction", "Overview"],
              keywords: ["machine learning", "AI", "supervised", "unsupervised"]
            }
          },
          {
            title: "Linear Regression Implementation",
            description: "Code linear regression from scratch and using scikit-learn",
            order: 2,
            estimatedTime: 120,
            type: "interactive",
            difficulty: "medium",
            content: {
              interactiveType: "code_editor",
              startingCode: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# Load dataset
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Implement linear regression
# Your code here`,
              expectedOutput: "A trained linear regression model with predictions",
              hints: [
                "Use the normal equation: θ = (X^T X)^(-1) X^T y",
                "Remember to add bias term (intercept)",
                "Visualize the results with matplotlib"
              ],
              tags: ["Linear Regression", "Implementation", "Python"],
              keywords: ["linear regression", "scikit-learn", "numpy", "implementation"]
            }
          }
        ]
      },
      {
        title: "Deep Learning with Neural Networks",
        description: "Build and train neural networks for various applications",
        order: 2,
        estimatedTime: 720,
        learningObjectives: [
          "Understand neural network architecture",
          "Implement backpropagation algorithm",
          "Build CNNs for computer vision",
          "Create RNNs for sequence data"
        ],
        lessons: [
          {
            title: "Neural Network Fundamentals",
            description: "Understand perceptrons, activation functions, and forward propagation",
            order: 1,
            estimatedTime: 105,
            type: "video",
            difficulty: "hard",
            content: {
              videoUrl: "https://youtube.com/watch?v=neural-networks",
              youtubeId: "neural-networks",
              videoDuration: 6300,
              videoQuality: "1080p",
              tags: ["Neural Networks", "Deep Learning", "Backpropagation"],
              keywords: ["neural networks", "perceptron", "activation", "backpropagation"]
            }
          }
        ]
      }
    ]
  },

  {
    title: "Digital Marketing Mastery",
    description: "Complete digital marketing course covering SEO, social media, content marketing, PPC, email marketing, and analytics. Build a comprehensive marketing strategy.",
    difficulty: "Beginner",
    duration: "10 weeks",
    category: "Digital Marketing",
    tags: ["SEO", "Social Media", "Content Marketing", "PPC", "Email Marketing", "Analytics"],
    price: 149,
    level: "Beginner",
    estimatedHours: 80,
    whatYouWillLearn: [
      "Master search engine optimization (SEO)",
      "Create effective social media campaigns",
      "Develop content marketing strategies",
      "Run successful PPC campaigns",
      "Build email marketing funnels",
      "Analyze marketing performance",
      "Understand customer psychology",
      "Create marketing budgets and ROI calculations"
    ],
    prerequisites: [
      "Basic computer skills",
      "Understanding of business fundamentals",
      "Familiarity with social media platforms"
    ],
    modules: [
      {
        title: "Digital Marketing Fundamentals",
        description: "Core principles of digital marketing and customer journey mapping",
        order: 1,
        estimatedTime: 360,
        lessons: [
          {
            title: "The Digital Marketing Landscape",
            description: "Overview of digital marketing channels and strategies",
            order: 1,
            estimatedTime: 60,
            type: "video",
            difficulty: "easy",
            content: {
              videoUrl: "https://youtube.com/watch?v=digital-marketing-intro",
              youtubeId: "digital-marketing-intro",
              videoDuration: 3600,
              videoQuality: "1080p",
              tags: ["Digital Marketing", "Overview", "Strategy"],
              keywords: ["digital marketing", "channels", "strategy", "overview"]
            }
          }
        ]
      }
    ]
  },

  {
    title: "Cybersecurity Essentials",
    description: "Learn to protect systems, networks, and data from cyber threats. Cover ethical hacking, penetration testing, security frameworks, and incident response.",
    difficulty: "Intermediate",
    duration: "14 weeks",
    category: "Cybersecurity",
    tags: ["Security", "Ethical Hacking", "Penetration Testing", "Network Security", "Incident Response"],
    price: 249,
    level: "Intermediate",
    estimatedHours: 140,
    whatYouWillLearn: [
      "Understand common cyber threats and vulnerabilities",
      "Perform ethical hacking and penetration testing",
      "Implement security frameworks and controls",
      "Secure networks and wireless systems",
      "Respond to security incidents",
      "Conduct risk assessments",
      "Use security tools and technologies",
      "Understand compliance requirements"
    ],
    prerequisites: [
      "Basic networking knowledge",
      "Understanding of operating systems",
      "Familiarity with command line interfaces"
    ]
  },

  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications for iOS and Android using React Native. Learn navigation, state management, native modules, and app store deployment.",
    difficulty: "Intermediate",
    duration: "12 weeks",
    category: "Mobile Development",
    tags: ["React Native", "Mobile Development", "iOS", "Android", "Cross-platform"],
    price: 199,
    level: "Intermediate",
    estimatedHours: 120,
    whatYouWillLearn: [
      "Build native mobile apps with React Native",
      "Navigate between screens and manage app state",
      "Access device features (camera, GPS, storage)",
      "Integrate with REST APIs and databases",
      "Handle push notifications",
      "Optimize app performance",
      "Deploy to App Store and Google Play",
      "Implement responsive mobile design"
    ],
    prerequisites: [
      "JavaScript and React knowledge",
      "Basic understanding of mobile platforms",
      "Familiarity with npm and package management"
    ]
  }
];

// Function to add courses to database
const addAdvancedCourses = async () => {
  try {
    // Find an instructor user (or create one)
    let instructor = await User.findOne({ role: "instructor" });
    
    if (!instructor) {
      console.log("⚠️  No instructor found. Creating default instructor...");
      instructor = new User({
        username: "admin_instructor",
        email: "instructor@devjourney.com",
        password: "hashedpassword123", // In real app, this should be properly hashed
        role: "instructor",
        isEmailVerified: true,
        profile: {
          firstName: "John",
          lastName: "Instructor",
          bio: "Expert software developer and educator with 10+ years experience"
        }
      });
      await instructor.save();
      console.log("✅ Default instructor created");
    }

    // Clear existing courses (optional - comment out if you want to keep existing courses)
    // await Course.deleteMany({});
    // console.log("🗑️  Cleared existing courses");

    // Add the instructor's ID to each course
    const coursesWithInstructor = advancedCourses.map(course => ({
      ...course,
      user: instructor._id,
      isPublished: true,
      publishedAt: new Date(),
      enrollmentCount: Math.floor(Math.random() * 1000) + 100, // Random enrollment count
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
      reviewCount: Math.floor(Math.random() * 200) + 50,
      viewCount: Math.floor(Math.random() * 5000) + 1000
    }));

    // Insert courses
    const insertedCourses = await Course.insertMany(coursesWithInstructor);
    
    console.log(`✅ Successfully added ${insertedCourses.length} advanced courses:`);
    insertedCourses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.title} (${course.category})`);
    });

    // Update instructor's coursesCreated
    instructor.coursesCreated = instructor.coursesCreated || [];
    instructor.coursesCreated.push(...insertedCourses.map(course => course._id));
    await instructor.save();

    console.log("🎓 Instructor updated with new courses");
    console.log("\n📊 Course Statistics:");
    console.log(`   Total Modules: ${insertedCourses.reduce((sum, course) => sum + (course.modules?.length || 0), 0)}`);
    console.log(`   Total Lessons: ${insertedCourses.reduce((sum, course) => 
      sum + (course.modules?.reduce((moduleSum, module) => moduleSum + (module.lessons?.length || 0), 0) || 0), 0)}`);
    console.log(`   Total Estimated Hours: ${insertedCourses.reduce((sum, course) => sum + (course.estimatedHours || 0), 0)}`);

  } catch (error) {
    console.error("❌ Error adding courses:", error);
    throw error;
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await addAdvancedCourses();
  
  console.log("\n🎉 All courses added successfully!");
  console.log("You can now view them in your application.");
  
  mongoose.connection.close();
  process.exit(0);
};

// Execute if run directly
if (require.main === module) {
  runScript().catch(error => {
    console.error("Script failed:", error);
    process.exit(1);
  });
}

module.exports = { advancedCourses, addAdvancedCourses };
