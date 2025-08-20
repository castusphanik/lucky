import Status from '@/components/Status';
import type { TColumns } from '@/components/Table';
import { Edit } from '@/pages/AccountsManagement/UserRolesPermissions';

export const PMColumns: TColumns = [
  { label: 'Unit Alias/ID', field: 'unit_alias' },
  { label: 'Equipment Type', field: 'equipment_type' },
  { label: 'PM Type', field: 'pm_type' },
  { label: 'Location / Parking Facility', field: 'location_parking_facility' },
  { label: 'Last PM Date', field: 'last_pm_date' },
  { label: 'Next PM Due Date', field: 'next_pm_due_date' },
  { label: 'Status', field: 'status', renderComponent: Status },
];

export const DOTColumns: TColumns = [
  { label: 'Unit Alias/ID', field: 'unit_alias' },
  { label: 'Equipment Type', field: 'equipment_type' },
  { label: 'Last DOT Inspection Date', field: 'last_dot_inspection_date' },
  { label: 'Next Due Date', field: 'next_due_date' },
  { label: 'Valid Through', field: 'valid_through' },
  { label: 'Permits Status', field: 'permits_status' },
  { label: 'Compliance %', field: 'compliance' },
];

export const PMDetailsColumns: TColumns = [
  { label: 'Date of Service', field: 'date_of_service' },
  { label: 'Work Performed', field: 'work_performed' },
  { label: 'Location', field: 'location' },
  { label: 'Vendor / Technician', field: 'vendor_technician' },
  { label: 'Time taken', field: 'time_taken' },
  { label: 'Parts Replaced', field: 'parts_replaced' },
];

export const EquipmentListingColumns: TColumns = [
  { label: 'Customer Ref.#', field: 'customer_ref' },
  { label: 'Trailer Model', field: 'trailer_model' },
  { label: 'VIN#', field: 'vin' },
  { label: 'Location', field: 'location' },
  { label: 'Year', field: 'year' },
  { label: 'Status', field: 'status' },
  { label: 'Asset Type', field: 'asset_type' },
];

export const gpsInfoLabelMap = {
  provider: 'Provider',
  motionStatus: 'Motion Status',
  lastGpsUpdate: 'Last GPS Update',
  location: 'Location',
  coordinates: 'Coordinates',
};

export const equipmentSpecificationsDetailsLabelMap = {
  unitNumber: 'Unit Number',
  staus: 'Status',
  vin: 'VIN',
  custom: 'Custom',
  make: 'Make',
  suspension: 'Suspension',
  year: 'Year',
  color: 'Color',
  doorType: 'DoorType',
  floorType: 'FloorType',
  wallType: 'Wall Type',
  rimType: 'RimType',
  gpsEquipped: 'GPS Equipped',
  trailerHeight: 'Trailer Height',
  brakeType: 'Brake Type',
  trailerWidth: 'Trailer Width',
  roofType: 'roof Type',
  track: 'Track',
  trailerLength: 'Trailer Length',
  dateAcquiredOn: 'Date Acquired On',
  tireSize: 'Tire Size',
  dateInService: 'Date in Service',
};

export const equipmentContractDetailsLabelMap = {
  contractType: 'Contract Type',
  scheduleA: 'Schedule A',
  account: 'Account',
  scheduleS: 'Schedule S',
};

export const DOTPMColumnSelector = [
  { label: 'Account Name', field: 'accountName' },
  { label: 'Account Manager', field: 'accountManager' },
  { label: 'Account Number', field: 'accountNumber' },
  { label: 'Legacy Account', field: 'legacyAccunt' },
  { label: 'RA Facility', field: 'raFacility' },
  { label: 'Account Type', field: 'accountType' },
];

export const EquipmentListingSelectorColumns = [
  { label: 'Test1', field: 'test1' },
  { label: 'Test2', field: 'test2' },
];

export const UserRolesColumns = [
  { label: '', field: 'edit', renderComponent: Edit },
  { label: 'Role Name', field: 'name' },
  { label: 'Description', field: 'description' },
  { label: 'Created On', field: 'created_by' },
];
