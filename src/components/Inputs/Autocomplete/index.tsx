import React, { useMemo } from 'react';
import * as MUI from '@mui/material';
import './styles.scss';
import { RiArrowDownSLine } from 'react-icons/ri';

type omitProps = 'options' | 'onChange' | 'value' | 'renderInput';

type TProps = Omit<React.ComponentProps<typeof MUI.Autocomplete>, omitProps> & {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  options: { label: string; value: string }[];
  name: string;
  value: string | { [key: string]: string };
  error?: string | { [key: string]: string };
  onChange?: (name: string, value: string) => void;
};

function Autocomplete({
  label = '',
  isRequired = false,
  options = [],
  error,
  name = '',
  value = '',
  placeholder,
  onChange = () => null,
  ...rest
}: TProps) {
  const inputValue = typeof value === 'string' ? value : value?.[name] || '';
  const inputError = typeof error === 'string' ? error : error?.[name] || '';

  const selected = useMemo(() => {
    return options.find(item => item.value === inputValue);
  }, [value]);

  function handleChange(data: any) {
    onChange(name, data?.value);
  }

  return (
    <div className="input-container autocomplete-input">
      <label>
        {label} {isRequired && <span>*</span>}
      </label>
      <CustomAutocomplete
        fullWidth
        renderInput={params => (
          <MUI.TextField {...params} placeholder={placeholder ? placeholder : 'Select an option'} />
        )}
        popupIcon={<RiArrowDownSLine />}
        slots={{ paper: ({ children }) => <CustomPaper>{children}</CustomPaper> }}
        options={options}
        value={selected || null}
        onChange={(_, value) => handleChange(value)}
        {...rest}
      />

      <div className="input-error">
        {inputError === 'required' ? `${label} is required` : inputError}
      </div>
    </div>
  );
}

export default Autocomplete;

const CustomAutocomplete = MUI.styled(MUI.Autocomplete)({
  border: 'var(--input-border)',
  borderRadius: 'var(--input-border-radius)',
  backgroundColor: '#fff',

  fieldset: {
    border: 'none',
  },

  '.MuiInputBase-root': {
    padding: '0.05em 0.5em',
    fontSize: 'var(--input-font-size)',
    fontFamily: 'var(--input-font-family)',
  },
});

const CustomPaper = MUI.styled(MUI.Paper)({
  marginTop: 8,
  border: '1px solid var(--color-input-border)',
  borderRadius: 'var(--input-border-radius)',
  fontSize: '0.85rem',
  fontFamily: 'var(--input-font-family)',
  padding: '0 5px',

  '.MuiAutocomplete-option[aria-selected="true"]': {
    backgroundColor: 'var(--input-selected)',

    '&.Mui-focused': {
      backgroundColor: 'var(--color-input-selected)',
    },
  },

  '.MuiAutocomplete-option': {
    borderRadius: 5,
  },
});
