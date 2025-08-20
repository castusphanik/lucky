import { getLoggedInUserData } from '@/helpers/utils';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const baseQuery = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  prepareHeaders: headers => {
    const profile = getLoggedInUserData();
    headers.set('Authorization', `Bearer ${profile?.access_token}`);
  },
});

export const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    console.error('Unauthorized User!');
    // sessionStorage.clear();
    // localStorage.clear();
    // window.location.href = '/';
  }

  return result;
};
