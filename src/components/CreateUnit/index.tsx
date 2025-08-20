import React, { FC } from 'react';
import './styles.scss';
import Button from '../Button';
import { useState } from 'react';
import Input from '../Form/Input';
import CustomDropdown from '../Form/Dropdown';
import { CiCamera } from 'react-icons/ci';
import { Stack } from '@mui/material';
import { FiSave } from 'react-icons/fi';
import Tabs from '../Tabs';


const createUnitOptions = [
  { label: 'Specification Details', value: 'Specification Details' },
  { label: 'Contact Details', value: 'Contact Details' },
  { label: 'Compilance Details', value: 'Compilance Details' },
];

const CreateUnit = () => {
  return (
    <>
      <div className="create-unit">
        <Stack direction="row" alignItems="center" spacing={2} className="create-unit__header">
          <CiCamera style={{marginTop:"15px"}}  className="create-unit__camera-icon" color="#ffffff" size={40} />
          <div style={{ flex: 1 }}>
            <Input label="Title Name" isRequired />
          </div>
          <FiSave style={{marginTop:"25px"}} />
        </Stack>
        <div className="create-unit__body">
          <Tabs variant="primary" options={createUnitOptions} />
          <div className="form-container">
            <Input label="Unit Number" isRequired />
            <Input label="VIN#" isRequired />
            <Input label="Make" isRequired />
            <Input label="Year" isRequired />
            <CustomDropdown label="Door Type" placeholder="Select Option" required />
            <CustomDropdown label="Wall Type" placeholder="Select Option" required />{' '}
            <CustomDropdown label="Door Type" placeholder="Select Option" required />{' '}
            <CustomDropdown label="GPS Equipped" placeholder="Select Option" required />{' '}
            <CustomDropdown label="Brake Type" placeholder="Select Option" required />
            <CustomDropdown label="Roof Type" placeholder="Select Option" required />{' '}
            <CustomDropdown label="Trailer Size" placeholder="Select Option" required />{' '}
            <CustomDropdown label="Trailer Length" placeholder="Select Option" required />
            <CustomDropdown label="Status" placeholder="Select Option" required />
            <Input label="Custom" isRequired />
            <Input label="Suspension" isRequired />
            <Input label="Color" isRequired />
            <CustomDropdown label="Floor Type" placeholder="Select Shape" required />
            <CustomDropdown label="Rim Type" placeholder="Select Option" required />
            <CustomDropdown label="Trailer Height" placeholder="Select Option" required />
            <CustomDropdown label="Trailer Width" placeholder="Select Option" required />
            <CustomDropdown label="Date Aquired on" placeholder="Select Option" required />
            <CustomDropdown label="Date In Service" placeholder="Select Option" required />
          </div>
        </div>
        <Stack direction="row" spacing={1} className='create-unit__footer-buttons'>
          <Button color="primary" size="sm">
            Save
          </Button>
          <Button color="light" size="sm">
            Cancel
          </Button>
        </Stack>
      </div>
    </>
  );
};

export default CreateUnit;
