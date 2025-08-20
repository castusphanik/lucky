import { FC, ReactNode } from 'react';
import './styles.scss';
import { RxCross1 } from 'react-icons/rx';
import Button from '../Button';
import { Typography } from '@mui/material';

export interface PopupProps {
  title?: string;
  children: ReactNode;
  width?: number | string;
  buttonName?: string;
  className?: string;
  isLoading?: boolean;
  onClose?: () => void;
  onClick?: () => void;
}

const Popup: FC<PopupProps> = ({
  children,
  title = '',
  width = 550,
  buttonName,
  className = '',
  isLoading = false,
  onClose,
  onClick,
}) => {
  return (
    <div id="popup" className={className}>
      <div className="popup-container" style={{ width }}>
        <div className="title-container">
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <RxCross1 className="close-icon" onClick={onClose} />
        </div>

        <div className="popup-body-container">{children}</div>

        {buttonName && (
          <div className="button-container">
            <Button isLoading={isLoading} onClick={onClick}>
              {buttonName}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
