import Table from '@/components/Table';
import { useAppSelector } from '@/redux/store';
import { useState } from 'react';
import './styles.scss';
import Tabs from '@/components/Tabs';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import type { TColumns } from '@/components/Table';
import ManageColumns from '@/components/ManageColumns';
import StatusChip from '@/components/StatusChip';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import EditIcon from '@/assets/EditIcon.svg';
import DeleteIcon from '@/assets/DeleteRedIcon.svg';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Stack, Typography } from '@mui/material';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';

const initialLeaseFilters: TFormData = [
  { label: 'Unit #', name: 'unit', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Description', name: 'desc', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Schedule A #', name: 'schedule', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account #', name: 'account', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account Name', name: 'name', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Lease PO', name: 'lease', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Status', name: 'status', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Start Date', name: 'start', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Termination Date', name: 'terminate', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'TEN Facility', name: 'facility', type: 'textInput', props: { placeholder: ' ' } },
];

const initialRentFilters: TFormData = [
  { label: 'Unit #', name: 'unit', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Description', name: 'desc', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Rental Agreement', name: 'rent_agree', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account #', name: 'account', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account Name', name: 'name', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Rental PO', name: 'rental', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Status', name: 'status', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Start Date', name: 'start', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'End Date', name: 'end_date', type: 'textInput', props: { placeholder: ' ' } },
  // { label: 'TEN Facility', name: 'facility', type: 'textInput', props: { placeholder: ' ' } },
];

const initialLeaseColumns: TColumns = [
  { label: 'Unit #', field: 'unit', renderComponent: AgreementUnit },
  { label: 'Description', field: 'desc' },
  { label: 'Schedule A #', field: 'schedule' },
  { label: 'Account #', field: 'account' },
  { label: 'Account Name', field: 'name' },
  { label: 'Lease PO', field: 'lease' },
  { label: 'Status', field: 'status', renderComponent: UserStatus },
  { label: 'Start Date', field: 'start' },
  { label: 'Termination Date', field: 'terminate' },
  { label: 'TEN Facility', field: 'facility' },
];

const initialRentColumns: TColumns = [
  { label: 'Unit #', field: 'unit', renderComponent: AgreementUnit },
  { label: 'Description', field: 'desc' },
  { label: 'Rental Agreement', field: 'rent_agree' },
  { label: 'Account #', field: 'account' },
  { label: 'Account Name', field: 'name' },
  { label: 'Rental PO', field: 'rental' },
  { label: 'Status', field: 'status', renderComponent: UserStatus },
  { label: 'Start Date', field: 'start' },
  { label: 'End Date', field: 'end_date' },
  { label: 'TEN Facility', field: 'facility' },
];

const { LEASE_USERS, RENT_USERS } = {
  LEASE_USERS: 'lease',
  RENT_USERS: 'rent',
};

const tabs = [
  { label: 'Lease', value: LEASE_USERS },
  { label: 'Rent', value: RENT_USERS },
];

function Agreements() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(LEASE_USERS);
  const [leaseUserColumns, setLeaseUserColumns] = useState(initialLeaseColumns);
  const [rentUserColumns, setRentUserColumns] = useState(initialRentColumns);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const columns = activeTab === LEASE_USERS ? leaseUserColumns : rentUserColumns;
  const formData = activeTab === LEASE_USERS ? initialLeaseFilters : initialRentFilters;

  const handleDeleteConfirm = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const rows = [
    {
      id: 1,
      unit: {
        value: '#SYN-9548699548',
        onClick: () =>
          navigate(
            activeTab === LEASE_USERS ? '/fleet/lease-agreement-overview' : '/fleet/rent-agreement-overview'
          ),
      },
      desc: 'Drive Van',
      schedule: '2020062421',
      account: 'SCH-1234',
      name: 'MSA-5389',
      lease: 'LSE-2025-0012',
      status: { value: 'active' },
      start: 'June 15, 2025',
      terminate: 'May 15, 2025',
      facility: 'May 15, 2025',
      rent_agree: '(5468) Jasper Leo',
      rental: '1234',
      end_date: 'Aug 30, 2025',
    },

    {
      id: 2,
      unit: { value: '#SYN-9548345354' },
      desc: 'Drive Van',
      schedule: '2020062421',
      account: 'SCH-1234',
      name: 'MSA-5389',
      lease: 'LSE-2025-0012',
      status: { value: 'inactive' },
      start: 'June 15, 2025',
      terminate: 'May 15, 2025',
      facility: 'May 15, 2025',
      rent_agree: '(5468) Jasper Leo',
      rental: '1234',
      end_date: 'Aug 30, 2025',
    },
    {
      id: 3,
      unit: { value: '#SYN-3454645476' },
      desc: 'Drive Van',
      schedule: '2020062421',
      account: 'SCH-1234',
      name: 'MSA-5389',
      lease: 'LSE-2025-0012',
      status: { value: 'active' },
      start: 'June 15, 2025',
      terminate: 'May 15, 2025',
      facility: 'May 15, 2025',
      rent_agree: '(5468) Jasper Leo',
      rental: '1234',
      end_date: 'Aug 30, 2025',
    },
  ];

  return (
    <div className="agreements">
      <div className="agreements__actions-container">
        <div style={{ display: 'flex', gap: 20 }}>
          <SearchBar placeholder="Search" />
          <Tabs options={tabs} activeTab={activeTab} onChange={val => setActiveTab(val)} />
        </div>

        <div className="flex-align-center right-section">
          {activeTab === RENT_USERS && (
            <div className="edit-actions-container">
              <Typography variant="body2" fontWeight={500}>
                Actions
              </Typography>

              <div className="actions">
                <img src={EditIcon} style={{ height: 25 }} />
              </div>

              <div className="actions">
                <img
                  src={DeleteIcon}
                  style={{ height: 25 }}
                  onClick={() => setIsDeleteConfirmationOpen(true)}
                  alt="Delete"
                />
              </div>
            </div>
          )}
          <Button
            size="fit"
            variant="outline"
            icon={<img className={showFilters ? 'filter-icon' : ''} src={FilterIcon} />}
            onClick={() => setShowFilters(!showFilters)}
            classValue={`filter-btn ${showFilters ? 'active' : ''}`}
          >
            Filter
          </Button>

          <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
            Download
          </Button>

          <ManageColumns
            columns={columns}
            onApply={data => {
              if (activeTab === LEASE_USERS) {
                setLeaseUserColumns(data);
              } else {
                setRentUserColumns(data);
              }
            }}
          />
        </div>
      </div>

      <motion.div
        className="agreements__filters-wrapper"
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
          <DynamicForm formData={formData} className="agreements__filter-inputs-container" />

          <Button size="md" classValue="search-btn">
            Search
          </Button>
        </Stack>
      </motion.div>

      <div className="agreements__table-section">
        <Table columns={columns.filter(item => !item?.hide)} rows={rows} totalRecords={20} />
      </div>

      {isDeleteConfirmationOpen && (
        <ConfirmationModal
          name="lease agreement"
          open={isDeleteConfirmationOpen}
          onClose={() => setIsDeleteConfirmationOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default Agreements;

function UserStatus({ value }: { value: string }) {
  const statusMap: Record<string, { label: string; textColor: string; bgColor: string }> = {
    active: {
      label: 'Active',
      textColor: '#3DB00D',
      bgColor: '#D9F2CE',
    },
    suspended: {
      label: 'Under Review',
      textColor: '#E28221',
      bgColor: '#F2E3D4',
    },
    inactive: {
      label: 'Inactive',
      textColor: '#B91B1E',
      bgColor: '#F0CECE',
    },
  };

  const status = statusMap[value] ?? {
    label: 'Unknown',
    textColor: '#000',
    bgColor: '#eee',
  };

  return <StatusChip label={status.label} textColor={status.textColor} bgColor={status.bgColor} />;
}

type agreementUnitProps = {
  value: string;
  onClick: () => void;
};

function AgreementUnit({ value, onClick }: agreementUnitProps) {
  // const handleClick = () => {
  //   navigate(
  //     selectedTab === LEASE_USERS ? '/lease-agreement-overview' : '/rent-agreement-overview'
  //   );
  // };

  return (
    <div
      className="flex-align-center agreements__user-name clickable-unit"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      {value}
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
