import React, { useState, useMemo  } from "react";
import { observer } from "mobx-react-lite";
import { todoStore } from "../../stores/todoStore"; // путь подкорректируй под себя
import Modal from 'react-modal';

type TaskFormProps = {
  onClose: () => void;
  appElement: HTMLElement | null;
};

const TodoItem: React.FC<TaskFormProps> = observer(({ onClose, appElement}) => {
  const [newTodo, setNewTodo] = useState("");
  Modal.setAppElement(appElement || '#root');

  const todosObjects = useMemo(() => {
    return todoStore.todos.map(todo => todo.title);
  }, [todoStore.todos]);

  const handleAdd = () => {
    if (todosObjects.includes(newTodo.trim())){
        console.log('exist')
        return
    }
    if (newTodo.trim()) {
      todoStore.addTodo({
        id: Date.now(),
        title: newTodo,
        description: "Описание задачи",
        due_date: "2025-05-01",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        priority: "high",
        status: "done",
        creator_id: 1,
        assignee_id: 1,
      });
      setNewTodo("");
    }
  };

  return (
    <div className="todo-item">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Введите заголовок"
      />
      <button onClick={handleAdd}>Добавить</button>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
});

export default TodoItem;
