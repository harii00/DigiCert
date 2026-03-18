import CompletedCourse from '../models/CompletedCourse.js';
import xlsx from 'xlsx';
import fs from 'fs';

// @desc    Upload CSV/Excel and update course completion data
// @route   POST /api/courses/upload-csv
// @access  Private/Admin
export const uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV or Excel file' });
  }

  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const results = xlsx.utils.sheet_to_json(sheet);

    const operations = results.map(row => {
      // Normalize keys to lowercase and trim
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.trim().toLowerCase().replace(/^\ufeff/, '');
        normalizedRow[cleanKey] = row[key];
      });

      // Map possible header variations
      const roll_number = String(normalizedRow.roll_number || normalizedRow['roll number'] || '').trim().toUpperCase();
      const name = String(normalizedRow.name || '').trim();
      const course_name = String(normalizedRow.course_name || normalizedRow['course name'] || '').trim();
      const level = parseInt(normalizedRow.level || '0');
      const completed = String(normalizedRow.completed || '').trim().toUpperCase();

      if (!roll_number || !course_name) return null;

      return {
        updateOne: {
          filter: { roll_number, course_name },
          update: { 
            roll_number, 
            name, 
            course_name, 
            level, 
            completed 
          },
          upsert: true
        }
      };
    }).filter(op => op !== null);

    if (operations.length > 0) {
      await CompletedCourse.bulkWrite(operations);
    }
    
    // Clean up uploaded file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    res.status(200).json({ 
      message: `Successfully processed ${operations.length} records`,
      count: operations.length 
    });
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all completed courses
// @route   GET /api/courses
// @access  Private/Admin
export const getAllCompletedCourses = async (req, res) => {
  try {
    const courses = await CompletedCourse.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's completed courses
// @route   GET /api/courses/my-courses
// @access  Private/Student
export const getMyCompletedCourses = async (req, res) => {
  try {
    const courses = await CompletedCourse.find({ 
      roll_number: req.user.roll_number.trim(),
      completed: 'YES' 
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
