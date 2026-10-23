import sectionService from '../services/sectionService.js';
import { sendSuccess } from '../utils/response.js';

export const getSections = async (req, res, next) => {
  try { sendSuccess(res, await sectionService.getSections(req.userId)); }
  catch (error) { next(error); }
};

export const createSection = async (req, res, next) => {
  try { sendSuccess(res, await sectionService.createSection(req.body, req.userId), 201); }
  catch (error) { next(error); }
};

export const updateSection = async (req, res, next) => {
  try { sendSuccess(res, await sectionService.updateSection(req.params.id, req.body, req.userId)); }
  catch (error) { next(error); }
};

export const deleteSection = async (req, res, next) => {
  try { await sectionService.deleteSection(req.params.id, req.userId); sendSuccess(res, { message: 'Section deleted' }); }
  catch (error) { next(error); }
};
