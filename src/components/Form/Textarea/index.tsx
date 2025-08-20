import { Typography } from "@mui/material";
import "./styles.scss";
import React from "react";
type textareaProps = {
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  name: string;
  value: string | { [key: string]: any };
  error?: string;
  onChange?: (name: string, value: string) => void;
  rows?: number;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
};
const Textarea = ({
  name,
  label,
  placeholder,
  isRequired,
  error,
  rows = 5,
  onChange = () => null,
  value,
  maxLength,
  readOnly = false,
  disabled = false,
  ref,
}: textareaProps) => {
  const inputValue = typeof value === "string" ? value : value?.[name];
  return (
    <div className="textarea-container">
      {/* {label && (
        <label>
          <Typography>{label}</Typography>
          {isRequired && <span>*</span>}
        </label>
      )} */}
      {label && (
        <label>
          {label} {isRequired && <span>*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        placeholder={placeholder ? placeholder : "Type here..."}
        name={name}
        value={inputValue}
        maxLength={maxLength}
        rows={rows ? rows : undefined}
        onChange={(event) => onChange(name, event.target.value)}
        readOnly={readOnly}
        disabled={disabled}
      ></textarea>
      <small className="input-error">{error}</small>
    </div>
  );
};
export default Textarea;