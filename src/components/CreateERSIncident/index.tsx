import { FC } from 'react';
import Popup from '../Popup';
import './styles.scss';
import Button from '../Button';
import { useState } from 'react';
import Input from '../Form/Input';
import DatePicker from '../Form/DatePicker';
import CustomDropdown from '../Form/Dropdown';
import FileUpload from '../Form/FileUpload';
import { Stack } from '@mui/material';

interface CreateERSIncident {
  onClose?: () => void;
}

const CreateERSIncident: FC<CreateERSIncident> = ({ onClose = () => {} }) => {
  return (
    <Popup title="Create Estimate" onClose={onClose} >
      <div className="create-ers-incident">
        <div className="create-ers-incident__form-container">
        <Input type="text" label="ERS Case ID" isRequired  />
        <CustomDropdown label="Estimated Time of Arrival" required  />

        <CustomDropdown label="Equipment ID" required  />
        <FileUpload  label="Upload" isRequired />

        <Input type="text" label="Location" isRequired  />
        <CustomDropdown label="Status" required  />

        <CustomDropdown label="Event Type" required  />
        <Input type="text" label="Time Stamp" isRequired  />

        <CustomDropdown label="Vendor Name"  />
    </div>
        <div className="create-estimate__button-bg-container">
          <Button color="primary" size="sm">
            Save
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default CreateERSIncident;
