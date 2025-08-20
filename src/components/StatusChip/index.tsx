import React from "react";
import "./styles.scss";

type StatusChipProps = {
  label: string;
  textColor: string;
  bgColor: string;
};

const StatusChip: React.FC<StatusChipProps> = ({ label, textColor, bgColor }) => {
  return (
    <div
      className="status-chip"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <span
        className="status-chip__dot"
        style={{ backgroundColor: textColor }}
      ></span>
      <span className="status-chip__label">{label}</span>
    </div>
  );
};

export default StatusChip;
