import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Updater } from 'react-query/types/core/utils';
import './App.css';

interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
}

interface OldDataProps {
  oldData: Updater<{ data: User[] } | undefined, { data: User[] }>;
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
  const queryClient = useQueryClient();

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
    onSuccess: (newUser) => {
      // refetches data to update with refetch from useQuery()
      // refetch();
      // queryClient.invalidateQueries('users');

      // modify cache to avoid unnecessary api calls

      queryClient.setQueryData('users', (oldData: any | undefined) => {
        return {
          ...oldData,
          data: [newUser, ...oldData.data],
        };
      });
    },
  });

  const handleAddNewUser = async () => {
    const newUser = await mutate({ first_name: 'Bob', last_name: 'Smith' });
    return newUser;
  };

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
        <button onClick={() => handleAddNewUser()}>Add User</button>
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
