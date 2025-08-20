import React, { FC, ReactNode, useEffect, useState, ChangeEvent } from "react";
import "./styles.scss";
import FileUploadIcon from "../../../assets/fileUploadIcon.svg"
import DeleteIcon from "../../../assets/deleteIcon.svg";
import PdfIcon from "../../../assets/pdfIcon.svg";
import ImageIcon from "../../../assets/ImageIcon.svg";
import toast from "react-hot-toast";
import { FaCircleCheck } from "react-icons/fa6";
import { bytesToKB } from "../../../helpers/utils";
import Button from "../../Button";
import { Typography } from "@mui/material";


export interface UserFile {
  name: string;
  size: number;
  type?: string;
  mUrl?: string;
  verified?: boolean;
  
}

export interface FileUploadProps {
  title: string;
  description?: string;
  validFiles?: string[];
  onChange?: (name: string, files: (File | UserFile)[]) => void;
  name?: string;
  className?: string;
  uploadType?: "file" | string;
  value?: UserFile | UserFile[] | null;
  handleValueDelete?: (val: any) => void;
  fileLimit?: number;
  fileSize?: number;
  renderValues?: ReactNode;
  onClick?: () => void;
  label?: string;
  isRequired?:string;
}

const FileUpload: FC<FileUploadProps> = ({
  title,
  description = "Supported Formats: Excel upto 2 MB",
  validFiles = [],
  onChange = () => undefined,
  name = "",
  className = "",
  uploadType = "file",
  value = [],
  handleValueDelete = () => undefined,
  fileLimit = 5,
  fileSize = 2,
  label,
  renderValues,
  onClick = () => undefined,
  isRequired,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<(File | UserFile)[]>([]);

  useEffect(() => {
    onChange(name, uploadedFiles);
  }, [name, uploadedFiles, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    toast.dismiss();
    let files = Array.from(e.target.files ?? []);

    const totalBytes =
      uploadedFiles.reduce((sum, f: any) => sum + (f.size ?? 0), 0) +
      files.reduce((sum, f) => sum + f.size, 0);

    if (totalBytes > fileSize * 1_000_000) {
      toast.error(`File size exceeding ${fileSize} MB!`);
      e.target.value = "";
      return;
    }

    if (uploadedFiles.length + files.length > fileLimit) {
      toast.error(`Only ${fileLimit} files can be uploaded`);
      e.target.value = "";
      return;
    }

    files = files.filter((file) => {
      if (file.size > fileSize * 1_000_000) {
        toast.error(`File size exceeding ${fileSize} MB!`);
        return false;
      }
      if (validFiles.length && !validFiles.includes(file.type)) {
        toast.error("Invalid file type!");
        return false;
      }
      return true;
    });

    setUploadedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleDelete = (file: File | UserFile) => {
    if ("mUrl" in file) {
      setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name));
    } else {
      setUploadedFiles((prev) => prev.filter((f) => f !== file));
      handleValueDelete(file);
    }
  };

  const renderFilePreview = (file: File | UserFile, idx: number) => {
    const mime = (file as File).type ?? "";

    if (mime.startsWith("video")) {
      const url = URL.createObjectURL(file as File);
      return (
        <div key={idx} className="file-upload__image-preview-container">
          <video className="image-preview" src={url} muted controls />
          <img
            className="delete-icon"
            src={DeleteIcon}
            onClick={() => handleDelete(file)}
          />
        </div>
      );
    }

    if (mime === "application/pdf") {
      const clickOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(URL.createObjectURL(file as File));
      };

      return (
        <div key={idx} className="file-upload__wrapper" onClick={clickOpen}>
          <h4>{title}</h4>
          <div className="file-upload__pdf-preview">
            <div className="file-upload__left-section">
              <img src={PdfIcon} />
              <div>
                <h4>{file.name}</h4>
                <p>{bytesToKB(file.size)} kb</p>
              </div>
            </div>
            <img
              src={DeleteIcon}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(file);
              }}
            />
          </div>
        </div>
      );
    }

    if (mime.startsWith("image/")) {
      const url = URL.createObjectURL(file as File);

      return (
        <div
          key={idx}
          className="file-upload__image-preview-container"
          onClick={(e) => {
            e.stopPropagation();
            window.open(url);
          }}
        >
          <img className="image-preview" src={url} alt="preview" />
          <img
            className="delete-icon"
            src={DeleteIcon}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(file);
            }}
          />
        </div>
      );
    }

    return null;
  };

  const renderUserFilePreview = (User: UserFile) => {
    const ext = User.name.split(".").pop();
    const icon = ext === "pdf" ? PdfIcon : ImageIcon;

    return (
      <div className="file-upload">
        <Typography className="label-element">{title}</Typography>
        <div
          className="file-upload__pdf-preview file-upload__value-preview"
          onClick={(e) => {
            e.stopPropagation();
            if (User.mUrl) window.open(User.mUrl);
          }}
        >
          <div className="file-upload__left-section">
            <img src={icon} />
            <div>
              <h4>{User.name}</h4>
              <p>{bytesToKB(User.size)} kb</p>
            </div>
          </div>
          <div>
            {User.verified ? (
              <FaCircleCheck color="green" size={23} />
            ) : (
              <img
                src={DeleteIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  handleValueDelete(name);
                  handleDelete(User);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const isEmptyValue =
    !value ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0);

  return (
    <>
      {isEmptyValue ? (
        <div className={`file-upload ${className}`} onClick={onClick}>
          {(uploadType !== "file" ||  uploadedFiles?.length === 0 ) && (
            <>
             <Typography className="label-element">
          {label} {isRequired && <span className="required"> *</span>}
        </Typography>
              <div className="file-upload__container">
                <input
                  id={name}
                  type="file"
                  multiple={uploadType !== "file"}
                  onChange={handleChange}
                  accept={validFiles.join(",")}
                />
                <div className="file-upload__left-section">
                  <img src={FileUploadIcon} />
                  <p>{description}</p>
                </div>
                 <label className="file-upload__label-button" htmlFor={name}>
                  Choose 
                </label>
              </div>
            </>
          )}
          <div className="file-upload__preview-container">
            {uploadedFiles.map(renderFilePreview)}
            {renderValues}
          </div>
        </div>
      ) : (
        renderUserFilePreview(value as UserFile)
      )}
    </>
  );
};

export default FileUpload;
