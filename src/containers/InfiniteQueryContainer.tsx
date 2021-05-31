import { useInfiniteQuery } from 'react-query';

import { Users } from '../types';
import React from 'react';
import ListItem from '../components/ListItem';

export const InfiniteQueryContainer: React.FunctionComponent = () => {
  const getUsersPage = async ({ pageParam = 0 }): Promise<Users> => {
    const response = await fetch(
      `https://reqres.in/api/users?page=${pageParam}`
    );
    if (!response.ok) {
      throw new Error('Oops! Something went wrong!');
    }
    return response.json();
  };
  const {
    data: infiniteData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    status,
    error,
  } = useInfiniteQuery('users', getUsersPage, {
    getNextPageParam: (lastPage, _pages) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      // deal with dummy api 2 page max
      if (lastPage.page === 2) return 0;
      return false;
    },
  });
  console.log('data', infiniteData);
  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {JSON.stringify(error)}</p>
  ) : (
    <>
      <ul className="flex flex-wrap">
        {infiniteData?.pages &&
          infiniteData.pages.map((users) =>
            users.data.map((user) => <ListItem user={user} />)
          )}
      </ul>
      <div>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full mx-auto"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage}
        >
          Load More
        </button>
      </div>
      <div>{isFetching ? 'Fetching...' : null}</div>
    </>
  );
};
