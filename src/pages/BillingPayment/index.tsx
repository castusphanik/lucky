import './styles.scss';
import Table from '@/components/Table';
import ManageColumns from '@/components/ManageColumns';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import { useNavigate } from 'react-router-dom';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

const initialColumns = [
  { label: 'Payment ID', field: 'paymentId' },
  { label: 'Payment Date', field: 'paymentDate' },
  { label: 'Payment Method', field: 'paymentMethod' },
  { label: 'Total Paid', field: 'totalPaid' },
  { label: 'Amount Paid', field: 'amountPaid' },
  { label: 'Due Balance', field: 'balanceDue' },
  { label: 'Invoice Applied To', field: 'invoiceApplied' },
];

const formData: TFormData = [
  {
    label: 'Payment ID',
    name: 'paymentId',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'Payment Date', name: 'paymentDate', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'Payment Method',
    name: 'paymentMethod',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'Amount Paid', name: 'amountPaid', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Due Balance', name: 'balanceDue', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'Invoice Applied To',
    name: 'invoiceApplied',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
];

function BillingPayment() {
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handlePaymentIdClick = () => {
    navigate('/billing/payment-overview');
  };

  const rows = [];

  for (let i = 0; i < 10; i++) {
    const obj = {
      id: i,
      paymentId: 'TENX9548699548',
      paymentDate: 'July 2,2025',
      paymentMethod: 'ACH',
      totalPaid: '$ 125',
      amountPaid: '$ 64',
      balanceDue: '$ 124',
      invoiceApplied: 'INVC424264,INVC424268,INVC424265,',
    };

    rows.push(obj);
  }

  return (
    <div className="billing-payment">
      <div className="billing-payment__actions-container">
        <SearchBar />

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
        clickableField={'paymentId'}
        onClick={handlePaymentIdClick}
      />
    </div>
  );
}

export default BillingPayment;
