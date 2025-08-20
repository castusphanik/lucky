import React, { useEffect, useState } from 'react';
import Popup from '../Popup';
import Input from '../Form/Input';
import Button from '../Button';
import './styles.scss';

const initialFormState = {
  unit: '',
  leasePO: '',
  account: '',
  startDate: '',
  schedule: '',
  terminationDate: '',
  msa: '',
  status: '',
  leaseAgreement: '',
};

type LeaseFormProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  editData?: typeof initialFormState;
};

const CreateLeaseAgreementModal = ({ open, onClose, isEdit = false, editData }: LeaseFormProps) => {
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
      console.log(isEdit ? 'Updating data:' : 'Submitting new data:', formData);
      onClose();
    }
  };

  return (
    <Popup title={isEdit ? 'Edit Lease Agreement' : 'Create Lease Agreement'} onClose={onClose}>
      <div className="lease-modal">
        <div className="lease-modal__grid">
          {Object.entries(initialFormState).map(([key, _]) => (
            <Input
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              name={key}
              isRequired
              value={formData}
              onChange={handleInputChange}
              error={formErrors}
            />
          ))}
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

export default CreateLeaseAgreementModal;
