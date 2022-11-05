import React, { FC, useState } from 'react';
import { Button, css, TextField } from '@mui/material';
import { useAppDispatch } from 'redux/hooks';
import { useSelector } from 'react-redux';
import { fetchAsyncCreateProf, fetchAsyncLogin, fetchAsyncRegister, selectIsLoginView, toggleMode } from './authSlice';

export const Auth: FC = () => {
  const dispatch = useAppDispatch();
  const isLoginView = useSelector(selectIsLoginView);
  const [credential, setCredential] = useState({ username: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setCredential({ ...credential, [name]: value });
  };

  const login = async () => {
    if (isLoginView) {
      // JWTトークンを取得
      await dispatch(fetchAsyncLogin(credential));
    } else {
      // 新規ユーザー
      const result = await dispatch(fetchAsyncRegister(credential));
      if (fetchAsyncRegister.fulfilled.match(result)) {
        // ユーザが一致している場合は、ログイン＆プロフィール作成
        await dispatch(fetchAsyncLogin(credential));
        await dispatch(fetchAsyncCreateProf());
      }
    }
  };

  return (
    <div css={SAuthRoot}>
      <h1>{isLoginView ? 'Login' : 'Register'}</h1>
      <br />
      <TextField
        InputLabelProps={{ shrink: true }}
        label="Username"
        type="text"
        name="username"
        value={credential.username}
        onChange={handleInputChange}
      />
      <br />
      <TextField
        InputLabelProps={{ shrink: true }}
        label="Password"
        type="password"
        name="password"
        value={credential.password}
        onChange={handleInputChange}
      />
      <Button type="submit" variant="contained" color="primary" size="small" onClick={login} css={SLoginButton}>
        {isLoginView ? 'Login' : 'Register'}
      </Button>
      <button type="button" onClick={() => dispatch(toggleMode())} css={SToggleModeButton}>
        <span> {isLoginView ? 'Create new account ?' : 'Back to Login'}</span>
      </button>
    </div>
  );
};

const SAuthRoot = css`
  font-family: serif;
  color: dimgray;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.125em;

  span {
    font-family: serif;
    cursor: pointer;
  }
`;

const SLoginButton = css`
  margin: 1.5em;
`;

const SToggleModeButton = css`
  border: none;
  outline: none;
  background: transparent;
`;
