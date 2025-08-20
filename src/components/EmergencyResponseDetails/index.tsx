import React from 'react'
import "./styles.scss";
import DetailedOverview from '../DetailedOverview';
import { emergencyResponseOverviewData } from '@/helpers/mock';
import { Typography } from '@mui/material';
import Table from '@/components/Table';
import File from '@/assets/file.svg';
import gpsLocation from "@/assets/gpsLocation.jpeg";
import truck from "@/assets/truckImage.png";




const communicationColumns = [
  { field: 'date', label: 'Date /Time' },
  { field: 'type', label: 'Type' },
  { field: 'fromTo', label: 'From / To' },
  { field: 'summary', label: 'Summary' },
];

const communicationRows = [
  {
    date: 'Jul 4, 10:00AM',
    type: 'SMS',
    fromTo: 'Vendor → Driver',
    summary: 'On my way',
  },
];

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
}) => (
  <div className="emergency-response_communication-card">
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }} className="emergency-response_communication-card-details">
      {icon && <img src={icon} className="emergency-response_communication-icon" alt="icon" />} {title}
    </Typography>
    <div className="emergency-response_communication-content">{children}</div>
  </div>
);
function EmergencyResponseDetails() {
  return (
    <div className='emergency-response-details'>
        <DetailedOverview data={emergencyResponseOverviewData} />
         <Typography variant="subtitle1" sx={{ fontWeight: 600,marginTop:'20px' }} className="uploads-title">
      Uploads
    </Typography>
    <div className="upload-resolution-container">

  {/* Left side - Uploads */}
  <div className="uploads-section">
    <div className="uploads-content-row">
      {/* Uploaded Photos */}
      <div className="upload-block">
        <Typography variant="body1" sx={{ fontWeight: 500, marginBottom: 1 }}>
          Uploaded Photos
        </Typography>
        <div className="photo-container">
          <img src={truck} alt="Truck 1" />
          <img src={truck} alt="Truck 2" />
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="upload-block">
        <Typography variant="body1" sx={{ fontWeight: 500, marginBottom: 1 }}>
          Uploaded Documents
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Documents.pdf
        </Typography>
      </div>
    </div>
  </div>

  {/* Right side - Resolution Notes */}
  <div className="resolution-notes">
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      Resolution Notes
    </Typography>
    <div className="notes-content">
      <div className="note-row">
        <span>Resolved By</span>
        <span className="note-value">John Doe</span>
      </div>
      <div className="note-row">
        <span>Resolved On</span>
        <span className="note-value">June 2, 2025 - 10:12 AM</span>
      </div>
      <div className="note-row">
        <span>Technician Notes</span>
        <span className="note-value">“Tire replaced on-site using spare. Checked tire for pressure. All clear.”</span>
      </div>
    </div>
  </div>
</div>


        <div className='emergency-response-gpslocation'>
  <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600 }}
            className="emergency-response__title"
          >
            GPS Location
          </Typography>
            {/* Displaying the image */}
        <img
          src={gpsLocation}
          alt="GPS Location"
          style={{
            width: '100%',
            maxWidth: '100%',
            marginTop: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}
        />

        </div>
         <SectionCard icon={File} title="Communication Log">
        {/* <div style={{marginTop:20, height:150}}> */}
      <Table
  columns={communicationColumns}
  rows={communicationRows}
  totalRecords={communicationRows.length}
  checkboxSelection={false}
  disableSortBy={true}
  clickableField=""
  height={150} // or any smaller value like 100
/>
        {/* </div> */}
      </SectionCard>




    </div>
  )
}

export default EmergencyResponseDetails
