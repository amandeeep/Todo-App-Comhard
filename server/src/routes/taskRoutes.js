import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import auth from '../middleware/auth.js';
import { createTaskValidator, updateTaskValidator, taskIdValidator, taskQueryValidator } from '../validators/index.js';

const router = Router();
router.use(auth);

router.post('/', createTaskValidator, taskController.createTask);
router.get('/', taskQueryValidator, taskController.getTasks);
router.get('/by-status', taskQueryValidator, taskController.getTasksByStatus);
router.post('/bulk-update', taskController.bulkUpdate);
router.get('/:id', taskIdValidator, taskController.getTaskById);
router.patch('/:id', updateTaskValidator, taskController.updateTask);
router.delete('/:id', taskIdValidator, taskController.deleteTask);
router.patch('/:id/status', taskIdValidator, taskController.updateTaskStatus);
router.patch('/:id/complete', taskIdValidator, taskController.completeTask);

export default router;
