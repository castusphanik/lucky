import  { FC } from "react";
import Popup from "../Popup";
import "./styles.scss";
import Button from "../Button";
import { useState } from "react";
import Input from "../Form/Input";
import DatePicker from "../Form/DatePicker";

interface CreateEstimate {
  onClose?: () => void;
}

const CreateEstimate: FC<CreateEstimate> = ({ onClose = () => {} }) => {
  return (
    <Popup title="Create Estimate" onClose={onClose} width={370}>
      <div className="create-estimate">
        <Input type="text" label="Estimate ID" isRequired />
        <Input type="text" label="Work Order ID" isRequired />
        <Input type="text" label="Equipment" isRequired />
        <DatePicker label="Created Date" isRequired />
      
        <Input type="text" label="Vendor" />
       <Input type="text" label="Total Estimate Amount" />
       <Input type="text" label="Status" />

        <div className="create-estimate__button-bg-container">
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

export default CreateEstimate;