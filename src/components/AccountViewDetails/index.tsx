import React, { useState, useMemo } from 'react';
import './styles.scss';
import { Typography, Skeleton } from '@mui/material';
import DetailedOverview from '../DetailedOverview';
import UserIcon from '@/assets/userIcon.svg';
import { FaCircle } from 'react-icons/fa';
import BuildingIcon from '@/assets/BuildingIcon.svg';
// import DevExtremeTable, { type TColumns } from '../DevExtremeTable';
import { useDispatch } from 'react-redux';
import { updateLimit, updatePage } from '@/features/table/tableSlice';
import { useLocation, useParams } from 'react-router-dom';
import { useGetAssociatedAccountsQuery, useGetSecondaryContactsQuery } from '@/services/accounts';
import { useAppSelector } from '@/redux/store';
import Table, { type TColumns } from '@/components/Table';

const AccountViewDetails = () => {
  const dispatch = useDispatch();
  const { customerId, accountId } = useParams<{ customerId: string; accountId: string }>();
  const location = useLocation();
  const routeFilters = useAppSelector(state => state.tableFilters[location.pathname] ?? {});

  const {
    data: accountDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useGetAssociatedAccountsQuery({ customerId: customerId!, accountId: accountId! });

  console.log(accountDetails);

  const toStr = (v: unknown): string | undefined =>
    v === undefined || v === null || v === '' ? undefined : String(v);

  // If only a single name filter is provided, split into first and last halves
  const nameFilter = toStr(routeFilters['name']);
  let computedFirstName = toStr(routeFilters['first_name']);
  let computedLastName = toStr(routeFilters['last_name']);

  if (nameFilter && !computedFirstName && !computedLastName) {
    const parts = nameFilter.trim().split(/\s+/);
    const halfIndex = Math.ceil(parts.length / 2);
    computedFirstName = parts.slice(0, halfIndex).join(' ');
    computedLastName = parts.slice(halfIndex).join(' ');
  }

  const {
    data: accountUsersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useGetSecondaryContactsQuery({
    accountId: accountId!,
    first_name: computedFirstName,
    last_name: computedLastName,
    email: toStr(routeFilters['email']),
    designation: toStr(routeFilters['designation']),
    phone_number: toStr(routeFilters['phone_number']),
  });

  const secondaryContactsColumns: TColumns = [
    { label: 'Name', field: 'name', renderComponent: UserName, width: 200 },
    { label: 'Email', field: 'email', width: 300 },
    { label: 'Designation', field: 'designation', width: 150 },
    { label: 'Phone Number', field: 'phone_number', width: 150 },
    { label: 'Status', field: 'status', width: 200, renderComponent: UserStatus },
  ];

  const [columns] = useState<TColumns>(secondaryContactsColumns);

  const rows = useMemo(() => {
    if (!accountUsersData) {
      return [];
    }
    return accountUsersData.data.map(user => {
      const fallbackName = (user as unknown as { name?: string }).name ?? '';
      const fullName =
        user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : fallbackName;
      return {
        ...user,
        id: user.user_id,
        name: { value: fullName },
        status: { value: (user as unknown as { status?: string }).status ?? '' },
      };
    });
  }, [accountUsersData]);

  const handlePageChange = (newPage: number) => {
    dispatch(updatePage(newPage + 1));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(updateLimit(newLimit));
  };

  if (isLoadingDetails) {
    return <Skeleton variant="rectangular" width="100%" height={600} />;
  }

  if (isErrorDetails || !accountDetails) {
    return <div>Error loading account details.</div>;
  }

  const { selectedAccount, primaryContactUser, relatedAccounts } = accountDetails.data;

  return (
    <div className="account-view">
      <div className="account-view__left-section">
        {selectedAccount && (
          <div className="top-name-section">
            <img src={BuildingIcon} alt="building-icon" className="building-icon" />
            <Typography variant="body2" fontWeight={500} className="build-code">
              {`#${selectedAccount.legacy_account_number || 'US84758FD94'}`}
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {selectedAccount.account_name}
            </Typography>
          </div>
        )}
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }} className="section-title">
          Primary Contact
        </Typography>

        {primaryContactUser ? (
          <DetailedOverview
            data={[
              {
                label: 'Name',
                value: `${primaryContactUser.first_name} ${primaryContactUser.last_name}`,
              },
              { label: 'Email', value: primaryContactUser.email },
              { label: 'Phone Number', value: primaryContactUser.phone_number },
              { label: 'Title', value: primaryContactUser.designation },
            ]}
            className="detailed-overview--single-column"
          />
        ) : (
          <Typography>N/A</Typography>
        )}

        <div className="related-section-box">
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }} className="section-title ">
            Related Accounts {relatedAccounts?.length || 0}
          </Typography>

          {Array.isArray(relatedAccounts) &&
            relatedAccounts.map(account => (
              <div className="related-account" key={account.account_id}>
                <div className="item">
                  <Typography variant="body2" className="label">
                    Account Name <br />
                    <Typography variant="body2" className="company-name">
                      {account.account_name}
                    </Typography>
                  </Typography>
                </div>
                <div className="item">
                  <Typography variant="body2" className="label">
                    AC/No:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400 }} className="value">
                    {account.account_number || 'N/A'}
                  </Typography>
                </div>
                <div className="item">
                  <Typography variant="body2" className="label">
                    Customer Ref #:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400 }} className="value">
                    {account.legacy_account_number || 'N/A'}
                  </Typography>
                </div>
                <div className="item">
                  <Typography variant="body2" className="label">
                    Location:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400 }} className="value">
                    {account?.country_lookup_ref_country_code} -{' '}
                    {account?.country_lookup_ref_country_name}
                  </Typography>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="account-view__right-table-section">
        {isLoadingUsers ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : isErrorUsers ? (
          <div>Error loading users.</div>
        ) : (
          <Table
            columns={columns}
            rows={rows}
            totalRecords={accountUsersData?.data?.length || 0}
            checkboxSelection={false}
            disableSearch={false}
          />
        )}
      </div>
    </div>
  );
};

export default AccountViewDetails;

function UserName(props: Record<string, unknown>) {
  const { value } = props as { value: string };
  return (
    <div className="flex-align-center account-view__user-name">
      <img src={UserIcon} width={25} />
      {value}
    </div>
  );
}

function UserStatus(props: Record<string, unknown>) {
  const { value } = props as { value: string };
  const statusColors: Record<string, string> = {
    active: '#3DB00D',
    suspended: '#CF4444',
  };

  const statusText: Record<string, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Suspended',
  };

  const color = statusColors[value] ?? '#00000050';

  return (
    <div
      className="flex-align-center account-view__status"
      style={{ color: color, borderColor: color }}
    >
      <FaCircle size={10} color={color} /> {statusText[value]}
    </div>
  );
}
