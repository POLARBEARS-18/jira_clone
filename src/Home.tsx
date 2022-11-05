import { Avatar, createTheme, css, Grid, ThemeProvider } from '@mui/material';
import {
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
  selectLoginUser,
  selectProfiles,
} from 'features/auth/authSlice';
import {
  fetchAsyncGetCategory,
  fetchAsyncGetTasks,
  fetchAsyncGetUsers,
  selectEditedTask,
  selectTasks,
} from 'features/task/taskSlice';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'redux/hooks';
import { Polyline, Logout } from '@mui/icons-material';
import { TaskList } from 'features/task/TaskList';
import { TaskForm } from 'features/task/TaskForm';
import { TaskDisplay } from 'features/task/TaskDisplay';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#3cb371',
    },
  },
});

export const Home: FC = () => {
  const dispatch = useAppDispatch();
  const editedTask = useSelector(selectEditedTask);
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  const loginProfile = profiles.filter((prof) => prof.user_profile === loginUser.id)[0];

  const LogoutButton = () => {
    localStorage.removeItem('localJWT');
    window.location.href = '/';
  };

  const handlerEditPicture = () => {
    // 紐づくidをクリック
    const fileInput = document.getElementById('imageInput');
    fileInput?.click();
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetTasks());
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetUsers());
      await dispatch(fetchAsyncGetCategory());
      await dispatch(fetchAsyncGetProfs());
    };
    void fetchBootLoader();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div css={SRoot}>
        <Grid container>
          <Grid item xs={4}>
            <Polyline css={SIcon} />
          </Grid>
          <Grid item xs={4}>
            <h1>Scrum Task Board</h1>
          </Grid>
          <Grid item xs={4}>
            <div css={SLogout}>
              <button type="button" onClick={LogoutButton} css={SIconLogout}>
                <Logout fontSize="large" />
              </button>
              <input
                type="file"
                onChange={(e) => {
                  void dispatch(
                    fetchAsyncUpdateProf({
                      id: loginProfile.id,
                      img: e.target.files !== null ? e.target.files[0] : null,
                    })
                  );
                }}
                id="imageInput"
                hidden
              />
              <button type="button" onClick={handlerEditPicture} css={SIconAvatar}>
                <Avatar src={loginProfile?.img !== null ? loginProfile?.img : undefined} alt="avatar" css={SAvatar} />
              </button>
            </div>
          </Grid>
          <Grid item xs={6}>
            {tasks[0]?.task && <TaskList />}
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: '80vh' }}
            >
              <Grid>{editedTask.status ? <TaskForm /> : <TaskDisplay />}</Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

const SRoot = css`
  text-align: center;
  background-color: white;
  color: dimgray;
  font-family: serif;
  margin: 1.5625em;
`;

const SIcon = css`
  margin-top: 1.5em;
  cursor: none;
`;
const SLogout = css`
  margin-top: 1.25em;
  display: flex;
  justify-content: flex-end;
`;
const SIconLogout = css`
  background-color: transparent;
  color: dimgray;
  margin-top: 0.25em;
  border: none;
  outline: none;
  cursor: pointer;
`;
const SIconAvatar = css`
  background-color: transparent;
  padding-top: 0.1875em;
  border: none;
  outline: none;
  cursor: pointer;
`;

const SAvatar = css`
  margin-left: 0.5em;
`;
