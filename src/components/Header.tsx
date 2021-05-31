import { NavLink } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="text-gray-900 dark:text-white p-3">
      <h1 className="font-sans text-2xl px-4 py-6">React Query Discovery</h1>
      <nav>
        <ul className="flex">
          <li className="px-4 transition duration-300 ease-in-out hover:bg-red-700 hover:text-white">
            <NavLink activeStyle={{ color: 'red' }} exact to="/">
              Home
            </NavLink>
          </li>
          <li className="px-4 transition duration-300 ease-in-out hover:bg-red-700 hover:text-white">
            <NavLink activeStyle={{ color: 'red' }} to="/infinite-query">
              Infinite Query
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};
