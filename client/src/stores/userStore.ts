import { makeAutoObservable } from "mobx";

export interface User {
    firstName: string;
    lastName: string;
    patronymic: string;
    login: string;
    password: string;
    supervisor?: User; // Руководитель — тоже пользователь, может быть необязательным
  }

  class UserStore {
    todos: User[] = [];
  
    constructor() {
      makeAutoObservable(this);
    }
}
export const todoStore = new UserStore();