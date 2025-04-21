import { makeAutoObservable, runInAction } from 'mobx';
import { userStore } from './userStore';

export interface Todo {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  priority: 'низкий' | 'средний' | 'высокий';
  status: 'к выполнению' | 'выполняется' | 'выполнена' | 'отменена';
  creator_id?: number;
  assignee_id?: number;
  creator_first_name?: string;
  creator_last_name?: string;
  assignee_first_name?: string;
  assignee_last_name?: string;
}

class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async loadTodo() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('res', response)
      if (!response.ok) {
        response.status === 403 ? userStore.userLogout() : console.log('void')
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      const data = await response.json();
      runInAction(() => {
        const sortedTodos = data.slice().sort((a: Todo, b: Todo) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        this.todos = sortedTodos;
      });
    } catch (error) {
      console.error('Ошибка при загрузке todo:', error);
    }
  }

  async addTodo(todo: Todo) {
    console.log('todo', todo)
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Токен не найден');
      return;
    }
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        response.status === 403 ? userStore.userLogout() : console.log('void')
        throw new Error(`Ошибка при добавлении задачи: ${response.status}`);
      }
      const data = await response.json();
      runInAction(() => {
        this.todos.push(data);
      });
      this.loadTodo();
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  }

  async removeTodo(todo: Todo) {
    if (todo.creator_id !== userStore.authUser?.id) {
      alert('У вас нет прав для выполнения этого действия.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Токен не найден');
      return;
    }
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        response.status === 403 ? userStore.userLogout() : console.log('void')
        throw new Error(`Ошибка при удалении задачи: ${response.status}`);
      }
      runInAction(() => {
        const index = this.todos.findIndex((item) => item.id === todo.id);
        if (index !== -1) {
          this.todos.splice(index, 1);
        }
      });
      this.loadTodo();
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  }

  async updateTodo(id: number, todo: Todo) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Токен не найден');
      return;
    }
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo }),
      });
      if (!response.ok) {
        response.status === 403 ? userStore.userLogout() : console.log('void')
        throw new Error(`Ошибка при обновлении задачи: ${response.status}`);
      }
      runInAction(() => {
        const index = this.todos.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.todos[index] = { ...this.todos[index], ...todo };
        }
      });
      this.loadTodo();
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  }
}
export const todoStore = new TodoStore();
