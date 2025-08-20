import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthStorage } from './auth';

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080';

export interface Customer {
  customer_id: number;
  customer_name: string;
  customer_class: string;
  status: string;
  reference_number: string;
  sold_by_salesperson_id: number;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_at: string | null;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number | null;
}

export interface CustomerUser {
  user_id: number;
  customer_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  role: string;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number | null;
}

export interface CustomersResponse {
  data: Customer[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface CustomerUsersResponse {
  data: CustomerUser[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

const customersService = createApi({
  reducerPath: 'customers',
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
    getTenCustomers: builder.query<
      CustomersResponse,
      {
        page: number;
        perPage: number;
        customer_name?: string;
        customer_id?: string;
        customer_class?: string;
        status?: string;
        reference_number?: string;
      }
    >({
      query: ({
        page,
        perPage,
        customer_name,
        customer_id,
        customer_class,
        status,
        reference_number,
      }) => {
        let url = `user/tenCustomers?page=${page}&perPage=${perPage}`;
        if (customer_name) {
          url += `&customer_name=${encodeURIComponent(customer_name)}`;
        }
        if (customer_id) {
          url += `&customer_id=${encodeURIComponent(customer_id)}`;
        }
        if (customer_class) {
          url += `&customer_class=${encodeURIComponent(customer_class)}`;
        }
        if (status) {
          url += `&status=${encodeURIComponent(status)}`;
        }
        if (reference_number) {
          url += `&reference_number=${encodeURIComponent(reference_number)}`;
        }
        return url;
      },
      providesTags: ['Customers'],
    }),
    getTenCustomerUsers: builder.query<
      CustomerUsersResponse,
      {
        customerId: number;
        page: number;
        perPage: number;
        username?: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        status?: string;
        role?: string;
      }
    >({
      query: ({
        customerId,
        page,
        perPage,
        username,
        email,
        first_name,
        last_name,
        status,
        role,
      }) => {
        let url = `/user/usersByCustomerId?customer_id=${customerId}&page=${page}&perPage=${perPage}`;
        if (username) {
          url += `&username=${encodeURIComponent(username)}`;
        }
        if (email) {
          url += `&email=${encodeURIComponent(email)}`;
        }
        if (first_name) {
          url += `&first_name=${encodeURIComponent(first_name)}`;
        }
        if (last_name) {
          url += `&last_name=${encodeURIComponent(last_name)}`;
        }
        if (status) {
          url += `&status=${encodeURIComponent(status)}`;
        }
        if (role) {
          url += `&role=${encodeURIComponent(role)}`;
        }
        return url;
      },
      providesTags: ['CustomerUsers'],
    }),
  }),
  tagTypes: ['Customers', 'CustomerUsers'],
  // keepUnusedDataFor: 0,
});

export const { useGetTenCustomersQuery, useGetTenCustomerUsersQuery } = customersService;

export default customersService;
