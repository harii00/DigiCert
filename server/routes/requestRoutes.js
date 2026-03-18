import express from 'express';
import { createRequest, getAllRequests, getMyRequests, processRequest } from '../controllers/requestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/', protect, admin, getAllRequests);
router.get('/my-requests', protect, getMyRequests);
router.patch('/:id', protect, admin, processRequest);

export default router;
