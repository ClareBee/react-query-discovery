import React from 'react';
import { User, Users } from '../types';
import ListItem from './ListItem';

interface ListProps {
  users?: Users;
}

const List: React.FunctionComponent<ListProps> = ({ users }) => (
  <ul className=" bg-white shadow-xl divide-y divide-gray-300 ">
    {users &&
      users?.data?.map((user: User) => (
        <ListItem user={user} key={user.email} />
      ))}
  </ul>
);

export default List;
