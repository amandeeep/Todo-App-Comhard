import Task from '../models/Task.js';
import { AppError } from '../utils/response.js';

class TaskService {
  buildFilterQuery(queryParams, userId) {
    const filter = { createdBy: userId, isDeleted: false };

    if (queryParams.search) {
      filter.$or = [
        { title: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    if (queryParams.status) {
      const statuses = queryParams.status.split(',').map(s => s.trim());
      filter.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
    }

    if (queryParams.priority) {
      const priorities = queryParams.priority.split(',').map(p => p.trim());
      filter.priority = priorities.length === 1 ? priorities[0] : { $in: priorities };
    }

    if (queryParams.tags) {
      const tags = queryParams.tags.split(',').map(t => t.trim());
      filter.tags = { $in: tags };
    }

    if (queryParams.sectionId) filter.sectionId = queryParams.sectionId;

    if (queryParams.slaStatus) {
      const slaStatuses = queryParams.slaStatus.split(',').map(s => s.trim());
      filter.slaStatus = slaStatuses.length === 1 ? slaStatuses[0] : { $in: slaStatuses };
    }

    if (queryParams.dueBefore) filter.dueAt = { ...filter.dueAt, $lte: new Date(queryParams.dueBefore) };
    if (queryParams.dueAfter) filter.dueAt = { ...filter.dueAt, $gte: new Date(queryParams.dueAfter) };
    if (queryParams.createdBefore) filter.createdAt = { ...filter.createdAt, $lte: new Date(queryParams.createdBefore) };
    if (queryParams.createdAfter) filter.createdAt = { ...filter.createdAt, $gte: new Date(queryParams.createdAfter) };

    if (queryParams.overdue === 'true') {
      filter.dueAt = { $lt: new Date() };
      filter.status = { $ne: 'Done' };
    }

    if (queryParams.noDueDate === 'true') filter.dueAt = null;

    if (queryParams.dueToday === 'true') {
      const start = new Date(); start.setHours(0, 0, 0, 0);
      const end = new Date(); end.setHours(23, 59, 59, 999);
      filter.dueAt = { $gte: start, $lte: end };
    }

    if (queryParams.dueThisWeek === 'true') {
      const now = new Date();
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek); endOfWeek.setDate(startOfWeek.getDate() + 6); endOfWeek.setHours(23, 59, 59, 999);
      filter.dueAt = { $gte: startOfWeek, $lte: endOfWeek };
    }

    if (queryParams.estimatedDurationMin) filter.estimatedDurationMinutes = { ...filter.estimatedDurationMinutes, $gte: parseFloat(queryParams.estimatedDurationMin) };
    if (queryParams.estimatedDurationMax) filter.estimatedDurationMinutes = { ...filter.estimatedDurationMinutes, $lte: parseFloat(queryParams.estimatedDurationMax) };

    return filter;
  }

  buildSortQuery(queryParams) {
    const sortBy = queryParams.sortBy || 'createdAt';
    const order = queryParams.order === 'asc' ? 1 : -1;
    if (sortBy === 'priority') return { _priorityOrder: order, createdAt: -1 };
    return { [sortBy]: order };
  }

  async createTask(taskData, userId) {
    const task = new Task({
      ...taskData,
      createdBy: userId,
      activity: [{ action: 'created', userId, timestamp: new Date() }],
    });
    await task.save();
    return task;
  }

  async getTasks(queryParams, userId) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = this.buildFilterQuery(queryParams, userId);
    const sort = this.buildSortQuery(queryParams);

    let pipeline = [{ $match: filter }];

    if (queryParams.sortBy === 'priority') {
      pipeline.push({
        $addFields: {
          _priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'Urgent'] }, then: 4 },
                { case: { $eq: ['$priority', 'High'] }, then: 3 },
                { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                { case: { $eq: ['$priority', 'Low'] }, then: 1 },
              ],
              default: 0,
            },
          },
        },
      });
    }

    const countResult = await Task.aggregate([...pipeline, { $count: 'total' }]);
    const totalItems = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalItems / limit);

    pipeline.push(
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users', localField: 'assignee', foreignField: '_id', as: 'assigneeInfo',
          pipeline: [{ $project: { name: 1, email: 1, avatar: 1 } }],
        },
      },
      { $addFields: { assignee: { $arrayElemAt: ['$assigneeInfo', 0] } } },
      { $project: { assigneeInfo: 0, _priorityOrder: 0 } }
    );

    const tasks = await Task.aggregate(pipeline);

    const now = new Date();
    const atRiskThreshold = parseFloat(process.env.SLA_AT_RISK_THRESHOLD || '0.2');
    tasks.forEach(task => {
      if (task.slaDurationMinutes && task.slaDurationMinutes > 0) {
        const startTime = task.startAt || task.createdAt;
        const slaDeadline = new Date(new Date(startTime).getTime() + task.slaDurationMinutes * 60 * 1000);
        task.slaDeadline = slaDeadline;
        if (task.status === 'Done' && task.completedAt) {
          task.slaStatus = new Date(task.completedAt) <= slaDeadline ? 'Met' : 'Breached';
        } else if (now > slaDeadline) {
          task.slaStatus = 'Breached';
        } else {
          const totalDuration = slaDeadline.getTime() - new Date(startTime).getTime();
          const remaining = slaDeadline.getTime() - now.getTime();
          task.slaStatus = (remaining / totalDuration) <= atRiskThreshold ? 'At Risk' : 'On Track';
        }
      }
    });

    return {
      data: tasks,
      pagination: { page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }

  async getTaskById(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, createdBy: userId, isDeleted: false }).populate('assignee', 'name email avatar');
    if (!task) throw new AppError('Task not found', 404);
    task.calculateSlaStatus();
    return task;
  }

  async updateTask(taskId, updateData, userId) {
    const task = await Task.findOne({ _id: taskId, createdBy: userId, isDeleted: false });
    if (!task) throw new AppError('Task not found', 404);

    const activityEntries = [];

    if (updateData.status && updateData.status !== task.status) {
      activityEntries.push({ action: 'status_change', field: 'status', oldValue: task.status, newValue: updateData.status, userId, timestamp: new Date() });
      if (updateData.status === 'Done' && !task.completedAt) updateData.completedAt = new Date();
      if (task.status === 'Done' && updateData.status !== 'Done') {
        updateData.completedAt = null;
        activityEntries.push({ action: 'reopened', userId, timestamp: new Date() });
      }
    }

    if (updateData.priority && updateData.priority !== task.priority) {
      activityEntries.push({ action: 'priority_change', field: 'priority', oldValue: task.priority, newValue: updateData.priority, userId, timestamp: new Date() });
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) task[key] = updateData[key];
    });

    if (activityEntries.length > 0) task.activity.push(...activityEntries);
    await task.save();
    return task;
  }

  async deleteTask(taskId, userId) {
    const task = await Task.findOne({ _id: taskId, createdBy: userId, isDeleted: false });
    if (!task) throw new AppError('Task not found', 404);
    task.isDeleted = true;
    task.deletedAt = new Date();
    task.activity.push({ action: 'deleted', userId, timestamp: new Date() });
    await task.save();
    return task;
  }

  async updateTaskStatus(taskId, status, userId) {
    return this.updateTask(taskId, { status }, userId);
  }

  async completeTask(taskId, userId) {
    return this.updateTask(taskId, { status: 'Done' }, userId);
  }

  async bulkUpdate(taskIds, updateData, userId) {
    const results = [];
    for (const id of taskIds) {
      try {
        const task = await this.updateTask(id, updateData, userId);
        results.push({ id, success: true, task });
      } catch (err) {
        results.push({ id, success: false, error: err.message });
      }
    }
    return results;
  }

  async getDashboardStats(userId) {
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now); endOfDay.setHours(23, 59, 59, 999);
    const base = { createdBy: userId, isDeleted: false };

    const [totalTasks, completedTasks, overdueTasks, todayTasks, inProgressTasks, statusCounts, priorityCounts] = await Promise.all([
      Task.countDocuments(base),
      Task.countDocuments({ ...base, status: 'Done' }),
      Task.countDocuments({ ...base, dueAt: { $lt: now }, status: { $ne: 'Done' } }),
      Task.countDocuments({ ...base, dueAt: { $gte: startOfDay, $lte: endOfDay } }),
      Task.countDocuments({ ...base, status: 'In Progress' }),
      Task.aggregate([{ $match: base }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $match: base }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
    ]);

    return {
      totalTasks, completedTasks, overdueTasks, todayTasks, inProgressTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      statusBreakdown: statusCounts.reduce((a, { _id, count }) => { a[_id] = count; return a; }, {}),
      priorityBreakdown: priorityCounts.reduce((a, { _id, count }) => { a[_id] = count; return a; }, {}),
    };
  }

  async getSlaStats(userId) {
    const base = { createdBy: userId, isDeleted: false, slaDurationMinutes: { $gt: 0 } };
    const now = new Date();
    const atRiskThreshold = parseFloat(process.env.SLA_AT_RISK_THRESHOLD || '0.2');
    const tasks = await Task.find(base).lean();

    let onTrack = 0, atRisk = 0, breached = 0, met = 0, totalEligible = 0, totalCompletionTime = 0, completedCount = 0;

    tasks.forEach(task => {
      const startTime = task.startAt || task.createdAt;
      const slaDeadline = new Date(new Date(startTime).getTime() + task.slaDurationMinutes * 60 * 1000);

      if (task.status === 'Done' && task.completedAt) {
        totalEligible++;
        completedCount++;
        totalCompletionTime += (new Date(task.completedAt).getTime() - new Date(startTime).getTime()) / (1000 * 60);
        if (new Date(task.completedAt) <= slaDeadline) met++; else breached++;
      } else if (now > slaDeadline) {
        breached++;
      } else {
        const totalDuration = slaDeadline.getTime() - new Date(startTime).getTime();
        const remaining = slaDeadline.getTime() - now.getTime();
        if ((remaining / totalDuration) <= atRiskThreshold) atRisk++; else onTrack++;
      }
    });

    return {
      onTrack, atRisk, breached, met,
      totalWithSla: tasks.length,
      compliancePercentage: totalEligible > 0 ? Math.round((met / totalEligible) * 100) : 0,
      avgCompletionTimeMinutes: completedCount > 0 ? Math.round(totalCompletionTime / completedCount) : 0,
    };
  }

  async getTasksByStatus(queryParams, userId) {
    const filter = this.buildFilterQuery(queryParams, userId);
    delete filter.status;

    const statuses = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];
    const result = {};

    for (const status of statuses) {
      const statusFilter = { ...filter, status };
      const page = parseInt(queryParams[`${status.replace(/\s/g, '')}Page`]) || 1;
      const limit = parseInt(queryParams.columnLimit) || 20;
      const skip = (page - 1) * limit;

      const [tasks, count] = await Promise.all([
        Task.find(statusFilter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).populate('assignee', 'name email avatar').lean(),
        Task.countDocuments(statusFilter),
      ]);

      result[status] = { tasks, totalCount: count, page, hasMore: skip + limit < count };
    }

    return result;
  }
}

export default new TaskService();
