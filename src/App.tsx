import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { ListContainer as ListPage } from './containers/ListContainer';
import { InfiniteQueryContainer as InfiniteQueryPage } from './containers/InfiniteQueryContainer';
import { User, Users } from './types';

const App = () => {
  return (
    <Router>
      <div className="bg-gray-200">
        <Header />
        <main>
          <Switch>
            <Route path="/infinite-query">
              <InfiniteQueryPage />
            </Route>
            <Route path="/">
              <ListPage />
            </Route>
          </Switch>
        </main>

        <footer>&co; 2021 React Query Playground</footer>
      </div>
    </Router>
  );
};

export default App;
