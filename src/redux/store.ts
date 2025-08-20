import { configureStore } from '@reduxjs/toolkit';
import * as service from '../services';
import themeReducer from '../features/theme/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import tableReducer from '@/features/table/tableSlice';
import layoutReducer from '@/features/layout/layoutSlice';
import accountsReducer from '@/features/accounts/accountsSlice';
import tableFiltersReducer from '@/features/tableFilters/tableFiltersSlice';
import fleetViewFiltersReducer from '@/features/fleetViewFilters/fleetViewFiltersSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    table: tableReducer,
    layout: layoutReducer,
    selectedAccounts: accountsReducer,
    tableFilters: tableFiltersReducer,
    fleetViewFilters: fleetViewFiltersReducer,
    [service.authService.reducerPath]: service.authService.reducer,
    [service.accountManagementService.reducerPath]: service.accountManagementService.reducer,
    [service.rolesService.reducerPath]: service.rolesService.reducer,
    [service.accountsService.reducerPath]: service.accountsService.reducer,
    [service.customersService.reducerPath]: service.customersService.reducer,
    [service.geofencesService.reducerPath]: service.geofencesService.reducer,
    [service.fleetService.reducerPath]: service.fleetService.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      service.authService.middleware,
      service.accountManagementService.middleware,
      service.rolesService.middleware,
      service.accountsService.middleware,
      service.customersService.middleware,
      service.fleetService.middleware,
      service.geofencesService.middleware,
    ]),
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
