import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateJWT, requireTeacher } from '../middleware/auth';

// Configure multer for submission files
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
import { 
  getSubmissionsByAssignment, 
  getMySubmissions, 
  submitAssignment, 
  updateSubmission 
} from '../controllers/submissionController';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const submissionValidation = [
  body('text').optional().trim().isLength({ min: 1 }).withMessage('Text cannot be empty'),
  body('files').optional().isArray().withMessage('Files must be an array')
];

// Routes
router.get('/assignment/:assignmentId', authenticateJWT, getSubmissionsByAssignment);
router.get('/my', authenticateJWT, getMySubmissions);
router.post('/', authenticateJWT, upload.array('files', 5), submissionValidation, submitAssignment);
router.put('/:id', authenticateJWT, upload.array('files', 5), submissionValidation, updateSubmission);
router.put('/:id/grade', authenticateJWT, requireTeacher, gradeSubmission);

export default router;