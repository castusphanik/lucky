import React, { FC } from "react";
import Popup from "../Popup";
import "./styles.scss";
import { Typography } from "@mui/material";
import Button from "../Button";
import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";
import DatePicker from "../Form/DatePicker";
import moment from "moment";
import Input from "../Form/Input";
import CustomCheckbox from "../Form/CustomCheckbox";
import CustomDropdown from "../Form/Dropdown";

interface PdfDocumentExportModal {
  onClose?: () => void;
}

const PdfDocumentExportModal: FC<PdfDocumentExportModal> = ({
  onClose = () => {},
}) => {
  const [doc, setDoc] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment());
   const [selectedOption, setSelectedOption] = useState("");
  const [checked,SetIsChecked] = useState(false)

  return (
    <Popup title="Select Document" onClose={onClose} width={450}>
      <div className="upload-data-file-container">
        <CustomDropdown
          label="Select Document"
          value={selectedOption}
          onChange={setSelectedOption}
          options={["Option 1", "Option 2", "Option 3"]}
          required
        />
        <Input type="text" label="Unit ID" />
         <DatePicker value={selectedDate} onChange={setSelectedDate} label="Date" />
         <div className="upload-data-file-container__checkbox-bg">
         <CustomCheckbox name="Inspection Passed" isChecked={checked} onChange={() => SetIsChecked(!checked)} />
         <Typography> Inspection Passed</Typography>
         </div>
        <div className="upload-data-file-container__button-bg-container">
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

export default PdfDocumentExportModal;
