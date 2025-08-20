import React, { FC } from "react";
import Popup from "../Popup";
import { PiUploadSimple } from "react-icons/pi";
import "./styles.scss";
import { Typography } from "@mui/material";
import FileUpload from "../Form/FileUpload";
import Button from "../Button";
import { useState } from "react";

interface UploadDataFileProps {
  onClose?: () => void;
}

const UploadDataFile: FC<UploadDataFileProps> = ({ onClose = () => {} }) => {
    const [files, setFiles] = useState<File[]>([]);
  return (
    <Popup title="Import Fleet" onClose={onClose} width={450}>
      <div className="upload-data-file-container">
        <div className="upload-data-file-container__upload-card">
          <PiUploadSimple size={40} color="#3D4460" />
        </div>
    
        <Typography fontFamily="var(--font-primary)" >Upload
        <span style={{color:"red"}}>*</span>
        </Typography>
        
          <FileUpload
          name="fleet-file"
          title=""
          description="Supported Formats: Excel up to 2 mb"
          validFiles={[
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
            "application/vnd.ms-excel",
          ]}
          onChange={(name,data) => setFiles(data)}
          fileSize={2}
          fileLimit={1}
          uploadType="file"
        />
        <div className="upload-data-file-container__button-bg-container">
          <Button color="primary" size="sm">Upload</Button>
          <Button color="light" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Popup>
  );
};

export default UploadDataFile;
