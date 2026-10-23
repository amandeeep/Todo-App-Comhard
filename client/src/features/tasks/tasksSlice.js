import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/endpoints';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (params, { rejectWithValue }) => {
  try {
    const response = await taskService.getAll(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const fetchTasksByStatus = createAsyncThunk('tasks/fetchTasksByStatus', async (params, { rejectWithValue }) => {
  try {
    const response = await taskService.getByStatus(params);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks by status');
  }
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (id, { rejectWithValue }) => {
  try {
    const response = await taskService.getById(id);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (data, { rejectWithValue }) => {
  try {
    const response = await taskService.create(data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await taskService.update(id, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    await taskService.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateTaskStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await taskService.updateStatus(id, status);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
  }
});

export const bulkUpdateTasks = createAsyncThunk('tasks/bulkUpdate', async (data, { rejectWithValue }) => {
  try {
    const response = await taskService.bulkUpdate(data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to bulk update tasks');
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    byStatus: {},
    currentTask: null,
    pagination: {
      page: 1,
      limit: 20,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    filters: {
      search: '',
      status: '',
      priority: '',
      tags: '',
      slaStatus: '',
      sortBy: 'createdAt',
      order: 'desc',
      dueToday: '',
      dueThisWeek: '',
      overdue: '',
    },
    selectedTasks: [],
    activeView: 'list',
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        priority: '',
        tags: '',
        slaStatus: '',
        sortBy: 'createdAt',
        order: 'desc',
        dueToday: '',
        dueThisWeek: '',
        overdue: '',
      };
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    toggleTaskSelection: (state, action) => {
      const id = action.payload;
      const idx = state.selectedTasks.indexOf(id);
      if (idx > -1) {
        state.selectedTasks.splice(idx, 1);
      } else {
        state.selectedTasks.push(id);
      }
    },
    selectAllTasks: (state) => {
      state.selectedTasks = state.items.map((t) => t._id);
    },
    clearSelection: (state) => {
      state.selectedTasks = [];
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch by status
      .addCase(fetchTasksByStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasksByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.byStatus = action.payload;
      })
      .addCase(fetchTasksByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single task
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isCreating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isUpdating = false;
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx > -1) state.items[idx] = action.payload;
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
        state.selectedTasks = state.selectedTasks.filter((id) => id !== action.payload);
      })
      // Update status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx > -1) state.items[idx] = action.payload;
      })
      // Bulk update
      .addCase(bulkUpdateTasks.fulfilled, (state) => {
        state.selectedTasks = [];
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  setActiveView,
  toggleTaskSelection,
  selectAllTasks,
  clearSelection,
  clearCurrentTask,
  clearError,
} = tasksSlice.actions;
export default tasksSlice.reducer;
