import React from 'react';
import './styles.scss';
import { Typography } from '@mui/material';
import ShieldIcon from '@/assets/shield.svg';
import FileIcon from '@/assets/file.svg';
import EyeIcon from '@/assets/Icons/EyeIcon.png';
import EditIcon from '@/assets/Icons/EditIcon.png';
import ReplaceIcon from '@/assets/Icons/ReplaceIcon.png';
import PhoneIcon from '@/assets/Icons/PhoneIcon.png';

type InsuranceInfo = {
  policyNumber: string;
  insuranceContact: string;
  coverage: string;
  effectiveDates: string;
  policyStatus: string;
  notes?: string;
};

type DocumentInfo = {
  fileName: string;
  fileType: string;
  uploadedBy: string;
  uploadedDate: string;
};

type Props = {
  insuranceInfo: InsuranceInfo;
  documentInfo?: DocumentInfo;
  showActions?: boolean;
};

const InsuranceDetails: React.FC<Props> = ({ insuranceInfo, documentInfo, showActions }) => {
  return (
    <div className="insurance-details">
      {/* Policy Info Card */}
      <div className="card">
        <div className="card__header">
          <img src={ShieldIcon} alt="Policy" />
          <Typography className="card__title">Policy Info</Typography>
        </div>

        <div className="card__grid">
          <div>
            <label>Policy Number</label>
            <p>{insuranceInfo.policyNumber}</p>
          </div>
          <div>
            <label>Insurance Provider Name & Contact</label>
            <p>{insuranceInfo.insuranceContact}</p>
          </div>
          <div>
            <label>Coverage Type & Limits</label>
            <p>{insuranceInfo.coverage}</p>
          </div>
          <div>
            <label>Effective Dates (Start – End)</label>
            <p>{insuranceInfo.effectiveDates}</p>
          </div>
          <div>
            <label>Policy Status</label>
            <p>{insuranceInfo.policyStatus}</p>
          </div>
          <div>
            <label>Notes or Exclusions</label>
            <p>{insuranceInfo.notes || 'None Specified'}</p>
          </div>
        </div>
      </div>

      {/* Document Info Card */}
      {documentInfo && (
        <div className="card">
          <div className="card__header">
            <img src={FileIcon} alt="File" />
            <Typography className="card__title">Uploaded Documents</Typography>
          </div>

          <div className="card__grid">
            <div>
              <label>File Name</label>
              <p>{documentInfo.fileName}</p>
            </div>
            <div>
              <label>File Type</label>
              <p>{documentInfo.fileType}</p>
            </div>
            <div>
              <label>Uploaded By</label>
              <p>{documentInfo.uploadedBy}</p>
            </div>
            <div>
              <label>Uploaded Date</label>
              <p>{documentInfo.uploadedDate}</p>
            </div>
          </div>

          {showActions && (
            <div className="card__actions">
              <div className="card__action">
                <img src={EyeIcon} /> View Document
              </div>
              <div className="card__action">
                <img src={EditIcon} /> Edit Document
              </div>
              <div className="card__action">
                <img src={EditIcon} /> Download Document
              </div>
              <div className="card__action">
                <img src={ReplaceIcon} /> Replace Document
              </div>
              <div className="card__action">
                <img src={PhoneIcon} /> Contact Help Desk
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsuranceDetails;
