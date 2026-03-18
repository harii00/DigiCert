import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByRollNumber,
  uploadStudentsCSV
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer config for file upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /csv|xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && (mimetype || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel')) {
      return cb(null, true);
    } else {
      cb('Error: Only CSV and Excel files allowed!');
    }
  }
});

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin-only// Student Management routes
router.route('/students')
  .get(protect, admin, getAllStudents)
  .post(protect, admin, createStudent);

router.post('/students/upload', protect, admin, upload.single('file'), uploadStudentsCSV);

router.route('/students/roll/:roll_number')
  .get(protect, admin, getStudentByRollNumber);

router.route('/students/:id')
  .get(protect, admin, getStudentById)
  .put(protect, admin, updateStudent)
  .delete(protect, admin, deleteStudent);

export default router;
