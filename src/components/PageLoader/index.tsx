import './styles.scss';
import React from 'react';
import { CircularProgress, Typography } from '@mui/material';

type TProps = {
  isLoading: boolean;
  message?: string;
  color?: string;
  size?: number;
  thickness?: number;
  style?: React.CSSProperties;
  className?: string;
};

function PageLoader({
  isLoading = false,
  message,
  color,
  size = 30,
  thickness = 6,
  style,
  className = '',
}: TProps) {
  return (
    isLoading && (
      <div className={`page-loader ${className}`} style={style}>
        <CircularProgress
          sx={{ color: color ? color : 'var(--color-primary)' }}
          size={size}
          thickness={thickness}
        />
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      </div>
    )
  );
}

export default PageLoader;
