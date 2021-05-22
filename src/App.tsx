import React from 'react';
import { useMutation, useQuery } from 'react-query';
import './App.css';

interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
}

const getUsers = async () => {
  const response = await fetch('https://reqres.in/api/users');
  if (!response.ok) {
    throw new Error('Oops! Something went wrong!');
  }
  return response.json();
};

const addUser = async (user: User) => {
  const response = await fetch('https://reqres.in/api/users', {
    method: 'POST',
    body: JSON.stringify({
      first_name: user.first_name,
      last_name: user.last_name,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    throw new Error('Oops! Something went wrong!');
  }

  return response.json();
};

function App() {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery('users', getUsers);
  const {
    mutate,
    isLoading: addingUser,
    error: addUserError,
  } = useMutation(addUser, {
    onSuccess: (data) => {
      console.log(data);
      // refetches data to update
      refetch();
    },
  });

  if (isLoading) {
    return <p>Is loading</p>;
  }
  if (isError || addUserError) {
    return <p> Something went wrong: {error} </p>;
  }

  console.log('data', users);
  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        {addingUser ? <p>Adding user</p> : null}
        <button
          onClick={() => mutate({ first_name: 'Bob', last_name: 'Smith' })}
        >
          Add User
        </button>
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
