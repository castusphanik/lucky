// UserPreviewPage.tsx
import React, { useState } from 'react';
import UserPreviewModal from '@/pages/UserPreviewData'


const UserPreviewData: React.FC = () => {
  const [open, setOpen] = useState(true);

  const userData = {
    name: 'Stella Elsa',
    contactName: 'Daniel Mckee',
    email: 'stellaelsa@gmail.com',
    phone: '+1(863)9380-193',
    employeecount: '50+',
    branch: 'Head Quarters-Atlanta Usa',
    date: 'May 15, 2025',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  return (
    <UserPreviewModal open={open} onClose={() => setOpen(false)} user={userData} />
  );
};

export default UserPreviewData;
