import { makeAutoObservable } from "mobx";

export interface Todo {
    id: number;
    title: string;
    description: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    priority: string;
    status: string;
    creator_id: number;
    assignee_id: number

  }

  class TodoStore {
    todos: Todo[] = [];
  
    constructor() {
      makeAutoObservable(this);
    }
  
    loadTodo() {
      fetch('/api/todos')
        .then(response => response.json())
        .then(data => {
          this.todos = data;})
        .catch(error => console.error(error));
    }

    addTodo(todo: Todo) {
      fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })
        .then(response => response.json())
        .then(data => {
          // Обновляем список задач после добавления новой
          this.todos.push(data); // Можно использовать data, если сервер возвращает добавленную задачу
        })
        .catch(error => console.error('Ошибка при добавлении задачи:', error));
    }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }
}

export const todoStore = new TodoStore();
