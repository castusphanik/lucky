import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Grid from '@mui/material/Grid';

interface UserViewProps {
  name: string;
  email: string;
  phone: string;
  location: string;
  noOfAccounts: string;
}

const UserView: React.FC<UserViewProps> = ({ name, email, phone, location, noOfAccounts }) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #e8f0ff, #ffffff)',
        padding: 2,
        height: 200,
      }}
    >
      <Grid container>
        {/* Section 1: Avatar */}
        <Grid sx={{ margin: '16px' }}>
          <Avatar sx={{ bgcolor: '#0B4F9E', width: 110, height: 110, borderRadius: '15px' }}>
            <PersonIcon sx={{ fontSize: 50, bgcolor: '#0B4F9E' }} />
            {/* <PersonOutlineOutlinedIcon sx={{ fontSize: 50 }} /> */}
          </Avatar>
        </Grid>

        {/* Section 2: Name, Email, Phone */}
        <Grid item xs={12} sm={4} sx={{ margin: '16px', width: '70%' }}>
          <Typography fontWeight={600} fontSize="1.2rem">
            {name}
          </Typography>
          <Typography color="text.secondary">{email}</Typography>

          <Grid
            container
            spacing={3}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box mt={1}>
              <Typography color="text.secondary">
                <strong>Phone</strong>
              </Typography>
              <Typography fontWeight={600}>{phone}</Typography>
            </Box>

            <Box mt={1}>
              <Typography color="text.secondary">
                <strong>No of Accounts</strong>
              </Typography>
              <Typography fontWeight="bold">{noOfAccounts}</Typography>
            </Box>

            <Box mt={1}>
              <Typography color="text.secondary">
                <strong>Location</strong>
              </Typography>
              <Typography fontWeight={600}>{location}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserView;
