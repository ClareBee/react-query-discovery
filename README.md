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

https://react-query.tanstack.com/guides/mutations
useMutation() - to create/update/delete data or perform server side-effects

isIdle or status === 'idle' - The mutation is currently idle or in a fresh/reset state
isLoading or status === 'loading' - The mutation is currently running
isError or status === 'error' - The mutation encountered an error
isSuccess or status === 'success' - The mutation was successful and mutation data is available
error - If the mutation is in an isError state, the error is available via the error property.
data - If the mutation is in a success state, the data is available via the data property.

### Mutation side effects

- these become async if returning a promise in any of these callbacks

```javascript
useMutation(addProduct, {
  onMutate: (variables) => {
    // mutation happens
    // Optionally return a context containing data to use when for example rolling back
    return { id: 1 };
  },
  onError: (error, variables, context) => {
    // An error happened!
    console.log(`rolling back optimistic update with id ${context.id}`);
  },
  onSuccess: (data, variables, context) => {
    // Act on data
  },
  onSettled: (data, error, variables, context) => {
    // Error or success...
  },
});
```

- Use mutateAsync instead of mutate to get a promise which will resolve on success or throw on an error. This can for example be used to compose side effects.
- ability to retry
- ability to persist mutation w hydration? `hydrate(queryClient, state)`

## QueryClient

- queryClient.invalidateQueries('users') => marks it as stale, refetch in background if being rendered
- e.g. invalidate queries after an onSuccess in the mutation
- if data is returned from mutation, no need to refetch, can update with setQueryData inside the onSuccess
-

```javascript
const mutation = useMutation(editUser, {
  onSuccess: (data) => {
    queryClient.setQueryData(['user', { id: 5 }], data);
  },
});
mutation.mutate({
  id: 5,
  name: 'Jane Doe',
});
```

- optimistic updates?
- ability to cancel expensive queries (promise.cancel)
- scrollrestoration? - should work out of the box
- some methods accept a QueryFilters or MutationFilters object

## Server Side Rendering (SSR)

https://react-query.tanstack.com/guides/ssr

- Prefetch data yourself and pass it in as initialData
- Prefetch the query on the server, dehydrate the cache and rehydrate it on the client
- good with Next.js (SSG & SSR)

## Caching

https://react-query.tanstack.com/guides/caching

## Testing

`npm install @testing-library/react-hooks react-test-renderer --save-dev`

Example from docs:

```javascript
export function useCustomHook() {
  return useQuery('customHook', () => 'Hello');
}
```

Tested by:

```javascript
const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const { result, waitFor } = renderHook(() => useCustomHook(), { wrapper });

await waitFor(() => result.current.isSuccess);

expect(result.current.data).toEqual('Hello');
```

Testing requests:
e.g. with https://www.npmjs.com/package/nock

```javascript
function useFetchData() {
  return useQuery('fetchData', () => request('/api/data'));
}
```

Tested by:

```javascript
const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const expectation = nock('http://example.com').get('/api/data').reply(200, {
  answer: 42,
});

const { result, waitFor } = renderHook(() => useFetchData(), { wrapper });

await waitFor(() => {
  return result.current.isSuccess;
});

expect(result.current).toEqual({ answer: 42 });
```
