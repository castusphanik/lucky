import React from 'react';
import { Avatar, Box, Typography, Card, CardContent, Link } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
// import { Flex } from '@adobe/react-spectrum';
import { Grid } from '@mui/material';

interface Account {
  name: string;
  acNo: string;
  customerRef?: string;
  link?: string;
}

interface UserProfileProps {
  name: string;
  email: string;
  company: string;
  role: string;
  associatedAccounts: number;
  relatedAccounts: number;
  accounts: Account[];
}

const CustomerProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  company,
  role,
  associatedAccounts,
  relatedAccounts,
  accounts,
}) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #e8f0ff, #ffffff)',
        padding: 3,
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* Left Section */}
        <Grid item xs={12} md={4} display="flex" alignItems="center" justifyContent="flex-start">
          <Avatar
            sx={{
              bgcolor: '#0B4F9E',
              width: 110,
              height: 110,
              borderRadius: '15px',
              mr: 2,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>

          <Box sx={{ marginTop: '16px' }}>
            <Typography variant="h6" fontWeight="bold">
              {name}
            </Typography>
            <Typography color="text.secondary">{email}</Typography>
            <Box mt={1}>
              <Typography fontSize={16} color="text.secondary">
                Company
              </Typography>
              <Typography fontWeight="bold">{company}</Typography>
            </Box>
            <Typography sx={{ marginTop: '10px' }} fontSize={16} color="text.secondary">
              Related Accounts {relatedAccounts}
            </Typography>
          </Box>
        </Grid>

        {/* Middle Section */}
        <Grid item xs={6} md={4} display="flex" flexDirection="column" sx={{ marginLeft: '140px' }}>
          <Typography fontSize={16} color="text.secondary">
            Company Role
          </Typography>
          <Typography fontWeight="bold">{role}</Typography>
        </Grid>

        {/* Right Section */}
        <Grid item xs={6} md={4} fontSize="16px" display="flex" flexDirection="column" ml={25}>
          <Typography fontSize={16} color="text.secondary">
            No of Associated Accounts
          </Typography>
          <Typography fontWeight="bold">{associatedAccounts}</Typography>
        </Grid>

        {/* Related Accounts Cards */}
        <Grid container spacing={2} ml={16}>
          {accounts.map((account, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: '#eaf2ff',
                  width: '330px',
                  height: '140px',
                }}
              >
                <CardContent>
                  <Typography fontSize={16} color="text.secondary">
                    Account Name
                  </Typography>
                  <Link href={account.link} underline="always" fontWeight="bold" color="#387BFE">
                    {account.name}
                  </Link>
                  <Box mt={1} display="flex" justifyContent="space-between">
                    <Typography fontSize={16} color="text.secondary">
                      AC/No
                    </Typography>
                    <Typography fontWeight="regular">{account.acNo}</Typography>
                  </Box>
                  <Box mt={1} display="flex" justifyContent="space-between">
                    <Typography fontSize={16} color="text.secondary">
                      Customer Ref #
                    </Typography>
                    <Typography fontWeight="regular">{account.customerRef}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerProfile;
