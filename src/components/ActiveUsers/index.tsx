import React from 'react';
import {Typography, Paper } from '@mui/material';
import ActivityCard from '../ActivityCard';

const users = [
  {
    name: 'Elijah Wang',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastActivity: 'Assigned route to Vehicle #12 at 3:45 PM',
    alertsHandled: '3 delays resolved today',
  },
  {
    name: 'Sophia Martinez',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastActivity: 'Updated schedule for Route #7 at 1:30 PM',
    alertsHandled: '2 delays resolved today',
  },
];

const ActiveUsers: React.FC = () => {
  return (
    <Paper elevation={1} sx={{ borderRadius: 3, p: 2, width: 365, backgroundColor: '#f8fbff', margin:'20px' }}>
      <Typography fontWeight={800} fontSize={18} mb={1.5}>
        Active Users
      </Typography>
      {users.map((user, index) => (
        <ActivityCard key={index} {...user} />
      ))}
    </Paper>
  );
};

export default ActiveUsers;
