import React from 'react';
import './styles.scss';
import DetailedOverview from '../DetailedOverview';
import { WorkOrderDetailsData } from '@/helpers/mock';
import type { TColumns } from '../Table';
import Table from '../Table';
import { Stack, Typography } from '@mui/material';

const WorkOrderDetails: React.FC = () => {
  const initialColumns: TColumns = [
    { label: 'VRMS', field: 'vrms' },
    { label: 'Description', field: 'description' },
    { label: 'Quantity', field: 'quantity' },
  ];

  const rows = [];

  for (let i = 0; i < 3; i++) {
    const obj = {
      id: i,
      vrms: '123-456-789',
      description: 'Replace brake pads',
      quantity: '10',
    };

    rows.push(obj);
  }

  return (
    <div className="work-order-details">
      <Stack display={'flex'} alignItems={"flex-end"} >
       <Typography variant='body2' >Work Order No</Typography>
       <Typography fontWeight={600}>229494</Typography>
       </Stack>
      <DetailedOverview data={WorkOrderDetailsData} />
      <Stack marginTop={4}>
        <Typography marginBottom={2} fontWeight={600}>Problem Description (Customer/Driver Notes)</Typography>
        <Table
          columns={initialColumns.filter(item => !item?.hide)}
          rows={rows}
          cellPadding={'0.3em'}
          checkboxSelection={false}
          disableSortBy={true}
        />
      </Stack>
    </div>
  );
};

export default WorkOrderDetails;
