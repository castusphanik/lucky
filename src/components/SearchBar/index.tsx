import React, { useState } from 'react';
import { LuSearch, LuArrowRight } from 'react-icons/lu';
import './styles.scss';

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
  placeholder?: string;
};

const SearchBar: React.FC<Props> = ({ value, onChange, onSearch, placeholder = 'Search' }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.();
    }
  };

  return (
    <div className="search-bar">
      {value || isFocused ? '' : <LuSearch className="search-bar__icon" />}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value || isFocused ? (
        <LuArrowRight className="search-bar__icon arrow" onClick={onSearch} />
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchBar;
