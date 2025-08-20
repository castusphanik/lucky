import React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';
import Table from '../Table';
import DetailedOverview from '../DetailedOverview';
import { LeaseOverviewData } from '@/helpers/mock';

const meterColumns = [
  { field: 'currentReading', label: 'Current Reading' },
  { field: 'unit', label: 'Unit' },
  { field: 'lastUpdate', label: 'Last Update' },
  { field: 'source', label: 'Source' },
];

const invoiceColumns = [
  { field: 'invoice', label: 'Invoice' },
  { field: 'date', label: 'Date' },
  { field: 'amount', label: 'Amount' },
  { field: 'status', label: 'Status' },
  { field: 'unit', label: 'Unit' },
  { field: 'po', label: 'PO#' },
];

const LeaseAgreementOverview: React.FC = () => {
  return (
    <div className="lease-agreement">
      <DetailedOverview data={LeaseOverviewData} />

      <div style={{ marginTop: 20 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Meters
        </Typography>

        <Table height={200} columns={meterColumns} />
      </div>

      <div style={{ marginTop: 20 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Invoice Access
        </Typography>
        <Table height={200} columns={invoiceColumns} />
      </div>
    </div>
  );
};

export default LeaseAgreementOverview;
