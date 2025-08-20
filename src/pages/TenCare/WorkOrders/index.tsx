import { useState, useEffect } from 'react';
import './styles.scss';
import Table from '@/components/Table';
import ManageColumns from '@/components/ManageColumns';
import { FaCircle } from 'react-icons/fa';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import StatusChip from '@/components/StatusChip';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { Stack, Typography } from '@mui/material';

const initialColumns = [
  { label: 'Work Order ID', field: 'workOrderId' },
  { label: 'Equipment ID', field: 'equipmentId' },
  {
    label: 'Status',
    field: 'status',

    renderComponent: (props: { label: string; textColor: string; bgColor: string }) => (
      <StatusChip label={props.label} textColor={props.textColor} bgColor={props.bgColor} />
    ),
  },
  { label: 'Opened Date', field: 'openedDate' },
  { label: 'ETA', field: 'eta' },
  { label: 'Vendor Assigned', field: 'vendorAssigned' },
  { label: 'Priority', field: 'priority' },
];

const formData: TFormData = [
  {
    label: 'Work Order ID',
    name: 'workOrderId',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'Equipment ID', name: 'equipmentId', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'Status',
    name: 'status',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  {
    label: 'Opened Date',
    name: 'openedDate',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'ETA', name: 'eta', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'Vendor Assigned',
    name: 'vendorAssigned',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'Priority', name: 'priority', type: 'textInput', props: { placeholder: ' ' } },
];

function WorkOrders() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleWorkOrderClick = () => {
    navigate('/ten-care/work-order-overview');
  };

  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: 1,
    workOrderId: 'INSP-6240',
    equipmentId: 'Trailer #TX-3471',
    status: {
      label: 'Inprogress',
      textColor: '#E28221',
      bgColor: '#F2E3D4',
    },

    openedDate: 'Acme Freight Co.',
    eta: 'Travelers Insurance',
    vendorAssigned: 'Liability',
    priority: 'Jan 1 – Dec 31, 2025',
  }));

  return (
    <div className="work-orders">
      <div className="work-orders__actions-container">
        <div className="flex-align-center right-section">
          <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
            Download as CSV
          </Button>
          <Button
            size="fit"
            variant="outline"
            classValue={`filter-btn ${showFilters ? 'active' : ''}`}
            icon={<img className={showFilters ? 'filter-icon' : ''} src={FilterIcon} />}
            onClick={() => setShowFilters(!showFilters)}
            icon={<img src={FilterIcon} />}
          >
            Filter
          </Button>
          <ManageColumns columns={initialColumns} />
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

          <Button size="md" classValue="search-btn">
            Search
          </Button>
        </Stack>
      </motion.div>

      <Table
        columns={initialColumns.filter(item => !item?.hide)}
        rows={rows}
        cellPadding={'0.5em'}
        clickableField={'workOrderId'}
        onClick={handleWorkOrderClick}
      />
    </div>
  );
}

export default WorkOrders;
