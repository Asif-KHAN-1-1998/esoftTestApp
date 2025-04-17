import { observer } from "mobx-react-lite";         // наблюдатель за MobX-хранилищем
import { todoStore } from "../../stores/todoStore";  // импорт твоего стора
import { useState, useEffect } from "react";                    // локальное состояние для ввода
import Modal from 'react-modal';
import TodoItem from "../TodoItem";


Modal.setAppElement('#root');

const TodoList = observer(() => {
   // временное состояние для input
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [todoId, setTodoId] = useState<number | undefined>(undefined); // локальное состояние для ввод

  const openModal = (id?:number) => {
    setModalIsOpen(true);
    setTodoId(id)
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
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <TodoItem onClose={closeModal} appElement={document.getElementById('root')} todoID = {todoId}/>
    </Modal>
    <button onClick={() => openModal(undefined)}>Создать задачу</button>
    <ul>
      {todoStore.todos.length > 0 ? (
        todoStore.todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.title}</strong><br />
            {todo.description}<br />
            Приоритет: {todo.priority}, Статус: {todo.status}<br />
            ID: {todo.id} Ответственный {todo.assignee_first_name} {todo.assignee_last_name}<br />
            <button onClick={() => todoStore.removeTodo(todo.id!)}>Удалить</button>
            <button onClick={() => openModal(todo.id)}>Редактировать</button>
          </li>
        ))
      ) : (
        <li>Нет задач</li>
      )}
    </ul>

    </div>
  );
});

export default TodoList;
