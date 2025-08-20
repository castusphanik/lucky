import React, { useState } from "react";
import "./styles.scss";

interface CustomCheckboxProps {
  name: string;
  isRequired?: boolean;
  classValue?: string;
  isChecked: boolean;
  onChange: (name: string, isChecked: boolean) => void;
  isDisabled?: boolean;
}
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  classValue = "",
  isChecked = false,
  onChange = () => { },
  isDisabled = false,
}) => {

  const [internalChecked, setInternalChecked] = useState(isChecked || false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    if (isChecked === undefined) {
      setInternalChecked(checked);
    }
    if (onChange) {
      onChange(name, checked);
    }
  };

  return (
    <div className="custom-checkbox">
      <input
        className={classValue}
        id={name}
        type="checkbox"
        name={name}
        disabled={isDisabled}
        onChange={handleCheckboxChange}
        checked={isChecked !== undefined ? isChecked : internalChecked}
      />
    </div>
  );
};

export default CustomCheckbox;