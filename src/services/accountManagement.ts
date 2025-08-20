import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithInterceptor } from './apiInterceptor';

const accountManagementService = createApi({
  reducerPath: 'accountManagement',
  baseQuery: baseQueryWithInterceptor,
  keepUnusedDataFor: 0, // Disable caching
  endpoints: builder => ({
    getUserManagementData: builder.query({
      query: ({ type, params, accountIds, userId }) => {
        const queryParams = { ...params };
        if (accountIds) {
          queryParams.accountIds = accountIds;
        }
        return {
          url:
            type === 'ten'
              ? `/user/tenUsers/${userId}`
              : `/user/customerUsersByAssignedAccounts/${userId}`,
          params: queryParams,
        };
      },
    }),

    getTenUserDetails: builder.query({
      query: ({ userId }) => `/userDetails/${userId}`,
    }),

    getCustomerUserDetails: builder.query({
      query: ({ userId }) => `/customerAccounts/${userId}`,
    }),
  }),
});

export const {
  useGetUserManagementDataQuery,
  useLazyGetTenUserDetailsQuery,
  useLazyGetCustomerUserDetailsQuery,
} = accountManagementService;
export default accountManagementService;
