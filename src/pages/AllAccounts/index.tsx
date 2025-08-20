import { useState, useMemo } from 'react';
import './styles.scss';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
// import type { TColumns } from '@/components/DevExtremeTable';
import ManageColumns from '@/components/ManageColumns';
import UserIcon from '@/assets/userIcon.svg';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { Stack, Typography, Skeleton } from '@mui/material';
import { useGetCustomerAccountsListQuery } from '@/services/accounts';
// import DevExtremeTable from '@/components/DevExtremeTable';
import { useDispatch, useSelector } from 'react-redux';
import { updateLimit, updatePage } from '@/features/table/tableSlice';
import { useAppSelector, type RootState } from '@/redux/store';
import { useLocation, useParams } from 'react-router-dom';
import Table, { type TColumns } from '@/components/Table';

const allAccountFilters: TFormData = [
  { label: 'Account Name', name: 'acc_name', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account Manager', name: 'acc_manager', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account No#', name: 'acc_no', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Legacy Account', name: 'legacy_acc', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'No of Users', name: 'users', type: 'select', options: [] },
  { label: 'Account Type', name: 'acc_type', type: 'select', options: [] },
];

const allAccountColumns: TColumns = [
  { label: 'Account Name', field: 'account_name', renderComponent: UserName, width: 370 },

  { label: 'Account ID', field: 'account_id' },
  { label: 'Account Type', field: 'account_type' },
  { label: 'Status', field: 'status' },
];

function AllAccounts() {
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState<TColumns>(allAccountColumns);
  const formData = allAccountFilters;
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state: RootState) => state.table);
  const { customerId } = useParams();
  const routeFilters = useAppSelector(state => state.tableFilters[location.pathname] ?? {});

  // Helper function to convert values to strings for API
  const toStr = (v: unknown): string | undefined =>
    v === undefined || v === null || v === '' ? undefined : String(v);

  const {
    data: accountsData,
    isLoading,
    isError,
  } = useGetCustomerAccountsListQuery({
    customerId,
    page,
    perPage: limit,
    account_name: toStr(routeFilters['account_name']),
    account_type: toStr(routeFilters['account_type']),
    status: toStr(routeFilters['status']),
  });

  const rows = useMemo(() => {
    if (!accountsData) {
      return [];
    }
    return accountsData.data.map(account => ({
      ...account,
      id: account.account_id,
      account_name: {
        value: account.account_name,
        onClick: () => console.log('Account clicked:', account.account_id),
      },
    }));
  }, [accountsData]);

  const handlePageChange = (newPage: number) => {
    dispatch(updatePage(newPage + 1));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(updateLimit(newLimit));
  };

  if (isError) {
    return <div>Error loading accounts.</div>;
  }

  return (
    <div className="all-accounts">
      <motion.div
        className="all-accounts__filters-wrapper"
        initial={{ height: 0 }}
        animate={{ height: showFilters ? 'auto' : 0 }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ padding: '0.8rem', paddingBottom: 0 }}
        >
          Filter by
        </Typography>

        <Stack
          direction="row"
          alignItems="flex-end"
          gap={1}
          sx={{ padding: '0.8rem', paddingTop: '0.5rem' }}
        >
          <DynamicForm formData={formData} className="all-accounts__filter-inputs-container" />

          <Button size="md" className="search-btn">
            Search
          </Button>
        </Stack>
      </motion.div>

      <div className="all-accounts__table-section">
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          // <DevExtremeTable
          //   columns={columns}
          //   rows={rows}
          //   totalRecords={accountsData?.meta.total || 0}
          //   checkboxSelection={true}
          //   disableSearch={false}
          //   onPageChange={handlePageChange}
          //   onLimitChange={handleLimitChange}
          // />
          <Table
            columns={columns}
            rows={rows}
            totalRecords={accountsData?.meta.total || 0}
            checkboxSelection={true}
            disableSearch={false}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </div>
  );
}

export default AllAccounts;

type userNameProps = {
  value: string;
  onClick: () => void;
};

function UserName({ value, onClick }: userNameProps) {
  return (
    <div
      className="flex-align-center all-accounts__user-name"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      {value}
    </div>
  );
}
