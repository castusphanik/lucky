import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthStorage } from './auth';

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080';

export interface Account {
  account_id: number;
  parent_account_id: number | null;
  customer_id: number;
  account_name: string;
  account_number: string | null;
  legacy_account_number: string | null;
  account_type: string;
  account_manager_id: number | null;
  number_of_users: number | null;
  status: string;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_at: string | null;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number | null;
}

export interface PrimaryContact {
  user_id: number;
  account_id: number;
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  designation: string;
  avatar: string | null;
  auth_0_reference_id: string;
  status: string;
  is_customer: boolean;
  first_active: string | null;
  last_active: string | null;
  created_at: string;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;
  user_role_id: number;
}

export interface ChildAccount extends Account {
  primaryContact: PrimaryContact | null;
}

export interface AccountDetailsResponse {
  data: {
    parentAccount: Account;
    primaryContact: PrimaryContact;
    childAccounts: ChildAccount[];
  };
}

export interface AccountsResponse {
  data: Account[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface AccountUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  account_id: number;
  designation: string;
  status: string;
  phone_number: string;
  avatar: string | null;
  is_customer: boolean;
}

export interface AccountUsersResponse {
  data: AccountUser[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface SecondaryContactsResponse {
  data: AccountUser[];
}

export interface AssociatedAccountsResponse {
  data: {
    selectedAccountDetails: Account;
    primaryContactDetails: PrimaryContact;
    associatedAccounts: Account[];
  };
}

const accountsService = createApi({
  reducerPath: 'accounts',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json');
      const token = AuthStorage.getValidAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getAccounts: builder.query<
      AccountsResponse,
      {
        page: number;
        perPage: number;
        userId?: string;
        account_id?: string;
        account_name?: string;
        account_type?: string;
        status?: string;
      }
    >({
      query: ({ page, perPage, userId, account_id, account_name, account_type, status }) => {
        let url = `/account/customerUserAccounts/${userId}?page=${page}&perPage=${perPage}`;

        if (account_id) {
          url += `&account_id=${encodeURIComponent(account_id)}`;
        }
        if (account_name) {
          url += `&account_name=${encodeURIComponent(account_name)}`;
        }
        if (account_type) {
          url += `&account_type=${encodeURIComponent(account_type)}`;
        }
        if (status) {
          url += `&status=${encodeURIComponent(status)}`;
        }
        return url;
      },
      providesTags: ['Accounts'],
    }),
    getAccountsByAccountId: builder.query<
      AccountsResponse,
      { accountId: string; page: number; perPage: number }
    >({
      query: ({ accountId, page, perPage }) =>
        `/account/${accountId}/accounts?page=${page}&perPage=${perPage}`,
      providesTags: (_result, _error, { accountId }) => [
        { type: 'Accounts', id: `ACCOUNT-${accountId}` },
      ],
    }),
    getAssignedAccounts: builder.query<AccountsResponse, void>({
      query: () => '/account/customerUserAccounts',
      providesTags: ['Accounts'],
    }),
    getAssociatedAccounts: builder.query<
      AssociatedAccountsResponse,
      { customerId: string; accountId: string }
    >({
      query: ({ customerId, accountId }) => `/account/accountPrimaryContactAndRelated/${accountId}`,
      providesTags: ['Accounts'],
    }),
    getSecondaryContacts: builder.query<
      SecondaryContactsResponse,
      {
        accountId: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        designation?: string;
        phone_number?: string;
      }
    >({
      query: ({ accountId, first_name, last_name, email, designation, phone_number }) => {
        let url = `/account/accountLinkedUsers/${accountId}`;
        const params = new URLSearchParams();
        if (first_name) params.set('first_name', first_name);
        if (last_name) params.set('last_name', last_name);
        if (email) params.set('email', email);
        if (designation) params.set('designation', designation);
        if (phone_number) params.set('phone_number', phone_number);
        const qs = params.toString();
        if (qs) url += `?${qs}`;
        return url;
      },
      providesTags: (_result, _error, { accountId }) => [
        { type: 'Accounts', id: `SECONDARY-CONTACTS-${accountId}` },
      ],
    }),
    getCustomerAccountsList: builder.query<
      AccountsResponse,
      {
        customerId: string;
        page: number;
        perPage: number;
        account_name?: string;
        account_type?: string;
        status?: string;
      }
    >({
      query: ({ customerId, page, perPage, account_name, account_type, status }) => {
        let url = `/account/customerAccounts/${customerId}?page=${page}&perPage=${perPage}`;
        if (account_name) {
          url += `&account_name=${encodeURIComponent(account_name)}`;
        }
        if (account_type) {
          url += `&account_type=${encodeURIComponent(account_type)}`;
        }
        if (status) {
          url += `&status=${encodeURIComponent(status)}`;
        }
        return url;
      },
      providesTags: (_result, _error, { customerId }) => [
        { type: 'Accounts', id: `CUSTOMER-ACCOUNTS-${customerId}` },
      ],
    }),
    getAssignedAccountsDropdown: builder.query<AccountsResponse, { userId: number }>({
      query: ({ userId }) => `/account/userAccounts/${userId}`,
      providesTags: ['Accounts'],
    }),

    getDownloadData: builder.query<Blob, { accountIds: string }>({
      query: ({ accountIds }) => ({
        url: `/account/assignedAccounts/export?accountIds=${accountIds}`,
        responseHandler: response => response.blob(),
      }),
    }),
  }),
  tagTypes: ['Accounts'],
  // keepUnusedDataFor: 0,
});

export const {
  useGetAccountsQuery,
  useGetAccountsByAccountIdQuery,
  useGetAssignedAccountsQuery,
  useGetAssociatedAccountsQuery,
  useGetSecondaryContactsQuery,
  useGetCustomerAccountsListQuery,
  useGetAssignedAccountsDropdownQuery,
  useLazyGetDownloadDataQuery,
} = accountsService;

export default accountsService;
