import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SelectedAccountsState {
  selectedAccountIds: string[];
}

const initialState: SelectedAccountsState = {
  selectedAccountIds: [],
};

const accountsSlice = createSlice({
  name: 'selectedAccounts',
  initialState,
  reducers: {
    setSelectedAccounts: (state, action: PayloadAction<string[]>) => {
      state.selectedAccountIds = action.payload;
    },
  },
});

export const { setSelectedAccounts } = accountsSlice.actions;
export default accountsSlice.reducer;
