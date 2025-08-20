import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useGetAccountsByAccountIdQuery } from '@/services/accounts';
// import DevExtremeTable from '@/components/DevExtremeTable';
import { useDispatch, useSelector } from 'react-redux';
import { updateLimit, updatePage } from '@/features/table/tableSlice';
import type { RootState } from '@/redux/store';
import Table,{ type TColumns } from '@/components/Table';

const accountDetailsFilters: TFormData = [
  { label: 'Account Name', name: 'acc_name', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account Manager', name: 'acc_manager', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account No#', name: 'acc_no', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Legacy Account', name: 'legacy_acc', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'No of Users', name: 'users', type: 'select', options: [] },
  { label: 'Account Type', name: 'acc_type', type: 'select', options: [] },
];

const accountDetailsColumns: TColumns = [
  { label: 'Account Name', field: 'account_name', renderComponent: UserName },
  { label: 'Account ID', field: 'account_id' },
  { label: 'Account Type', field: 'account_type' },
  { label: 'Status', field: 'status' },
  { label: 'Number of Users', field: 'number_of_users' },
];

function AccountDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState<TColumns>(accountDetailsColumns);
  const formData = accountDetailsFilters;
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state: RootState) => state.table);

  const {
    data: accountsData,
    isLoading,
    isError,
  } = useGetAccountsByAccountIdQuery({
    accountId: customerId || '1',
    page,
    perPage: limit,
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
        onClick: () =>
          navigate(`/account-management/account-view-details/${customerId}/${account.account_id}`),
      },
    }));
  }, [accountsData, navigate]);

  const handlePageChange = (newPage: number) => {
    dispatch(updatePage(newPage + 1));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(updateLimit(newLimit));
  };

  if (isError) {
    return <div>Error loading account details.</div>;
  }

  return (
    <div className="account-details">
      <div className="account-details__header">
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Accounts under Customer ID: {customerId}
        </Typography>
      </div>

      <div className="account-details__actions-container">
        <div className="flex-align-center right-section">
          <Button
            size="fit"
            variant="outline"
            icon={<img className={showFilters ? 'filter-icon' : ''} src={FilterIcon} />}
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-btn ${showFilters ? 'active' : ''}`}
          >
            Filter
          </Button>

          <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
            Download as CSV
          </Button>

          <ManageColumns columns={columns} onApply={setColumns} />
        </div>
      </div>

      <motion.div
        className="account-details__filters-wrapper"
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
          <DynamicForm formData={formData} className="account-details__filter-inputs-container" />

          <Button size="md" className="search-btn">
            Search
          </Button>
        </Stack>
      </motion.div>

      <div className="account-details__table-section">
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
           
          />
        )}
      </div>
    </div>
  );
}

export default AccountDetails;

type userNameProps = {
  value: string;
  onClick: () => void;
};

function UserName({ value, onClick }: userNameProps) {
  return (
    <div
      className="flex-align-center account-details__user-name"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      <img src={UserIcon} width={25} />
      {value}
    </div>
  );
}
