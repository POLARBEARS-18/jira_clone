import { FC } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { css } from '@emotion/react';
import { Auth } from 'features/auth/Auth';
import { Home } from 'Home';

const App: FC = () => (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/tasks" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;

export const SLink = css`
  text-decoration: none;
  color: black;
`;
