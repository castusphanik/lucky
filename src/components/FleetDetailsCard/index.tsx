import React from 'react';
import './styles.scss';
import Button from '../Button';
import LinkIcon from '@/assets/link-solid-full.svg';
import { Link } from 'react-router-dom';

interface FleetDetailsCardProps {
  fleetData?: {
    unitNumber?: string;
    year?: string | number;
    make?: string | null;
    model?: string;
    length?: string | number;
    doorType?: string | null;
    vin?: string;
    agreementType?: string;
    licensePlateNumber?: string | null;
    licensePlateState?: string | null;
    lastPmDate?: string;
    latitude?: string | number;
    longitude?: string | number;
    location?: string;
    motionStatus?: string;
    lastGpsUpdate?: string;
  };
}

const FleetDetailsCard = ({ fleetData }: FleetDetailsCardProps) => {
  // Format the vehicle description
  const getVehicleDescription = () => {
    if (!fleetData) return '';
    const { year, make, model, length, doorType } = fleetData;
    const parts = [year, make, model, length, doorType]
      .map(item => (item === null || item === 'null' ? '' : String(item)))
      .filter(Boolean);
    return parts.join(' ');
  };

  // Format the last PM date
  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === 'null') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  // Format the last GPS update
  const formatGpsDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return '';
    }
  };

  // Format coordinates
  const formatCoordinates = () => {
    if (!fleetData?.latitude || !fleetData?.longitude) return '';
    const lat = parseFloat(String(fleetData.latitude));
    const lng = parseFloat(String(fleetData.longitude));
    if (Number.isNaN(lat) || Number.isNaN(lng)) return '';
    return `${lat.toFixed(8)} (LAT)\n${lng.toFixed(8)} (LNG)`;
  };

  if (!fleetData) {
    return (
      <div className="fleet-details-card">
        <p>No fleet data available</p>
      </div>
    );
  }

  return (
    <div className="fleet-details-card">
      <section className="fleet-details-card__wrapper">
        <div className="fleet-details-card__equipment-info">
          <div className="fleet-details-card__separator"></div>

          <h2>{fleetData.unitNumber || 'N/A'}</h2>
          <p>{getVehicleDescription() || 'N/A'}</p>
          <article className="fleet-details-card__equipment-info-item">
            <p>VIN#: </p>
            <p>{fleetData.vin || 'N/A'}</p>
          </article>
          <article className="fleet-details-card__equipment-info-item">
            <p>Contract Type: </p>
            <p>{fleetData.agreementType || 'N/A'}</p>
          </article>
          <article className="fleet-details-card__equipment-info-item">
            <p>License Plate #: </p>
            <p>
              {[fleetData.licensePlateNumber, fleetData.licensePlateState]
                .filter(Boolean)
                .join(' ') || 'N/A'}
            </p>
          </article>
          <article className="fleet-details-card__equipment-info-item">
            <p>Last PM Date: </p>
            <p>{formatDate(fleetData.lastPmDate)}</p>
          </article>
        </div>
        <div className="fleet-details-card__gps-info">
          <h2>GPS Information</h2>
          <article className="fleet-details-card__equipment-info-item">
            <p>Provider: </p>
            <p>Road Ready</p>
          </article>
          <article className="fleet-details-card__equipment-info-item">
            <p>Coordinates: </p>
            <p>{formatCoordinates()}</p>
          </article>
          <article className="fleet-details-card__equipment-info-item">
            <p>Location: </p>
            <p>{fleetData.location || 'N/A'}</p>
          </article>
          <article className="fleet-details-card__equipment-info-item">
            <p>Location: </p>
            <p>{fleetData.motionStatus || 'N/A'}</p>
          </article>
          <article className="fleet-details-card__equipment-info-item">
            <p>Last GPS Updated: </p>
            <p>{formatGpsDate(fleetData.lastGpsUpdate)}</p>
          </article>
        </div>
      </section>
      <section className="fleet-details-card__service-line"></section>
      <section className="fleet-details-card__services">
        <Button className="access-btn" size="fit">
          Request Service
        </Button>
        <p className="fleet-details-card__service-item">
          <img src={LinkIcon} alt="link" />
          <Link
            to="/fleet/fleet-view-details"
            state={{
              gpsInfo: {
                motionStatus: fleetData?.motionStatus ?? '',
                lastGpsUpdate: fleetData?.lastGpsUpdate ?? '',
                location: fleetData?.location ?? '',
              },
              equipmentSpecificationsInfo: {
                unitNumber: String(fleetData?.unitNumber ?? ''),
                vin: String(fleetData?.vin ?? ''),
                make: String(fleetData?.make ?? ''),
                year: String(fleetData?.year ?? ''),
                color: '',
                doorType: String(fleetData?.doorType ?? ''),
                floorType: '',
                wallType: '',
                rimType: '',
                trailerHeight: '',
                trailerWidth: '',
                roofType: '',
                trailerLength: String(fleetData?.length ?? ''),
                tireSize: '',
                dateInService: '',
              },
              equipmentContractInfo: {
                account: '',
              },
            }}
          >
            Additional Details about trailer
          </Link>
        </p>
        <p className="fleet-details-card__service-item">
          <img src={LinkIcon} alt="link" />
          <Link
            to="/fleet/fleet-view-details"
            state={{
              gpsInfo: {
                motionStatus: fleetData?.motionStatus ?? '',
                lastGpsUpdate: fleetData?.lastGpsUpdate ?? '',
                location: fleetData?.location ?? '',
              },
              equipmentSpecificationsInfo: {
                unitNumber: String(fleetData?.unitNumber ?? ''),
                vin: String(fleetData?.vin ?? ''),
                make: String(fleetData?.make ?? ''),
                year: String(fleetData?.year ?? ''),
                color: '',
                doorType: String(fleetData?.doorType ?? ''),
                floorType: '',
                wallType: '',
                rimType: '',
                trailerHeight: '',
                trailerWidth: '',
                roofType: '',
                trailerLength: String(fleetData?.length ?? ''),
                tireSize: '',
                dateInService: '',
              },
              equipmentContractInfo: {
                account: '',
              },
            }}
          >
            Additional Details about PM Compliance
          </Link>
        </p>
      </section>
    </div>
  );
};

export default FleetDetailsCard;
