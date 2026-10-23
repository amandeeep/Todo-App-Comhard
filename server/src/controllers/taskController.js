import taskService from '../services/taskService.js';
import { sendSuccess } from '../utils/response.js';

export const createTask = async (req, res, next) => {
  try { sendSuccess(res, await taskService.createTask(req.body, req.userId), 201); }
  catch (error) { next(error); }
};

export const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.query, req.userId);
    sendSuccess(res, result.data, 200, { pagination: result.pagination });
  } catch (error) { next(error); }
};

export const getTaskById = async (req, res, next) => {
  try { sendSuccess(res, await taskService.getTaskById(req.params.id, req.userId)); }
  catch (error) { next(error); }
};

export const updateTask = async (req, res, next) => {
  try { sendSuccess(res, await taskService.updateTask(req.params.id, req.body, req.userId)); }
  catch (error) { next(error); }
};

export const deleteTask = async (req, res, next) => {
  try { await taskService.deleteTask(req.params.id, req.userId); sendSuccess(res, { message: 'Task deleted' }); }
  catch (error) { next(error); }
};

export const updateTaskStatus = async (req, res, next) => {
  try { sendSuccess(res, await taskService.updateTaskStatus(req.params.id, req.body.status, req.userId)); }
  catch (error) { next(error); }
};

export const completeTask = async (req, res, next) => {
  try { sendSuccess(res, await taskService.completeTask(req.params.id, req.userId)); }
  catch (error) { next(error); }
};

export const bulkUpdate = async (req, res, next) => {
  try {
    const { taskIds, ...updateData } = req.body;
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ success: false, message: 'taskIds array is required' });
    }
    sendSuccess(res, await taskService.bulkUpdate(taskIds, updateData, req.userId));
  } catch (error) { next(error); }
};

export const getTasksByStatus = async (req, res, next) => {
  try { sendSuccess(res, await taskService.getTasksByStatus(req.query, req.userId)); }
  catch (error) { next(error); }
};
