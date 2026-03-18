import express from 'express';
import { uploadCSV, getAllCompletedCourses, getMyCompletedCourses } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload-csv', protect, admin, upload.single('file'), uploadCSV);
router.get('/', protect, admin, getAllCompletedCourses);
router.get('/my-courses', protect, getMyCompletedCourses);

export default router;
