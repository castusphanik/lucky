import { useState, useMemo } from 'react';
import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { UserRolesColumns } from '@/helpers/columns';
import { dummyPermissions } from '@/helpers/mock';
// import DevExtremeTable from '@/components/DevExtremeTable';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import EditIcon from '@/assets/EditIcon.svg';
import { IoMdAdd } from 'react-icons/io';
import CustomDropdown from '@/components/Form/Dropdown';
import { useGetRolesQuery } from '@/services/roles';
import { Skeleton } from '@mui/material';
import moment from 'moment';
import Table from '@/components/Table';

const UserRolesAndPermissions = () => {
  const customerInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const exportOptions = ['Export to PDF', 'Export to CSV'];
  const [selectedExport, setSelectedExport] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { data: rolesData, isLoading, isError } = useGetRolesQuery(customerInfo?.customer_id);

  const handleAddRole = () => {
    navigate('/account-management/user-roles-and-permissions/form', {
      state: {
        mode: 'create',
        roleName: '',
        permissions: dummyPermissions,
      },
    });
  };

  if (isError) {
    return <div>Error loading roles.</div>;
  }

  const userRoles = useMemo(() => {
    if (!rolesData) {
      return [];
    }
    return rolesData.data.roles?.map(role => ({
      ...role,
      id: role.user_role_id,
      created_by: moment(role.created_at).format('DD MMM YYYY, h:mm a'),
      edit: {
        onClick: () =>
          navigate('/account-management/user-roles-and-permissions/form', {
            state: { id: role?.user_role_id },
          }),
      },
    }));
  }, [rolesData]);

  return (
    <div className="userRolesPermissions">
      <div className="userRolesPermissions__actions-container">
        <div style={{ display: 'flex', gap: 20 }}>
          <SearchBar
            placeholder="Search"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex-align-center right-section">
          {/* <div className="actions">
            <img src={EditIcon} style={{ height: 25 }} onClick={handleEditRole} />
          </div> */}

          <CustomDropdown
            label=""
            options={exportOptions}
            value={selectedExport}
            onChange={val => setSelectedExport(val as string)}
            multiSelect={false}
          />

          <Button
            size="lg"
            icon={<IoMdAdd size={18} />}
            iconPosition="right"
            onClick={handleAddRole}
          >
            Add Role
          </Button>
        </div>
      </div>
      <div></div>

      <div className="userRolesPermissions__table-section">
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={400} />
        ) : (
          // <DevExtremeTable
          //   columns={UserRolesColumns}
          //   rows={userRoles}
          //   totalRecords={userRoles.length}
          //   checkboxSelection={true}
          //   disableSearch={false}
          // />
          <Table
            columns={UserRolesColumns}
            rows={userRoles}
            totalRecords={userRoles.length}
            checkboxSelection={true}
            disableSearch={false}
          />
        )}
      </div>
    </div>
  );
};

export default UserRolesAndPermissions;

export function Edit({ onClick }: { onClick: () => void }) {
  return <img src={EditIcon} style={{ width: 20, cursor: 'pointer' }} onClick={onClick} />;
}
