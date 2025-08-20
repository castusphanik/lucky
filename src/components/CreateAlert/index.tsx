import React, { useState } from 'react';
import StepperPopup from '@/components/StepperPopup';
import SearchBar from '../SearchBar';
import { Typography } from '@mui/material';
import Input from '../Form/Input';
import './styles.scss';
import CustomDropdown from '../Form/Dropdown';
import DatePicker from '../Form/DatePicker';

const fromOptions = ['10AM', '11AM', '12AM'];
const toOptions = ['10AM', '11AM', '12AM'];
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const deliveryOptions = ['Text', 'Email', 'In portal', 'Webhook'];

type AlertProps = {
  open: boolean;
  onClose: () => void;
};

const CreateAlert = ({ open, onClose }: AlertProps) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  const handleInputChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const steps = [
    {
      number: 1,
      label: 'Event',
      content: (
        <div>
          <SearchBar />
        </div>
      ),
    },
    {
      number: 2,
      label: 'Period',
      content: (
        <div className="period">
          <Typography variant="body1" fontWeight={500} mb={3}>
            Please Select Period
          </Typography>

          {/* Between Hours */}
          <div className="period__row">
            <div className="period__checkbox-group">
              <input type="checkbox" id="between-hours" defaultChecked />
              <label htmlFor="between-hours">
                <Typography variant="body2">Between Hours:</Typography>
              </label>
            </div>
            <div className="period__inputs">
              <CustomDropdown
                options={fromOptions}
                value={formValues.from || ''}
                onChange={val => handleInputChange('from', val as string)}
                placeholder="Select From"
              />
              <CustomDropdown
                options={toOptions}
                value={formValues.to || ''}
                onChange={val => handleInputChange('to', val as string)}
                placeholder="Select To"
              />
            </div>
          </div>

          {/* Specific Days */}
          <div className="period__row">
            <div className="period__checkbox-group">
              <input type="checkbox" id="specific-days" defaultChecked />
              <label htmlFor="specific-days">
                <Typography variant="body2">Specific Days:</Typography>
              </label>
            </div>
            <div className="period__inputs">
              <CustomDropdown
                options={weekdays}
                value={formValues.day || ''}
                onChange={val => handleInputChange('day', val as string)}
                placeholder="Select Weekday"
                multiSelect="true"
              />
            </div>
          </div>

          {/* Start / End Date */}
          <div className="period__row">
            <div className="period__checkbox-group">
              <input type="checkbox" id="start-end-date" defaultChecked />
              <label htmlFor="start-end-date">
                <Typography variant="body2">Start / End Date:</Typography>
              </label>
            </div>
            <div className="period__inputs">
              <DatePicker isRequired placeholder="Select From Date" name="fromDate" />
              <DatePicker isRequired placeholder="Select To Date" name="toDate" />
            </div>
          </div>

          {/* Event Duration */}
          <div className="period__row">
            <div className="period__checkbox-group">
              <input type="checkbox" id="event-duration" defaultChecked />
              <label htmlFor="event-duration">
                <Typography variant="body2">Event Duration:</Typography>
              </label>
            </div>
            <div className="period__inputs">
              <Input type="text" placeholder="Idle trailer" name="eventDuration" />
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      label: 'Equipment',
      content: (
        <div>
          <Typography variant="body1" fontWeight={600} mb={2}>
            Please Select Equipment
          </Typography>
          <div style={{ marginTop: '15px' }}>
            <label>
              <input type="radio" name="equipment" value="accounts" defaultChecked /> Accounts
            </label>

            <label style={{ marginLeft: '20px' }}>
              <input type="radio" name="equipment" value="trailers" /> Individual Trailers
            </label>
          </div>
        </div>
      ),
    },
    {
      number: 4,
      label: 'Delivery Method & Recipients',
      content: (
        <div className="delivery-method">
          <div>
            <Typography variant="label2" fontWeight={600}>
              Please Select Delivery Method
            </Typography>
            <CustomDropdown
              options={deliveryOptions}
              value={formValues.to || ''}
              onChange={val => handleInputChange('to', val as string)}
              placeholder="Select Delivery Method"
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <Input
              label="Please Enter Recipients"
              isRequired
              type="text"
              placeholder="Enter Recipients"
              name="recipients"
            />
          </div>
        </div>
      ),
    },
    {
      number: 5,
      label: 'Delivery Frequency',
      content: (
        <div className='delivery-frequency'>
          <Typography variant="body1" fontWeight={500} mb={3}>
            Please Select Delivery Frequency
          </Typography>

          <div className='delivery-frequency__check-box-container'>
            <div className="period__checkbox-group">
              <input type="checkbox" id="between-hours" defaultChecked />
              <label htmlFor="between-hours">
                <Typography variant="body2">As it happens</Typography>
              </label>
            </div>

            <div className="period__checkbox-group">
              <input type="checkbox" id="between-hours" defaultChecked />
              <label htmlFor="between-hours">
                <Typography variant="body2">Once Per Day</Typography>
              </label>
            </div>

            <div className="period__checkbox-group">
              <input type="checkbox" id="between-hours" defaultChecked />
              <label htmlFor="between-hours">
                <Typography variant="body2">Once Per Week</Typography>
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 6,
      label: 'Preview',
      content: (
        <div className="preview">
          <Typography variant="body2" mb={2} fontWeight={600} className="preview__title">
            Please confirm your selections before you clicking on submit
          </Typography>

          <div className="preview__row">
            <Typography variant="body2" className="preview__label">
              Selected Event:
            </Typography>
            <Typography variant="body2" className="preview__value">
              {formValues.event || '—'}
            </Typography>
          </div>

          <div className="preview__row">
            <Typography variant="body2" className="preview__label">
              Selected Period:
            </Typography>
            <Typography variant="body2" className="preview__value">
              {formValues.period || '—'}
            </Typography>
          </div>

          <div className="preview__row">
            <Typography variant="body2" className="preview__label">
              Selected Equipment:
            </Typography>
            <Typography variant="body2" className="preview__value">
              {formValues.equipment || '—'}
            </Typography>
          </div>

          <div className="preview__row">
            <Typography variant="body2" className="preview__label">
              Selected Delivery Method:
            </Typography>
            <Typography variant="body2" className="preview__value">
              {formValues.deliveryMethod || '—'}
            </Typography>
          </div>

          <div className="preview__row">
            <Typography variant="body2" className="preview__label">
              Entered Recipients:
            </Typography>
            <Typography variant="body2" className="preview__value">
              {formValues.recipients || '—'}
            </Typography>
          </div>

          <div className="preview__row">
            <Typography variant="body2" className="preview__label">
              Selected Delivery Frequency:
            </Typography>
            <Typography variant="body2" className="preview__value">
              {formValues.deliveryFrequency || '—'}
            </Typography>
          </div>
        </div>
      ),
    },
  ];

  return <StepperPopup open={open} onClose={onClose} title="Create Alert" steps={steps} />;
};

export default CreateAlert;
