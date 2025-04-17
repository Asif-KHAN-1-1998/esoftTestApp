import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { todoStore } from "../../stores/todoStore"; // путь подкорректируй под себя
import Modal from 'react-modal';
import { z } from 'zod';

type TodosFormProps = {
  onClose: () => void;
  appElement: HTMLElement | null;
  todoID: number | undefined;
};

const todoSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  description: z.string().min(5, "Описание должно быть не менее 5 символов"),
  due_date: z.string().min(1, "Укажите дату окончания"),
  created_at: z.string().min(1, "дата начала"),
  updated_at: z.string().min(1, "дата обновления"),
  priority: z.enum(["низкий", "средний", "высокий"]),
  status: z.enum(["к выполнению", "выполняется", "выполнена", "отменена"]),
  creator_id: z.number(),
  assignee_id: z.number().min(1, "Выберите исполнителя"),
});

type TaskFormType = z.infer<typeof todoSchema>;

const TodoItem: React.FC<TodosFormProps> = observer(({ onClose, appElement, todoID }) => {
  Modal.setAppElement(appElement || '#root');

  const [formData, setFormData] = useState<TaskFormType>({
    title: "",
    description: "",
    due_date: "",
    created_at: new Date().toISOString().slice(0, 10), // например, текущая дата
    updated_at: new Date().toISOString().slice(0, 10),
    priority: "средний",
    status: "к выполнению",
    creator_id: 1, // временно жёстко задано
    assignee_id: 2,
  });

  useEffect(() => {
    if (todoID !== undefined) {
      const todoItem = todoStore.todos.find(item => item.id === todoID);
      if (todoItem) {
        setFormData(todoItem);
      }
    }
  }, [todoID]); // useEffect зависит от todoID

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

     // Здесь ты добавляешь todo
    onClose(); // Закрытие формы после отправки
  };

  return (
    <form className="todo-item" onSubmit={handleSubmit}>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Введите заголовок"
      />
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Введите описание"
      />
      <input
        name="due_date"
        type="date"
        value={formData.due_date}
        onChange={handleChange}
        placeholder="Введите дату завершения"
      />
      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="низкий">низкий</option>
        <option value="средний">средний</option>
        <option value="высокий">высокий</option>
      </select>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="к выполнению">К выполнению</option>
        <option value="выполняется">Выполняется</option>
        <option value="выполнена">Выполнена</option>
        <option value="отменена">Отменена</option>
      </select>
      <button type="submit">Сохранить</button>
      <button type="button" onClick={onClose}>Закрыть</button>
    </form>
  );
});

export default TodoItem;
