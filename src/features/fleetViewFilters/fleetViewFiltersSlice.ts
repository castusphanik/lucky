import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Card filters for visibility controls
interface CardFilters {
  isTotalAssetsVisible: boolean;
  isGpsEquippedAssetsVisible: boolean;
  isAssetsWithoutGpsVisible: boolean;
  isIdleUnitsVisible: boolean;
  isActiveERSEventsVisible: boolean;
  isActiveGeofencesVisible: boolean;
  isOverdueDOTInspectionsVisible: boolean;
}

// Panel filters for search and filtering
interface PanelFilters {
  unitNumber: string;
  filterBy: string; // For InfoCard filtering
}

interface FleetViewFiltersState {
  cardFilters: CardFilters;
  panelFilters: PanelFilters;
  activeFilterType: 'card' | 'panel' | 'none'; // Track which filter type is currently active
}

const initialState: FleetViewFiltersState = {
  cardFilters: {
    isTotalAssetsVisible: true,
    isGpsEquippedAssetsVisible: true,
    isAssetsWithoutGpsVisible: true,
    isIdleUnitsVisible: true,
    isActiveERSEventsVisible: true,
    isActiveGeofencesVisible: true,
    isOverdueDOTInspectionsVisible: true,
  },
  panelFilters: {
    unitNumber: '',
    filterBy: '',
  },
  activeFilterType: 'none',
};

const fleetViewFiltersSlice = createSlice({
  name: 'fleetViewFilters',
  initialState,
  reducers: {
    // Card filter actions
    setCardFilter: (state, action: PayloadAction<{ key: keyof CardFilters; value: boolean }>) => {
      const { key, value } = action.payload;
      state.cardFilters[key] = value;
      // Set active filter type to card when card filters are modified
      state.activeFilterType = 'card';
      // Clear only unitNumber when switching to card filters, keep filterBy
      state.panelFilters.unitNumber = '';
    },

    setAllCardFilters: (state, action: PayloadAction<CardFilters>) => {
      state.cardFilters = action.payload;
      // Set active filter type to card when card filters are modified
      state.activeFilterType = 'card';
    },

    resetCardFilters: state => {
      state.cardFilters = initialState.cardFilters;
      // Clear active filter type if no other filters are active
      if (state.activeFilterType === 'card') {
        state.activeFilterType = 'none';
      }
    },

    // Panel filter actions
    setPanelFilter: (
      state,
      action: PayloadAction<{ key: keyof PanelFilters; value: string | string[] }>
    ) => {
      const { key, value } = action.payload;
      (state.panelFilters as Record<string, string | string[]>)[key] = value;
      // Set active filter type to panel when panel filters are modified
      state.activeFilterType = 'panel';
      // Clear card filters when switching to panel filters
      state.cardFilters = initialState.cardFilters;
    },

    setAllPanelFilters: (state, action: PayloadAction<PanelFilters>) => {
      state.panelFilters = action.payload;
      // Set active filter type to panel when panel filters are modified
      state.activeFilterType = 'panel';
    },

    resetPanelFilters: state => {
      state.panelFilters = initialState.panelFilters;
      // Clear active filter type if no other filters are active
      if (state.activeFilterType === 'panel') {
        state.activeFilterType = 'none';
      }
    },

    // Reset all filters
    resetAllFilters: state => {
      state.cardFilters = initialState.cardFilters;
      state.panelFilters = initialState.panelFilters;
      state.activeFilterType = 'none'; // Clear active filter type when all filters are reset
    },

    // Clear specific panel filter fields
    clearPanelFilterField: (state, action: PayloadAction<keyof PanelFilters>) => {
      const field = action.payload;
      state.panelFilters = {
        ...state.panelFilters,
        [field]: '',
      };
    },

    // Set active filter type
    setActiveFilterType: (state, action: PayloadAction<'card' | 'panel' | 'none'>) => {
      const newFilterType = action.payload;
      state.activeFilterType = newFilterType;

      // If switching to card filter, clear only unitNumber but keep filterBy for card filtering
      if (newFilterType === 'card') {
        state.panelFilters.unitNumber = '';
      }

      // If switching to panel filter, clear card filters and data
      if (newFilterType === 'panel') {
        state.cardFilters = initialState.cardFilters;
      }
    },

    // Clear active filter type
    clearActiveFilterType: state => {
      state.activeFilterType = 'none';
    },
  },
});

export const {
  setCardFilter,
  setAllCardFilters,
  resetCardFilters,
  setPanelFilter,
  setAllPanelFilters,
  resetPanelFilters,
  resetAllFilters,
  clearPanelFilterField,
  setActiveFilterType,
  clearActiveFilterType,
} = fleetViewFiltersSlice.actions;

export default fleetViewFiltersSlice.reducer;

// Export types for use in components
export type { CardFilters, PanelFilters, FleetViewFiltersState };
