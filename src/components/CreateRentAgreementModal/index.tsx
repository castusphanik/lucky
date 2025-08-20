import React, { useState, useEffect } from 'react';
import Popup from '../Popup';
import Input from '../Form/Input';
import Button from '../Button'; 
import './styles.scss';

const initialFormState = {
  unit: '',
  PONumber: '',
  accountName: '',
  startDate: '',
  account: '',
  endDate: '',
  tenFacility: '',
  status: '',
  rentalType: '',
};

type RentAgreementModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  editData?: typeof initialFormState;
};

const CreateRentAgreementModal = ({
  open,
  onClose,
  isEdit = false,
  editData,
}: RentAgreementModalProps) => {
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
      console.log(isEdit ? 'Updating Rent Agreement:' : 'Creating Rent Agreement:', formData);
      onClose(); // Close after submission
    }
  };

  return (
    <Popup
      title={isEdit ? 'Edit Rent Agreement' : 'Create Rent Agreement'}
      open={open}
      onClose={onClose}
    >
      <div className="lease-modal">
        <div className="lease-modal__grid">
          <Input
            label="Unit"
            name="unit"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="PO Number"
            name="PONumber"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Account Name"
            name="accountName"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Start Date"
            name="startDate"
            isRequired
            // type="date"
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Account"
            name="account"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="End Date"
            name="endDate"
            isRequired
            // type="date"
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="TEN Facility"
            name="tenFacility"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Status"
            name="status"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
          <Input
            label="Rental Type"
            name="rentalType"
            isRequired
            value={formData}
            onChange={handleInputChange}
            error={formErrors}
          />
        </div>

        <div className="lease-modal__actions">
          <Button size="fit" onClick={handleSubmit} color="primary">
            {isEdit ? 'Update' : 'Save'}
          </Button>
          <Button size="fit" onClick={onClose} color="gray">
            Cancel
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default CreateRentAgreementModal;
