import { useState } from 'react';
import { userStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { User } from '../../stores/userStore';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  type UserForm = Omit<User, 'id'>;
  const [formData, setFormData] = useState<UserForm>({
    first_name: '',
    last_name: '',
    middle_name: '',
    username: '',
    password: '',
    manager_id: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const responce = await userStore.userRegistartion(formData);
    responce ? navigate('/auth') : console.error('problem');
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <input
            type="text"
            name="last_name"
            placeholder="Фамилия"
            value={formData.last_name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="first_name"
            placeholder="Имя"
            value={formData.first_name}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="middle_name"
            placeholder="Отчество"
            value={formData.middle_name}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Логин"
            value={formData.username}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <select
            name="manager_id"
            className="input"
            value={formData.manager_id}
            onChange={handleChange}
          >
            <option value="">Нет</option>
            {userStore.users
              .filter((user) => user.manager_id === null || user.manager_id === undefined)
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
          </select>
        </div>
        <button type="submit" className="btn-submit">
          Зарегистрироваться
        </button>
      </form>
      <button onClick={() => navigate('/auth')} className="btn-login">
        Войти
      </button>
    </div>
  );
};

export default RegisterPage;
