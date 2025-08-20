import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { CIRCLE, POLYGON } from '@/helpers/constants';

interface GeofenceRendererProps {
  geofence?: {
    id: number | string,
    geofence_shape: 'Polygon' | 'Circle';
    polygon?: Array<{ lat: number; lng: number }>;
    center?: { lat: number; lng: number };
    radius_meters?: number;
    center_lat?: number;
    center_lng?: number;
  };
  editable?: boolean;
  onEdit?: (updatedGeofence: any) => void;
}

const GeofenceRenderer: React.FC<GeofenceRendererProps> = ({ geofence, editable = false, onEdit }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !geofence) return;

    // Clear previous shapes
    const previous = map.get('renderedGeofences') || [];
    previous.forEach((shape: google.maps.Polygon | google.maps.Circle) => shape.setMap(null));

    const shapes: (google.maps.Polygon | google.maps.Circle)[] = [];

    if (geofence.geofence_shape === POLYGON && geofence.polygon) {
      const polygon = new google.maps.Polygon({
        paths: geofence.polygon,
        map,
        editable: editable,
        draggable: false,
        fillColor: '#FF6B35',
        fillOpacity: 0.2,
        strokeColor: '#FF6B35',
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      shapes.push(polygon);

      // Auto-zoom
      const bounds = new google.maps.LatLngBounds();
      geofence.polygon?.forEach(v => bounds.extend(v));
      map.fitBounds(bounds);
      map.setZoom(6);

      if (editable && onEdit) {
        const emitUpdate = () => {
          const updatedPath = polygon.getPath().getArray().map(p => ({
            lat: p.lat(),
            lng: p.lng(),
          }));
          onEdit({
            ...geofence,
            polygon: updatedPath,
          });
        };

        google.maps.event.addListener(polygon.getPath(), 'set_at', emitUpdate);
        google.maps.event.addListener(polygon.getPath(), 'insert_at', emitUpdate);
        google.maps.event.addListener(polygon.getPath(), 'remove_at', emitUpdate);
      }
    }

    if (geofence.geofence_shape === CIRCLE) {
      const circleLatLng = { lat: geofence.center_lat, lng: geofence.center_lng }
      const circle = new google.maps.Circle({
        center: circleLatLng,
        radius: geofence.radius_meters,
        map,
        editable: editable,
        draggable: editable,
        fillColor: '#FF6B35',
        fillOpacity: 0.2,
        strokeColor: '#FF6B35',
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      shapes.push(circle);

      // Auto-center
      map.setCenter(circleLatLng);
      map.setZoom(6);

      if (editable && onEdit) {
        const emitUpdate = () => {
          onEdit({
            ...geofence,
            // center: {
            //   lat: circle.getCenter()?.lat() ?? 0,
            //   lng: circle.getCenter()?.lng() ?? 0,
            // },
            center_lat: circle.getCenter()?.lat() ?? 0,
            center_lng: circle.getCenter()?.lng() ?? 0,
            radius_meters: circle.getRadius(),
          });
        };

        google.maps.event.addListener(circle, 'center_changed', emitUpdate);
        google.maps.event.addListener(circle, 'radius_changed', emitUpdate);
      }
    }

    map.set('renderedGeofences', shapes);

    return () => {
      shapes.forEach(shape => shape.setMap(null));
    };
  }, [map, geofence, editable, onEdit]);

  return null;
};

export default GeofenceRenderer;
