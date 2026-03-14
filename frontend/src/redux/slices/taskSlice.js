import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  },
  loading: false,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTaskItem: (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setTasks, addTask, updateTaskItem, removeTask, setLoading } = taskSlice.actions;

export default taskSlice.reducer;
