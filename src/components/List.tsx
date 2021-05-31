import React from 'react';
import { User, Users } from '../types';
import ListItem from './ListItem';

interface ListProps {
  users?: Users;
}

const List: React.FunctionComponent<ListProps> = ({ users }) => (
  <ul className="flex flex-col justify-center items-center bg-white dark:bg-gray-200 shadow-xl divide-y divide-gray-300">
    {users &&
      users?.data?.map((user: User) => <ListItem user={user} key={user.id} />)}
  </ul>
);

export default List;
