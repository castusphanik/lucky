import * as MUI from '@mui/material';
import { useMemo } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

type props = {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  options: { label: string; value: string | number }[];
  name: string;
  value: { [key: string]: (string | number)[] };
  error?: string | { [key: string]: string };
  onChange?: (name: string, value: (string | number)[]) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
};

function MultiSelect({
  label,
  isRequired = false,
  options = [],
  name,
  value,
  error,
  disabled = false,
  onChange = () => null,
  size = 'medium',
  placeholder = 'Select an option',
}: props) {
  const inputValue = value?.[name] || [];
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

  function handleChange(data: unknown) {
    const selected = Array.isArray(data) ? (data as string[]) : [];

    if (selected.includes('select-all')) {
      if (inputValue.length === options.length) {
        onChange(name, []);
      } else {
        onChange(
          name,
          options.map(option => option.value)
        );
      }
    } else {
      onChange(name, selected);
    }
  }

  const renderValue = (value: unknown) => {
    const selected = Array.isArray(value) ? (value as string[]) : [];

    if (selected.length === 0) return placeholder;

    if (selected.includes('select-all') || selected.length === options.length) {
      return 'All Accounts Selected';
    }

    return `${selected.length} accounts selected`;
  };

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
        value={inputValue}
        disabled={disabled}
        onChange={e => handleChange(e.target.value)}
        multiple
        renderValue={renderValue}
      >
        <MUI.MenuItem disableRipple style={menuItemStyles} value="select-all">
          <input
            className="custom-checkbox"
            type="checkbox"
            checked={inputValue.length === options.length}
            readOnly
          />
          Select All
        </MUI.MenuItem>

        {options.map((option, index) => (
          <MUI.MenuItem key={index} value={option?.value} disableRipple style={menuItemStyles}>
            <input
              className="custom-checkbox"
              type="checkbox"
              checked={inputValue.includes(option.value)}
              readOnly
            />
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

export default MultiSelect;

const dropdownStyles = {
  marginTop: 0.8,
  border: '1px solid var(--color-input-border)',
  boxShadow: 'none',
  padding: '0 5px',
  borderRadius: 'var(--input-border-radius)',
  maxHeight: 300,
};

const menuItemStyles = {
  fontFamily: 'var(--input-font-family)',
  fontSize: '0.8rem',
  borderRadius: 5,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem',
  margin: '4px 0',
};
