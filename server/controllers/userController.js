import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import xlsx from 'xlsx';
import fs from 'fs';

const DEPARTMENT_MAPPING = {
  'BM': 'Biomedical Engineering',
  'CE': 'Civil Engineering',
  'CD': 'Computer Science & Design',
  'CS': 'Computer Science & Engineering',
  'EE': 'Electrical & Electronics Engineering',
  'EC': 'Electronics & Communication Engineering',
  'EI': 'Electronics & Instrumentation Engineering',
  'ME': 'Mechanical Engineering',
  'MZ': 'Mechatronics Engineering',
  'SE': 'Information Science & Engineering',
  'AG': 'Agricultural Engineering',
  'AD': 'Artificial Intelligence and Data Science',
  'AL': 'Artificial Intelligence and Machine Learning',
  'BT': 'Biotechnology',
  'CB': 'Computer Science & Business Systems',
  'CT': 'Computer Technology',
  'FT': 'Fashion Technology',
  'FD': 'Food Technology',
  'IT': 'Information Technology',
  'TT': 'Textile Technology'
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        department: user.department || '',
        roll_number: user.roll_number || '',
        profilePicture: user.profilePicture || '',
        signature: user.signature || '',
        isPasswordChanged: user.isPasswordChanged,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;
      
      if (req.body.signature !== undefined) {
          user.signature = req.body.signature;
      }

      if (req.body.password) {
        user.password = req.body.password;
        user.isPasswordChanged = true;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        department: updatedUser.department || '',
        roll_number: updatedUser.roll_number || '',
        profilePicture: updatedUser.profilePicture,
        signature: updatedUser.signature,
        isPasswordChanged: updatedUser.isPasswordChanged,
        role: updatedUser.role,
        email: updatedUser.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });

    // Attach certificate count for each student
    const studentsWithCerts = await Promise.all(
      students.map(async (student) => {
        const certCount = await Certificate.countDocuments({ studentId: student._id });
        return {
          ...student.toObject(),
          certificateCount: certCount,
        };
      })
    );

    res.json(studentsWithCerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single student by ID
// @route   GET /api/users/students/:id
// @access  Private/Admin
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const certificates = await Certificate.find({ studentId: student._id })
      .populate('issuedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      ...student.toObject(),
      certificates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single student by roll number
// @route   GET /api/users/students/roll/:roll_number
// @access  Private/Admin
export const getStudentByRollNumber = async (req, res) => {
  try {
    const student = await User.findOne({ roll_number: req.params.roll_number, role: 'student' }).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new student
// @route   POST /api/users/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, department, roll_number } = req.body;

    if (!name || !email || !password || !roll_number) {
      return res.status(400).json({ message: 'Name, email, password, and roll number are required' });
    }

    const userExists = await User.findOne({ 
      $or: [{ email }, { roll_number }]
    });

    if (userExists) {
      const field = userExists.email === email ? 'email' : 'roll number';
      return res.status(400).json({ message: `User with this ${field} already exists` });
    }

    const student = await User.create({
      name,
      email,
      password,
      roll_number,
      role: 'student',
      department: department || '',
    });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      roll_number: student.roll_number,
      role: student.role,
      department: student.department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student info
// @route   PUT /api/users/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, email, department, password, roll_number } = req.body;

    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (roll_number && roll_number !== student.roll_number) {
      const rollExists = await User.findOne({ roll_number });
      if (rollExists) {
        return res.status(400).json({ message: 'Roll number already in use' });
      }
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.department = department !== undefined ? department : student.department;
    student.roll_number = roll_number || student.roll_number;
    if (password) {
      student.password = password;
    }

    await student.save();

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      roll_number: student.roll_number,
      role: student.role,
      department: student.department,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/users/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload bulk students via CSV/Excel
// @route   POST /api/users/students/upload
// @access  Private/Admin
export const uploadStudentsCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV or Excel file' });
  }

  const filePath = req.file.path;
  const results = {
    totalProcessed: 0,
    added: 0,
    skipped: 0,
    invalid: 0,
    errors: []
  };

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Get existing emails and roll numbers to avoid duplicates efficiently
    const existingUsers = await User.find({}, 'email roll_number').lean();
    const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
    const existingRolls = new Set(existingUsers.filter(u => u.roll_number).map(u => u.roll_number.toUpperCase()));

    const validNewStudents = [];

    for (let i = 0; i < data.length; i++) {
       results.totalProcessed++;
       const row = data[i];

       // Normalize headers
       const getCol = (possibleNames) => {
         for (let key in row) {
           if (possibleNames.includes(key.trim().toLowerCase())) return row[key];
         }
         return null;
       };

       const name = getCol(['name', 'full name', 'student name']);
       const email = getCol(['email', 'email id', 'email address']);
       const rawRoll = getCol(['roll_number', 'roll number', 'rollno', 'register number']);

       if (!name || !email || !rawRoll) {
         results.invalid++;
         results.errors.push(`Row ${i + 2}: Missing required fields (Name, Email, or Roll Number)`);
         continue;
       }

       const roll_number = String(rawRoll).toUpperCase().trim();
       const cleanEmail = String(email).toLowerCase().trim();

       // Duplicate check
       if (existingEmails.has(cleanEmail) || existingRolls.has(roll_number)) {
         results.skipped++;
         continue;
       }

       // Roll number validation and department derivation
       if (roll_number.length !== 12) {
         results.invalid++;
         results.errors.push(`Row ${i + 2}: Invalid roll number length (${roll_number})`);
         continue;
       }

       const deptCode = roll_number.substring(7, 9);
       const department = DEPARTMENT_MAPPING[deptCode];

       if (!department) {
         results.invalid++;
         results.errors.push(`Row ${i + 2}: Unknown department code in roll number (${roll_number})`);
         continue;
       }

       const password = `${roll_number}@digicert`;

       validNewStudents.push({
         name: String(name).trim(),
         email: cleanEmail,
         roll_number,
         department,
         password,
         role: 'student'
       });

       // Optimistically add to sets to catch duplicates within the same file
       existingEmails.add(cleanEmail);
       existingRolls.add(roll_number);
    }

    if (validNewStudents.length > 0) {
      await User.insertMany(validNewStudents);
      results.added = validNewStudents.length;
    }

    // Clean up
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Upload processing completed',
      results
    });

  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: 'Failed to process file: ' + error.message });
  }
};
