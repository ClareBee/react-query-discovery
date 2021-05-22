import React from 'react';
import { useQuery } from 'react-query';
import './App.css';

interface User {
  id?: string;
  first_name?: string;
}

const getUsers = async () => {
  const response = await fetch('https://reqres.in/api/users');
  if (!response.ok) {
    throw new Error('Oops! Something went wrong!');
  }
  return response.json();
};

function App() {
  const { data: users, isLoading, error } = useQuery('users', getUsers);

  if (isLoading) {
    return <p>Is loading</p>;
  }
  if (error) {
    return <p> Something went wrong </p>;
  }

  console.log('data', users);
  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <ul>
          {users.data.map((user: User) => (
            <li key={user?.id}>{user?.first_name}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
