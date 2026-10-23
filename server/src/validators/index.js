import { body, query, param, validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map((err) => ({ field: err.path, message: err.msg }));
    return sendError(res, 'Validation failed', 400, extracted);
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/\d/).withMessage('Password must contain a number'),
  validate,
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate,
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/\d/).withMessage('Password must contain a number'),
  validate,
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters').matches(/\d/).withMessage('Password must contain a number'),
  validate,
];

export const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 300 }),
  body('description').optional().isLength({ max: 5000 }),
  body('status').optional().isIn(['Backlog', 'To Do', 'In Progress', 'In Review', 'Done']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
  body('startAt').optional({ values: 'null' }).isISO8601(),
  body('dueAt').optional({ values: 'null' }).isISO8601(),
  body('estimatedDurationMinutes').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('slaDurationMinutes').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('tags').optional().isArray(),
  validate,
];

export const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title').optional().trim().notEmpty().isLength({ max: 300 }),
  body('description').optional().isLength({ max: 5000 }),
  body('status').optional().isIn(['Backlog', 'To Do', 'In Progress', 'In Review', 'Done']),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
  body('startAt').optional({ values: 'null' }).isISO8601(),
  body('dueAt').optional({ values: 'null' }).isISO8601(),
  body('estimatedDurationMinutes').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('actualDurationMinutes').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('timeSpentMinutes').optional().isFloat({ min: 0 }),
  body('slaDurationMinutes').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('tags').optional().isArray(),
  validate,
];

export const taskIdValidator = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  validate,
];

export const createSectionValidator = [
  body('name').trim().notEmpty().withMessage('Section name is required').isLength({ max: 100 }),
  body('color').optional().matches(/^#[0-9a-fA-F]{6}$/),
  validate,
];

export const updateSectionValidator = [
  param('id').isMongoId().withMessage('Invalid section ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('color').optional().matches(/^#[0-9a-fA-F]{6}$/),
  body('order').optional().isInt({ min: 0 }),
  validate,
];

export const taskQueryValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['title', 'priority', 'status', 'dueAt', 'createdAt', 'startAt', 'estimatedDurationMinutes', 'slaStatus', 'order']),
  query('order').optional().isIn(['asc', 'desc']),
  validate,
];
