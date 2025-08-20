import React, { FC } from 'react';
import './styles.scss';
import Button from '../Button';
import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import HorizontalStepper from '../HorizontalStepper';
import Table from '../Table';
import Textarea from '../Form/Textarea';
import { IoTimeOutline } from "react-icons/io5";


const steps = [
  { label: 'Last PM', date: 'Apr 05, 2024', status: 'completed' },
  { label: 'Skipped', status: 'skipped' },
  { label: 'Next PM', date: 'Jul 05, 2024', status: 'active' },
  { label: 'Planned', status: 'upcoming' },
];

const serviceHistoryCols = [
  { label: "Date of Service", field: "dateOfService" },
  { label: "Work Performed", field: "workPerformed" },
  { label: "Location", field: "location" },
  { label: "Vendor/Technician", field: "vendor" },
  { label: "Time Taken", field: "timeTaken" },
  { label: "Parts Replaced", field: "partsReplaced" }
];


const rows = [
  {
    id: 1,
    dateOfService: "June 25,2025",
    workPerformed: "Brake Inspection",
    location: "In-Shop",
    vendor: "John Doe",
    timeTaken: "1 hr",
    partsReplaced: "Brakes Worn"
  },
    {
    id: 2,
    dateOfService: "June 25,2025",
    workPerformed: "Brake Inspection",
    location: "In-Shop",
    vendor: "John Doe",
    timeTaken: "1 hr",
    partsReplaced: "Brakes Worn"
  },
    {
    id: 3,
    dateOfService: "June 25,2025",
    workPerformed: "Brake Inspection",
    location: "In-Shop",
    vendor: "John Doe",
    timeTaken: "1 hr",
    partsReplaced: "Brakes Worn"
  },
    {
    id: 4,
    dateOfService: "June 25,2025",
    workPerformed: "Brake Inspection",
    location: "In-Shop",
    vendor: "John Doe",
    timeTaken: "1 hr",
    partsReplaced: "Brakes Worn"
  },
    {
    id: 5,
    dateOfService: "June 25,2025",
    workPerformed: "Brake Inspection",
    location: "In-Shop",
    vendor: "John Doe",
    timeTaken: "1 hr",
    partsReplaced: "Brakes Worn"
  },
];

const accounts = [
  { label: "U85728", value: "U85728" },
  { label: "555366", value: "555366" },
  { label: "555110", value: "555110" },
  { label: "HCCT555144", value: "HCCT555144" },
  { label: "6028121", value: "6028121" },
  { label: "HCCT555010", value: "HCCT555010" }
];

const RequestService = () => {

  
  return (
    <>
      <div className="request-service">
        <div className="request-service__map-container">
        
        </div>
      
        <div className="request-service__body">
        <Stack direction="row" alignItems="center" justifyContent="space-between"   >
            <Typography>PM Schedule</Typography>
            <Button variant="outline" size='md'>Edit Schedule</Button>
        </Stack>
        <HorizontalStepper steps={steps} />
        <Typography>Service History</Typography>
        <Table columns={serviceHistoryCols} rows={rows}  />
        <Stack direction="row" spacing={1} >
            <Typography>Comments</Typography>
            <Stack flex={1}>
            <Textarea  />
            </Stack>
        </Stack>
        <Stack direction="row" justifyContent="space-between" >
          <Typography> <span style={{color:'var(--color-green)'}}> OEM !</span> Warranty</Typography>
          <Typography> <span style={{alignItems:"center"}}><IoTimeOutline /></span> After Hours Service</Typography>
          <Button size="lg">Request Service</Button>
        </Stack>
        </div>
       
      </div>
    </>
  );
};

export default RequestService;