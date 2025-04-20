import { makeAutoObservable, runInAction } from 'mobx';

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  username: string;
  password: string;
  manager_id?: number;
  subordinate?: User[];
  creator_first_name?: string;
  creator_last_name?: string;
}

export interface AuthData {
  id?: number;
  username: string;
  password: string;
}

class UserStore {
  users: User[] = [];
  authUser: AuthData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  loadAuthData() {
    const user = localStorage.getItem('user');
    if (user) {
      this.authUser = JSON.parse(user);
    }
  }

  async loadUsers() {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      runInAction(() => {
        this.users = data;
        const manager = this.users.find((user) => !user.manager_id);
        if (manager) {
          const subordinate = this.users.filter((user) => user.manager_id === manager.id);
          manager.subordinate = subordinate;
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  async userRegistartion(user: User) {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      this.users.push(data);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  }

  async userLogin(loginData: AuthData) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          console.log('token', data);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          return true;
        } else {
          console.warn('Токен не получен');
          return false;
        }
      } else {
        console.warn('Ошибка при авторизации');
        return false;
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      return false;
    }
  }

  userLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
export const userStore = new UserStore();
