import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type RouteFilters = Record<string, unknown>;

type TableFiltersState = Record<string, RouteFilters>;

const initialState: TableFiltersState = {};

const tableFiltersSlice = createSlice({
  name: 'tableFilters',
  initialState,
  reducers: {
    setFilterForRouteField: (
      state,
      action: PayloadAction<{ route: string; field: string; value: unknown }>
    ) => {
      const { route, field, value } = action.payload;
      const existing = state[route] ?? {};

      if (value === undefined || value === null || value === '') {
        const { [field]: _removed, ...rest } = existing;
        if (Object.keys(rest).length > 0) {
          state[route] = rest;
        } else {
          delete state[route];
        }
        return;
      }

      state[route] = { ...existing, [field]: value };
    },

    setRouteFilters: (state, action: PayloadAction<{ route: string; filters: RouteFilters }>) => {
      const { route, filters } = action.payload;
      state[route] = filters;
    },

    clearRouteFilters: (state, action: PayloadAction<{ route: string }>) => {
      delete state[action.payload.route];
    },

    clearAllRouteFilters: () => initialState,
  },
});

export const { setFilterForRouteField, setRouteFilters, clearRouteFilters, clearAllRouteFilters } =
  tableFiltersSlice.actions;

export default tableFiltersSlice.reducer;
