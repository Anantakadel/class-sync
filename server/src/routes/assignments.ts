import express from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import { authenticateJWT, requireTeacher } from '../middleware/auth';
import {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController';

const router = express.Router();

// Configure multer for assignment files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Validation middleware
const assignmentValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('dueDate')
    .isISO8601()
    .withMessage('Valid due date is required'),
  body('instructions')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Instructions cannot exceed 2000 characters')
];

// Routes
router.get('/', authenticateJWT, getAssignments);
router.get('/:id', authenticateJWT, getAssignment);
router.post('/', authenticateJWT, requireTeacher, upload.array('files', 5), assignmentValidation, createAssignment);
router.put('/:id', authenticateJWT, requireTeacher, upload.array('files', 5), assignmentValidation, updateAssignment);
router.delete('/:id', authenticateJWT, requireTeacher, deleteAssignment);

export default router;