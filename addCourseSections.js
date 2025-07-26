const mongoose = require("mongoose");
const Course = require("./models/Course");
const CourseSection = require("./models/CourseSection");
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

// Function to add course sections to existing courses
const addCourseSections = async () => {
  try {
    const courses = await Course.find({ isPublished: true });
    
    if (courses.length === 0) {
      console.log("⚠️  No published courses found. Please add courses first.");
      return;
    }

    for (const course of courses) {
      // Skip if course already has sections
      if (course.sections && course.sections.length > 0) {
        console.log(`⏭️  Course "${course.title}" already has sections. Skipping...`);
        continue;
      }

      let sectionsData = [];

      // Generate sections based on course category
      switch (course.category) {
        case "Web Development":
          sectionsData = [
            {
              sectionName: "HTML & CSS Fundamentals",
              courseId: course._id,
              description: "Learn the building blocks of web development",
              estimatedTime: 8,
              resources: [
                { name: "HTML Cheat Sheet", url: "/resources/html-cheat-sheet.pdf", type: "pdf" },
                { name: "CSS Grid Guide", url: "/resources/css-grid-guide.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "JavaScript Essentials",
              courseId: course._id,
              description: "Master JavaScript programming concepts",
              estimatedTime: 12,
              resources: [
                { name: "JavaScript Reference", url: "/resources/js-reference.pdf", type: "pdf" },
                { name: "ES6 Features", url: "/resources/es6-features.md", type: "document" }
              ]
            },
            {
              sectionName: "Frontend Frameworks",
              courseId: course._id,
              description: "Build dynamic UIs with modern frameworks",
              estimatedTime: 16,
              resources: [
                { name: "React Documentation", url: "https://reactjs.org/docs", type: "link" },
                { name: "Component Examples", url: "/resources/react-components.zip", type: "zip" }
              ]
            },
            {
              sectionName: "Backend Development",
              courseId: course._id,
              description: "Server-side programming and APIs",
              estimatedTime: 20,
              resources: [
                { name: "Node.js Guide", url: "/resources/nodejs-guide.pdf", type: "pdf" },
                { name: "API Best Practices", url: "/resources/api-best-practices.md", type: "document" }
              ]
            },
            {
              sectionName: "Database Integration",
              courseId: course._id,
              description: "Work with databases and data persistence",
              estimatedTime: 12,
              resources: [
                { name: "MongoDB Tutorial", url: "/resources/mongodb-tutorial.pdf", type: "pdf" },
                { name: "SQL vs NoSQL", url: "/resources/sql-vs-nosql.md", type: "document" }
              ]
            },
            {
              sectionName: "Deployment & DevOps",
              courseId: course._id,
              description: "Deploy applications to production",
              estimatedTime: 10,
              resources: [
                { name: "Deployment Checklist", url: "/resources/deployment-checklist.pdf", type: "pdf" },
                { name: "Docker Guide", url: "/resources/docker-guide.md", type: "document" }
              ]
            }
          ];
          break;

        case "AI/Machine Learning":
          sectionsData = [
            {
              sectionName: "Python for Data Science",
              courseId: course._id,
              description: "Essential Python libraries for ML",
              estimatedTime: 15,
              resources: [
                { name: "NumPy Cheat Sheet", url: "/resources/numpy-cheat-sheet.pdf", type: "pdf" },
                { name: "Pandas Tutorial", url: "/resources/pandas-tutorial.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Statistics and Probability",
              courseId: course._id,
              description: "Mathematical foundations for ML",
              estimatedTime: 18,
              resources: [
                { name: "Statistics Reference", url: "/resources/statistics-reference.pdf", type: "pdf" },
                { name: "Probability Distributions", url: "/resources/probability-distributions.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Supervised Learning",
              courseId: course._id,
              description: "Classification and regression algorithms",
              estimatedTime: 25,
              resources: [
                { name: "Scikit-learn Guide", url: "/resources/sklearn-guide.pdf", type: "pdf" },
                { name: "Algorithm Comparison", url: "/resources/ml-algorithms.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Unsupervised Learning",
              courseId: course._id,
              description: "Clustering and dimensionality reduction",
              estimatedTime: 20,
              resources: [
                { name: "Clustering Techniques", url: "/resources/clustering-techniques.pdf", type: "pdf" },
                { name: "PCA Explained", url: "/resources/pca-explained.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Deep Learning",
              courseId: course._id,
              description: "Neural networks and deep learning",
              estimatedTime: 30,
              resources: [
                { name: "TensorFlow Guide", url: "/resources/tensorflow-guide.pdf", type: "pdf" },
                { name: "Neural Network Architectures", url: "/resources/nn-architectures.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Model Deployment",
              courseId: course._id,
              description: "Deploy ML models to production",
              estimatedTime: 12,
              resources: [
                { name: "MLOps Best Practices", url: "/resources/mlops-best-practices.pdf", type: "pdf" },
                { name: "Model Monitoring", url: "/resources/model-monitoring.md", type: "document" }
              ]
            }
          ];
          break;

        case "Digital Marketing":
          sectionsData = [
            {
              sectionName: "Marketing Fundamentals",
              courseId: course._id,
              description: "Core marketing principles and strategies",
              estimatedTime: 8,
              resources: [
                { name: "Marketing Plan Template", url: "/resources/marketing-plan-template.pdf", type: "pdf" },
                { name: "Customer Persona Worksheet", url: "/resources/customer-persona.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Search Engine Optimization",
              courseId: course._id,
              description: "Improve website visibility in search results",
              estimatedTime: 12,
              resources: [
                { name: "SEO Checklist", url: "/resources/seo-checklist.pdf", type: "pdf" },
                { name: "Keyword Research Tools", url: "/resources/keyword-tools.md", type: "document" }
              ]
            },
            {
              sectionName: "Social Media Marketing",
              courseId: course._id,
              description: "Build brand presence on social platforms",
              estimatedTime: 10,
              resources: [
                { name: "Social Media Calendar", url: "/resources/social-media-calendar.xlsx", type: "excel" },
                { name: "Content Creation Guide", url: "/resources/content-creation.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Pay-Per-Click Advertising",
              courseId: course._id,
              description: "Run effective paid advertising campaigns",
              estimatedTime: 15,
              resources: [
                { name: "Google Ads Guide", url: "/resources/google-ads-guide.pdf", type: "pdf" },
                { name: "Ad Copy Templates", url: "/resources/ad-copy-templates.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Email Marketing",
              courseId: course._id,
              description: "Build and nurture email subscriber lists",
              estimatedTime: 8,
              resources: [
                { name: "Email Templates", url: "/resources/email-templates.zip", type: "zip" },
                { name: "Automation Workflows", url: "/resources/email-automation.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Analytics and Optimization",
              courseId: course._id,
              description: "Measure and improve marketing performance",
              estimatedTime: 10,
              resources: [
                { name: "Google Analytics Setup", url: "/resources/ga-setup.pdf", type: "pdf" },
                { name: "KPI Dashboard Template", url: "/resources/kpi-dashboard.xlsx", type: "excel" }
              ]
            }
          ];
          break;

        case "Cybersecurity":
          sectionsData = [
            {
              sectionName: "Security Fundamentals",
              courseId: course._id,
              description: "Basic security concepts and principles",
              estimatedTime: 10,
              resources: [
                { name: "Security Framework Guide", url: "/resources/security-frameworks.pdf", type: "pdf" },
                { name: "Threat Landscape Report", url: "/resources/threat-landscape.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Network Security",
              courseId: course._id,
              description: "Secure network infrastructure",
              estimatedTime: 18,
              resources: [
                { name: "Firewall Configuration", url: "/resources/firewall-config.pdf", type: "pdf" },
                { name: "Network Monitoring Tools", url: "/resources/network-monitoring.md", type: "document" }
              ]
            },
            {
              sectionName: "Ethical Hacking",
              courseId: course._id,
              description: "Penetration testing and vulnerability assessment",
              estimatedTime: 25,
              resources: [
                { name: "Penetration Testing Guide", url: "/resources/pentest-guide.pdf", type: "pdf" },
                { name: "Kali Linux Tools", url: "/resources/kali-tools.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Incident Response",
              courseId: course._id,
              description: "Handle and recover from security incidents",
              estimatedTime: 15,
              resources: [
                { name: "Incident Response Plan", url: "/resources/incident-response.pdf", type: "pdf" },
                { name: "Forensics Tools", url: "/resources/forensics-tools.md", type: "document" }
              ]
            },
            {
              sectionName: "Compliance and Governance",
              courseId: course._id,
              description: "Security standards and regulatory compliance",
              estimatedTime: 12,
              resources: [
                { name: "GDPR Compliance Guide", url: "/resources/gdpr-compliance.pdf", type: "pdf" },
                { name: "Security Audit Checklist", url: "/resources/security-audit.pdf", type: "pdf" }
              ]
            }
          ];
          break;

        case "Mobile Development":
          sectionsData = [
            {
              sectionName: "Mobile Development Basics",
              courseId: course._id,
              description: "Introduction to mobile app development",
              estimatedTime: 8,
              resources: [
                { name: "Mobile Design Guidelines", url: "/resources/mobile-design.pdf", type: "pdf" },
                { name: "Platform Comparison", url: "/resources/ios-vs-android.md", type: "document" }
              ]
            },
            {
              sectionName: "React Native Fundamentals",
              courseId: course._id,
              description: "Core concepts of React Native",
              estimatedTime: 15,
              resources: [
                { name: "React Native Documentation", url: "https://reactnative.dev/docs", type: "link" },
                { name: "Component Library", url: "/resources/rn-components.zip", type: "zip" }
              ]
            },
            {
              sectionName: "Navigation and State Management",
              courseId: course._id,
              description: "Handle app navigation and global state",
              estimatedTime: 12,
              resources: [
                { name: "Navigation Patterns", url: "/resources/navigation-patterns.pdf", type: "pdf" },
                { name: "Redux Guide", url: "/resources/redux-guide.pdf", type: "pdf" }
              ]
            },
            {
              sectionName: "Native Features Integration",
              courseId: course._id,
              description: "Access device capabilities",
              estimatedTime: 18,
              resources: [
                { name: "Native Modules Guide", url: "/resources/native-modules.pdf", type: "pdf" },
                { name: "Camera Integration", url: "/resources/camera-integration.md", type: "document" }
              ]
            },
            {
              sectionName: "Performance Optimization",
              courseId: course._id,
              description: "Optimize app performance and user experience",
              estimatedTime: 10,
              resources: [
                { name: "Performance Best Practices", url: "/resources/performance-optimization.pdf", type: "pdf" },
                { name: "Memory Management", url: "/resources/memory-management.md", type: "document" }
              ]
            },
            {
              sectionName: "App Store Deployment",
              courseId: course._id,
              description: "Publish apps to app stores",
              estimatedTime: 8,
              resources: [
                { name: "App Store Guidelines", url: "/resources/app-store-guidelines.pdf", type: "pdf" },
                { name: "Release Checklist", url: "/resources/release-checklist.pdf", type: "pdf" }
              ]
            }
          ];
          break;

        default:
          // Generic sections for other categories
          sectionsData = [
            {
              sectionName: "Introduction and Overview",
              courseId: course._id,
              description: "Course introduction and learning objectives",
              estimatedTime: 4,
              resources: [
                { name: "Course Syllabus", url: "/resources/syllabus.pdf", type: "pdf" },
                { name: "Learning Resources", url: "/resources/learning-resources.md", type: "document" }
              ]
            },
            {
              sectionName: "Core Concepts",
              courseId: course._id,
              description: "Fundamental concepts and principles",
              estimatedTime: 12,
              resources: [
                { name: "Concept Guide", url: "/resources/core-concepts.pdf", type: "pdf" },
                { name: "Examples and Exercises", url: "/resources/exercises.zip", type: "zip" }
              ]
            },
            {
              sectionName: "Practical Applications",
              courseId: course._id,
              description: "Real-world applications and case studies",
              estimatedTime: 15,
              resources: [
                { name: "Case Studies", url: "/resources/case-studies.pdf", type: "pdf" },
                { name: "Project Templates", url: "/resources/project-templates.zip", type: "zip" }
              ]
            },
            {
              sectionName: "Advanced Topics",
              courseId: course._id,
              description: "Advanced concepts and techniques",
              estimatedTime: 18,
              resources: [
                { name: "Advanced Guide", url: "/resources/advanced-guide.pdf", type: "pdf" },
                { name: "Expert Tips", url: "/resources/expert-tips.md", type: "document" }
              ]
            },
            {
              sectionName: "Final Project",
              courseId: course._id,
              description: "Capstone project to demonstrate learning",
              estimatedTime: 10,
              resources: [
                { name: "Project Requirements", url: "/resources/project-requirements.pdf", type: "pdf" },
                { name: "Evaluation Rubric", url: "/resources/evaluation-rubric.pdf", type: "pdf" }
              ]
            }
          ];
      }

      // Create sections for this course
      const createdSections = await CourseSection.insertMany(sectionsData);
      
      // Update course with section references
      course.sections = createdSections.map(section => section._id);
      await course.save();

      console.log(`✅ Added ${createdSections.length} sections to "${course.title}"`);
    }

    console.log("\n🎉 All course sections added successfully!");

  } catch (error) {
    console.error("❌ Error adding course sections:", error);
    throw error;
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await addCourseSections();
  
  console.log("\n📚 Course sections setup complete!");
  console.log("Courses now have detailed sections with resources and time estimates.");
  
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

module.exports = { addCourseSections };
