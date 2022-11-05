import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import { AuthState, CRED, JWT, LoginUser, PostProfile, Profile, User } from 'types/types';
import axios from 'axios';

export const fetchAsyncLogin = createAsyncThunk('auth/login', async (auth: CRED) => {
  const res = await axios.post<JWT>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/authen/jwt/create`, auth, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
});

export const fetchAsyncRegister = createAsyncThunk('auth/register', async (auth: CRED) => {
  const res = await axios.post<User>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/create/`, auth, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
});

export const fetchAsyncGetMyProf = createAsyncThunk('auth/loginuser', async () => {
  const res = await axios.get<LoginUser>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/loginuser/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return res.data;
});

export const fetchAsyncCreateProf = createAsyncThunk('auth/createProfile', async () => {
  const res = await axios.post<Profile>(
    `${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/profile/`,
    { img: null },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWT as string}`,
      },
    }
  );
  return res.data;
});

export const fetchAsyncGetProfs = createAsyncThunk('auth/getProfiles', async () => {
  const res = await axios.get<Profile[]>(`${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT as string}`,
    },
  });
  return res.data;
});

export const fetchAsyncUpdateProf = createAsyncThunk('auth/updateProfile', async (profile: PostProfile) => {
  const uploadData = new FormData();
  if (profile.img) uploadData.append('img', profile.img, profile.img.name);

  const res = await axios.put<Profile>(
    `${import.meta.env.VITE_LOCAL_PUBLIC_FOLDER}/api/profile/${profile.id}/`,
    uploadData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.localJWT as string}`,
      },
    }
  );
  return res.data;
});

const initialState: AuthState = {
  isLoginView: true,
  loginUser: {
    id: 0,
    username: '',
  },
  profiles: [
    {
      id: 0,
      user_profile: 0,
      img: null,
    },
  ],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleMode(state) {
      const wrapState = state;
      wrapState.isLoginView = !state.isLoginView;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action: PayloadAction<JWT>) => {
      localStorage.setItem('localJWT', action.payload.access);
      if (action.payload.access) window.location.href = '/tasks';
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action: PayloadAction<LoginUser>) => ({
      ...state,
      loginUser: action.payload,
    }));
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action: PayloadAction<Profile[]>) => ({
      ...state,
      profiles: action.payload,
    }));
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action: PayloadAction<Profile>) => ({
      ...state,
      profiles: state.profiles.map((prof) => (prof.id === action.payload.id ? action.payload : prof)),
    }));
  },
});

export const { toggleMode } = authSlice.actions;

export const selectIsLoginView = (state: RootState) => state.auth.isLoginView;
export const selectLoginUser = (state: RootState) => state.auth.loginUser;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
