import Section from '../models/Section.js';
import Task from '../models/Task.js';
import { AppError } from '../utils/response.js';

class SectionService {
  async createDefaultSections(userId) {
    const defaults = [
      { name: 'Backlog', order: 0, color: '#94a3b8', isDefault: true },
      { name: 'To Do', order: 1, color: '#60a5fa', isDefault: true },
      { name: 'In Progress', order: 2, color: '#fbbf24', isDefault: true },
      { name: 'In Review', order: 3, color: '#a78bfa', isDefault: true },
      { name: 'Done', order: 4, color: '#34d399', isDefault: true },
    ];
    return Section.insertMany(defaults.map(s => ({ ...s, createdBy: userId })));
  }

  async getSections(userId) {
    let sections = await Section.find({ createdBy: userId, isDeleted: false }).sort({ order: 1 });
    if (sections.length === 0) sections = await this.createDefaultSections(userId);

    const sectionIds = sections.map(s => s._id);
    const counts = await Task.aggregate([
      { $match: { sectionId: { $in: sectionIds }, isDeleted: false, createdBy: userId } },
      { $group: { _id: '$sectionId', count: { $sum: 1 } } },
    ]);
    const countMap = counts.reduce((a, { _id, count }) => { a[_id.toString()] = count; return a; }, {});

    return sections.map(s => ({ ...s.toObject(), taskCount: countMap[s._id.toString()] || 0 }));
  }

  async createSection(data, userId) {
    const maxOrder = await Section.findOne({ createdBy: userId, isDeleted: false }).sort({ order: -1 }).select('order');
    return Section.create({ ...data, order: maxOrder ? maxOrder.order + 1 : 0, createdBy: userId });
  }

  async updateSection(sectionId, data, userId) {
    const section = await Section.findOne({ _id: sectionId, createdBy: userId, isDeleted: false });
    if (!section) throw new AppError('Section not found', 404);
    Object.keys(data).forEach(key => { if (data[key] !== undefined) section[key] = data[key]; });
    await section.save();
    return section;
  }

  async deleteSection(sectionId, userId) {
    const section = await Section.findOne({ _id: sectionId, createdBy: userId, isDeleted: false });
    if (!section) throw new AppError('Section not found', 404);
    await Task.updateMany({ sectionId: section._id, createdBy: userId }, { $set: { sectionId: null } });
    section.isDeleted = true;
    await section.save();
    return section;
  }
}

export default new SectionService();
