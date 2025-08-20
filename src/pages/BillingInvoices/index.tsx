import { useState, useEffect } from 'react';
import './styles.scss';
import type { TColumns } from '@/components/Table';
import Table from '@/components/Table';
import ManageColumns from '@/components/ManageColumns';
import { FaCircle } from 'react-icons/fa';
import Button from '@/components/Button';
import { FiDownload } from 'react-icons/fi';
import FilterIcon from '@/assets/filterIcon.svg';
import InvoicePaymentPopup from '@/components/InvoicePaymentPopup';
import { useNavigate } from 'react-router-dom';
import StatusChip from '@/components/StatusChip';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import { motion } from 'framer-motion';
import { Stack, Typography } from '@mui/material';
import InfoCard from '@/components/InfoCard';

const initialColumns: TColumns = [
  { label: 'Invoice Number', field: 'invoiceNumber' },
  { label: 'Invoice Date', field: 'invoiceDate' },
  { label: 'Due Date', field: 'dueDate' },
  { label: 'Account ID', field: 'account' },
  { label: 'Account Name', field: 'name' },
  { label: 'No of Equipment ID (s)', field: 'equipmentIdNum' },
  { label: 'Invoice Type', field: 'invoiceType' },
  { label: 'Balance Due', field: 'balanceDue' },
  {
    field: 'status',
    label: 'Status',
    renderComponent: (props: { label: string; textColor: string; bgColor: string }) => (
      <StatusChip label={props.label} textColor={props.textColor} bgColor={props.bgColor} />
    ),
  },
];

const formData: TFormData = [
  {
    label: 'Invoice Number',
    name: 'invoiceNumber',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  { label: 'Invoice Date', name: 'invoiceDate', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Due Date', name: 'dueDate', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account ID', name: 'account', type: 'textInput', props: { placeholder: ' ' } },
  { label: 'Account Name', name: 'name', type: 'textInput', props: { placeholder: ' ' } },
  {
    label: 'No of Equipment ID (s)',
    name: 'eqipmentIdNum',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  {
    label: 'Invoice Type',
    name: 'invoiceType',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  {
    label: 'Balance Due',
    name: 'balanceDue',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
  {
    label: 'Status',
    name: 'status',
    type: 'textInput',
    props: { placeholder: ' ' },
  },
];

function BillingInvoices() {
  const [openInvoice, setOpenInvoice] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handlePayNow = () => {
    setOpenInvoice(true);
  };

  const handleInvoiceNumberClick = () => {
    navigate('/billing/invoice-overview');
  };

  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    invoiceNumber: `TENX95486995${48 + i}`,
    invoiceDate: 'July 2, 2025',
    dueDate: 'July 23, 2025',
    account: 'DCNT544632848',
    name: 'Max-Alex',
    equipmentIdNum: '24',
    invoiceType: 'Lease',
    balanceDue: '$ 1234',
    status: {
      label: 'Paid',
      textColor: '#3db008',
      bgColor: '#F2E3D4',
    },
  }));

  return (
    <div className="billing-invoices">
      <Stack direction="row" spacing={2}>
        <InfoCard title="All Accounts" value="$173,473.10" variant="simple" />
        <InfoCard title="Current Invoices" value="0" variant="simple" />
        <InfoCard title="Past Due Invoices" value="107" variant="simple" />
        <InfoCard title="Past Due 30+ days" value="107" variant="simple" />
      </Stack>
      <div className="billing-invoices__actions-container">
        <div className="flex-align-center right-section">
          <Button size="fit" onClick={handlePayNow}>
            Pay Now
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
        clickableField="invoiceNumber"
        onClick={handleInvoiceNumberClick}
      />

      {openInvoice && <InvoicePaymentPopup onClose={() => setOpenInvoice(false)} />}
    </div>
  );
}

export default BillingInvoices;


