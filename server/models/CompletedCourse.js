import mongoose from 'mongoose';

const completedCourseSchema = new mongoose.Schema({
  roll_number: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  completed: {
    type: String,
    required: true,
    enum: ['YES', 'NO'],
    default: 'YES',
  },
}, {
  timestamps: true,
});

// Compound index to ensure uniqueness per roll_number and course_name
completedCourseSchema.index({ roll_number: 1, course_name: 1 }, { unique: true });

export default mongoose.model('CompletedCourse', completedCourseSchema);
