import React, { FC } from "react";
import Popup from "../Popup";
import "./styles.scss";
import Button from "../Button";
import { useState } from "react";
import Input from "../Form/Input";
import CustomDropdown from "../Form/Dropdown";
import RadioGroup from "../Form/RadioGroup";

interface CreateGeofence {
  onClose?: () => void;
}

const targetOptions = [
  { label: "Entry", value: "entry" },
  { label: "Exit", value: "exit" },
  { label: "Idle Within", value: "idle" },
];

const equipmentOptions = [
  { label: "Single Equipment", value: "single-equipment" },
  { label: "Multiple Equipment", value: "multiple-equipment" },
];

const CreateGeofence: FC<CreateGeofence> = ({ onClose = () => {} }) => {
  return (
    <Popup title="Create Geofence" onClose={onClose} width={370}>
      <div className="create-geofence">
        <Input type="text" label="Track Number" isRequired />
        <Input type="text" label="Geofence Name" isRequired />
        <Input type="text" label="Set Location" isRequired />
        <RadioGroup
          name="target-alert"
          label="Target Alert On"
          isRequired
          options={targetOptions}
        />
        <RadioGroup
          name="equipment"
          label="Assign Equipment"
          options={equipmentOptions}
          isRequired
        />
        <CustomDropdown
          label="Select Shape"
          placeholder="Select Shape"
          required
        />
        <Input type="text" label="Geofence Dimensions" isRequired />
        <CustomDropdown
          label="Select Group / Tag"
          placeholder="Select Option"
          required
        />

        <div className="create-geofence__button-bg-container">
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

export default CreateGeofence;
