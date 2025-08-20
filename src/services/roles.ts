import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthStorage } from './auth';

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080';

export interface UserRole {
  user_role_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface RolesResponse {
  data: { roles: UserRole[] };
}

const rolesService = createApi({
  reducerPath: 'roles',
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
    getRoles: builder.query<RolesResponse, void>({
      query: id => `/roles/customerRoles/${id}`,
      providesTags: ['Roles'],
    }),

    createRole: builder.mutation({
      query: body => ({
        url: '/roles/createRole',
        method: 'POST',
        body,
      }),
    }),

    getRoleById: builder.query({
      query: id => `/roles/getUserRoleById/${id} `,
    }),

    updateRole: builder.mutation({
      query: body => ({
        url: '/roles/editUserRole',
        method: 'PUT',
        body,
      }),
    }),
  }),
  tagTypes: ['Roles'],
  // keepUnusedDataFor: 0, // Disable caching
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetRoleByIdQuery,
} = rolesService;

export default rolesService;
