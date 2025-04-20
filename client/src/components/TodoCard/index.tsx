import React from 'react';
import { Todo } from '../../stores/todoStore';
import './index.css';
import { formatDate } from '../../tools/formateDate';
import { userStore } from '../../stores/userStore';
import { useState,useEffect} from 'react';

interface TodosProps {
  todo: Todo;
  onEdit: (id: number | undefined) => void;
  onDelete: (id: number | undefined) => void;
}

const TodoCard: React.FC<TodosProps> = ({ todo, onEdit, onDelete }) => {
  const userId = userStore.authUser?.id;
  const [today, setToday] = useState('');

    useEffect(() => {
  
      const date = new Date();
      const todayDate = new Date(date);
      todayDate.setDate(date.getDate() - 1);
      const todayFormatted = todayDate.toISOString().slice(0, 10);
    
  
      setToday(todayFormatted);
    
    }, []);


  return (
    <div className="todo-card">
      <h3 className={
    todo.status === 'выполнена'
      ? 'todo-title-complete'
      : todo.due_date > today
        ? 'todo-title-danger'
        : 'todo-title'
        }>{todo.title}</h3>

      <div className="todo-meta">
        <div className="meta-item">
          <strong>Приоритет:</strong> {todo.priority}
        </div>
        <div className="meta-item">
          <strong>Дедлайн:</strong> {formatDate(todo.due_date)}
        </div>
        <div className="meta-item">
          <strong>Ответственный:</strong> {todo.assignee_first_name} {todo.assignee_last_name}
        </div>
        <div className="meta-item">
          <strong>Статус:</strong> {todo.status}
        </div>
      </div>

      <div className="todo-actions">
        <button className="btn btn-edit" onClick={() => onEdit(todo.id)}>
          Редактировать
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(todo.id)}
          disabled={todo.creator_id !== userId}
          title={
            todo.creator_id !== userId ? 'Недоступно: вы не являетесь автором' : 'Удалить задачу'
          }
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
