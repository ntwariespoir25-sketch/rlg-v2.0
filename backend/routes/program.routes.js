const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { adminProtect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const {
  getAllPrograms,
  getProgramBySlug,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  getProgramsByType,
} = require('../controllers/program.controller');

// Public routes
router.get('/', getAllPrograms);
router.get('/type/:type', getProgramsByType);
router.get('/slug/:slug', getProgramBySlug);
router.get('/:id', getProgramById);

// Admin only routes
router.use(adminProtect);

const programValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn(['School Leadership Development', 'Tournaments & Competitions', 'Leadership Forums & Conferences']),
  body('target').notEmpty().withMessage('Target audience is required'),
  body('description').notEmpty().withMessage('Description is required'),
];

router.post('/', programValidation, validate, createProgram);
router.put('/:id', programValidation, validate, updateProgram);
router.delete('/:id', deleteProgram);

module.exports = router;