import React, { useState } from 'react';
import './styles.scss';
import Tabs from '@/components/Tabs';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from '@/components/Button';
import { BsDownload } from "react-icons/bs";
import ManageColumns from "@/components/ManageColumns";
import Table from '@/components/Table';
import StatusChip from '@/components/StatusChip';
import FilterIcon from '@/assets/filterIcon.svg';
import { useNavigate } from 'react-router-dom';

const EmergencyResponsiveService = () => {
   const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hide');

  const tabOptions = [
    { label: 'Hide Completed', value: 'hide', icon:FaEyeSlash },
    { label: 'Show Completed', value: 'show', icon:FaEye},
  ];
  const columns:any = [
    { field: "ersCaseId", label: "ERS Case Id", hide: false },
    { field: "equipmentId", label: "Equipment Id", hide: false },
    { field: "location", label: "Location", hide: false },
    { field: "createdTime", label: "Created Time", hide: false },
    { field: "eta", label: "ETA", hide: false },
    { field: "eventType", label: "Event Type", hide: false },
    { field: "status", label: "Status", hide: false },
  ];
  const  handleEmergencyResponseDetailsClick = () => (
    navigate('/ten-care/emergency-response-service-details')
  );
const columnsData: any = [
 {
  field: "ersCaseId",
  label: "ERS Case ID",
},
  { field: "equipmentId", label: "Equipment ID" },
  { field: "location", label: "Location" },
  { field: "createdTime", label: "Created Time" },
  { field: "eta", label: "ETA" },
  { field: "eventType", label: "Event Type" },
  {
    field: "status",
    label: "Status",
    renderComponent: (props: {
      label: string;
      textColor: string;
      bgColor: string;
    }) => (
      <StatusChip
        label={props.label}
        textColor={props.textColor}
        bgColor={props.bgColor}
      />
    ),
  },
];

const rows = [
  {
    id: 1,
    ersCaseId: "ERS-10923",
    equipmentId: "TNX4223456",
    location: "12 Washington Square",
    createdTime: "Jul 10, 2025, 9:46 AM",
    eta: "Jul 14, 2025, 10:45 AM",
    eventType: "Flat Tire",
     status: {
      label: "Inprogress",
      textColor: "#E28221",
      bgColor: "#F2E3D4"
    }
  },
  {
    id: 2,
    ersCaseId: "ERS-10924",
    equipmentId: "TNX4223648",
    location: "12 Sidney, Texas.",
    createdTime: "Jul 12, 2025, 11:22 AM",
    eta: "Jul 16, 2025, 3:32 PM",
    eventType: "Lights",
    status: {
      label: "Cancelled",
      textColor: "#B91B1E",
      bgColor: "#F0CECE"
    }
  }
];
  const handleApplyColumns = (updatedColumns:any) => {
    console.log("Updated Columns:", updatedColumns);
    // You can save this in state and use to filter visible columns
  };

  return (
  <>
      <div className="emeregency-response-container__header-portion">
          <Tabs
          options={tabOptions}
          activeTab={activeTab}
          onChange={setActiveTab}
          className=""
           variant = "secondary"
        />
         <Button size="fit" variant="outline" icon={<img src={FilterIcon} />}>
            Filter
          </Button>
        <Button size='fit' variant='filled' shape='square' color='primary'  icon={<BsDownload size={16} />} iconPosition='right'
    classValue = ""
    weight = "normal"
    disabled={false}
    children ='Download'/>
    <ManageColumns columns={columns} onApply={handleApplyColumns}  />
      </div>
<div className='emeregency-response-container__body-content'>
<Table
  columns={columnsData}
  rows={rows}
  totalRecords={rows.length}
  checkboxSelection={true}
  disableSortBy={false}
   clickableField={'ersCaseId'}
  onClick={handleEmergencyResponseDetailsClick}

/>
</div>

    </>
  );
};

export default EmergencyResponsiveService;

