import { observer } from 'mobx-react-lite';
import { todoStore } from '../../stores/todoStore';
import { useState, useMemo, useEffect} from 'react';
import Modal from 'react-modal';
import AddTask from '../AddTask';
import TodoCard from '../TodoCard';
import './index.css';
import { Todo } from '../../stores/todoStore';
import { formatDate } from '../../tools/formateDate';
import { userStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const TodoList = observer(() => {
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [todoId, setTodoId] = useState<number | undefined>(undefined);
  const [groupTodo, setGroupTodo] = useState<keyof Todo>('created_at');
  const [groupByDate, setGroupByDate] = useState('created_at');
  const [today, setToday] = useState('');
  const [monday, setMonday] = useState('');
  const [sunday, setSunday] = useState('');

  useEffect(() => {
    console.log(groupTodo, 'today', today);
    
    const date = new Date();
    const todayDate = new Date(date);
    todayDate.setDate(date.getDate() - 1);
    const todayFormatted = todayDate.toISOString().slice(0, 10);
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const mondayDate = new Date(date);
    mondayDate.setDate(date.getDate() + diffToMonday + 1);
    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(mondayDate.getDate() + 6 + 1);
  
    setMonday(mondayDate.toLocaleString('en-CA'));
    setSunday(sundayDate.toLocaleString('en-CA'));
    setToday(todayFormatted);
  
  }, []);

  useEffect(() => {
    if (groupTodo === 'created_at'){
      setGroupByDate('created_at')
    }
  }, [groupTodo])

  
  const getUser = (id: number) => {
    const user = userStore.users.find((user) => user.id === id);
    return user ? `${user.first_name} ${user.last_name}` : '';
  }

  const groupOptions = [
    {value: 'created_at', label: 'Нет'},
    {value: 'due_date', label: 'По дате завершения'},
    {value: 'assignee_id', label: 'По ответсвенным'},
    
  ]
  const dateOptions = [
    {value: 'created_at', label: 'Нет'},
    {value: 'day', label: 'День'},
    {value: 'week', label: 'Неделя'},
    {value: 'later', label: 'Позднее'},
  ]

  const filteredTodos = useMemo(() => {
    return todoStore.todos.reduce((obj, item) => {
      const key = String(item[groupTodo]);
      const dueDate = new Date(item.due_date).toISOString().slice(0, 10);

      if (!obj[key]) {
        obj[key] = [];
      }
  
      if (groupByDate === 'day') {
        if (dueDate === today) {
          obj[key].push(item);
        } else {
          console.log('no');
        }
      } else if (groupByDate === 'week') {
        if (monday <= dueDate && dueDate <= sunday) {
          obj[key].push(item);
        } else {
          console.log('no');
        }
      } else if (groupByDate === 'later') {
        if (dueDate > sunday) {
          obj[key].push(item);
        } else {
          console.log('no');
        }
      } else {
        obj[key].push(item);
      }
  
      return obj;
    }, {} as Record<string, Todo[]>);
  }, [todoStore.todos, groupTodo, groupByDate, today, monday, sunday]);
  



  const openModal = (id?: number) => {
    setModalIsOpen(true);
    setTodoId(id);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="todo-container">
    <header className="todo-header">
      <h1>TODO</h1>
      <div className="controls">
        <div className="selectors-container">
          <select
            value={groupTodo}
            onChange={(e) => setGroupTodo(e.target.value as keyof Todo)}
            className="group-select"
          >
            {groupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {(groupTodo === 'due_date' || groupByDate !== 'created_at') && (
            <select
              value={groupByDate}
              onChange={(e) => setGroupByDate(e.target.value)}
              className="date-select"
            >
              {dateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="buttons-container">
          <button className="btn btn-primary" onClick={() => openModal()}>
            + Новая задача
          </button>
          <button
            className="btn-logout"
            onClick={() => {
              userStore.userLogout();
              navigate('/auth');
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    </header>

    <section className="todo-list">
      {Object.entries(filteredTodos).length > 0 ? (
        Object.entries(filteredTodos).map(([groupKey, todos]) => (
          <div key={groupKey} className="group">
            {todos.length > 0 && (
              <h3 className="group-title">
                {groupByDate === 'due_date'
                  ? formatDate(groupKey)
                  : getUser(Number(groupKey))}
              </h3>
            )}
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={openModal}
                onDelete={() => todoStore.removeTodo(todo)}
              />
            ))}
          </div>
        ))
      ) : (
        <p>Задачи отсутствуют</p>
      )}
    </section>

    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
      <AddTask onClose={closeModal} appElement={document.getElementById('root')} todoID={todoId} />
    </Modal>
  </div>
  );
});

export default TodoList;
