import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../../stores/userStore';
import './index.css';

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await userStore.userLogin(loginData);
    result ? navigate('/') : console.log('wrong auth');
  };

  return (
    <div className="login-container">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            required
            placeholder="Введите логин"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
            placeholder="Введите пароль"
          />
        </div>
        <button type="submit" className="btn-submit">Войти</button>
      </form>
      <button onClick={() => navigate('/register')} className="btn-register">
        РЕГИСТРАЦИЯ
      </button>
    </div>
  );
};

export default LoginPage;
