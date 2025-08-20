import React from 'react';
import { Dialog, Typography, Stack } from '@mui/material';
import Button from '../Button';
import './styles.scss';
import DeleteIcon from '@/assets/DeleteIcon.png';

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  codeLabel?: string;
  codeValue?: string;
  name?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message = '',
  codeLabel = '',
  codeValue,
  name,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="confirmation-modal__main-container">
        <div className="confirmation-modal__content">
          <Stack spacing={2}>
            <div className="confirmation-modal__icon-container">
              <img src={DeleteIcon} alt="deleteIcon" />
            </div>

            <Typography variant="h5" className="confirmation-modal__title">
              Are you sure you want <br />
              to delete this {name}?
            </Typography>

            <Typography variant="body2" className="confirmation-modal__label">
              {message}
            </Typography>

            <Typography variant="body1" className="confirmation-modal__code">
              {codeValue || codeLabel}
            </Typography>
          </Stack>
        </div>

        <div className="confirmation-modal__button-container">
          <Button size="fit" color="primary" onClick={onConfirm}>
            Yes
          </Button>
          <Button size="fit" classValue="no-btn" onClick={onClose}>
            No
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;
