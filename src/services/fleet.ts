import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthStorage } from './auth';
import { toQueryString } from '@/helpers/utils';

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080';

export interface FleetListViewParams {
  page: number;
  perPage: number;
  account_id?: string; // e.g., "1,2"
  vin?: string;
  customer_unit_number?: string;
  model?: string;
  year?: string | number;
  equipment_type?: string;
  location?: string;
  motion_status?: string; // e.g., STOPPED | MOTION
  last_gps_update?: string; // e.g., YYYY-MM-DD
  last_gps_coordinates?: string; // e.g., "47.37,-71.72"
  arrival_time?: string; // e.g., "09:10 PM"
  latitude?: string | number;
  contractStartDate?: string; // YYYY-MM-DD
  contractEndDate?: string; // YYYY-MM-DD
  agreement_type?: string;
  unit_number?: string;
  break_type?: string;
  color?: string;
  ten_branch?: string;
  lift_gate?: string;
  equipment_id?: string | number;
}

export interface FleetListViewApiResponse {
  success: boolean | number;
  message: string;
  data: {
    success: boolean;
    totalRecords: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
    data: unknown[];
  };
}

export interface GetEquipmentCountsParams {
  account_id: string; // e.g., "1,2"
  filterBy?: string; // e.g., "idleUnitsCount", "gpsEquippedCount", etc.
  page?: number; // Page number for pagination
  perPage?: number; // Number of items per page
}

export interface GetEquipmentCountsResponse {
  success: boolean | number;
  message: string;
  data: {
    success: boolean;
    equipmentCounts: Record<string, number>; // account_id -> count mapping
    stats: {
      totalCount: number;
      gpsEquippedCount: number;
      accessWithoutGpsCount: number;
      idleUnitsCount: number;
      geofenceCount: number;
    };
    data: unknown[]; // Array of equipment items when filtered
    totalRecords?: number;
  };
}

const fleetService = createApi({
  reducerPath: 'fleet',
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
    getFleetListView: builder.query<FleetListViewApiResponse, FleetListViewParams>({
      query: params =>
        `/fleet/getListView?${toQueryString(params as unknown as Record<string, unknown>)}`,
      providesTags: ['FleetListView'],
    }),
    getEquipmentCounts: builder.query<GetEquipmentCountsResponse, GetEquipmentCountsParams>({
      query: params =>
        `/fleet/getEquipmentCounts?${toQueryString(params as unknown as Record<string, unknown>)}`,
      providesTags: ['EquipmentCounts'],
    }),
  }),
  tagTypes: ['FleetListView', 'EquipmentCounts'],
  // keepUnusedDataFor: 0,
});

export const {
  useGetFleetListViewQuery,
  useLazyGetFleetListViewQuery,
  useGetEquipmentCountsQuery,
  useLazyGetEquipmentCountsQuery,
} = fleetService;
export default fleetService;
