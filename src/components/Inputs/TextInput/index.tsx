import './styles.scss';
import React, { useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const textFormats: { [key: string]: RegExp } = {
  number: /\D/g,
  alphabets: /[^a-zA-Z\s]/g,
  alphabetsWithoutSpace: /[^a-zA-Z]/g,
};

type omitProps = 'onChange' | 'value' | 'type';

type textInputProps = Omit<React.ComponentProps<'input'>, omitProps> & {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  name: string;
  value: string | { [key: string]: string };
  error?: string | { [key: string]: string };
  onChange?: (name: string, value: string) => void;
  type?: 'text' | 'password' | 'number';
  format?: 'alphabets' | 'number' | 'currency' | 'alphabetsWithoutSpace';
};

function TextInput({
  label,
  name,
  error,
  placeholder,
  type,
  isRequired,
  value,
  format,
  onChange = () => null,
  ...rest
}: textInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;

    if (format) {
      if (format === 'currency') {
        value = value.replace(textFormats.number, '');
        value = value ? parseFloat(value).toLocaleString() : '';

        onChange(name, value);
      } else {
        onChange(name, value.replace(textFormats[format], ''));
      }
    } else {
      onChange(name, value);
    }
  }

  const inputValue = typeof value === 'string' ? value : value?.[name] || '';
  const inputError = typeof error === 'string' ? error : error?.[name] || '';

  return (
    <div className="input-container text-input">
      {label && (
        <label>
          {label} {isRequired && <span>*</span>}
        </label>
      )}

      <div
        className={`text-input__container ${
          type === 'password' ? 'text-input__password-container' : ''
        }`}
      >
        <input
          placeholder={placeholder ? placeholder : label ? 'Enter ' + label?.toLowerCase() : ''}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleChange}
          autoComplete="off"
          {...rest}
        />

        {type === 'password' && (
          <>
            {showPassword ? (
              <VscEyeClosed className="eye-icon" onClick={() => setShowPassword(false)} />
            ) : (
              <VscEye className="eye-icon" onClick={() => setShowPassword(true)} />
            )}
          </>
        )}
      </div>

      <div className="input-error">
        {inputError === 'required' ? `${label} is required` : inputError}
      </div>
    </div>
  );
}

export default TextInput;
