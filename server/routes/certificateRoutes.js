import express from 'express';
import {
  issueCertificate,
  getAllCertificates,
  getCertificateById,
  getCertificateByCertId,
  getStudentCertificates,
  updateCertificateStatus,
  deleteCertificate,
  downloadPDF,
  publicDownloadPDF,
  getRanking,
} from '../controllers/certificateController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/verify/:certId', getCertificateByCertId);
router.get('/ranking', getRanking);
router.get('/public/:certificateId/download', publicDownloadPDF);
router.get('/:id/download', downloadPDF);

// Protected routes
router.get('/', protect, admin, getAllCertificates);
router.get('/my-certificates', protect, getStudentCertificates);
router.get('/:id', protect, getCertificateById);

// Admin routes
router.post('/', protect, admin, issueCertificate);
router.patch('/:id/status', protect, admin, updateCertificateStatus);
router.delete('/:id', protect, admin, deleteCertificate);

export default router;
