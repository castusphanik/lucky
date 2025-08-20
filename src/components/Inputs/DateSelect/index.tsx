import './styles.scss';
import { styled } from '@mui/material';
import { LocalizationProvider, DatePicker, type DateView } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React from 'react';

type TProps = Omit<React.ComponentProps<typeof DatePicker>, 'onChange' | 'value' | 'views'> & {
  label?: string;
  isRequired?: boolean;
  name: string;
  value: string | { [key: string]: string };
  error?: string | { [key: string]: string };
  onChange?: (name: string, value: string) => void;
  views?: DateView[];
};

function DateSelect({
  label,
  isRequired,
  name,
  value,
  error,
  onChange = () => null,
  views = ['year', 'month', 'day'],
  ...rest
}: TProps) {
  const inputValue = typeof value === 'object' ? value?.[name] : value;
  const inputError = typeof error === 'string' ? error : error?.[name] || '';

  return (
    <div className="input-container date-select">
      {label && (
        <label>
          {label} {isRequired && <span>*</span>}
        </label>
      )}

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <CustomDatePicker
          views={views}
          slotProps={{ openPickerButton: { disableRipple: true } }}
          value={!inputValue || inputValue === '' ? null : moment(inputValue)}
          onChange={newValue => onChange(name, moment(newValue).format('YYYY-MM-DD'))}
          {...rest}
        />
      </LocalizationProvider>

      <div className="input-error">
        {inputError === 'required' ? `${label} is required` : inputError}
      </div>
    </div>
  );
}

export default DateSelect;

const CustomDatePicker = styled(DatePicker)({
  width: '100%',
  border: 'var(--input-border)',
  borderRadius: 'var(--input-border-radius)',
  backgroundColor: '#fff',

  fieldset: {
    border: 'none',
  },

  '.MuiInputBase-input': {
    padding: '0.75em 0.8em',
    fontSize: 'var(--input-font-size)',
    fontFamily: 'var(--input-font-family)',
  },

  '.MuiSvgIcon-root': {
    width: '1.3rem',
    height: '1.3rem',
  },
});
