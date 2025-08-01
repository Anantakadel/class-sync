import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Submission from '../models/Submission';
import Assignment from '../models/Assignment';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';

// @desc    Get submissions for an assignment
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private
export const getSubmissionsByAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
      return;
    }

    // Check permissions
    if (req.user.role === 'student' && assignment.createdBy.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    const query: any = { assignmentId: req.params.assignmentId };
    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Submission.countDocuments(query);

    res.json({
      success: true,
      data: {
        submissions,
        assignment: {
          id: assignment._id,
          title: assignment.title,
          dueDate: assignment.dueDate
        },
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          hasNext: skip + submissions.length < total,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's submissions
// @route   GET /api/submissions/my
// @access  Private (Students only)
export const getMySubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const submissions = await Submission.find({ studentId: req.user.id })
      .populate('assignmentId', 'title dueDate')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Submission.countDocuments({ studentId: req.user.id });

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          hasNext: skip + submissions.length < total,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/submissions
// @access  Private (Students only)
export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const { assignmentId } = req.body;

    // Get file paths from uploaded files
    const files = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

    // Check if assignment exists and is active
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || !assignment.isActive) {
      res.status(404).json({
        success: false,
        message: 'Assignment not found or inactive'
      });
      return;
    }

    // Check if assignment is overdue
    if (new Date() > assignment.dueDate) {
      res.status(400).json({
        success: false,
        message: 'Assignment is overdue and cannot be submitted'
      });
      return;
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId: req.user.id
    });

    if (existingSubmission) {
      res.status(400).json({
        success: false,
        message: 'You have already submitted this assignment'
      });
      return;
    }

    const submission = await Submission.create({
      assignmentId,
      studentId: req.user.id,
      files,
      submittedAt: new Date()
    });

    const populatedSubmission = await Submission.findById(submission._id)
      .populate('assignmentId', 'title dueDate')
      .populate('studentId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: { submission: populatedSubmission }
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private (Students only)
export const updateSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array()
      });
      return;
    }

    const submission = await Submission.findById(req.params.id)
      .populate('assignmentId', 'dueDate');

    if (!submission) {
      res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
      return;
    }

    // Check ownership
    if (submission.studentId.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own submissions.'
      });
      return;
    }

    // Check if assignment is overdue - Fix: Cast to any to access populated fields
    const assignment = submission.assignmentId as any;
    if (new Date() > assignment.dueDate) {
      res.status(400).json({
        success: false,
        message: 'Cannot update submission after due date'
      });
      return;
    }

    // Get file paths from uploaded files
    const newFiles = req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

    // Combine existing files with new files (or replace if new files are provided)
    const files = newFiles.length > 0 ? newFiles : submission.files;

    submission.files = files;
    submission.submittedAt = new Date();

    await submission.save();

    const updatedSubmission = await Submission.findById(submission._id)
      .populate('assignmentId', 'title dueDate')
      .populate('studentId', 'name email');

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: { submission: updatedSubmission }
    });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Grade submission (Teacher only)
export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { grade, feedback, status } = req.body;

    const submission = await Submission.findById(id).populate('assignmentId');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Check if user is teacher of this assignment
    if (submission.assignmentId.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = status || submission.status;
    submission.gradedAt = new Date();

    await submission.save();

    // Create notification for student
    await Notification.create({
      userId: submission.studentId,
      type: 'grading',
      title: 'Assignment Graded',
      message: `Your submission for "${submission.assignmentId.title}" has been graded.`,
      assignmentId: submission.assignmentId._id
    });

    res.json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getSubmissionsByAssignment, getMySubmissions, submitAssignment, updateSubmission, gradeSubmission };