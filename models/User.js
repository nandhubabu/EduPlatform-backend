const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "instructor", "student"] },
    progress: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        sections: [
          {
            sectionId: {
              type: Schema.Types.ObjectId,
              ref: "CourseSection",
              required: true,
            },
            status: {
              type: String,
              enum: ["Not Started", "In Progress", "Completed"],
              default: "Not Started",
            },
          },
        ],
      },
    ],
    coursesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    coursesApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    assessmentResults: [
      {
        scores: {
          R: { type: Number, default: 0 }, // Realistic
          I: { type: Number, default: 0 }, // Investigative
          A: { type: Number, default: 0 }, // Artistic
          S: { type: Number, default: 0 }, // Social
          E: { type: Number, default: 0 }, // Enterprising
          C: { type: Number, default: 0 }, // Conventional
        },
        topInterests: [String], // Array of top 3 interest areas
        recommendations: [
          {
            title: String,
            description: String,
            growth: String,
            education: String,
            matchScore: Number,
          }
        ],
        completedAt: { type: Date, default: Date.now },
      }
    ],
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

module.exports = mongoose.model("User", userSchema);
