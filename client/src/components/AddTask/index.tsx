import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { todoStore } from '../../stores/todoStore';
import { userStore } from '../../stores/userStore';
import { Todo } from '../../stores/todoStore';
import './index.css'

type TodosFormProps = {
  onClose: () => void;
  appElement: HTMLElement | null;
  todoID: number | undefined;
};
type TodoForm = Omit<Todo, 'id'>;

const AddTask: React.FC<TodosFormProps> = observer(({ onClose, appElement, todoID }) => {
  Modal.setAppElement(appElement || '#root');
  const userId = userStore.authUser?.id;

  const priorities: Todo['priority'][] = ['низкий', 'средний', 'высокий'];
  const statuses: Todo['status'][] = ['к выполнению', 'выполняется', 'выполнена', 'отменена'];

  const [formData, setFormData] = useState<TodoForm>({
    title: '',
    description: '',
    due_date: '',
    created_at: new Date().toISOString().slice(0, 10),
    updated_at: new Date().toISOString().slice(0, 10),
    priority: 'высокий',
    status: 'к выполнению',
    creator_id: userId,
    assignee_id: userId,
  });

  const filterSubordinates = useMemo(() => {
    return userStore.users.filter((u) => u.manager_id === userId);
  }, [userStore.users, userId]);


  useEffect(() => {
    if (todoID !== undefined) {
      const todoItem = todoStore.todos.find((item) => item.id === todoID);
      if (todoItem) setFormData(todoItem);
    }
  }, [todoID]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoID) {
      todoStore.updateTodo(todoID, formData);
    } else {
      todoStore.addTodo(formData);
    }
    onClose();
  };

  return (
    <form
    className="todo-item" onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Введите заголовок"
        disabled={formData.creator_id !== userId && !filterSubordinates.some(sub => sub.id === formData.creator_id)}
      />
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Введите описание"
        disabled={formData.creator_id !== userId && !filterSubordinates.some(sub => sub.id === formData.creator_id)}
      />
      <input
        name="due_date"
        type="date"
        value={formData.due_date}
        onChange={handleChange}
        placeholder="Введите дату завершения"
        disabled={formData.creator_id !== userId && !filterSubordinates.some(sub => sub.id === formData.creator_id)}
      />
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        disabled={formData.creator_id !== userId && !filterSubordinates.some(sub => sub.id === formData.creator_id)}
      >
        {priorities.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        disabled={formData.creator_id !== userId && formData.assignee_id !== userId && !filterSubordinates.some(sub => sub.id === formData.creator_id)
        }
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <select
        name="assignee_id"
        value={formData.assignee_id}
        onChange={handleChange}
        disabled={formData.creator_id !== userId && !filterSubordinates.some(sub => sub.id === formData.creator_id)}
      >
        <option value={userId}>Я - Ответственный</option>
        {filterSubordinates.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.first_name} {sub.last_name}
          </option>
        ))}
      </select>
      <button type="submit">Сохранить</button>
      <button type="button" onClick={onClose}>
        Закрыть
      </button>
    </form>
  );
});

export default AddTask;
