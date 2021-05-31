import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { ListContainer as ListPage } from './containers/ListContainer';
import { InfiniteQueryContainer as InfiniteQueryPage } from './containers/InfiniteQueryContainer';

const App = () => {
  return (
    <Router>
      <div className="bg-white dark:bg-gray-800 px-4">
        <Header />
        <main>
          <Switch>
            <Route exact path="/infinite-query">
              <InfiniteQueryPage />
            </Route>
            <Route exact path="/">
              <ListPage />
            </Route>
          </Switch>
        </main>

        <footer className="text-gray-900 dark:text-white py-4">
          &co; 2021 React Query Playground
        </footer>
      </div>
    </Router>
  );
};

export default App;
