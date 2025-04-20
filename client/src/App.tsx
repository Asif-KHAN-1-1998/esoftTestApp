import './App.css';
import { useEffect } from 'react';
import { userStore } from './stores/userStore';
import { todoStore } from './stores/todoStore';
import TodoList from './components/TodoList';

function App() {
  useEffect(() => {
    // Загрузим данные пользователей и задачи
    userStore.loadAuthData(); // Сначала загрузим authUser
    userStore.loadUsers();     // Загрузим пользователей
    todoStore.loadTodo();      // Загрузим задачи
  }, []);

  return (
    <div className="app-container">
      <TodoList />
    </div>
  );
}

export default App;
