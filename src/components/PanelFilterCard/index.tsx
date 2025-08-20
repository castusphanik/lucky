import React from 'react';
import './styles.scss';

interface PanelFilterCardProps {
  unitNumber: string;
  year: string;
  make: string;
  model: string;
  trailerLength: string;
  vehicleType: string;
  lastGpsUpdate: string;
  loadStatus: string;
}

const PanelFilterCard: React.FC<PanelFilterCardProps> = ({
  unitNumber,
  year,
  make,
  model,
  trailerLength,
  vehicleType,
  lastGpsUpdate,
  loadStatus,
}) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="panel-filter-card">
      {/* Top Section */}
      <div className="card-top">
        <div className="unit-number">{unitNumber}</div>
        <div className="vehicle-title">
          {year} {make} {model}
        </div>
        <div className="vehicle-details">
          {trailerLength} {vehicleType}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="card-bottom">
        <div className="gps-update">{formatDate(lastGpsUpdate)}</div>
        <div className="load-status">{loadStatus}</div>
      </div>

      {/* Divider */}
      <div className="card-divider"></div>
    </div>
  );
};

export default PanelFilterCard;
