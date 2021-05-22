# React-Query discovery app

Playing around with react-query on a create-react-app with TypeScript & using dummy data from https://reqres.in/

React Query "...makes fetching, caching, synchronizing and updating **server state** in your React applications a breeze." - https://react-query.tanstack.com/overview

## Server state:

- persisted remotely in a location you don't control/own
- can be updated w/o your knowledge -> need to update data accordingly
- fetching/updating needs asynchronous APIs
- involves qq of caching & judging when data is stale/out of date
- challenge of deduping multiple requests into a single one
- challenge of large responses -> pagination/lazy loading etc

## 3 Main Concepts:

Queries
Mutations
Query Invalidation

## Fancy Devtools!

```javascript
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <MyApp />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
```

## useQuery

isLoading
isFetching
error
data
