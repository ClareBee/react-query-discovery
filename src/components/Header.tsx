import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header>
      <h1>React Query Discovery</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/infinite-query">Infinite Query</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
