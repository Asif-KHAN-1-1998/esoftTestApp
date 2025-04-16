import { observer } from "mobx-react-lite";         // наблюдатель за MobX-хранилищем
import { todoStore } from "../../stores/todoStore";  // импорт твоего стора
import { useState, useEffect } from "react";                    // локальное состояние для ввода

const TodoList = observer(() => {
  const [newTodo, setNewTodo] = useState(""); // временное состояние для input

  const handleAdd = () => {
    if (newTodo.trim()) {
      todoStore.addTodo({
        id: 1,
        title: 'Пример задачи',
        description: 'Описание задачи',
        due_date: '2025-05-01',
        created_at: '2025-04-16',
        updated_at: '2025-04-16',
        priority: 'высокий',
        status: 'к выполнению',
        creator_first_name: 'Иван',
        creator_last_name: 'Иванов',
        assignee_first_name: 'Пётр',
        assignee_last_name: 'Петров'
      });; // добавляем задачу в store
      setNewTodo("");             // очищаем поле ввода
    }
  };
  useEffect(() => {
    todoStore.loadTodo();
  }, []);


  return (
    <div style={{ padding: '20px' }}>
      <h2>📝 Список задач</h2>

      {/* Поле ввода и кнопка добавления */}
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Введите задачу"
      />
      <button onClick={handleAdd}>Добавить</button>

      {/* Список задач */}
      <ul>
  {todoStore.todos.map((todo) => (
    <li key={todo.id}>
      <strong>{todo.title}</strong><br />
      {todo.description}<br />
      Приоритет: {todo.priority}, Статус: {todo.status}<br />
      Ответственный: {todo.assignee_first_name} {todo.assignee_last_name}
    </li>
  ))}
</ul>

    </div>
  );
});

export default TodoList;
