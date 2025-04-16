import { Link } from 'react-router-dom';

const StartPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Добро пожаловать!</h1>
      <p>Рады видеть вас на нашем сайте 🎉</p>
      <Link to="/one">
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Перейти на страницу Приложения
        </button>
      </Link>
    </div>
  );
};

export default StartPage;
