// CustomDropdown.tsx
import { useState, FC, useRef, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Typography } from '@mui/material';
import './styles.scss';

interface CustomDropdownProps {
  label: string;
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  required?: boolean;
  errorText?: string;
  multiSelect?: boolean;
}

const CustomDropdown: FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  errorText = '',
  multiSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>(
    Array.isArray(value) ? value : []
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (multiSelect && Array.isArray(value)) {
      setSelectedItems(value);
    }
  }, [value, multiSelect]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleMultiSelect = (option: string) => {
    const updated = selectedItems.includes(option)
      ? selectedItems.filter((item) => item !== option)
      : [...selectedItems, option];

    setSelectedItems(updated);
    onChange(updated);
  };

  const filteredOptions = options?.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <Typography className="dropdown-label">
        {label}
        {required && <span className="required">*</span>}
      </Typography>

      <div
        className={`dropdown-container ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography className="dropdown-selected">
          {multiSelect
            ? selectedItems.length > 0
              ? selectedItems.join(', ')
              : 'Select Option'
            : (value as string) || 'Select Option'}
        </Typography>
        <span className="dropdown-icon">
          {isOpen ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
        </span>
      </div>

      {isOpen && (
        <div className="dropdown-options">
          {multiSelect && (
            <input
              type="text"
              placeholder="Search"
              className="dropdown-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {filteredOptions.map((opt, idx) => (
            <div
              key={opt}
              className={`dropdown-option ${idx < filteredOptions.length - 1 ? 'divider' : ''
                }`}
              onClick={() =>
                multiSelect ? handleMultiSelect(opt) : handleSelect(opt)
              }
            >
              {multiSelect ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    className="multiselect-checkbox"
                    type="checkbox"
                    checked={selectedItems.includes(opt)}
                    onChange={() => handleMultiSelect(opt)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '16px', height: '16px' }}
                  />
                  {opt}
                </label>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="single-select"
                    checked={value === opt}
                    onChange={() => handleSelect(opt)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '16px', height: '16px', }}
                  />
                  {opt}
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      {errorText && <div className="dropdown-error">{errorText}</div>}
    </div>
  );
};

export default CustomDropdown;
