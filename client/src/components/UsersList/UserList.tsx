import { useEffect, useState } from 'react';
import { userStore } from '../../stores/userStore';
import { observer } from "mobx-react-lite";  


const UsersList = observer(() => {
  useEffect(() => {
    userStore.loadUsers()
  }, []);


  return (
    <div>
      <h1>Список пользователей</h1>
      <button onClick={()=> {userStore.userLogout()}}> Выйти </button>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Отчество</th>
            <th>Логин</th>
            <th>Начальник Имя</th>
            <th>Начальник Фамилия</th>
            <th>Подчиненные</th>
          </tr>
        </thead>
        <tbody>
          {userStore.users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.middle_name}</td>
              <td>{user.username}</td>
              <td>{user.manager_id ? user.creator_first_name : 'Нет'}</td>
              <td>{user.manager_id ? user.creator_last_name : 'Нет'}</td>
              <td>{user.subordinate?.map((sub) => (
                  <div key={sub.id}>
                    {sub.last_name} {sub.first_name} {sub.middle_name}
                  </div>
              ))}</td>
              

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default UsersList;