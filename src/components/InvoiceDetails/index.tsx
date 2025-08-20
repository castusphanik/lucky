import React from 'react'
import "./styles.scss";
import DetailedOverview from '../DetailedOverview';
import { invoiceOverviewData, invoicePaymentOverviewData } from '@/helpers/mock';
import logo from "../../assets/TenLogo.svg";
import { Stack, Typography } from '@mui/material';
import Button from '../Button';
import { FiDownload } from 'react-icons/fi';
import Table from '../Table';

const invoiceDetailsColumns=[
  {label:"Description",field:"description"},
  {label:"Qty",field:"quantity"},
  {label:"Rate",field:"rate"}
]

const invoiceDetailsRows = [
  {id:1,description:"Lorem Ipsum is dummy text of printing and typesetting industry",quantity:"24",rate:"$15.00"}
]

function InvoiceDetails() {
  return (
    <div className='invoice-details'>
        <div className='header'>
            <img src={logo} />
            <Stack  >
                <Typography variant='body2'>Invoice Number</Typography>
                <Typography fontWeight={600}>TENX25433536</Typography>
            </Stack>
        </div>
        <DetailedOverview data={invoiceOverviewData} />
        <Stack mt={2} mb={2}>
        <Table checkboxSelection={false} columns={invoiceDetailsColumns} rows={invoiceDetailsRows}  />
        </Stack>
         <DetailedOverview data={invoicePaymentOverviewData}  className='single-child' />
        <Stack direction="row" alignItems="center" mt={2} spacing={1}  justifyContent="flex-end">
            <Button size='fit' icon={<FiDownload size={18} />} iconPosition='right'>Download Official Invoice</Button>
            <Button size='fit'>Pay Now</Button>
        </Stack>
    </div>
  )
}

export default InvoiceDetails