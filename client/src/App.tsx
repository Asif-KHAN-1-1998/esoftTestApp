import './App.css';
import { useEffect } from 'react';
import { userStore } from './stores/userStore';
import { todoStore } from './stores/todoStore';
import TodoList from './components/TodoList';

function App() {
  useEffect(() => {
    userStore.loadAuthData(); 
    userStore.loadUsers();  
    todoStore.loadTodo(); 
  }, []);

  return (
    <div className="app-container">
      <TodoList />
    </div>
  );
}

export default App;
