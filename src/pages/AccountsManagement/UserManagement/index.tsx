import Tabs from '@/components/Tabs';
import './styles.scss';
import { useState } from 'react';
import type { TColumns } from '@/components/Table';
import Table from '@/components/Table';
import ManageColumns from '@/components/ManageColumns';
import { FaCircle } from 'react-icons/fa';
import UserIcon from '@/assets/userIcon.svg';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import { Stack, Typography } from '@mui/material';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import UserPreviewModal from '@/components/userPreviewCard';
import UserView from '@/components/userQuickView';
import AssignRole from '@/components/AssignRole';
import CustomerProfile from '@/components/customerQuickView';
import {
  useGetUserManagementDataQuery,
  useLazyGetCustomerUserDetailsQuery,
} from '@/services/accountManagement';
import { useAppSelector } from '@/redux/store';
import { getLoggedInUserData } from '@/helpers/utils';
import { USER_ROLE_LABELS, USER_ROLES } from '@/helpers/constants';
import { useDispatch } from 'react-redux';
import { updatePage } from '@/features/table/tableSlice';

const initialTenUserColumns: TColumns = [
  { label: 'Name', field: 'name', renderComponent: UserName },
  { label: 'Email', field: 'email' },
  { label: 'Title', field: 'designation' },
  { label: 'PA Name', field: 'pa_name', renderComponent: UserAccount },
  { label: 'First Active', field: 'first_active' },
  { label: 'Last Active', field: 'last_active' },
  { label: 'Status', field: 'status', renderComponent: UserStatus },
];

const initialCustomerUserColumns: TColumns = [
  { label: 'Name', field: 'name', renderComponent: UserName },
  { label: 'Email', field: 'email' },
  { label: 'Customer Account', field: 'account', renderComponent: UserAccount },
  { label: 'Designation', field: 'designation' },
  { label: 'User Role', field: 'role' },
  { label: 'User Status', field: 'status', renderComponent: UserStatus },
  { label: 'First Active', field: 'first_active' },
  { label: 'Last Active', field: 'last_active' },
];

