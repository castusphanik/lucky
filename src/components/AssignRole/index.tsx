import { useState } from 'react';
import CustomDropdown from '../Form/Dropdown';
import Popup from '../Popup';
import Button from '../Button';

const options = ['Fleet Management', 'TEN Care', 'Billing', 'Reports', 'Account Management'];

type TProps = {
  open: boolean;
  onClose: () => void;
};

function AssignRole({ open, onClose }: TProps) {
  const [value, setValue] = useState<string[]>([]);

  if (!open) return;

  return (
    <Popup title="Assign Role" width={400} onClose={onClose}>
      <CustomDropdown
        multiSelect
        label="Assign Role"
        options={options}
        value={value}
        onChange={val => setValue(val as string[])}
      />

      <Button size="fit" style={{ marginTop: 15, padding: '10px 20px' }}>
        Assign
      </Button>
    </Popup>
  );
}

export default AssignRole;
