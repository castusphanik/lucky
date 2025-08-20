import React, { useEffect, useState } from 'react';
import Popup from '../Popup';
import Input from '../Form/Input';
import Button from '../Button';
import './styles.scss';

const initialFormState = {
  name: '',
  contactName: '',
  email: '',
  phone: '',
  noOfEmployee: '',
  branch: '',
};

type CreateTenUserModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  editData?: typeof initialFormState;
};

const CreateTenUserModal = ({
  open,
  onClose,
  isEdit = false,
  editData,
}: CreateTenUserModalProps) => {
  if (!open) return null;

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEdit && editData) {
      setFormData(editData);
    } else {
      setFormData(initialFormState);
    }
  }, [open, isEdit, editData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    const errors: { [key: string]: string } = {};
    Object.keys(initialFormState).forEach(key => {
      if (!formData[key as keyof typeof formData]?.trim()) {
        errors[key] = ' is required';
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log(isEdit ? 'Updating Ten User:' : 'Creating Ten User:', formData);
      onClose();
    }
  };

  return (
    <Popup title={isEdit ? 'Edit Ten User' : 'Create Ten User'} onClose={onClose} width={370}>
      <div className="ten-user-modal">
        <div className="ten-user-modal__grid">
          <Input
            label="Name"
            name="name"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Contact Name"
            name="contactName"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Email"
            name="email"
            isRequired
            type="email"
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Phone"
            name="phone"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="No of Employee"
            name="noOfEmployee"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Branch"
            name="branch"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
        </div>

        <div className="ten-user-modal__actions">
          <Button size="fit" onClick={handleSubmit} color="primary">
            {isEdit ? 'Save & Update' : 'Save'}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default CreateTenUserModal;