const tenUserFilters: TFormData = [
  { label: 'Name', name: 'name', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Email', name: 'email', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Title', name: 'title', type: 'select', options: [] },
  { label: 'Parent Account Name', name: 'pa', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'First Active', name: 'first_active', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Last Active', name: 'last_active', type: 'textInput', props: { placeholder: ' ' } },
];

const customerUserFilters: TFormData = [
  { label: 'Name', name: 'name', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Email', name: 'email', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Customer Account', name: 'account', type: 'select', options: [] },
  { label: 'Role', name: 'role', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'User Status', name: 'status', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'First Active', name: 'first_active', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Last Active', name: 'last_active', type: 'textInput', props: { placeholder: ' ' } },
];

const { TEN_USERS, CUSTOMER_USERS } = {
  TEN_USERS: 'ten',
  CUSTOMER_USERS: 'customer',
};

const tabs = [
  { label: 'Ten Users', value: TEN_USERS, count: '1.2k' },
  { label: 'Customer Users', value: CUSTOMER_USERS, count: '1.2k' },
];

const { TEN_ADMIN } = USER_ROLES;

type TResponse = Record<string, any>[];

function UserManagement() {
  const dispatch = useDispatch();
  const profile = getLoggedInUserData();
  const userInfo = JSON.parse(localStorage.getItem('user_info')!);
  const userRole = profile?.user_info?.role;
  const initialTab = userRole === TEN_ADMIN ? TEN_USERS : CUSTOMER_USERS;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [tenUserColumns, setTenUserColumns] = useState(initialTenUserColumns);
  const [customerUserColumns, setCustomerUserColumns] = useState(initialCustomerUserColumns);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [userDetails, setUserDetails] = useState<Record<string, any>>({});

  const columns = activeTab === TEN_USERS ? tenUserColumns : customerUserColumns;
  const formData = activeTab === TEN_USERS ? tenUserFilters : customerUserFilters;
  const { page, limit } = useAppSelector(state => state.table);
  const { selectedAccountIds } = useAppSelector(state => state.selectedAccounts);

  // Convert selected account IDs to comma-separated string, excluding 'select-all'
  const accountIdsParam = selectedAccountIds.filter(id => id !== 'select-all').join(',');

  const [getCustomerUserDetails, { data: customerAccounts }] = useLazyGetCustomerUserDetailsQuery();
  const { data, isFetching } = useGetUserManagementDataQuery(
    {
      type: activeTab,
      params: { page, perPage: limit },
      accountIds: accountIdsParam || undefined,
      userId: userInfo.user_id,
    },
    { refetchOnMountOrArgChange: true }
  );

  const users: TResponse = data?.data || [];
  const accounts: TResponse = customerAccounts?.data || [];

  const transformedUsers = users.map(item => {
    return {
      ...item,
      id: item?.user_id,
      name: {
        value: `${item.first_name || ''} ${item.last_name || ''}`.trim(),
        onClick: () => {
          handleClickRow(item?.user_id);
          setShowUserDetails(true);
        },
      },
      account: {
        value: item?.account_customer_customer_name,
        id: item?.account_customer_reference_number,
      },
      role: USER_ROLE_LABELS?.[item?.user_role_ref_name] || item?.user_role_ref_name,
      status: { value: item?.status },
    };
  });

  const transformedAccounts = accounts.map(item => {
    return {
      name: item?.account_name,
      acNo: item?.account_number,
    };
  });

  async function handleClickRow(id: string) {
    if (id && activeTab === CUSTOMER_USERS) {
      await getCustomerUserDetails({ userId: id });
    }

    const selectedUser: Record<string, any> | undefined = transformedUsers?.find(
      item => item?.id === id
    );

    const details = {
      id: selectedUser?.id,
      name: selectedUser?.name?.value,
      email: selectedUser?.email,
      phoneNumber: selectedUser?.phone_number,
      company: selectedUser?.account_customer_customer_name,
      designation: selectedUser?.designation,
    };

    setUserDetails(details);
  }

  function RenderExpandedComponent({ activeTab }: { activeTab: string }) {
    return activeTab === TEN_USERS ? (
      <UserView
        name={userDetails?.name}
        email={userDetails?.email}
        phone={userDetails?.phoneNumber}
        noOfAccounts=""
        location=""
      />
    ) : (
      <CustomerProfile
        name={userDetails?.name}
        email={userDetails?.email}
        company={userDetails?.company}
        role={userDetails?.designation}
        associatedAccounts={0}
        relatedAccounts={transformedAccounts?.length || 0}
        accounts={transformedAccounts}
      />
    );
  }

  return (
    <>
      <div className="user-management">
        <div className="user-management__actions-container">
          <div style={{ visibility: userRole === TEN_ADMIN ? 'visible' : 'hidden' }}>
            <Tabs
              options={tabs}
              activeTab={activeTab}
              onChange={val => {
                dispatch(updatePage(1));
                setActiveTab(val);
              }}
            />
          </div>

          <div className="flex-align-center right-section">
            {activeTab === CUSTOMER_USERS && (
              <Button size="fit" className="assign-btn" onClick={() => setShowAssignRole(true)}>
                Assign Role
              </Button>
            )}

            <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
              Download as CSV
            </Button>

            <Button
              size="fit"
              variant="outline"
              icon={<img className={showFilters ? 'filter-icon' : ''} src={FilterIcon} />}
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-btn ${showFilters ? 'active' : ''}`}
            >
              Filter
            </Button>

            <ManageColumns
              columns={columns}
              onApply={data => {
                if (activeTab === TEN_USERS) {
                  setTenUserColumns(data);
                } else {
                  setCustomerUserColumns(data);
                }
              }}
            />
          </div>
        </div>

        <motion.div
          className="filters-wrapper"
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
            <DynamicForm formData={formData} className="filters-inputs-container" />

            <Button size="md" className="search-btn">
              Search
            </Button>
          </Stack>
        </motion.div>

        <Table
          isLoading={isFetching}
          columns={columns.filter(item => !item?.hide)}
          rows={transformedUsers}
          cellPadding={activeTab === TEN_USERS ? '0.7em' : '0.65em'}
          height={'calc(100vh - 170px)'}
          totalRecords={data?.meta?.total || 0}
          onClickRow={handleClickRow}
          renderExpandedContent={<RenderExpandedComponent activeTab={activeTab} />}
        />
      </div>

      <UserPreviewModal
        open={showUserDetails}
        onClose={() => setShowUserDetails(false)}
        user={{
          name: userDetails?.name,
          email: userDetails?.email,
          phone: userDetails?.phoneNumber,
          contactName: '',
          employeecount: '',
          branch: '',
          date: '',
          avatarUrl: '',
        }}
      />

      <AssignRole open={showAssignRole} onClose={() => setShowAssignRole(false)} />
    </>
  );
}

export default UserManagement;

function UserStatus({ value }: { value: string }) {
  const statusColors: Record<string, string> = {
    ACTIVE: '#3DB00D',
    SUSPENDED: '#CF4444',
  };

  const statusText: Record<string, string> = {
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended',
  };

  const color = statusColors[value] ?? '#00000050';

  return (
    <div
      className="flex-align-center user-management__status"
      style={{ color: color, borderColor: color }}
    >
      <FaCircle size={10} color={color} /> {statusText[value]}
    </div>
  );
}

type userNameProps = {
  value: string;
  onClick: () => void;
};

function UserName({ value, onClick }: userNameProps) {
  return (
    <div
      className="flex-align-center user-management__user-name"
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

function UserAccount({ value, id }: { value: string; id?: string }) {
  return (
    <div className="flex-align-center user-management__user-account">
      <div className="label">12 LA</div>
      <div>
        {value}
        {id && <div className="id">#ID {id}</div>}
      </div>
    </div>
  );
}
