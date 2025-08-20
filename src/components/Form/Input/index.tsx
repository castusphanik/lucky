import { useRef, useState } from "react";
import "./styles.scss";
import { IoEyeOff } from "react-icons/io5";
import IconEye from "../../../assets/EyeIcon.svg"
import { Typography } from "@mui/material";

type textInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value"
> & {
  type?: string;
  regex?: RegExp;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  name: string;
  value: { [key: string]: string };
  error?: { [key: string]: string };
  onChange?: (name: string, value: string) => void;
  className?: string;
};

const Input = ({
  label,
  placeholder,
  type = "text",
  onChange = () => null,
  name,
  value,
  className = "",
  maxLength,
  disabled = false,
  error,
  isRequired,
  regex,
  ...rest
}: textInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;

    // Allow only numbers

    if (type === "currency") {
      value = value.replace(/\D/g, "");

      value = value !== "" ? parseFloat(value).toLocaleString() : "";
    }

    if (regex) {
      onChange(name, value.replace(regex, ""));
    } else {
      onChange(name, value);
    }
  }

  const inputType = showPassword ? "text" : "password";


  return (
    <div className={`input ${className} ${disabled ? "disabled" : ""}`}>
      <div style={{ width: "100%" }}>
        <Typography className="label-element">
          {label} {isRequired && <span className="required"> *</span>}
        </Typography>
        <div className={`input-container ${inputRef.current}`}>
          <input
            placeholder={
              placeholder ? placeholder : "Enter " + label
            }
            onFocus={() => (inputRef.current = "focus")}
            onBlurCapture={() => {
              inputRef.current = "";
            }}
            type={type === "password" ? inputType : type}
            onChange={handleChange}
            maxLength={maxLength}
            value={value?.[name]}
            onBlur={handleChange}
            disabled={disabled}
            {...rest}
          />
          {type === "password" && (
            <div>
              {showPassword ? (
                <IoEyeOff
                  className="eye-icon"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <img src={IconEye}
                  className="eye-icon"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          )}
          {/* {type === "email" && (
            <div>
              {!error?.[name] && value?.[name] !== "" ? (
                <TbCircleCheckFilled size="24" color="#052D93" />
              ) : (
                ""
              )}
            </div>
          )} */}

        </div>

        <small className="error-message">
          {error?.[name] === " is required"
            ? label + error?.[name]
            : error?.[name]}
        </small>
      </div>
    </div>
  );
};

export default Input;