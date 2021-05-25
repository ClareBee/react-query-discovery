import React from 'react';
import { User } from '../types';

interface ListItemProps {
  user: User;
}
const ListItem: React.FunctionComponent<ListItemProps> = ({ user }) => (
  <li className="p-4 hover:bg-gray-50" key={user?.id}>
    {user?.first_name}
    <img className="rounded-md" src={user?.avatar} />
  </li>
);

export default ListItem;
