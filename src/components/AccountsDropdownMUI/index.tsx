import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useGetAssignedAccountsDropdownQuery } from '@/services/accounts';
import { AuthStorage } from '@/services/auth';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setSelectedAccounts } from '@/features/accounts/accountsSlice';
import type { Account } from '@/services/accounts';
import './styles.scss';

const ITEM_HEIGHT = 32;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 280,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #ddd',
      borderRadius: '4px',
    },
  },
};

interface AccountsDropdownMUIProps {
  value?: string[];
  onValueChanged?: (value: string[]) => void;
  placeholder?: string;
}

const AccountsDropdownMUI: React.FC<AccountsDropdownMUIProps> = ({
  onValueChanged,
  placeholder = 'Select Account Number',
}) => {
  const dispatch = useAppDispatch();
  const { selectedAccountIds } = useAppSelector(state => state.selectedAccounts);
  const userId = AuthStorage.getUserId();
  const { data: accountsData, isLoading } = useGetAssignedAccountsDropdownQuery(
    { userId: userId || 0 },
    { skip: !userId }
  );

  const accounts = React.useMemo(() => {
    if (!accountsData?.data) return [];
    return accountsData.data.map((account: Account) => ({
      id: account.account_id.toString(),
      name: account.account_name || account.account_number || `Account ${account.account_id}`,
    }));
  }, [accountsData]);

  // Initially select all accounts when data is loaded
  React.useEffect(() => {
    if (accounts.length > 0 && selectedAccountIds.length === 0) {
      const allAccountIds = accounts.map(account => account.id);
      dispatch(setSelectedAccounts(['select-all', ...allAccountIds]));
      onValueChanged?.(allAccountIds);
    }
  }, [accounts, selectedAccountIds.length, dispatch, onValueChanged]);

  const handleChange = (event: SelectChangeEvent<typeof selectedAccountIds>) => {
    const {
      target: { value },
    } = event;

    const newValue = typeof value === 'string' ? value.split(',') : value;

    console.log('Previous selection:', selectedAccountIds);
    console.log('New value:', newValue);
    console.log('Accounts length:', accounts.length);

    // Handle "Select All" logic
    if (newValue.includes('select-all')) {
      // Check if we previously had "select-all" and now we have fewer accounts selected
      // This means an individual account was deselected from "select all"
      if (
        selectedAccountIds.includes('select-all') &&
        newValue.length < selectedAccountIds.length
      ) {
        // Individual account was deselected from "select all"
        const selectedAccountIds = newValue.filter(id => id !== 'select-all');
        console.log('Individual account deselected from select-all:', selectedAccountIds);
        dispatch(setSelectedAccounts(selectedAccountIds));
        onValueChanged?.(selectedAccountIds);
      } else if (selectedAccountIds.includes('select-all')) {
        // If "Select All" was already selected and is clicked again, deselect all
        console.log('Deselecting all');
        dispatch(setSelectedAccounts([]));
        onValueChanged?.([]);
      } else {
        // Select all accounts
        const allAccountIds = accounts.map(account => account.id);
        console.log('Selecting all accounts:', allAccountIds);
        dispatch(setSelectedAccounts(['select-all', ...allAccountIds]));
        onValueChanged?.(allAccountIds);
      }
    } else {
      // Individual account selection/deselection
      const selectedAccountIds = newValue.filter(id => id !== 'select-all');
      console.log('Selected account IDs:', selectedAccountIds);

      // Check if all accounts are selected (excluding "Select All")
      if (selectedAccountIds.length === accounts.length) {
        // All accounts selected, also include "Select All"
        console.log('All accounts selected, adding select-all');
        dispatch(setSelectedAccounts(['select-all', ...selectedAccountIds]));
        onValueChanged?.(selectedAccountIds);
      } else {
        // Some accounts selected, don't include "Select All"
        console.log('Some accounts selected, not adding select-all');
        dispatch(setSelectedAccounts(selectedAccountIds));
        onValueChanged?.(selectedAccountIds);
      }
    }
  };

  const renderValue = (selected: string[]) => {
    if (selected.length === 0) return placeholder;
    if (selected.includes('select-all')) {
      return 'All Accounts Selected';
    }
    if (selected.length === 1) {
      const account = accounts.find(acc => acc.id === selected[0]);
      return account?.name || selected[0];
    }
    return `${selected.length} accounts selected`;
  };

  if (isLoading) {
    return <div className="accounts-dropdown-loading">Loading accounts...</div>;
  }

  return (
    <div className="accounts-dropdown-mui">
      <FormControl sx={{ width: '100%' }}>
        <Select
          id="accounts-multiple-checkbox"
          multiple
          value={selectedAccountIds}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={renderValue}
          MenuProps={MenuProps}
          className=""
        >
          <MenuItem key="select-all" value="select-all">
            <Checkbox checked={selectedAccountIds.includes('select-all')} />
            <ListItemText primary="Select All" />
          </MenuItem>
          {accounts.map(account => (
            <MenuItem key={account.id} value={account.id}>
              <Checkbox checked={selectedAccountIds.includes(account.id)} />
              <ListItemText primary={account.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default AccountsDropdownMUI;
