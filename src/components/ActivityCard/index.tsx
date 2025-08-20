import React from 'react';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

interface ActiveUserCardProps {
  avatarUrl: string;
  name: string;
  lastActivity: string;
  alertsHandled: string;
}

const ActivityCard: React.FC<ActiveUserCardProps> = ({
  avatarUrl,
  name,
  lastActivity,
  alertsHandled,
}) => {
  return (
    <Box display="flex" flexDirection="column" p={2} width='100%'>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar src={avatarUrl} alt={name} sx={{ width: 40, height: 40 }} />
        <Box flexGrow={1}>
          <Typography fontWeight={600}>{name}</Typography>
        </Box>
        <CircleIcon sx={{ color: 'lightgreen', fontSize: 14 }} />
      </Box>

      <Box mt={1.5}  display={'flex'}>
        <Typography fontSize={14} width='55%' color='#555555' fontWeight={600}  sx={{ filter: 'blur(0.4px)' }}>
          Last Activity
        </Typography>
        <Typography width='55%' fontSize={16} fontWeight={600}>{lastActivity}</Typography>
      </Box>

      <Box mt={1.5}  display={'flex'} >
        <Typography fontSize={14}  width="55%" color="#555555" fontWeight={600}  sx={{ filter: 'blur(0.4px)' }} >
          Alerts Handled
        </Typography>
        <Typography fontSize={16} width="55%" fontWeight={600}>{alertsHandled}</Typography>
      </Box>

      <Divider sx={{ mt: 2,backgroundColor: '#cfe4ef',  height: '1px',  }} />
    </Box>
  );
};

export default ActivityCard;
