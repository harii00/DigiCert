import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const generateCertificateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'DCS-';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// @desc    Issue a new certificate
// @route   POST /api/certificates
// @access  Private/Admin
export const issueCertificate = async (req, res) => {
  try {
    const { studentEmail, studentName, event, issuedDate, status } = req.body;

    if (!studentEmail || !studentName || !event) {
      return res.status(400).json({ message: 'Email, Name, and Event are required' });
    }

    const student = await User.findOne({ email: studentEmail, role: 'student' });

    if (!student) {
      return res.status(404).json({ message: 'Student not found with this email' });
    }

    let certificateId;
    let exists = true;
    while (exists) {
      certificateId = generateCertificateId();
      const found = await Certificate.findOne({ certificateId });
      if (!found) exists = false;
    }

    // Generate Verification URL
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${certificateId}`;

    // Generate QR Code Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    const certificate = await Certificate.create({
      certificateId,
      studentId: student._id,
      studentName,
      studentEmail,
      event,
      issuedDate: issuedDate || Date.now(),
      status: status || 'Valid',
      qrCode: qrCodeDataUrl,
      verificationUrl,
      issuedBy: req.user._id,
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all certificates (with advanced filtering)
// @route   GET /api/certificates
// @access  Public (or Private/Admin depending on config, but search is public)
export const getAllCertificates = async (req, res) => {
  try {
    const { search, status, event, startDate, endDate } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { certificateId: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { event: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (event) {
      query.event = { $regex: event, $options: 'i' };
    }

    if (startDate || endDate) {
      query.issuedDate = {};
      if (startDate) query.issuedDate.$gte = new Date(startDate);
      if (endDate) query.issuedDate.$lte = new Date(endDate);
    }

    const certificates = await Certificate.find(query)
      .populate('studentId', 'name email')
      .populate('issuedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('issuedBy', 'name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Role-based filtering: Students can only see their own
    if (req.user.role === 'student' && certificate.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this certificate' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get certificate by Certificate ID (for verification)
// @route   GET /api/certificates/verify/:certId
// @access  Public
export const getCertificateByCertId = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certId })
      .populate('studentId', 'name email')
      .populate('issuedBy', 'name email');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current student's certificates
// @route   GET /api/certificates/my-certificates
// @access  Private/Student
export const getStudentCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentId: req.user._id })
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update certificate status (Revoke/Validate)
// @route   PATCH /api/certificates/:id/status
// @access  Private/Admin
export const updateCertificateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Valid', 'Revoked', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.status = status;
    await certificate.save();

    res.json({ message: `Certificate status updated to ${status}`, certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    await certificate.deleteOne();
    res.json({ message: 'Certificate removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download Certificate PDF
// @route   GET /api/certificates/:id/download
// @access  Private
export const downloadPDF = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('issuedBy'); // Load issuer to get signature

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Role-based filtering: Students can only download their own
    if (req.user && req.user.role === 'student' && certificate.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to download this certificate' });
    }

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    
    // Support inline viewing via ?inline=true
    if (req.query.inline === 'true') {
      res.setHeader('Content-Disposition', `inline; filename=${certificate.certificateId}.pdf`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename=${certificate.certificateId}.pdf`);
    }
    
    doc.pipe(res);

    // Background Color (Light/White)
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

    // Bolder, Stylized Multi-layer Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(8)
      .stroke('#0f172a'); // Thick outer border

    doc.rect(34, 34, doc.page.width - 68, doc.page.height - 68)
      .lineWidth(1.5)
      .stroke('#64748b'); // Thin inner border

    // Load and place the college logo at the top
    try {
      const fs = await import('fs');
      const path = await import('path');
      const logoPath = path.resolve('public', 'bannari_new_logo.png');
      if (fs.existsSync(logoPath)) {
        // Significantly increase banner logo size and center it
        doc.image(logoPath, (doc.page.width - 550) / 2, 60, { width: 550 });
      }
    } catch(err) {
      console.error('Logo not found or could not be loaded:', err);
    }

    doc.fillColor('#475569'); // slate-600

    // Shift the text body down to account for the larger logo, and tighten line spacing
    doc.fontSize(18)
      .font('Helvetica')
      .text('This acknowledges that', 0, 260, { width: doc.page.width, align: 'center' });

    doc.moveDown(0.3);

    // Ensure name fits on a single line dynamically
    let nameFontSize = 42;
    doc.font('Helvetica-Bold');
    while (doc.widthOfString(certificate.studentName, { size: nameFontSize }) > doc.page.width - 120) {
      nameFontSize -= 2;
    }

    doc.fontSize(nameFontSize)
      .fillColor('#0f172a') // slate-900
      .text(certificate.studentName, 0, doc.y, { width: doc.page.width, align: 'center', lineBreak: false });

    doc.moveDown(0.3);

    doc.fillColor('#475569') // slate-600
      .fontSize(18)
      .font('Helvetica')
      .text('has successfully completed and is certified in', 0, doc.y, { width: doc.page.width, align: 'center' });

    doc.moveDown(0.3);

    doc.fontSize(28)
      .font('Times-BoldItalic') // Different distinct font style
      .fillColor('#1e40af') // Standout color
      .text(`${certificate.event}`, 0, doc.y, { width: doc.page.width, align: 'center' });

    // Lock the Y-axis for both the text block and the signature block so they align perfectly horizontally
    const bottomY = 460;

    // Bottom Left Section (Date and ID)
    const formattedDate = new Date(certificate.issuedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    doc.fontSize(16) // Increased size
      .font('Helvetica-Bold')
      .fillColor('#475569') // slate-600
      .text(`Issue Date: ${formattedDate}`, 60, bottomY)
      .text(`Certificate ID: ${certificate.certificateId}`, 60, bottomY + 25);

    // Bottom Right Section (Admin E-Signature)
    if (certificate.issuedBy && certificate.issuedBy.signature) {
      try {
        const sigImage = certificate.issuedBy.signature.split(',')[1];
        if (sigImage) {
            const sigBuffer = Buffer.from(sigImage, 'base64');
            // Align to bottomY perfectly. A 120px tall image at bottomY-70 places its visual center exactly with the text.
            doc.image(sigBuffer, doc.page.width - 320, bottomY - 60, { width: 260, height: 120, fit: [260, 120], align: 'right' });
        }
      } catch(err) {
          console.error('Error rendering signature map:', err);
          doc.fontSize(16).font('Helvetica-Oblique').fillColor('#0f172a').text('Authorized Signatory', doc.page.width - 250, bottomY + 10);
      }
    } else {
      // Placeholder if no signature
      doc.fontSize(14).font('Helvetica-Oblique').fillColor('#0f172a').text('Authorized Signatory', doc.page.width - 250, bottomY + 10);
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Public download of certificate PDF by certificateId string (no auth required)
// @route   GET /api/certificates/public/:certificateId/download
// @access  Public
export const publicDownloadPDF = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('issuedBy');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');

    if (req.query.inline === 'true') {
      res.setHeader('Content-Disposition', `inline; filename=${certificate.certificateId}.pdf`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename=${certificate.certificateId}.pdf`);
    }

    doc.pipe(res);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

    // Borders
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(8)
      .stroke('#0f172a');

    doc.rect(34, 34, doc.page.width - 68, doc.page.height - 68)
      .lineWidth(1.5)
      .stroke('#64748b');

    // Logo
    try {
      const fs = await import('fs');
      const path = await import('path');
      const logoPath = path.resolve('public', 'bannari_new_logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, (doc.page.width - 550) / 2, 60, { width: 550 });
      }
    } catch(err) {
      console.error('Logo not found or could not be loaded:', err);
    }

    doc.fillColor('#475569');

    doc.fontSize(18)
      .font('Helvetica')
      .text('This acknowledges that', 0, 260, { width: doc.page.width, align: 'center' });

    doc.moveDown(0.3);

    let nameFontSize = 42;
    doc.font('Helvetica-Bold');
    while (doc.widthOfString(certificate.studentName, { size: nameFontSize }) > doc.page.width - 120) {
      nameFontSize -= 2;
    }

    doc.fontSize(nameFontSize)
      .fillColor('#0f172a')
      .text(certificate.studentName, 0, doc.y, { width: doc.page.width, align: 'center', lineBreak: false });

    doc.moveDown(0.3);

    doc.fillColor('#475569')
      .fontSize(18)
      .font('Helvetica')
      .text('has successfully completed and is certified in', 0, doc.y, { width: doc.page.width, align: 'center' });

    doc.moveDown(0.3);

    doc.fontSize(28)
      .font('Times-BoldItalic')
      .fillColor('#1e40af')
      .text(`${certificate.event}`, 0, doc.y, { width: doc.page.width, align: 'center' });

    const bottomY = 460;

    const formattedDate = new Date(certificate.issuedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    doc.fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#475569')
      .text(`Issue Date: ${formattedDate}`, 60, bottomY)
      .text(`Certificate ID: ${certificate.certificateId}`, 60, bottomY + 25);

    if (certificate.issuedBy && certificate.issuedBy.signature) {
      try {
        const sigImage = certificate.issuedBy.signature.split(',')[1];
        if (sigImage) {
          const sigBuffer = Buffer.from(sigImage, 'base64');
          doc.image(sigBuffer, doc.page.width - 320, bottomY - 60, { width: 260, height: 120, fit: [260, 120], align: 'right' });
        }
      } catch(err) {
        console.error('Error rendering signature:', err);
        doc.fontSize(16).font('Helvetica-Oblique').fillColor('#0f172a').text('Authorized Signatory', doc.page.width - 250, bottomY + 10);
      }
    } else {
      doc.fontSize(14).font('Helvetica-Oblique').fillColor('#0f172a').text('Authorized Signatory', doc.page.width - 250, bottomY + 10);
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top 100 students by certificate count
// @route   GET /api/certificates/ranking
// @access  Public
export const getRanking = async (req, res) => {
  try {
    const ranking = await Certificate.aggregate([
      {
        $group: {
          _id: '$studentId',
          studentName: { $first: '$studentName' },
          totalCertificates: { $sum: 1 },
        },
      },
      { $sort: { totalCertificates: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      {
        $project: {
          studentId: '$_id',
          studentName: 1,
          totalCertificates: 1,
          department: { $arrayElemAt: ['$studentInfo.department', 0] },
        },
      },
    ]);

    const rankedStudents = ranking.map((student, index) => ({
      rank: index + 1,
      studentName: student.studentName,
      studentId: student.studentId,
      totalCertificates: student.totalCertificates,
      department: student.department || '',
    }));

    res.json(rankedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
