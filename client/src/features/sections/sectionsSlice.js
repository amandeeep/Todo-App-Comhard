import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sectionService } from '../../services/endpoints';

export const fetchSections = createAsyncThunk('sections/fetchSections', async (_, { rejectWithValue }) => {
  try {
    const response = await sectionService.getAll();
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch sections');
  }
});

export const createSection = createAsyncThunk('sections/createSection', async (data, { rejectWithValue }) => {
  try {
    const response = await sectionService.create(data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create section');
  }
});

export const updateSection = createAsyncThunk('sections/updateSection', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await sectionService.update(id, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update section');
  }
});

export const deleteSection = createAsyncThunk('sections/deleteSection', async (id, { rejectWithValue }) => {
  try {
    await sectionService.delete(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete section');
  }
});

const sectionsSlice = createSlice({
  name: 'sections',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createSection.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx > -1) state.items[idx] = action.payload;
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      });
  },
});

export default sectionsSlice.reducer;
