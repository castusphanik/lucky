import { createSlice } from "@reduxjs/toolkit";

type state = {
  page: number;
  limit: number;
  selectedRows: Record<string, any>[];
  filters: Record<string, string | number>;
  sortBy: Record<string, string>;
};

const initialState: state = {
  page: 1,
  limit: 10,
  selectedRows: [],
  filters: {},
  sortBy: {},
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      state.page = action.payload;
    },

    updateLimit: (state, action) => {
      state.limit = action.payload;
    },

    updateSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },

    updateFilters: (state, action) => {
      state.filters = action.payload;
    },

    updateSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    clearFilters: (state) => {
      state.filters = {};
    },

    resetTableData: () => initialState,
  },
});

export const {
  updateFilters,
  updateLimit,
  updatePage,
  updateSelectedRows,
  updateSortBy,
  clearFilters,
  resetTableData,
} = tableSlice.actions;
export default tableSlice.reducer;
