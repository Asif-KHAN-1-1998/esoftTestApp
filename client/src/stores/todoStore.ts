import { makeAutoObservable, runInAction } from "mobx";

export interface Todo {
    id?: number;
    title: string;
    description: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    priority: "низкий" | "средний" | "высокий";
    status: "к выполнению" | "выполняется" | "выполнена" | "отменена";
    creator_id: number;
    assignee_id: number;
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
  
    loadTodo() {
      fetch('/api/todos')
        .then(response => response.json())
        .then(data => {
          runInAction(() => {this.todos = data}
        )})
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

    removeTodo(id: number) {
      fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log(response)
          if (response.ok) {
            const index = this.todos.findIndex((item) => item.id === id);
            this.todos.splice(index, 1);
          } else {
            console.error('Ошибка при удалении на сервере');
          }
        })
        .catch(error => {
          console.error('Сетевая ошибка при удалении:', error);
        });
    }

    updateTodo(id: number, todo: Todo) {
      fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({...todo }),
    })
    .then(response => {
      if (response.ok) {
        const index = this.todos.findIndex((item) => item.id === id);
        this.todos[index] = { ...this.todos[index], ...todo };
      } else {
        console.error('Ошибка при удалении на сервере');
      }
    })
    .catch(error => {
      console.error('Сетевая ошибка при изменении:', error);
    });
  }
    
}

export const todoStore = new TodoStore();