import React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';
import Table from '../Table';
import DetailedOverview from '../DetailedOverview';
import { rentAgreementOverview } from '@/helpers/mock';

const invoiceColumns = [
  { field: 'invoice', label: 'Invoice' },
  { field: 'date', label: 'Date' },
  { field: 'amount', label: 'Amount' },
  { field: 'status', label: 'Status' },
];



const RentAgreementOverview: React.FC = () => {
  return (
    <div className="lease-agreement">
      <DetailedOverview data={rentAgreementOverview} />

      <div style={{ marginTop: 20 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Invoice Access
        </Typography>

        <Table height={200} columns={invoiceColumns} />
      </div>
    </div>
  );
};

export default RentAgreementOverview;
