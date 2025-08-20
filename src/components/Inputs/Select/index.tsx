import * as MUI from '@mui/material';
import { useMemo } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

type props = {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  options: { label: string; value: string }[];
  name: string;
  value: string | { [key: string]: string };
  error?: string | { [key: string]: string };
  onChange?: (name: string, value: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
};

function Select({
  label,
  isRequired = false,
  placeholder,
  options = [],
  name,
  value,
  error,
  disabled = false,
  onChange = () => null,
  size = 'medium',
}: props) {
  const inputValue = typeof value === 'string' ? value : value?.[name] || '';
  const inputError = typeof error === 'string' ? error : error?.[name] || '';

  const CustomSelect = useMemo(() => {
    return MUI.styled(MUI.Select)({
      border: 'var(--input-border)',
      borderRadius: 'var(--input-border-radius)',
      backgroundColor: '#fff',

      fieldset: {
        border: 'none',
      },

      '.MuiInputBase-input': {
        padding: size === 'small' ? '0.4em 0.8em' : '0.45em 0.8em',
        fontSize: 'var(--input-font-size)',
        fontFamily: 'var(--input-font-family)',
      },

      '.MuiSelect-icon': {
        top: '16%',
      },
    });
  }, [size]);

  return (
    <div className="input-container">
      {label && (
        <label>
          {label} {isRequired && <span>*</span>}
        </label>
      )}

      <CustomSelect
        fullWidth
        IconComponent={props => <RiArrowDownSLine color="#00000090" size={24} {...props} />}
        MenuProps={{ PaperProps: { sx: dropdownStyles } }}
        value={!inputValue ? 'placeholder' : inputValue}
        disabled={disabled}
        onChange={e => onChange(name, e.target.value as string)}
      >
        <MUI.MenuItem value="placeholder" sx={{ display: 'none' }}>
          <span style={{ color: 'var(--color-input-placeholder)' }}>
            {placeholder ? placeholder : 'Select Option'}
          </span>
        </MUI.MenuItem>

        {options.map((option, index) => (
          <MUI.MenuItem key={index} value={option?.value} disableRipple style={menuItemStyles}>
            {option?.label}
          </MUI.MenuItem>
        ))}
      </CustomSelect>

      <div className="input-error">
        {inputError === 'required' ? `${label} is required` : inputError}
      </div>
    </div>
  );
}

export default Select;

const dropdownStyles = {
  marginTop: 0.8,
  border: '1px solid var(--color-input-border)',
  boxShadow: 'none',
  padding: '0 5px',
  borderRadius: 'var(--input-border-radius)',
  // maxHeight: 300,
};

const menuItemStyles = {
  fontFamily: 'var(--input-font-family)',
  fontSize: '0.85rem',
  borderRadius: 5,
};
