import { makeAutoObservable, runInAction } from "mobx";

export interface User {
    id?: number;
    first_name: string;
    last_name: string;
    middle_name: string;
    username: string;
    password: string;
    manager_id?: number | undefined; // Руководитель — тоже пользователь, может быть необязательным
    subordinate?: User[];
    creator_first_name?:string;
    creator_last_name?:string;
  }

  export interface AuthData {
    username: string;
    password: string;
  }
  const token = localStorage.getItem('token');
  class UserStore {
    users: User[] = [];
    authUser: AuthData[] = [];
  
    constructor() {
      makeAutoObservable(this);
    }
    
    loadUsers() {
      fetch('/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    .then((response) => response.json())
    .then((data) => {runInAction(() => {
      this.users = data;
      const manager = this.users.find((user) => (!user.manager_id))
      if (manager) {
        const subordinate = this.users.filter((user) => (user.manager_id === manager.id))
        manager.subordinate = subordinate;
      }
      
    });
    })
    .catch((error) => console.error('Error fetching users:', error));
    }

    userRegistartion(user: User) {
      fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then(response => response.json())
        .then(data => {
          this.users.push(data);
        })
        .catch(error => console.error('Ошибка при регистрации:', error));
      
    }

    userLogin(authData: AuthData) {
      fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      })
      .then(response => {
        if (response.ok) {
          return response.json();
      }})
      .then(data => {
        if (data) {
          // Сохраняем токен
          console.log('data', data)
          localStorage.setItem('token', data.token);
          // Можно сохранить и пользователя, если приходи
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          console.warn('Токен не получен');
        }
      })
      .catch(error => console.error('Ошибка при авторизации:', error));
      }

      
    userLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
}
export const userStore = new UserStore();