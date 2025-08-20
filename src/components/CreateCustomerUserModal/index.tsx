// CreateCustomerUserModal.tsx
import { useEffect, useState } from 'react';
import Popup from '../Popup';
import Input from '../Form/Input';
import Button from '@/components/Button';
import CustomDropdown from '@/components/Form/Dropdown';
import './styles.scss';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  title: '',
  role: '',
  customerAccount: '',
  permission: '',
};

type CreateCustomerUserModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  editData?: typeof initialFormState;
};

const CreateCustomerUserModal = ({
  open,
  onClose,
  isEdit = false,
  editData,
}: CreateCustomerUserModalProps) => {
  if (!open) return null;

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const roleOptions = ['Admin', 'Expert User', 'Basic User'];
  const customerAccountOptions = ['Parent Account', 'Child Account'];
  const permissionOptions = ['Fleet Management', 'TEN Care', 'Billing', 'Reports'];

  useEffect(() => {
    if (isEdit && editData) {
      setFormData(editData);
    } else {
      setFormData(initialFormState);
    }
  }, [open, isEdit, editData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    const errors: { [key: string]: string } = {};
    Object.keys(initialFormState).forEach((key) => {
      if (!formData[key as keyof typeof formData]?.trim()) {
        errors[key] = ' is required';
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log(isEdit ? 'Updating Customer User:' : 'Creating Customer User:', formData);
      onClose();
    }
  };

  return (
    <Popup title={isEdit ? 'Edit Customer User' : 'Create Customer User'} onClose={onClose} width={400}>
      <div className="customer-user-modal">
        <div className="customer-user-modal__grid">
          <Input label="Name" name="name" isRequired value={formData} onChange={handleInputChange} error={formErrors} />
          <Input label="Email" name="email" isRequired type="email" value={formData} onChange={handleInputChange} error={formErrors} />
          <Input label="Phone" name="phone" isRequired value={formData} onChange={handleInputChange} error={formErrors} />
          <Input label="Title" name="title" isRequired value={formData} onChange={handleInputChange} error={formErrors} />

          <CustomDropdown
            label="Role"
            required
            options={roleOptions}
            value={formData.role}
            onChange={(val) => handleInputChange('role', val as string)}
            errorText={formErrors.role}
          />

          <CustomDropdown
            label="Customers Accounts"
            required
            options={customerAccountOptions}
            value={formData.customerAccount}
            onChange={(val) => handleInputChange('customerAccount', val as string)}
            errorText={formErrors.customerAccount}
          />

          <CustomDropdown
            label="Permissions"
            required
            options={permissionOptions}
            multiSelect
            value={formData.permission ? formData.permission.split(', ') : []}
            onChange={(val) =>
              handleInputChange('permission', Array.isArray(val) ? val.join(', ') : val)
            }
            errorText={formErrors.permission}
          />
        </div>

        <div className="customer-user-modal__actions">
          <Button size="fit" onClick={handleSubmit} color="primary">
            {isEdit ? 'Update' : 'Save'}
          </Button>
          {/* <Button size="fit" onClick={onClose} color="primary">
            Cancel
          </Button> */}
        </div>
      </div>
    </Popup>
  );
};

export default CreateCustomerUserModal;
