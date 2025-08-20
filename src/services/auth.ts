import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'https://devcpapi.mindwavesolutions.com/api';

const TOKEN_STORAGE_KEY = 'auth_tokens';

// --- Interfaces for standardized data used within the app ---

export type UserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  role?: string;
};

export type UserRole = {
  id: string;
  name: string;
  description: string;
};

export type AuthTokens = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  expires_at: number;
  user_info: UserInfo;
  user_roles: UserRole[];
};

// --- Interfaces for the raw backend API response ---

interface BackendUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  user_role_id: number;
  auth_0_reference_id: string;
  customer_id: number;
  account_id: number | null;
  assigned_account_ids: number[];
  role: string;
}

interface ExchangeTokenApiResponse {
  data: {
    user: BackendUser;
    token: string;
  };
  message: string;
}

// --- AuthStorage class for local storage management ---

export class AuthStorage {
  static setTokens(tokens: Omit<AuthTokens, 'expires_at'>): void {
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    const tokensWithExpiry: AuthTokens = {
      ...tokens,
      expires_at: expiresAt,
    };
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokensWithExpiry));

    // Store current role ID separately
    if (tokens.user_roles && tokens.user_roles.length > 0) {
      const currentRole = {
        role_id: tokens.user_roles[0].id,
        role_name: tokens.user_roles[0].name,
      };
      localStorage.setItem('current_role', JSON.stringify(currentRole));
    }
  }

  static getTokens(): AuthTokens | null {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  static getCurrentRole(): { role_id: string; role_name: string } | null {
    const stored = localStorage.getItem('current_role');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  static getValidAccessToken(): string | null {
    const tokens = this.getTokens();
    if (!tokens || this.isTokenExpired()) {
      return null;
    }
    return tokens.access_token;
  }

  static getUserInfo(): {
    user_id: number;
    customer_id: number;
    account_id: number | null;
    assigned_account_ids: number[];
  } | null {
    const stored = localStorage.getItem('user_info');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  static getUserId(): number | null {
    const userInfo = this.getUserInfo();
    return userInfo?.user_id || null;
  }

  static clearTokens(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('current_role');
    localStorage.removeItem('user_info');
  }

  static isTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;
    return Date.now() >= tokens.expires_at;
  }
}

// --- RTK Query auth service ---

const authService = createApi({
  reducerPath: 'authApi',
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
    exchangeCodeForTokens: builder.mutation<ExchangeTokenApiResponse, string>({
      query: code => ({
        url: `/exchangeToken`,
        method: 'POST',
        body: { code },
      }),
      async onQueryStarted(code, { queryFulfilled }) {
        try {
          const { data: apiResponse } = await queryFulfilled;

          const backendToken = apiResponse.data.token;
          const backendUser = apiResponse.data.user;

          // Decode token to get expiration
          const payload = JSON.parse(atob(backendToken.split('.')[1]));
          const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

          const transformedUserInfo: UserInfo = {
            sub: backendUser.auth_0_reference_id,
            name: `${backendUser.first_name} ${backendUser.last_name}`,
            given_name: backendUser.first_name,
            family_name: backendUser.last_name,
            email: backendUser.email,
            role: backendUser.role,
            picture: '', // No picture from this backend response
          };

          const transformedTokens: Omit<AuthTokens, 'expires_at'> = {
            access_token: backendToken,
            token_type: 'Bearer',
            expires_in: expiresIn,
            scope: payload.scope || '',
            user_info: transformedUserInfo,
            user_roles: [
              {
                id: backendUser.user_role_id.toString(),
                name: backendUser.role,
                description: backendUser.role,
              },
            ],
          };

          AuthStorage.setTokens(transformedTokens);

          // Store additional user information
          const userInfo = {
            user_id: backendUser.user_id,
            customer_id: backendUser.customer_id,
            account_id: backendUser.account_id,
            assigned_account_ids: backendUser.assigned_account_ids,
          };
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        } catch (error) {
          console.error('Token exchange failed during data transformation:', error);
        }
      },
    }),
  }),
});

export const { useExchangeCodeForTokensMutation } = authService;
export default authService;
