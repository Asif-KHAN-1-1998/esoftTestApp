import { useEffect, useState } from 'react';

interface User {
  id: number;
  user_first_name: string;
  user_last_name: string;
  manager_id: number | null;
  username: string | null;
}


const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
    .then((response) => response.json())
    .then((data) => setUsers(data))
    .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h1>Список пользователей</h1>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Отчество</th>
            <th>Логин</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.user_first_name}</td>
              <td>{user.user_last_name}</td>
              <td>{user.username}</td>
              <td>{user.manager_id}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;