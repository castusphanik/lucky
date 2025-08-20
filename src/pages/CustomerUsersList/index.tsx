import { useState, useMemo } from 'react';
import './styles.scss';
import UserIcon from '@/assets/userIcon.svg';
import { Skeleton } from '@mui/material';
import { useGetTenCustomerUsersQuery } from '@/services/customers';
// import DevExtremeTable from '@/components/DevExtremeTable';
import { useDispatch, useSelector } from 'react-redux';
import { updateLimit, updatePage } from '@/features/table/tableSlice';
import type { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/store';
import Table from '@/components/Table';
import { useLocation } from 'react-router-dom';

interface CustomerUser {
  user_id: number;
  customer_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  role: string;
  created_at: string;
  created_by: number;
  updated_at: string | null;
  updated_by: number | null;
}

const customerUserColumns = [
  { label: 'Full Name', field: 'full_name', renderComponent: UserName, width: 200 },
  { label: 'Email', field: 'email', width: 300 },
  { label: 'Status', field: 'status' },
];

function CustomerUsersList() {
  const location = useLocation();
  const [columns] = useState(customerUserColumns);
  const dispatch = useDispatch();
  const { page, limit } = useSelector((state: RootState) => state.table);
  const { selectedAccountIds } = useAppSelector(state => state.selectedAccounts);
  const routeFilters = useAppSelector(state => state.tableFilters[location.pathname] ?? {});

  // Get the first selected customer ID (assuming we're working with customer IDs now)
  const customerId = selectedAccountIds.find(id => id !== 'select-all');
  const customerIdNumber = customerId ? parseInt(customerId) : 1; // Default to 1 if no selection

  // Helper function to convert values to strings for API
  const toStr = (v: unknown): string | undefined =>
    v === undefined || v === null || v === '' ? undefined : String(v);

  // Helper function to split full name into first and last name for search
  const splitFullName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return { first_name: parts[0], last_name: undefined };
    } else if (parts.length >= 2) {
      return {
        first_name: parts[0],
        last_name: parts.slice(1).join(' '),
      };
    }
    return { first_name: undefined, last_name: undefined };
  };

  const {
    data: customerUsersData,
    isLoading,
    isError,
  } = useGetTenCustomerUsersQuery({
    customerId: customerIdNumber,
    page,
    perPage: limit,
    username: toStr(routeFilters['username']),
    email: toStr(routeFilters['email']),
    ...splitFullName(toStr(routeFilters['full_name']) || ''),
    status: toStr(routeFilters['status']),
    role: toStr(routeFilters['role']),
  });

  const rows = useMemo(() => {
    if (!customerUsersData?.data) {
      return [];
    }
    return customerUsersData.data.map((user: CustomerUser) => ({
      ...user,
      id: user.user_id,
      full_name: {
        value: `${user.first_name} ${user.last_name}`,
        onClick: () => console.log('User clicked:', user.user_id),
      },
    }));
  }, [customerUsersData]);

  const handlePageChange = (newPage: number) => {
    dispatch(updatePage(newPage + 1));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(updateLimit(newLimit));
  };

  if (isError) {
    return <div>Error loading customer users.</div>;
  }

  return (
    <div className="customer-users-list">
      <div className="customer-users-list__table-section">
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          // <DevExtremeTable
          //   columns={columns}
          //   rows={rows}
          //   totalRecords={customerUsersData?.meta?.total || 0}
          //   checkboxSelection={true}
          //   disableSearch={false}
          //   onPageChange={handlePageChange}
          //   onLimitChange={handleLimitChange}
          // />
          <Table
            columns={columns}
            rows={rows}
            totalRecords={customerUsersData?.meta?.total || 0}
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

export default CustomerUsersList;

type userNameProps = {
  value: string;
  onClick: () => void;
};

function UserName({ value, onClick }: userNameProps) {
  return (
    <div
      className="flex-align-center customer-users-list__user-name"
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
