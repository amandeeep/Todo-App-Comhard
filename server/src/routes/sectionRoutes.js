import { Router } from 'express';
import * as sectionController from '../controllers/sectionController.js';
import auth from '../middleware/auth.js';
import { createSectionValidator, updateSectionValidator } from '../validators/index.js';

const router = Router();
router.use(auth);

router.get('/', sectionController.getSections);
router.post('/', createSectionValidator, sectionController.createSection);
router.patch('/:id', updateSectionValidator, sectionController.updateSection);
router.delete('/:id', sectionController.deleteSection);

export default router;
