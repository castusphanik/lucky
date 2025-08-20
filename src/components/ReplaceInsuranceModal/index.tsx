import React, { FC } from "react";
import Popup from "../Popup";
import "./styles.scss";
import Button from "../Button";
import { useState } from "react";
import Input from "../Form/Input";
import CustomDropdown from "../Form/Dropdown";
import RadioGroup from "../Form/RadioGroup";

interface ReplaceInsuranceModal {
  onClose?: () => void;
}



const ReplaceInsuranceModal: FC<ReplaceInsuranceModal> = ({ onClose = () => {} }) => {
  return (
    <Popup title="Replace Insurance" onClose={onClose} width={370}>
      <div className="replace-insurance-modal">
          <CustomDropdown
          label="Select Equipment to Cover"
          placeholder="Select Option"
          required
        />
          <CustomDropdown
          label="Insurance Type"
          placeholder="Select Option"
          required
        />
        <Input type="text" label="Provider Name" isRequired />
        <Input type="text" label="Policy Number" isRequired />
        <Input type="text" label="Coverage Dates" isRequired />
      
        <Input type="text" label="Upload COI" isRequired />
         <Input type="text" label="Additional Notes(Optional)" isRequired />
        

        <div className="replace-insurance-modal__button-bg-container">
          <Button color="primary" size="sm">
            Save
          </Button>
          <Button color="light" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default ReplaceInsuranceModal;