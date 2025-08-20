import "./styles.scss";
import DetailedOverview from '../DetailedOverview';
import {paymentOverviewData } from '@/helpers/mock';
import logo from "../../assets/TenLogo.svg";
import { Stack, Typography } from '@mui/material';
import Button from '../Button';
import { FiDownload } from 'react-icons/fi';

function PaymentDetails() {
  return (
    <div className='payment-details'>
        <div className='header'>
            <img src={logo} />
            <Stack  >
                <Typography variant='body2'>Invoice Number</Typography>
                <Typography fontWeight={600}>TENX25433536</Typography>
            </Stack>
        </div>
        <DetailedOverview data={paymentOverviewData} />
        <Stack direction="row" alignItems="center" spacing={1}  justifyContent="flex-end" mt={2}>
            <Button size='fit' icon={<FiDownload size={18} />} iconPosition='right'>Download Official Invoice</Button>
            <Button size='fit'>Pay Now</Button>
        </Stack>
    </div>
  )
}

export default PaymentDetails