import { useState } from 'react';
import './styles.scss';
import type { TColumns } from '@/components/Table';
import Table from '@/components/Table';
import ManageColumns from '@/components/ManageColumns';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import SendMailPopup from '@/components/SendMailPopup';
import { MdOutlineMail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { Stack, Typography } from '@mui/material';

const initialColumns: TColumns = [
  { label: 'Category', field: 'category' },
  { label: 'Report Name', field: 'reportName' },
  { label: 'Frequency', field: 'frequency' },
  { label: 'Format available', field: 'formatAvailable' },
  { label: 'Last Updated', field: 'lastUpdated' },
];

const formData: TFormData = [
  {
    label: 'Category',
    name: 'category',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'Report Name', name: 'reportName', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'Frequency',
    name: 'frequency',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  {
    label: 'Format Available',
    name: 'formatAvailable',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'LAst Updated', name: 'lastUpdated', type: 'textInput', props: { placeholder: ' ' } },
];

function ReportsExplorer() {
  const [openMailPopup, setOpenMailPopup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const handleSendMail = () => {
    setOpenMailPopup(true);
  };

  const handleReportIdClick = () => {
    navigate('/reports/reports-explorer-overview');
  };

  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    category: 'fleet',
    reportName: 'All Fleet',
    frequency: 'Daily',
    formatAvailable: 'CSV',
    lastUpdated: 'July 3, 2025',
  }));

  return (
    <div className="reports-explorer">
      <div className="reports-explorer__actions-container">
        <div className="flex-align-center right-section">
          <Button
            size="fit"
            onClick={handleSendMail}
            iconPosition="right"
            icon={<MdOutlineMail color="#ffffff" />}
          >
            Email a report
          </Button>
          <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
            Download as CSV
          </Button>
          <Button
            size="fit"
            variant="outline"
            classValue={`filter-btn ${showFilters ? 'active' : ''}`}
            icon={<img className={showFilters ? 'filter-icon' : ''} src={FilterIcon} />}
            onClick={() => setShowFilters(!showFilters)}
          // icon={<img src={FilterIcon} />}
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
        clickableField="reportName"
        onClick={handleReportIdClick}
      />

      {openMailPopup && <SendMailPopup onClose={() => setOpenMailPopup(false)} />}
    </div>
  );
}

export default ReportsExplorer;
