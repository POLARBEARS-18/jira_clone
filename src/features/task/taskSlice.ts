import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, PostTask, ReadTask, TaskState, User } from 'types/types';
import axios from 'axios';
import { RootState } from 'redux/store';

export const fetchAsyncGetTasks = createAsyncThunk('task/getTask', async () => {
  const res = await axios.get<ReadTask[]>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/tasks/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return res.data;
});

export const fetchAsyncGetUsers = createAsyncThunk('task/getUsers', async () => {
  const res = await axios.get<User[]>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/users/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return res.data;
});

export const fetchAsyncGetCategory = createAsyncThunk('task/getCategory', async () => {
  const res = await axios.get<Category[]>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/category/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return res.data;
});

export const fetchAsyncCreateCategory = createAsyncThunk('task/createCategory', async (item: string) => {
  const res = await axios.post<Category>(
    `${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/category/`,
    { item },
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT as string}`,
      },
    }
  );
  return res.data;
});

export const fetchAsyncCreateTask = createAsyncThunk('task/createTask', async (task: PostTask) => {
  const res = await axios.post<ReadTask>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/tasks/`, task, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return res.data;
});

export const fetchAsyncUpdateTask = createAsyncThunk('task/updateTask', async (task: PostTask) => {
  const res = await axios.put<ReadTask>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/tasks/${task.id}`, task, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return res.data;
});

export const fetchAsyncDeleteTask = createAsyncThunk('task/deleteTask', async (id: number) => {
  await axios.delete(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/tasks/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return id;
});

export const initialState: TaskState = {
  tasks: [
    {
      id: 0,
      task: '',
      description: '',
      criteria: '',
      status: '',
      status_name: '',
      category: 0,
      category_item: '',
      estimate: 0,
      responsible: 0,
      responsible_username: '',
      owner: 0,
      owner_username: '',
      created_at: '',
      updated_at: '',
    },
  ],
  editedTask: {
    id: 0,
    task: '',
    description: '',
    criteria: '',
    status: '',
    category: 0,
    estimate: 0,
    responsible: 0,
  },
  selectedTask: {
    id: 0,
    task: '',
    description: '',
    criteria: '',
    status: '',
    status_name: '',
    category: 0,
    category_item: '',
    estimate: 0,
    responsible: 0,
    responsible_username: '',
    owner: 0,
    owner_username: '',
    created_at: '',
    updated_at: '',
  },
  users: [
    {
      id: 0,
      username: '',
    },
  ],
  category: [
    {
      id: 0,
      item: '',
    },
  ],
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    editTask(state, action: PayloadAction<PostTask>) {
      const wrapState = state;
      wrapState.editedTask = action.payload;
    },
    selectTask(state, action: PayloadAction<ReadTask>) {
      const wrapState = state;
      wrapState.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetTasks.fulfilled, (state, action: PayloadAction<ReadTask[]>) => ({
      ...state,
      tasks: action.payload,
    }));
    // JWTの有効期限が切れた場合
    builder.addCase(fetchAsyncGetTasks.rejected, () => {
      window.location.href = '/';
    });

    builder.addCase(fetchAsyncGetUsers.fulfilled, (state, action: PayloadAction<User[]>) => ({
      ...state,
      users: action.payload,
    }));

    builder.addCase(fetchAsyncGetCategory.fulfilled, (state, action: PayloadAction<Category[]>) => ({
      ...state,
      category: action.payload,
    }));

    builder.addCase(fetchAsyncCreateCategory.fulfilled, (state, action: PayloadAction<Category>) => ({
      ...state,
      category: [...state.category, action.payload],
    }));
    // JWTの有効期限が切れた場合
    builder.addCase(fetchAsyncCreateCategory.rejected, () => {
      window.location.href = '/';
    });

    builder.addCase(fetchAsyncCreateTask.fulfilled, (state, action: PayloadAction<ReadTask>) => ({
      ...state,
      tasks: [action.payload, ...state.tasks],
      editedTask: initialState.editedTask,
    }));
    builder.addCase(fetchAsyncCreateTask.rejected, () => {
      window.location.href = '/';
    });

    builder.addCase(fetchAsyncUpdateTask.fulfilled, (state, action: PayloadAction<ReadTask>) => ({
      ...state,
      tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
      editedTask: initialState.editedTask,
      selectedTask: initialState.selectedTask,
    }));
    builder.addCase(fetchAsyncUpdateTask.rejected, () => {
      window.location.href = '/';
    });

    builder.addCase(fetchAsyncDeleteTask.fulfilled, (state, action: PayloadAction<number>) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== action.payload),
      editedTask: initialState.editedTask,
      selectedTask: initialState.selectedTask,
    }));
    builder.addCase(fetchAsyncDeleteTask.rejected, () => {
      window.location.href = '/';
    });
  },
});

export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;

export const { editTask, selectTask } = taskSlice.actions;
export default taskSlice.reducer;
