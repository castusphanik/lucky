import React, { useCallback } from 'react';
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { TruckSvg } from '../icons/TruckSvg';
import type { FleetAsset } from '../../types/fleet';

type FleetMarkerProps = {
  position: google.maps.LatLngLiteral;
  assetId: string;
  asset: FleetAsset;
  onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement, assetId: string) => void;
};

const FleetMarker = ({ position, assetId, asset, onMarkerClick }: FleetMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, assetId),
    [onMarkerClick, marker, assetId]
  );

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981'; // green
      case 'idle':
        return '#F59E0B'; // amber
      case 'maintenance':
        return '#EF4444'; // red
      case 'alert':
        return '#DC2626'; // dark red
      default:
        return '#6B7280'; // gray
    }
  };

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      onClick={handleClick}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
      className={'marker fleet-asset'}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: getMarkerColor(asset.status),
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <TruckSvg />
        {asset.hasAlert && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '12px',
              height: '12px',
              backgroundColor: '#DC2626',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        )}
      </div>
    </AdvancedMarker>
  );
};

export default FleetMarker;
