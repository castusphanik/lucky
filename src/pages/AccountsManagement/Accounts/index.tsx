import { useState, useRef } from 'react';
import './styles.scss';
import Button from '@/components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import DynamicForm, { type TFormData, type DynamicFormRef } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { Stack, Typography, Skeleton } from '@mui/material';
import { useGetAccountsQuery, useLazyGetDownloadDataQuery } from '@/services/accounts';
// import DevExtremeTable from '@/components/DevExtremeTable';
import { useDispatch, useSelector } from 'react-redux';
import { updatePage } from '@/features/table/tableSlice';
import type { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/store';
import Table, { type TColumns } from '@/components/Table';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import { AuthStorage } from '@/services/auth';

const accountFilters: TFormData = [
  { label: 'Account Name', name: 'account_name', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account ID', name: 'account_id', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'Account Type',
    name: 'account_type',
    type: 'select',
    options: [{ label: 'NATIONAL', value: 'national' }],
  },
  { label: 'Status', name: 'status', type: 'textInput', props: { placeholder: ' ' } },
];

const accountColumns: TColumns = [
  { label: 'Account Name', field: 'account_name', renderComponent: UserName, width: 380 },
  { label: 'Account ID', field: 'account_id', width: 120 },
  { label: 'Account Type', field: 'account_type', width: 150 },
  { label: 'Status', field: 'status' },
  // { label: 'Number of Users', field: 'number_of_users' },
];

function Accounts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [columns] = useState<TColumns>(accountColumns);
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state: RootState) => state.table);
  const { selectedAccountIds } = useAppSelector(state => state.selectedAccounts);
  const routeFilters = useAppSelector(state => state.tableFilters[location.pathname] ?? {});

  // Convert selected account IDs to comma-separated string, excluding 'select-all'
  const accountIdsParam = selectedAccountIds.filter(id => id !== 'select-all').join(',');

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<DynamicFormRef>(null);

  // Get customerId from user context
  const userId = AuthStorage.getUserInfo()?.user_id?.toString();

  console.log('Selected account IDs:', selectedAccountIds);
  console.log('Account IDs param:', accountIdsParam);

  const clean = (obj: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) => v !== undefined && v !== null && String(v).trim() !== ''
      )
    );

  const {
    data: accountsData,
    isLoading,
    isError,
  } = useGetAccountsQuery(
    {
      userId: userId || '',
      page,
      perPage: limit,
      ...(accountIdsParam && { accountIds: accountIdsParam }),
      ...clean(filters),
    },
    { skip: !userId }
  );

  const [triggerDownload] = useLazyGetDownloadDataQuery();

  const handleDownload = async () => {
    if (!accountIdsParam) return;

    try {
      const result = await triggerDownload({ accountIds: accountIdsParam });
      if (result.data) {
        const url = window.URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'assigned_accounts.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const rows = accountsData?.data
    ? accountsData.data.map(account => ({
        ...account,
        id: account.account_id,
        account_name: {
          value: account.account_name,
          onClick: () =>
            navigate(
              `/account-management/account-view-details/${account.customer_id}/${account.account_id}`
            ),
        },
      }))
    : [];

  // Force re-render when filters change by using routeFilters as a dependency
  const filterKey = JSON.stringify(routeFilters);

  console.log('accounts data:', accountsData);
  console.log('accounts meta:', accountsData?.meta);
  console.log('rows length:', rows.length);
  console.log('filter key:', filterKey);

  const handleFiltersSubmit = (vals: Record<string, string>) => {
    setFilters(clean(vals));
    dispatch(updatePage(1));
  };

  const handleSearchClick = () => {
    formRef.current?.submitForm();
  };

  const handleClear = () => {
    setFilters({});
    setFormKey(k => k + 1);
    dispatch(updatePage(1));
  };

  if (isError) {
    return <div>Error loading accounts.</div>;
  }

  return (
    <div className="accounts">
      <div className="accounts__actions-container">
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

          <Button
            size="fit"
            icon={<FiDownload size={18} />}
            iconPosition="right"
            onClick={handleDownload}
          >
            Download to CSV
          </Button>
        </div>
      </div>

      {!isLoading && (
        <motion.div
          className="accounts__filters-wrapper"
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
            <DynamicForm
              key={formKey}
              ref={formRef}
              formData={accountFilters}
              className="accounts__filter-inputs-container"
              onSubmit={handleFiltersSubmit}
            />

            <Button
              size="md"
              className="search-btn"
              onClick={() => {
                if (Object.keys(filters).length > 0) {
                  handleClear();
                } else {
                  handleSearchClick();
                }
              }}
            >
              {Object.keys(filters).length > 0 ? 'Clear' : 'Search'}
            </Button>
          </Stack>
        </motion.div>
      )}
      <div className="accounts__table-section">
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <Table
            columns={columns}
            rows={rows}
            totalRecords={accountsData?.meta?.total || 0}
            checkboxSelection={true}
            disableSearch={false}
          />
        )}
      </div>
    </div>
  );
}

export default Accounts;

type userNameProps = {
  value: string;
  onClick: () => void;
};

function UserName(props: Record<string, unknown>) {
  const { value, onClick } = props as userNameProps;
  return (
    <div
      className="flex-align-center accounts__user-name"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      {value}
    </div>
  );
}
