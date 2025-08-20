import { Typography } from '@mui/material';
import './styles.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  equipmentContractDetailsLabelMap,
  equipmentSpecificationsDetailsLabelMap,
  gpsInfoLabelMap,
} from '@/helpers/columns';
import { useDispatch } from 'react-redux';
import { setTopBarConfig } from '@/features/layout/layoutSlice';

const gpsInfo = {
  provider: 'Skybitz',
  motionStatus: 'Idle',
  lastGpsUpdate: '22/03/2025 at 11:22 PM',
  location: 'SpringTown, TX, US',
  coordinates: '-97.6791 (LON) 32.98471(LAT)',
};

const equipmentSpecificationsInfo = {
  unitNumber: '2033007PLA',
  staus: 'Active On-Contract',
  vin: '#1DW1268526134114',
  custom: 'N/A',
  make: 'STRICK COORPORATION',
  suspension: 'Spring',
  year: '2025',
  color: 'Dark Gray',
  doorType: 'SWING DOOR',
  floorType: 'WOOD STD',
  wallType: 'NONE SPECIFIED',
  rimType: 'Unimount',
  gpsEquipped: 'No',
  trailerHeight: `13'6"`,
  brakeType: 'N/A',
  trailerWidth: `102"`,
  roofType: 'Translucent',
  track: 'None Specified',
  trailerLength: '53',
  dateAcquiredOn: 'June 1, 2025 to July 31, 2025',
  tireSize: '295/75R22.5',
  dateInService: 'June 1, 2025 to July 31, 2025',
};

const equipmentContractInfo = {
  contractType: 'Lease',
  scheduleA: 'ABC123',
  account: '1133811PL A',
  scheduleS: 'ABC123',
};

const EquipmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location?.state ?? {}) as {
    gpsInfo?: Record<string, string>;
    equipmentSpecificationsInfo?: Record<string, string>;
    equipmentContractInfo?: Record<string, string>;
  };
  const dispatch = useDispatch();

  const handleClick = () => {
    navigate('/telematics');
    dispatch(
      setTopBarConfig({
        showBackButton: false,
        title: 'Telematics',
        extraContent: null,
        onBack: () => {},
        isSideBarOpen: true,
      })
    );
  };

  const renderDetails = <T extends Record<string, string>>(
    labelMap: T,
    infoData: Record<keyof T, string>
  ) => {
    return (
      <div className="equipment-details__spec-grid">
        {Object.entries(labelMap).map(([key, label]) => (
          <div className="equipment-details__spec-item" key={key}>
            <span className="equipment-details__label">{label}</span>
            {key === 'scheduleA' || key === 'scheduleS' ? (
              <a href={infoData[key]} target="_blank" rel="noopener noreferrer">
                {infoData[key] ?? '-'}
              </a>
            ) : (
              infoData[key] ?? '-'
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="equipment-details">
      <div className="equipment-details__header">
        <div className="equipment-details__header-left">
          <p className="van-img"></p>
          <div>
            <p>2336427PRA</p>
            <Typography variant="h6">2023 VANGUARD</Typography>
            <p>53 VAN</p>
          </div>
        </div>
        <div className="equipment-details__header-right">
          <p className="equipment-details__gps-head">GPS Information:</p>
          <div className="equipment-details__gps-info">
            {Object.entries(gpsInfoLabelMap).map(([key, label], index) => (
              <div className={`equipment-details__info-row item-${index + 1}`} key={key}>
                <p>{label}:</p>
                <p>{state.gpsInfo?.[key] ?? gpsInfo[key as keyof typeof gpsInfo]}</p>
              </div>
            ))}
          </div>
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              handleClick();
            }}
            className="equipment-details__telematics-link"
          >
            View Telematics Activity Feed
          </a>
        </div>
      </div>
      <hr className="equipment-details__line" />
      <div className="equipment-specifications">
        <p className="equipment-details__title">Equipment Specifications Details</p>
        {renderDetails(equipmentSpecificationsDetailsLabelMap, {
          ...equipmentSpecificationsInfo,
          ...(state.equipmentSpecificationsInfo ?? {}),
        } as Record<keyof typeof equipmentSpecificationsDetailsLabelMap, string>)}
      </div>
      <div className="equipment-contract">
        <p className="equipment-details__title">Equipment Contract Details</p>
        {renderDetails(equipmentContractDetailsLabelMap, {
          ...equipmentContractInfo,
          ...(state.equipmentContractInfo ?? {}),
        } as Record<keyof typeof equipmentContractDetailsLabelMap, string>)}
      </div>
    </div>
  );
};

export default EquipmentDetails;
