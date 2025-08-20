import { useState, useMemo } from 'react';
import './styles.scss';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
// import type { TColumns } from '@/components/DevExtremeTable';
import ManageColumns from '@/components/ManageColumns';
import { useLocation, useNavigate } from 'react-router-dom';
import UserIcon from '@/assets/userIcon.svg';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { Stack, Typography, Skeleton } from '@mui/material';
import { useGetTenCustomersQuery } from '@/services/customers';
// import DevExtremeTable from '@/components/DevExtremeTable';
import { useDispatch, useSelector } from 'react-redux';
import { updateLimit, updatePage } from '@/features/table/tableSlice';
import moment from 'moment';
import { useAppSelector, type RootState } from '@/redux/store';
import Table, { type TColumns } from '@/components/Table';

const customerFilters: TFormData = [
  { label: 'Customer Name', name: 'customer_name', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'Customer Class',
    name: 'customer_class',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  {
    label: 'Reference Number',
    name: 'reference_number',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'Status', name: 'status', type: 'select', options: [] },
];

const customerColumns: TColumns = [
  { label: 'Customer Name', field: 'customer_name', renderComponent: CustomerName, width: 170 },
  { label: 'Customer ID', field: 'customer_id' },
  { label: 'Customer Class', field: 'customer_class', width: 150 },
  { label: 'Reference Number', field: 'reference_number', width: 170 },
  { label: 'Created At', field: 'created_at' },
];

function Customers({ isFrom }: { isFrom: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState<TColumns>(customerColumns);
  const formData = customerFilters;
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state: RootState) => state.table);
  const routeFilters = useAppSelector(state => state.tableFilters[location.pathname] ?? {});

  // Helper function to convert values to strings for API
  const toStr = (v: unknown): string | undefined =>
    v === undefined || v === null || v === '' ? undefined : String(v);

  const {
    data: customersData,
    isLoading,
    isError,
  } = useGetTenCustomersQuery({
    page,
    perPage: limit,
    customer_name: toStr(routeFilters['customer_name']),
    customer_id: toStr(routeFilters['customer_id']),
    customer_class: toStr(routeFilters['customer_class']),
    status: toStr(routeFilters['status']),
    reference_number: toStr(routeFilters['reference_number']),
  });

  const rows = useMemo(() => {
    if (!customersData) {
      return [];
    }
    return customersData.data.map(customer => ({
      ...customer,
      id: customer.customer_id,
      customer_name: {
        value: customer.customer_name,
        onClick: () => {
          if (isFrom === 'customers') {
            navigate(`/all-accounts/${customer.customer_id}`);
          } else {
            navigate(`/customer-users/${customer.customer_id}`);
          }
        },
      },
      created_at: moment(customer.created_at).format('MM-DD-YYYY HH:mm'),
    }));
  }, [customersData, navigate]);

  const handlePageChange = (newPage: number) => {
    dispatch(updatePage(newPage + 1));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(updateLimit(newLimit));
  };

  if (isError) {
    return <div>Error loading customers.</div>;
  }

  return (
    <div className="customers">
      <motion.div
        className="customers__filters-wrapper"
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
          <DynamicForm formData={formData} className="customers__filter-inputs-container" />

          <Button size="md" className="search-btn">
            Search
          </Button>
        </Stack>
      </motion.div>

      <div className="customers__table-section">
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          <Table
            columns={columns}
            rows={rows}
            totalRecords={customersData?.meta.total || 0}
            checkboxSelection={true}
            disableSearch={false}
          />
        )}
      </div>
    </div>
  );
}

export default Customers;

type customerNameProps = {
  value: string;
  onClick: () => void;
};

function CustomerName({ value, onClick }: customerNameProps) {
  return (
    <div
      className="flex-align-center customers__customer-name"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      {value}
    </div>
  );
}
