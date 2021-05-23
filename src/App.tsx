import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import './App.css';
import { User, Users } from './types';

const getUsers = async (): Promise<Users> => {
  const response = await fetch('https://reqres.in/api/users');
  if (!response.ok) {
    throw new Error('Oops! Something went wrong!');
  }
  return response.json();
};

const addUser = async (user: User): Promise<User> => {
  const response = await fetch('https://reqres.in/api/users', {
    method: 'POST',
    body: JSON.stringify({
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
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

  // Can switch this out for useInfiniteQuery with pagination - getNextPageParam
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<Users, ErrorConstructor>('users', getUsers, {
    enabled: true, // useful setting to toggle if there's sth the refetch depends on
    refetchOnWindowFocus: false, // stops refetch when user focuses outside window
    // refetchInterval: 2000, // auto refetch in milliseconds
  });

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

      queryClient.setQueryData<Users | undefined>('users', (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            data: [newUser, ...oldData.data],
          };
        }
      });
    },
  });

  const handleAddNewUser = async () => {
    const newUser = await mutate({
      first_name: 'Bob',
      last_name: 'Smith',
      avatar: 'https://via.placeholder.com/150/0000FF/808080?Text=Avatar',
    });
    return newUser;
  };

  if (isLoading) {
    return <p>Is loading</p>;
  }
  if (isError || addUserError) {
    return <p> Something went wrong: {error} </p>;
  }

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        {addingUser ? <p>Adding user</p> : null}
        <button onClick={() => handleAddNewUser()}>Add User</button>
        <ul>
          {users &&
            users.data.map((user: User) => (
              <li key={user?.id}>
                {user?.first_name}
                <img src={user?.avatar} />
              </li>
            ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
