import './styles.scss';
import Button from '@/components/Button';
import ManageColumns from '@/components/ManageColumns';
import Table from '@/components/Table';
import { requestServiceHistoryRows } from '@/helpers/mock';
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const initialColumns = [
  { label: 'Trailer', field: 'trailer' },
  { label: 'Submitted On', field: 'submitted_on' },
  { label: 'Submitted By', field: 'submitted_by' },
  { label: 'Issue', field: 'issue' },
  { label: 'Repaired By', field: 'repaired_by' },
  { label: 'Location', field: 'location' },
];

const formData: TFormData = [
  { label: 'Trailer', name: 'trailer', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Submitted On', name: 'submitted_on', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Submitted By', name: 'submitted_by', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Issue', name: 'issue', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Repaired By', name: 'repaired_by', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Location', name: 'location', type: 'textInput', props: { placeholder: ' ' } },
];

function RequestServiceHistory() {
  const navigate = useNavigate();
  const [columns, setColumns] = useState(initialColumns);
  const [showFilters, setShowFilters] = useState(false);

  const handleRequestDetails = () => navigate('/ten-care/request-service-history-detail-view');

  return (
    <div className="request-service-history">
      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        mb={2}
        className="request-service-history__actions-container"
      >
        <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
          Download
        </Button>

        <Button
          size="fit"
          variant="outline"
          icon={<img className={showFilters ? 'filter-icon' : ''} src={FilterIcon} />}
          onClick={() => setShowFilters(!showFilters)}
          classValue={`filter-btn ${showFilters ? 'active' : ''}`}
        >
          Filter
        </Button>

        <ManageColumns columns={columns} onApply={data => setColumns(data)} />
      </Stack>

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
        columns={columns}
        rows={requestServiceHistoryRows}
        height={'calc(100vh - 185px)'}
        clickableField={'trailer'}
        onClick={handleRequestDetails}
      />
    </div>
  );
}

export default RequestServiceHistory;
