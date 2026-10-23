import taskService from '../services/taskService.js';
import { sendSuccess } from '../utils/response.js';

export const getStats = async (req, res, next) => {
  try { sendSuccess(res, await taskService.getDashboardStats(req.userId)); }
  catch (error) { next(error); }
};

export const getSlaStats = async (req, res, next) => {
  try { sendSuccess(res, await taskService.getSlaStats(req.userId)); }
  catch (error) { next(error); }
};
