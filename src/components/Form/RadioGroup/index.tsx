import { PiRadioButtonFill } from "react-icons/pi";
import "./styles.scss";
import { Typography } from "@mui/material";

type props = {
  name: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (name: string, value: string) => void;
  label?: string;
   isRequired?: boolean;
};

function RadioGroup({
  name,
  label,
  value,
  isRequired,
  options = [],
  onChange,
}: props) {
  return (
    <div className="radio-group">
      <Typography sx={{ fontFamily: "var(--font-primary)" }} fontSize={12}>
        {label}
        {isRequired && <span className="required">*</span>}
      </Typography>
      <div className="radio-group__container">
        {options.map((item, index) => (
          <div
            key={index}
            className="radio-group__option"
            onClick={() => onChange(name, item.value)}
          >
            <PiRadioButtonFill
              className={`radio-icon ${item.value === value ? "active" : ""}`}
            />
            <Typography
              sx={{ fontFamily: "var(--font-primary)" }}
              fontSize={12}
            >
              {item.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadioGroup;
