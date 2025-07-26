const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    difficulty: String,
    duration: String,
    category: { 
      type: String, 
      enum: [
        'Web Development', 
        'Data Science', 
        'Digital Marketing', 
        'Design', 
        'Business', 
        'Cloud Computing',
        'Mobile Development',
        'AI/Machine Learning',
        'Cybersecurity',
        'DevOps',
        'Other'
      ],
      default: 'Other'
    },
    tags: [String], // For better categorization and search
    price: { type: Number, default: 0 },
    level: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    estimatedHours: Number,
    whatYouWillLearn: [String], // Learning outcomes
    prerequisites: [String], // What students should know before taking
    
    // Course Content Structure
    modules: [{
      title: { type: String, required: true },
      description: String,
      order: { type: Number, default: 0 },
      estimatedTime: Number, // Time in minutes
      isLocked: { type: Boolean, default: false },
      unlockCriteria: String, // What needs to be completed to unlock
      learningObjectives: [String], // What students will learn in this module
      lessons: [{
        title: { type: String, required: true },
        description: String,
        order: { type: Number, default: 0 },
        estimatedTime: Number, // Time in minutes
        type: { 
          type: String, 
          enum: ['video', 'text', 'quiz', 'assignment', 'resource', 'interactive', 'live_session'],
          default: 'text'
        },
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
          default: 'medium'
        },
        content: {
          // For video lessons
          videoUrl: String, // YouTube URL or video file
          youtubeId: String, // Extracted YouTube video ID
          videoDuration: Number, // Duration in seconds
          videoQuality: String, // 720p, 1080p, etc.
          subtitles: [{
            language: String,
            url: String
          }],
          
          // For text lessons
          textContent: String, // Rich text/markdown content
          htmlContent: String, // HTML content
          readingTime: Number, // Estimated reading time in minutes
          
          // For quizzes
          questions: [{
            question: String,
            type: { type: String, enum: ['multiple_choice', 'true_false', 'fill_blank', 'essay'] },
            options: [String], // For multiple choice
            correctAnswer: String,
            explanation: String,
            points: { type: Number, default: 1 }
          }],
          passingScore: Number, // Percentage needed to pass
          
          // For assignments
          instructions: String,
          submissionFormat: String, // text, file, link
          maxFileSize: Number, // In MB
          allowedFileTypes: [String], // pdf, docx, etc.
          rubric: [{
            criteria: String,
            maxPoints: Number,
            description: String
          }],
          
          // For resources
          resourceUrl: String,
          resourceType: String, // pdf, link, download, code_sample
          fileSize: Number, // In bytes
          downloadCount: { type: Number, default: 0 },
          
          // For interactive lessons
          interactiveType: String, // code_editor, simulator, sandbox
          startingCode: String,
          expectedOutput: String,
          hints: [String],
          
          // Common fields
          notes: String,
          transcript: String,
          tags: [String],
          keywords: [String], // For search
          references: [String], // External links/books
        },
        isCompleted: { type: Boolean, default: false },
        watchTime: { type: Number, default: 0 }, // For video progress tracking
        attempts: { type: Number, default: 0 }, // For quizzes/assignments
        lastScore: Number, // Latest quiz/assignment score
        bestScore: Number, // Best quiz/assignment score
        completedAt: Date,
        
        // Engagement metrics
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        bookmarks: { type: Number, default: 0 },
        comments: [{
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          content: String,
          timestamp: { type: Date, default: Date.now },
          replies: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            content: String,
            timestamp: { type: Date, default: Date.now }
          }]
        }]
      }],
      
      // Module-level assessments
      moduleQuiz: {
        title: String,
        description: String,
        timeLimit: Number, // In minutes
        questions: [{
          question: String,
          type: { type: String, enum: ['multiple_choice', 'true_false', 'fill_blank', 'essay'] },
          options: [String],
          correctAnswer: String,
          explanation: String,
          points: { type: Number, default: 1 }
        }],
        passingScore: Number,
        maxAttempts: { type: Number, default: 3 }
      }
    }],
    
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "CourseSection" }], // Legacy support
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
      helpful: { type: Number, default: 0 }
    }],
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    lastUpdated: { type: Date, default: Date.now },
    thumbnail: String, // Course image URL
    promoVideo: String, // Course preview video
    courseImages: [String], // Additional course images
    
    // Course Metrics
    enrollmentCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }, // Percentage of students who completed
    averageCompletionTime: Number, // In hours
    viewCount: { type: Number, default: 0 },
    
    // Course Progression
    progressTracking: {
      enabled: { type: Boolean, default: true },
      milestones: [{
        title: String,
        description: String,
        requiredModules: [Number], // Module indices that need to be completed
        reward: String, // Badge, certificate, etc.
        icon: String
      }]
    },
    
    // Certification
    certificate: {
      enabled: { type: Boolean, default: true },
      template: String, // Certificate template ID
      minimumScore: { type: Number, default: 70 }, // Minimum score to get certificate
      verificationCode: String,
      issuer: String,
      accreditation: String // Accrediting body if any
    },
    
    // Course Language and Accessibility
    language: { type: String, default: 'English' },
    subtitleLanguages: [String],
    accessibility: {
      closedCaptions: { type: Boolean, default: false },
      audioDescriptions: { type: Boolean, default: false },
      transcripts: { type: Boolean, default: false },
      screenReaderCompatible: { type: Boolean, default: false }
    },
    
    // Course Settings
    settings: {
      allowDiscussions: { type: Boolean, default: true },
      allowDownloads: { type: Boolean, default: false },
      certificateEnabled: { type: Boolean, default: true },
      autoProgress: { type: Boolean, default: false }, // Auto-mark as complete
      allowReviews: { type: Boolean, default: true },
      moderateComments: { type: Boolean, default: false },
      showProgress: { type: Boolean, default: true },
      allowBookmarks: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      mobileDownload: { type: Boolean, default: false },
      
      // Enrollment settings
      enrollmentType: { 
        type: String, 
        enum: ['open', 'invite_only', 'approval_required', 'paid'],
        default: 'open'
      },
      maxStudents: Number,
      enrollmentDeadline: Date,
      
      // Content delivery
      dripContent: { type: Boolean, default: false }, // Release content gradually
      dripSchedule: [{
        moduleIndex: Number,
        releaseDate: Date,
        releaseDays: Number // Days after enrollment
      }],
      
      // Grading and completion
      gradingScale: {
        type: String,
        enum: ['percentage', 'letter', 'pass_fail', 'points'],
        default: 'percentage'
      },
      completionCriteria: {
        requireAllLessons: { type: Boolean, default: true },
        requireQuizzes: { type: Boolean, default: true },
        requireAssignments: { type: Boolean, default: true },
        minimumScore: { type: Number, default: 70 }
      }
    },
    
    // Course Analytics
    analytics: {
      lastAnalyticsUpdate: Date,
      popularLessons: [{
        lessonId: String,
        views: Number,
        completionRate: Number
      }],
      dropOffPoints: [{
        lessonId: String,
        dropOffRate: Number
      }],
      averageSessionTime: Number,
      deviceStats: {
        desktop: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 }
      }
    }
  },

  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
