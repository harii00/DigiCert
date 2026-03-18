import CertificateRequest from '../models/CertificateRequest.js';
import CompletedCourse from '../models/CompletedCourse.js';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import QRCode from 'qrcode';

// Helper for generating certificate ID
const generateCertificateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'DCS-';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// @desc    Create or Update a certificate request
// @route   POST /api/requests
// @access  Private/Student
export const createRequest = async (req, res) => {
  try {
    const { course_name, level } = req.body;
    
    // Check if course is actually completed
    const completion = await CompletedCourse.findOne({ 
      roll_number: req.user.roll_number, 
      course_name, 
      level,
      completed: 'YES' 
    });

    if (!completion) {
      return res.status(400).json({ message: 'Course not yet completed' });
    }

    // Check for existing request
    let request = await CertificateRequest.findOne({ 
      studentRollNumber: req.user.roll_number, 
      course_name, 
      level 
    });

    if (request) {
      if (request.status === 'pending') {
        return res.status(400).json({ message: 'Request already exists and is pending' });
      }
      if (request.status === 'approved') {
        return res.status(400).json({ message: 'Request already approved' });
      }
      
      // Re-request logic: Update existing rejected request
      request.status = 'pending';
      request.admin_remarks = '';
      request.requestDate = Date.now();
      await request.save();
      return res.status(200).json(request);
    }

    request = await CertificateRequest.create({
      studentId: req.user._id,
      studentName: req.user.name,
      studentRollNumber: req.user.roll_number,
      course_name,
      level,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all requests (Admin)
// @route   GET /api/requests
// @access  Private/Admin
export const getAllRequests = async (req, res) => {
  try {
    const requests = await CertificateRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's requests
// @route   GET /api/requests/my-requests
// @access  Private/Student
export const getMyRequests = async (req, res) => {
  try {
    const requests = await CertificateRequest.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve or Reject request
// @route   PATCH /api/requests/:id
// @access  Private/Admin
export const processRequest = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await CertificateRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    if (status === 'rejected') {
      request.status = 'rejected';
      request.admin_remarks = remarks || 'No remarks provided';
      await request.save();
      return res.json({ message: 'Request rejected', request });
    }

    // Approve logic -> Generate Certificate
    const student = await User.findById(request.studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let certificateId;
    let exists = true;
    while (exists) {
      certificateId = generateCertificateId();
      const found = await Certificate.findOne({ certificateId });
      if (!found) exists = false;
    }

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    const certificate = await Certificate.create({
      certificateId,
      studentId: student._id,
      studentName: student.name,
      studentEmail: student.email,
      event: `${request.course_name} - Level ${request.level}`,
      issuedDate: Date.now(),
      status: 'Valid',
      qrCode: qrCodeDataUrl,
      verificationUrl,
      issuedBy: req.user._id,
    });

    request.status = 'approved';
    request.certificateId = certificateId;
    request.certificateObjectId = certificate._id;
    await request.save();

    res.json({ message: 'Request approved and certificate generated', request, certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
