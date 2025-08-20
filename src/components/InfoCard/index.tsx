import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: string;
  variant?: 'simple' | 'simplecolor' | 'detailed'; // determines layout,
  className?: string;
  onClick?: () => void; // Add onClick prop
  isActive?: boolean; // Add isActive prop for highlighting
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  variant = 'simple',
  className,
  onClick,
  isActive,
}) => {
  return (
    <Card
      className={className}
      onClick={onClick}
      sx={{
        borderRadius: 4,
        backgroundColor: '#fff',
        boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.06)',
        width: 'auto',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              boxShadow: '2px 6px 15px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            }
          : {},
        ...(variant === 'simplecolor' && {
          borderLeft: `6px solid ${iconColor || 'darkblue'}`,
          // width:'100%'// ✅ conditional border
        }),
      }}
    >
      <CardContent>
        {/* Simple layout */}
        {variant === 'simple' && (
          <>
            <Typography
              color={isActive ? 'var(--color-primary)' : 'text.secondary'}
              fontSize={16}
              fontWeight={500}
            >
              {title}
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={24}
              mt={1}
              color={isActive ? 'var(--color-primary)' : 'inherit'}
            >
              {value}
            </Typography>
          </>
        )}
        {/* Simple color layout */}
        {variant === 'simplecolor' && (
          <>
            {/* <Box> */}
            <Typography color="text.secondary" fontSize={12} fontWeight={500}>
              {title}
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={24}
              mt={1}
              sx={{
                color: 'darkblue',
                textDecoration: 'underline',
              }}
            >
              {value}
            </Typography>
            {/* </Box> */}
          </>
        )}

        {/* Detailed layout */}
        {variant === 'detailed' && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color="text.secondary" fontSize={16} fontWeight={500}>
                {title}
              </Typography>
              <Box
                sx={{
                  backgroundColor: 'lightgrey',
                  p: 1,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                }}
              >
                {icon}
              </Box>
            </Box>

            <Typography fontWeight="bold" fontSize={28} mt={1}>
              {value}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
