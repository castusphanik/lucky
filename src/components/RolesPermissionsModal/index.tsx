import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Table from '@/components/Table';
import './styles.scss';
import CustomDropdown from '@/components/Form/Dropdown';
import Button from '@/components/Button';
import { TextInput } from '../Inputs';
import { Stack, Typography } from '@mui/material';
import { useGetAssignedAccountsDropdownQuery } from '@/services/accounts';
import {
  useCreateRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from '@/services/roles';
import toast from 'react-hot-toast';
import {
  validateFormDataOnChange,
  validateFormDataOnSubmit,
  type TFormValidations,
} from '@/helpers/validations';
import { allPermissions, permissionsData, permissionTypes } from '@/helpers/data';
import { useLocation } from 'react-router-dom';
import DropDownBox, { type DropDownBoxTypes } from 'devextreme-react/drop-down-box';
import TreeView, { type TreeViewRef } from 'devextreme-react/tree-view';

const columns = [
  { label: 'Modules', field: 'modules' },
  { label: 'Sub Modules', field: 'subModules' },
  { label: 'Functionality', field: 'functionality' },
  {
    label: 'Create',
    field: 'create',
    renderComponent: Checkbox,
  },
  {
    label: 'Update',
    field: 'update',
    renderComponent: Checkbox,
  },
  {
    label: 'View',
    field: 'view',
    renderComponent: Checkbox,
  },
  {
    label: 'Delete',
    field: 'delete',
    renderComponent: Checkbox,
  },
  {
    label: 'Download',
    field: 'download',
    renderComponent: Checkbox,
  },
];
const exportOptions = ['Export to PDF', 'Export to CSV'];

const formValidations: TFormValidations = [
  { name: 'name', validations: { isRequired: true } },
  { name: 'description', validations: { isRequired: true } },
  { name: 'accounts', validations: { isRequired: true } },
];

interface RolesPermissionsModalProps {
  mode: 'create' | 'edit';
  roleName?: string;
  permissions?: any[];
  onSave?: (roleName: string, permissions: any[]) => void;
  onClose?: () => void;
}

const PermissionsTable: React.FC<RolesPermissionsModalProps> = () => {
  const customerInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const location = useLocation();
  const id = location?.state?.id;

  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedExport, setSelectedExport] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);

  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const treeViewRef = useRef<TreeViewRef>(null);

  const [createRole, { isLoading }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const { data: roleData } = useGetRoleByIdQuery(id, { skip: !id });
  const { data } = useGetAssignedAccountsDropdownQuery(
    { userId: customerInfo?.user_id || 0 },
    { skip: !customerInfo?.user_id }
  );

  const roleDetails: Record<string, any> = roleData?.data?.role || {};

  useEffect(() => {
    if (roleDetails) {
      setInputs({
        name: roleDetails?.name || '',
        description: roleDetails?.description || '',
      });
      setSelectedAccounts(roleDetails?.accessible_account_ids || []);
      setPermissions(roleDetails?.role_permission?.map((item: any) => item.permission_name) || []);
    }
  }, [JSON.stringify(roleDetails)]);

  const accounts = useMemo(() => {
    if (data?.data && Array.isArray(data.data)) {
      const accountsData = data.data;

      function checkParentAccount(accountId: number): boolean {
        return accountsData
          .filter((account: any) => !account.is_child)
          .some(account => account.account_id === accountId);
      }

      return accountsData.map((item: any) => ({
        account_id: item.account_id,
        account_name: item.account_name,
        parent_account_id:
          item.parent_account_id && checkParentAccount(item.parent_account_id)
            ? item.parent_account_id
            : null,
      }));
    }
    return [];
  }, [JSON.stringify(data)]);

  const transformedPermissions = permissionsData.map(item => {
    const result: any = { ...item };

    permissionTypes.forEach(({ key, prefix }) => {
      result[key] = {
        isAvailable: (item as Record<string, any>)?.[key],
        name: `${prefix}:${item?.modulePermission}`,
        checked: permissions.some(assigned => assigned === `${prefix}:${item?.modulePermission}`),
        onChange: handleUpdatePermissions,
      };
    });

    return result;
  });

  function handleChange(name: string, value: any) {
    setInputs(prev => ({ ...prev, [name]: value }));
    validateFormDataOnChange(name, value, formValidations, errors, setErrors);
  }

  function handleUpdatePermissions(name: string, value: boolean) {
    if (value) {
      setPermissions([...permissions, name]);
    } else {
      const updatedList = permissions.filter(item => item !== name);
      setPermissions(updatedList);
    }
  }

  function handleSelectAll(value: boolean) {
    if (value) {
      setPermissions(allPermissions);
    } else {
      setPermissions([]);
    }
  }

  async function handleSave() {
    const { isError, formErrors } = validateFormDataOnSubmit(
      { ...inputs, accounts: selectedAccounts },
      formValidations
    );

    if (isError) {
      setErrors(formErrors);
      return;
    }

    if (permissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    const payload = {
      customer_id: customerInfo?.customer_id,
      name: inputs?.name,
      description: inputs?.description,
      accessible_account_ids: selectedAccounts,
      permissions: permissions.map(item => {
        return {
          permission_name: item,
          resource_server_identifier: 'https://ten-customer-portal-api',
        };
      }),
    };

    const mutation = id ? updateRole : createRole;
    const body = id ? { ...payload, role_id: id } : payload;

    try {
      const res = await mutation(body).unwrap();

      if (res) {
        toast.success('Role saved successfully');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create role');
    }
  }

  const syncTreeViewSelection = useCallback(
    (e: DropDownBoxTypes.ValueChangedEvent | any) => {
      const treeView =
        (e.component.selectItem && e.component) ||
        (treeViewRef.current && treeViewRef.current.instance());

      if (treeView) {
        if (e.value === null) {
          treeView.unselectAll();
        } else {
          const values = e.value || selectedAccounts;
          values &&
            values.forEach((value: any) => {
              treeView.selectItem(value);
            });
        }
      }

      if (e.value !== undefined) {
        setSelectedAccounts(e.value);
        setErrors(prev => ({ ...prev, accounts: '' }));
      }
    },
    [selectedAccounts]
  );

  const treeViewItemSelectionChanged = useCallback(
    (e: { component: { getSelectedNodeKeys: () => any } }) => {
      setSelectedAccounts(e.component.getSelectedNodeKeys());
    },
    []
  );

  const treeViewRender = useCallback(
    () => (
      <TreeView
        dataSource={accounts}
        ref={treeViewRef}
        dataStructure="plain"
        selectionMode="multiple"
        showCheckBoxesMode="selectAll"
        selectNodesRecursive={false}
        selectByClick={true}
        keyExpr="account_id"
        parentIdExpr="parent_account_id"
        displayExpr="account_name"
        onContentReady={syncTreeViewSelection}
        onSelectionChanged={treeViewItemSelectionChanged}
      />
    ),
    [accounts]
  );

  return (
    <div className="create-role">
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <div className="create-role__form-container">
          <div className="multi-select-container">
            <DropDownBox
              dataSource={accounts}
              showClearButton={true}
              valueExpr="account_id"
              displayExpr="account_name"
              placeholder="Select an Account"
              onValueChanged={syncTreeViewSelection}
              contentRender={treeViewRender}
              value={selectedAccounts}
              dropDownOptions={{ minWidth: 450 }}
              style={{ borderColor: '#b2c2e2', borderRadius: '6px' }}
            />
            <small className="input-error">{errors?.accounts ? 'Select an account' : ''}</small>
          </div>

          <TextInput
            name="name"
            placeholder="Enter Role Name"
            value={inputs}
            onChange={handleChange}
            error={{ name: errors?.name === 'required' ? 'Role Name is required' : errors?.name }}
          />

          <div className="description-input">
            <TextInput
              className="description-input"
              name="description"
              placeholder="Enter Role Description"
              value={inputs}
              onChange={handleChange}
              error={{
                description:
                  errors?.description === 'required'
                    ? 'Description is required'
                    : errors?.description,
              }}
            />
          </div>
        </div>

        <Stack direction="row" gap={2}>
          <CustomDropdown
            label=""
            options={exportOptions}
            value={selectedExport}
            onChange={val => setSelectedExport(val as string)}
            multiSelect={false}
          />

          <Stack direction="row" alignItems="center" gap={1} flexShrink={0}>
            <input
              className="custom-checkbox"
              type="checkbox"
              checked={permissions.length === allPermissions.length}
              onChange={e => handleSelectAll(e.target.checked)}
            />

            <Typography variant="body2">Allow all Modules</Typography>
          </Stack>
        </Stack>
      </Stack>

      <div></div>

      <Table
        columns={columns}
        rows={transformedPermissions}
        height={'calc(100vh - 250px)'}
        disableSortBy
        checkboxSelection={false}
      />

      <Stack direction="row" justifyContent="center" mt={5}>
        <Button
          onClick={handleSave}
          size="fit"
          shape="square"
          disabled={isLoading || isUpdating}
          style={{ minWidth: 170 }}
        >
          {isLoading || isUpdating ? 'Loading...' : id ? 'Update Permissions' : 'Save Permissions'}
        </Button>
      </Stack>
    </div>
  );
};

export default PermissionsTable;

type TCheckbox = {
  isAvailable: boolean;
  checked: boolean;
  name: string;
  onChange: (name: string, value: boolean) => void;
};

function Checkbox({ isAvailable, checked, name, onChange }: TCheckbox) {
  return isAvailable ? (
    <input
      className="custom-checkbox"
      type="checkbox"
      checked={checked}
      onChange={e => onChange(name, e.target.checked)}
    />
  ) : (
    <></>
  );
}
