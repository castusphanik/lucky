// src/pages/RolesPermissionsForm.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RolesPermissionsModal from '@/components/RolesPermissionsModal';
import { dummyPermissions } from '@/helpers/mock';

interface Permission {
  modules: string;
  subModules: string;
  functionality: string;
  create?: boolean;
  update?: boolean;
  view?: boolean;
  delete?: boolean;
  download?: boolean;
  allowAll?: boolean;
}

const RolesPermissionsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    mode = 'edit',
    roleName = '',
    permissions = dummyPermissions,
  }: {
    mode?: string;
    roleName?: string;
    permissions?: Permission[];
  } = location.state || {};

  const handleSave = (newRoleName: string, newPermissions: any[]) => {
    console.log('Saved:', newRoleName, newPermissions);
    navigate('/account-management/user-roles-and-permissions'); // Go back to main page
  };
  console.log('data:', permissions);

  return (
    <RolesPermissionsModal
      mode="create"
      roleName={roleName}
      permissions={permissions}
      onSave={handleSave}
      onClose={() => navigate('/account-management/user-roles-and-permissions')}
    />
  );
};

export default RolesPermissionsForm;
