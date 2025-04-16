import { observer } from "mobx-react-lite";         // наблюдатель за MobX-хранилищем
import { todoStore } from "../../stores/todoStore";  // импорт твоего стора
import { useState, useEffect } from "react";                    // локальное состояние для ввода
import Modal from 'react-modal';
import TodoItem from "../TodoItem";


Modal.setAppElement('#root');

const TodoList = observer(() => {
   // временное состояние для input
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    todoStore.loadTodo();
  }, []);


  return (
    <div style={{ padding: '20px' }}>
      <h2>📝 Список задач</h2>

      {/* Поле ввода и кнопка добавления */}
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
    <TodoItem onClose={closeModal} appElement={document.getElementById('root')} />
    </Modal>
    <button onClick={openModal}>Открыть модальное окно</button>

      {/* Список задач */}
      <ul>
  {todoStore.todos.map((todo) => (
    <li key={todo.id}>
      <strong>{todo.title}</strong><br />
      {todo.description}<br />
      Приоритет: {todo.priority}, Статус: {todo.status}<br />
      Создатель: {todo.creator_id} Ответственный {todo.assignee_id}
    </li>
  ))}
</ul>

    </div>
  );
});

export default TodoList;
