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

"A query is a declarative dependency on an asynchronous source of data that is tied to a unique key. A query can be used with any Promise based method (including GET and POST methods) to fetch data from a server. If your method modifies data on the server, we recommend using Mutations instead." - https://react-query.tanstack.com/guides/queries

### useQuery hook with:

- unique key (any unique serializable value - string (converted to an array internally)/array (esp for nested resources/additional params))
- function returning a promise to resolve data/throw error
- if >1 executed in parallel; if dyanamic (i.e. potentially changing # between renders), use useQueries([]) -> array of query objects returning an array of results
- dependency determined by { enabled: boolean } on query object (i.e. data from prev query)
- useIsFetching() to reveal background fetching

Tracks status & makes data available accordingly:
`isLoading` - no data, currently fetching
`isFetching` - any fetching state, including in the background
`error` - available if in `inError` state
`isIdle` - in disabled state
`data` - available if in `inSuccess` state
`refetch` -

React-query automatically gets fresh data if user leaves app and returns to stale data (can be disabled w false as below)

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
```

Retries configurable on the query object (w default exponential backoff retryDelay)

```javascript
{
   retry: 5, // retries 5 times before defaulting to error
 }
```

Pagination - better UI handling w usePreviousData

```javascript
const { isLoading, isError, error, data, isFetching, isPreviousData } =
  useQuery(['projects', page], () => fetchProjects(page), {
    keepPreviousData: true,
  });
```

- data from last successful fetch available while new data requested, even tho query key has changed
- when we get new data, previous data is seamlessly swapped to show the new data (cf SWR = Stale While Refresh)

Also see:

- useInfiniteQuery - e.g. for infinite scroll: https://react-query.tanstack.com/guides/infinite-queries
- placeholder data
- prepopulate with initialData
- prefetchQuery

## Mutations

useMutate()
onMutate
onSuccess
onError
