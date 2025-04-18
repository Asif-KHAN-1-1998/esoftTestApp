import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register/index.tsx';
import UsersList from './components/UsersList/UserList.tsx';
import Login from './components/Login/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/one" element={<App />} />
          <Route path="/users/list" element={<UsersList />} />
        </Routes>
      </BrowserRouter>
  </StrictMode>
);
