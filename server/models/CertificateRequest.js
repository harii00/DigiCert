import mongoose from 'mongoose';

const certificateRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentRollNumber: {
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  certificateId: {
    type: String,
  },
  certificateObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
  },
  admin_remarks: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

export default mongoose.model('CertificateRequest', certificateRequestSchema);
