/*userPreview component */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Box,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface UserPreviewProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    contactName: string;
    email: string;
    phone: string;
    employeecount: string;
    branch: string;
    date: string;
    avatarUrl?: string;
  };
}

interface GridItem {
  label: string;
  value: string;
}

const UserPreviewModal: React.FC<UserPreviewProps> = ({ open, onClose, user }) => {
  const gridItems: GridItem[] = [
    { label: 'Name', value: user.name },
    { label: 'Contact Name', value: user.contactName },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    { label: 'Employee', value: user.employeecount },
    { label: 'Branch', value: user.branch },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: '16px', // Rounded corners for dialog
        },
      }}
    >
      <Box px={2} pt={2}  position="relative">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', pb: 0 }}>
          <Typography fontWeight="bold">Ten User</Typography>
          <IconButton onClick={onClose}
  sx={{
    backgroundColor: '#e0e0e0', // light gray background
    color: '#000',              // icon color (you can change to '#666' if needed)
    '&:hover': {
      backgroundColor: '#d5d5d5', // slightly darker on hover
    },
    width: 36,
    height: 36,
    borderRadius: '50%',
  }}
>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ backgroundColor: '#f0f0f0', mt: 1 }} />

        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Avatar
              src={user.avatarUrl}
              alt={user.name}
              sx={{ width: 80, height: 80 }}
            />
            <Typography variant="h6" fontWeight="bold" mt={1}>
              {user.name}
            </Typography>
            <Typography color="text.secondary">{user.date}</Typography>
          </Box>

          <Box mt={2.5} >
            {gridItems.map((item: GridItem) => (
              <Grid
                container
                key={item.label}

                sx={{
                  backgroundColor: '#f3fafd',
                  borderBottom: '1px solid #e0e0e0',
                  borderRadius: 1,
                  px: 2,
                  py: 1.5,
                  mb: 1.2,
                }}
              >
                <Grid item xs={4} sx={{width:'40%'}} >
                  <Typography fontWeight="bold">{item.label}</Typography>
                </Grid>
                <Grid item xs={4} sx={{width:'60%'}}>
                  <Typography >{item.value}</Typography>
                </Grid>
              </Grid>
            ))}
          </Box>

          <Box mt={3} display="flex" justifyContent="flex-start">
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default UserPreviewModal;

