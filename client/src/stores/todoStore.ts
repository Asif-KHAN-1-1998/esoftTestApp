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
    creator_first_name: string;
    creator_last_name: string;
    assignee_first_name: string;
    assignee_last_name: string;
  }

  class TodoStore {
    todos: Todo[] = []; // ⬅️ Здесь тип стал Todo[], а не string[]
  
    constructor() {
      makeAutoObservable(this);
    }
  
    loadTodo() {
      fetch('/api/todos')
        .then(response => response.json())
        .then(data => {
          this.todos = data;
        });
    }

  addTodo(todo: string) {
    this.todos.push(todo);
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }
}

export const todoStore = new TodoStore();
