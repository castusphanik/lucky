import './styles.scss';
import { paymentOverviewData, requestServiceDetailViewData } from '@/helpers/mock';
import logo from '@/assets/TenLogo.svg';
import { Stack, Typography } from '@mui/material';

import { FiDownload } from 'react-icons/fi';
import DetailedOverview from '@/components/DetailedOverview';
import Button from '@/components/Button';

function RequestServiceHistoryDetailView() {
  return (
    <div className="request-service-details">
      <div className="request-service-details__header">
        <img src={logo} />
      </div>

      <Typography variant="h6">Service Request Details</Typography>

      <DetailedOverview
        data={requestServiceDetailViewData}
        className="detailed-overview--single-column"
      />

      <div></div>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        marginTop={2}
        justifyContent="flex-end"
      >
        <Button size="fit" icon={<FiDownload size={18} />} iconPosition="right">
          Download to PDF
        </Button>
      </Stack>
    </div>
  );
}

export default RequestServiceHistoryDetailView;
