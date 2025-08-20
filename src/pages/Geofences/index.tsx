import React, { useState, useCallback, useEffect } from 'react';
import Tabs from '@/components/Tabs';
import StatusCard from '@/components/StatusCard';
import Table from '@/components/Table';
import { TbMap, TbList } from 'react-icons/tb';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import TextInput from '@/components/Inputs/TextInput';
import Select from '@/components/Inputs/Select';
import Button from '@/components/Button';
import type { TColumns } from '@/components/Table';
import { useDrawingManager } from '@/hooks/useDrawingManager';
import { AutocompleteCustom } from '@/components/AutoComplete';
import AutocompleteResult from '@/components/AutoCompleteResult';
import GeofenceDetails from '@/components/GeofenceDetails';
import GeofenceRenderer from '@/components/GeofenceRenderer';
import { useGeofenceContext } from '@/contexts/GeofenceContext';
import './styles.scss';
import CreateAlert from '@/components/CreateAlert';
import toast from 'react-hot-toast';
import { setTopBarConfig } from '@/features/layout/layoutSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector, type RootState } from '@/redux/store';
import { useCreateGeoFenceMutation, useGetTagLookupQuery, useLazyGetGeofencesQuery } from '@/services/geofences';
import { convertToWKTPolygon, formatDate, getLocationName } from '@/helpers/utils';
import { ACTIVE, LIST } from '@/helpers/constants';
import { renderAccounts } from '@/components/DetailedOverview';
import Textarea from '@/components/Form/Textarea';
import type { GeofenceAPIData, TagLookupData } from '@/types/geofence';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Enhanced geofence data structure
interface GeofenceData {
  id: string;
  name: string;
  shape: 'circle' | 'polygon';
  location: {
    lat: number;
    lng: number;
    address?: string;
    placeId?: string;
  };
  // Circle specific data
  circleData?: {
    center: { lat: number; lng: number };
    radius: number; // in meters
    area: number; // in square meters
  };
  // Polygon specific data
  polygonData?: {
    vertices: Array<{ lat: number; lng: number }>;
    vertexCount: number;
    center: { lat: number; lng: number };
    area: number; // in square degrees
  };
  // Map zoom level when geofence was drawn
  drawnAtZoom: number;
  tagLookupId: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  createdBy: string;
  description?: string;
  alertsConfigured?: number;
  accounts?: string[];
}

// Modal form data
interface GeofenceFormData {
  name: string;
  location: {
    lat: string;
    lng: string;
    address?: string;
    addressComponents?: google.maps.GeocoderAddressComponent[],
  };
  shape: 'circle' | 'polygon';
  tagLookupId: string;
  // Circle specific form data
  circleData?: {
    centerLat: string;
    centerLng: string;
    radius: string;
  };
  // Polygon specific form data
  polygonData?: {
    vertices: Array<{ lat: string; lng: string }>;
  };
  locationName: string;
  description: string;
}

const { ACTIVITY_FEED, GEOFENCES, TELEMATICS_ALERTS } = {
  ACTIVITY_FEED: 'activity_feed',
  GEOFENCES: 'geofences',
  TELEMATICS_ALERTS: 'telematics_alerts',
};

const tabs = [
  { label: 'Activity Feed', value: ACTIVITY_FEED },
  { label: 'Geofences', value: GEOFENCES },
  { label: 'Telematics Alerts', value: TELEMATICS_ALERTS },
];

// Activity Feed data
const activityFeedData = [
  { id: 1, title: 'Idle Trailers', value: 548, color: '#e7840f' },
  { id: 2, title: 'Trailers in Motion', value: 548, color: '#f34141' },
  { id: 3, title: 'Trailers not reporting last 48 hours', value: 548, color: '#27e427' },
  { id: 4, title: 'Devices with Health Issues', value: 548, color: '#387bfe' },
];

// Telematics Alerts data
const telematicsAlertsData = [
  { id: 1, title: 'Idle Trailers', value: 548, color: '#e7840f' },
  { id: 2, title: 'Trailers in Motion', value: 548, color: '#f34141' },
  { id: 3, title: 'Trailers not reporting last 48 hours', value: 548, color: '#27e427' },
  { id: 4, title: 'Devices with Health Issues', value: 548, color: '#387bfe' },
];

// Geofences data
const geofencesData = [
  { id: 1, title: 'Active Geofences', value: 15, color: '#e7840f' },
  { id: 2, title: 'Geofence', value: 8, color: '#f34141' },
  { id: 3, title: 'Outside Geofence', value: 7, color: '#27e427' },
  { id: 4, title: 'Geofence Entries Last 24 hours', value: 6, color: '#387bfe' },
  { id: 5, title: 'Geofence Exits Last 24 hours', value: 6, color: '#387bfe' },
];

// View toggle options
const viewToggleOptions = [
  { label: 'Map View', value: 'map', icon: TbMap },
  { label: 'List View', value: 'list', icon: TbList },
];

// Geofences table columns
const geofencesColumns: TColumns = [
  {
    label: 'Geofence Name',
    field: 'geofence_name',
    renderComponent: ({ geofence, onClick }) => (
      <span
        className="geofence-name-link"
        style={{
          color: 'var(--color-primary)',
          cursor: 'pointer',
          fontWeight: 600,
          textDecoration: 'underline',
        }}
        onClick={e => {
          e.stopPropagation();
          onClick(geofence);
        }}
      >
        {geofence?.geofence_name}
      </span>
    ),
  },
  { label: 'Geofence Shape', field: 'geofence_shape' },
  { label: 'Geofence Location (City/State)', field: 'geofence_location' },
  { label: 'Account(s)', field: 'accounts', renderComponent: renderAccounts },
  { label: 'Created Date', field: 'created_date' },
  { label: 'Created By', field: 'created_by' },
  { label: 'Status', field: 'status' },
  { label: 'Description', field: 'description' },
];

// Activity Feed table columns
const activityFeedColumns: TColumns = [
  { label: 'Unit #', field: 'unit_number' },
  { label: 'Equipment Type', field: 'equipment_type' },
  { label: 'Event', field: 'event' },
  { label: 'Date / Time', field: 'date_time' },
  { label: 'Column 5', field: 'column_5' },
  { label: 'Column 6', field: 'column_6' },
];

// Telematics Alerts table columns
const telematicsAlertsColumns: TColumns = [
  { label: 'Events', field: 'events' },
  { label: 'Period', field: 'period' },
  { label: 'Equipment', field: 'equipment' },
  { label: 'Delivery Method', field: 'delivery_method' },
  { label: 'Recipients', field: 'recipients' },
  { label: 'Delivery Frequency', field: 'delivery_frequency' },
];

// Activity Feed table rows
const activityFeedRows = [
  {
    id: 1,
    unit_number: '2033007PLA',
    equipment_type: 'Dry Van',
    event: '-',
    date_time: '07/24/2025 16:33 PM',
    column_5: '-',
    column_6: '-',
  },
  {
    id: 2,
    unit_number: '4519821CHI',
    equipment_type: 'Reefer',
    event: '-',
    date_time: '07/25/2025 09:15 AM',
    column_5: '-',
    column_6: '-',
  },
  {
    id: 3,
    unit_number: '8820456ATL',
    equipment_type: 'Flatbed',
    event: '-',
    date_time: '07/26/2025 11:00 AM',
    column_5: '-',
    column_6: '-',
  },
];

// Telematics Alerts table rows
const telematicsAlertsRows = [
  {
    id: 1,
    events: 'Geofence Entry',
    period: 'Between Hours',
    equipment: 'Accounts',
    delivery_method: 'Text',
    recipients: 'Text',
    delivery_frequency: 'Once per day',
  },
  {
    id: 2,
    events: 'Geofence Exit',
    period: 'Specific Weekdays',
    equipment: 'Individual Trailers',
    delivery_method: 'Email',
    recipients: 'Email',
    delivery_frequency: 'Once per week',
  },
];

const Geofences = () => {
  const dispatch = useDispatch()
  const isBackClicked = useSelector((state: RootState) => state.layout.isBackClicked);

  // Use context for persistent state
  const {
    geofences,
    setGeofences,
    selectedGeofence,
    setSelectedGeofence,
    showDetailsPage,
    setShowDetailsPage,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    isModalOpen,
    setIsModalOpen,
    currentShape,
    setCurrentShape,
    selectedPlace,
    setSelectedPlace,
  } = useGeofenceContext();

  const [createGeofence, { isLoading }] = useCreateGeoFenceMutation();
  const [getGeofences, { data, isLoading: loadingGeofence, isError }] = useLazyGetGeofencesQuery();
  const { data: tagData } = useGetTagLookupQuery()

  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}') ?? null;
  const { selectedAccountIds } = useAppSelector(state => state.selectedAccounts);
  const accountIds = selectedAccountIds.filter(id => id !== 'select-all').map(id => Number(id));

  // Initialize activeTab to GEOFENCES if not set
  React.useEffect(() => {
    if (!activeTab) {
      setActiveTab(GEOFENCES);
    }
  }, [activeTab, setActiveTab]);

  // Map reference for getting zoom level
  const mapRef = React.useRef<google.maps.Map | null>(null);

  // Custom hook for drawing manager
  const MapWithDrawing = () => {
    const { drawingManager } = useDrawingManager();
    const map = useMap();

    // Store map reference for getting zoom level
    React.useEffect(() => {
      if (map) {
        mapRef.current = map;
      }
    }, [map]);

    // Handle new shapes being drawn
    React.useEffect(() => {
      if (!drawingManager) return;

      console.log('=== DRAWING MANAGER INITIALIZED ===');
      console.log('Drawing Manager:', drawingManager);
      console.log('Available Drawing Modes:', drawingManager.getDrawingMode());
      console.log('==================================');

      const handleCircleComplete = (circle: google.maps.Circle) => {
        const center = circle.getCenter();
        if (center) {
          const circleData = {
            type: 'circle',
            center: {
              lat: center.lat(),
              lng: center.lng(),
            },
            radius: circle.getRadius(),
            bounds: circle.getBounds()?.toJSON(),
            map: circle.getMap(),
            editable: circle.getEditable(),
            draggable: circle.getDraggable(),
            visible: circle.getVisible(),
            fillColor: circle.get('fillColor'),
            fillOpacity: circle.get('fillOpacity'),
            strokeColor: circle.get('strokeColor'),
            strokeOpacity: circle.get('strokeOpacity'),
            strokeWeight: circle.get('strokeWeight'),
          };

          // Get current map zoom level
          const currentZoom = map?.getZoom() || 15;

          console.log('=== CIRCLE DRAWING COMPLETE ===');
          console.log('Circle Data:', circleData);
          console.log('Circle Object:', circle);
          console.log('Center Coordinates:', { lat: center.lat(), lng: center.lng() });
          console.log('Radius (meters):', circle.getRadius());
          console.log('Area (approximate sq meters):', Math.PI * Math.pow(circle.getRadius(), 2));
          console.log('Zoom Level:', currentZoom);
          console.log('==============================');

          setCurrentShape({ shape: circle, type: 'circle' });

          // Pre-populate form with circle data
          const radius = circle.getRadius();

          setFormData(prev => ({
            ...prev,
            name: '', // Keep empty for user to fill
            shape: 'circle',
            location: {
              ...prev.location,
              lat: center.lat().toString(),
              lng: center.lng().toString(),
            },
            tagLookupId: '1', // Default group
            circleData: {
              centerLat: center.lat().toString(),
              centerLng: center.lng().toString(),
              radius: radius.toString(),
            },
          }));

          // Geocode the location
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: center }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const locationName = getLocationName(results);

              const geocodeData = {
                status,
                formattedAddress: results[0].formatted_address,
                placeId: results[0].place_id,
                types: results[0].types,
                geometry: results[0].geometry,
                addressComponents: results[0].address_components,
              };

              console.log('=== GEOCODING RESULTS ===');
              console.log('Geocode Data:', geocodeData);
              console.log('Formatted Address:', results[0].formatted_address);
              console.log('Place ID:', results[0].place_id);
              console.log('Address Components:', results[0].address_components);
              console.log('Location Name:', locationName);
              console.log('========================');

              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: results[0].formatted_address,
                  addressComponents: results[0].address_components,
                },
                locationName: locationName,
              }));
            } else {
              console.log('=== GEOCODING FAILED ===');
              console.log('Status:', status);
              console.log('Results:', results);
              console.log('========================');
            }
          });

          // Open the modal automatically when circle is completed
          setIsModalOpen(true);
        }

        drawingManager.setDrawingMode(null);
      };

      const handlePolygonComplete = (polygon: google.maps.Polygon) => {
        const path = polygon.getPath();
        if (path && path.getLength() > 0) {
          // Calculate center of polygon
          let latSum = 0;
          let lngSum = 0;
          const pathLength = path.getLength();
          const vertices: Array<{ lat: number; lng: number }> = [];

          for (let i = 0; i < pathLength; i++) {
            const vertex = path.getAt(i);
            latSum += vertex.lat();
            lngSum += vertex.lng();
            vertices.push({ lat: vertex.lat(), lng: vertex.lng() });
          }

          const centerLat = latSum / pathLength;
          const centerLng = lngSum / pathLength;

          // Calculate approximate area using shoelace formula
          let area = 0;
          for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            area += vertices[i].lng * vertices[j].lat;
            area -= vertices[j].lng * vertices[i].lat;
          }
          area = Math.abs(area) / 2;

          const polygonData = {
            type: 'polygon',
            center: {
              lat: centerLat,
              lng: centerLng,
            },
            vertices: vertices,
            vertexCount: pathLength,
            bounds: null, // Polygons don't have getBounds method
            map: polygon.getMap(),
            editable: polygon.getEditable(),
            draggable: polygon.getDraggable(),
            visible: polygon.getVisible(),
            fillColor: polygon.get('fillColor'),
            fillOpacity: polygon.get('fillOpacity'),
            strokeColor: polygon.get('strokeColor'),
            strokeOpacity: polygon.get('strokeOpacity'),
            strokeWeight: polygon.get('strokeWeight'),
            approximateArea: area, // in square degrees (rough approximation)
          };

          // Get current map zoom level
          const currentZoom = map?.getZoom() || 15;

          console.log('=== POLYGON DRAWING COMPLETE ===');
          console.log('Polygon Data:', polygonData);
          console.log('Polygon Object:', polygon);
          console.log('Center Coordinates:', { lat: centerLat, lng: centerLng });
          console.log('Number of Vertices:', pathLength);
          console.log('Vertices:', vertices);
          console.log('Approximate Area (sq degrees):', area);
          console.log('Zoom Level:', currentZoom);
          console.log('================================');

          setCurrentShape({ shape: polygon, type: 'polygon' });

          // Pre-populate form with polygon data
          setFormData(prev => ({
            ...prev,
            name: '', // Keep empty for user to fill
            shape: 'polygon',
            location: {
              ...prev.location,
              lat: centerLat.toString(),
              lng: centerLng.toString(),
            },
            tagLookupId: '1', // Default group
            polygonData: {
              vertices: vertices.map(v => ({
                lat: v.lat.toString(),
                lng: v.lng.toString(),
              })),
            },
          }));

          // Geocode the center location
          const geocoder = new google.maps.Geocoder();
          const center = new google.maps.LatLng(centerLat, centerLng);
          geocoder.geocode({ location: center }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const locationName = getLocationName(results);

              const geocodeData = {
                status,
                formattedAddress: results[0].formatted_address,
                placeId: results[0].place_id,
                types: results[0].types,
                geometry: results[0].geometry,
                addressComponents: results[0].address_components,
              };

              console.log('=== GEOCODING RESULTS ===');
              console.log('Geocode Data:', geocodeData);
              console.log('Formatted Address:', results[0].formatted_address);
              console.log('Place ID:', results[0].place_id);
              console.log('Address Components:', results[0].address_components);
              console.log('Location Name:', locationName);
              console.log('========================');

              setFormData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: results[0].formatted_address,
                  addressComponents: results[0].address_components,
                },
                locationName: locationName,
              }));
            } else {
              console.log('=== GEOCODING FAILED ===');
              console.log('Status:', status);
              console.log('Results:', results);
              console.log('========================');
            }
          });

          // Open the modal automatically when polygon is completed
          setIsModalOpen(true);
        }

        drawingManager.setDrawingMode(null);
      };

      // Add listeners
      google.maps.event.addListener(drawingManager, 'circlecomplete', handleCircleComplete);
      google.maps.event.addListener(drawingManager, 'polygoncomplete', handlePolygonComplete);

      return () => {
        google.maps.event.clearListeners(drawingManager, 'circlecomplete');
        google.maps.event.clearListeners(drawingManager, 'polygoncomplete');
      };
    }, [drawingManager]);

    return null;
  };

  const [alertOpen, setAlertOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<GeofenceFormData>({
    name: '',
    location: {
      lat: '',
      lng: '',
      address: '',
      addressComponents: [],
    },
    shape: 'circle',
    tagLookupId: '1',
    circleData: {
      centerLat: '',
      centerLng: '',
      radius: '',
    },
    polygonData: {
      vertices: [],
    },
    locationName: '',
    description: ''
  });

  // Form validation
  const [errors, setErrors] = useState<{
    name?: string;
    location?: string;
    tagLookupId?: string;
    locationName?: string;
    description?: string;
  }>({});

  // Map configuration
  const mapConfig = {
    mapId: '49ae42fed52588c3',
    defaultCenter: { lat: 43.64, lng: -79.41 },
    defaultZoom: 4,
    gestureHandling: 'greedy',
    disableDefaultUI: false,
    zoomControl: true,
    scrollwheel: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  // Handle Add Geofence button click
  const handleAddGeofence = () => {
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle location input changes
  const handleLocationChange = (field: 'lat' | 'lng') => (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));

    // Clear location error
    if (errors.location) {
      setErrors(prev => ({
        ...prev,
        location: undefined,
      }));
    }
  };

  // Handle circle data input changes
  const handleCircleDataChange =
    (field: 'centerLat' | 'centerLng' | 'radius') => (name: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        circleData: {
          ...prev.circleData!,
          [field]: value,
        },
      }));
    };

  // Handle polygon vertex changes
  const handleVertexChange =
    (index: number, field: 'lat' | 'lng') => (name: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        polygonData: {
          ...prev.polygonData!,
          vertices: prev.polygonData!.vertices.map((vertex, i) =>
            i === index ? { ...vertex, [field]: value } : vertex
          ),
        },
      }));
    };

  // Add new vertex to polygon
  const addVertex = () => {
    setFormData(prev => ({
      ...prev,
      polygonData: {
        ...prev.polygonData!,
        vertices: [...prev.polygonData!.vertices, { lat: '', lng: '' }],
      },
    }));
  };

  // Remove vertex from polygon
  const removeVertex = (index: number) => {
    setFormData(prev => ({
      ...prev,
      polygonData: {
        ...prev.polygonData!,
        vertices: prev.polygonData!.vertices.filter((_, i) => i !== index),
      },
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Geofence name is required';
    }

    if ((!formData.location.lat || !formData.location.lng) && formData?.shape == 'circle') {
      newErrors.location = 'Location coordinates are required';
    }

    if (!formData.tagLookupId) {
      newErrors.tagLookupId = 'Group selection is required';
    }

    if (!formData.locationName) {
      newErrors.locationName = 'Location is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    // Log the final geofence data
    const finalGeofenceData = {
      formData,
      currentShape: currentShape
        ? {
          type: currentShape.type,
          shape: currentShape.shape,
          // Extract shape-specific data
          ...(currentShape.type === 'circle'
            ? {
              center: (currentShape.shape as google.maps.Circle).getCenter()?.toJSON(),
              radius: (currentShape.shape as google.maps.Circle).getRadius(),
              area:
                Math.PI * Math.pow((currentShape.shape as google.maps.Circle).getRadius(), 2),
            }
            : {
              path: (currentShape.shape as google.maps.Polygon)
                .getPath()
                ?.getArray()
                .map((latLng: google.maps.LatLng) => ({
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                })),
              vertexCount: (currentShape.shape as google.maps.Polygon).getPath()?.getLength(),
            }),
        }
        : null,
      timestamp: new Date().toISOString(),
      mapZoom: mapRef.current?.getZoom(),
      mapCenter: mapRef.current?.getCenter()?.toJSON(),
    };

    console.log('=== GEOFENCE SAVE COMPLETE ===');
    console.log('Final Geofence Data:', finalGeofenceData);
    console.log('Form Data:', formData);
    console.log('Current Shape:', currentShape);
    console.log('Map Zoom Level:', mapRef.current?.getZoom());
    console.log('Map Center:', mapRef.current?.getCenter()?.toJSON());
    console.log('Timestamp:', new Date().toISOString());
    console.log('=============================');

    // Create new geofence data
    // const newGeofence: GeofenceData = {
    //   id: Date.now().toString(),
    //   name: formData.name,
    //   shape: formData.shape,
    //   location: {
    //     lat: parseFloat(formData.location.lat),
    //     lng: parseFloat(formData.location.lng),
    //     address: formData.location.address,
    //   },
    //   drawnAtZoom: mapRef.current?.getZoom() || 15,
    //   tagLookupId: formData.tagLookupId,
    //   status: 'ACTIVE',
    //   createdAt: new Date(),
    //   createdBy: 'Current User', // TODO: Get from auth context
    //   description: formData.name,
    //   alertsConfigured: 0,
    //   accounts: ['001-10000795-000'], // TODO: Get from context
    //   ...(currentShape?.type === 'circle' && {
    //     circleData: {
    //       center: (currentShape.shape as google.maps.Circle).getCenter()?.toJSON() || {
    //         lat: 0,
    //         lng: 0,
    //       },
    //       radius: (currentShape.shape as google.maps.Circle).getRadius(),
    //       area: Math.PI * Math.pow((currentShape.shape as google.maps.Circle).getRadius(), 2),
    //     },
    //   }),
    //   ...(currentShape?.type === 'polygon' && {
    //     polygonData: {
    //       vertices:
    //         (currentShape.shape as google.maps.Polygon)
    //           .getPath()
    //           ?.getArray()
    //           .map((latLng: google.maps.LatLng) => ({
    //             lat: latLng.lat(),
    //             lng: latLng.lng(),
    //           })) || [],
    //       vertexCount: (currentShape.shape as google.maps.Polygon).getPath()?.getLength() || 0,
    //       center: {
    //         lat: parseFloat(formData.location.lat),
    //         lng: parseFloat(formData.location.lng),
    //       },
    //       area: 0, // TODO: Calculate proper area
    //     },
    //   }),
    // };

    // Add to geofences list
    //setGeofences(prev => [...prev, newGeofence]);
    //console.log('New Geofence Created:', newGeofence);

    const isPolygon = formData.shape == 'polygon'
    const polygonString = isPolygon ? convertToWKTPolygon(currentShape?.shape, formData?.polygonData?.vertices) : ''
    const latLng = isPolygon ? { centerLat: formData?.location.lat, centerLng: formData?.location.lng, radius: '' } : formData.circleData

    const payload = {
      geofence_name: formData.name,
      shape_type: formData.shape?.charAt(0).toUpperCase() + formData.shape?.slice(1),
      polygon: polygonString,
      owner: 'Admin',
      center_lat: latLng?.centerLat,
      center_lng: latLng?.centerLng,
      radius_meters: latLng?.radius,
      tag_lookup_id: Number(formData?.tagLookupId),
      customer_id: userInfo?.customer_id,
      account_ids: accountIds,
      //account_ids: [1, 2, 3],
      description: formData?.description,
      geofence_location: formData?.locationName,
      status: ACTIVE,
      created_by: userInfo.user_id
    }

    try {
      const response = await createGeofence(payload).unwrap(); // 'unwrap()' to get plain response or throw an error
      console.log('New Geofence Created:', response);
      toast.success("New Geofence Created Successfully");
      handleCloseModal();
    } catch (error) {
      console.error('Error creating geofence:', error);
      toast.error("Failed to create Geofence");
    }
  }, [formData, currentShape]);

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentShape(null);
    setFormData({
      name: '',
      location: {
        lat: '',
        lng: '',
        address: '',
      },
      shape: 'circle',
      tagLookupId: '1',
      circleData: {
        centerLat: '',
        centerLng: '',
        radius: '',
      },
      polygonData: {
        vertices: [],
      },
      locationName: '',
      description: ''
    });
    setErrors({});
  };

  // Handle cancel (remove the drawn shape)
  const handleCancel = () => {
    if (currentShape) {
      // Remove the shape from the map
      currentShape.shape.setMap(null);
    }
    handleCloseModal();
  };

  // Handle place selection from autocomplete
  const handlePlaceSelect = (place: google.maps.places.Place | null) => {
    setSelectedPlace(place);
  };

  useEffect(() => {
    if (showDetailsPage) {
      dispatch(setTopBarConfig({
        showBackButton: true,
        title: 'Telematics Details',
      }));
    }
  }, [showDetailsPage])

  useEffect(() => {
    if (isBackClicked) {
      setShowDetailsPage(false);
      setSelectedGeofence(null);
      dispatch(setTopBarConfig({
        showBackButton: false,
        title: 'Telematics',
        isBackClicked: false
      }));
    }
  }, [isBackClicked])

  useEffect(() => {
    if (viewMode === LIST) {
      getGeofences({ custId: userInfo?.customer_id });
    }
  }, [viewMode])

  // If showing details page, render the GeofenceDetails component
  if (showDetailsPage && selectedGeofence) {
    return (
      <GeofenceDetails />
    );
  }

  return (
    <div className="geofences">
      <div className="geofences__actions-container">
        <div style={{ display: 'flex', gap: 20 }}>
          <Tabs options={tabs} activeTab={activeTab} onChange={val => setActiveTab(val)} />
        </div>

        {activeTab === TELEMATICS_ALERTS && (
          <div>
            <Button size="fit" onClick={() => setAlertOpen(true)}>
              Create Alert
            </Button>
          </div>
        )}

        {alertOpen && <CreateAlert open={alertOpen} onClose={() => setAlertOpen(false)} />}
      </div>

      <div className="geofences__content">
        {activeTab === ACTIVITY_FEED && (
          <div className="activity-feed">
            <div className="activity-feed__cards">
              {activityFeedData.map(item => (
                <div key={item.id} className="activity-feed__card">
                  <StatusCard item={item} isPMTab={false} />
                </div>
              ))}
            </div>

            <div className="activity-feed__table">
              <Table
                columns={activityFeedColumns}
                rows={activityFeedRows}
                totalRecords={activityFeedRows.length}
              />
            </div>
          </div>
        )}

        {activeTab === GEOFENCES && (
          <div className="geofences-content">
            <div className="geofences-content__cards">
              {geofencesData.map(item => (
                <div key={item.id} className="geofences-content__card">
                  <StatusCard item={item} isPMTab={false} />
                </div>
              ))}
            </div>

            <div className="geofences-content__view-toggle">
              <Tabs
                variant="secondary"
                options={viewToggleOptions}
                activeTab={viewMode}
                onChange={val => setViewMode(val as 'map' | 'list')}
              />
            </div>

            {viewMode === LIST && (
              <div className="geofences-content__table">
                <Table
                  columns={geofencesColumns}
                  rows={data?.data?.map((geofence: GeofenceAPIData) => ({
                    id: geofence.id,
                    geofence_name: {
                      geofence,
                      onClick: (selectedGeofence: GeofenceAPIData) => {
                        setSelectedGeofence(selectedGeofence);
                        setShowDetailsPage(true);
                      },
                    },
                    geofence_shape: geofence.geofence_shape,
                    geofence_location: geofence.geofence_location || '',
                    accounts: geofence.accounts ? geofence.accounts : [],
                    created_date: formatDate(geofence.created_at),
                    created_by: geofence?.created_by,
                    status: geofence?.status || '',
                    description: geofence?.description || '',
                  }))}
                  totalRecords={data?.data?.length}
                  isLoading={loadingGeofence}
                />
              </div>
            )}

            {viewMode === 'map' && (
              <div className="geofences-content__map">
                <Button
                  variant="filled"
                  icon={<AddIcon />}
                  size="fit"
                  onClick={handleAddGeofence}
                //classValue="add-geofence-btn"
                >
                  Add Geofence
                </Button>

                <APIProvider apiKey={API_KEY}>
                  <Map {...mapConfig} style={{ width: '100%', height: '100%', paddingBottom: '30px' }}>
                    <AutocompleteCustom onPlaceSelect={handlePlaceSelect} />
                    <AutocompleteResult place={selectedPlace} />
                    <MapWithDrawing />
                    <GeofenceRenderer />
                  </Map>
                </APIProvider>
              </div>
            )}
          </div>
        )}

        {activeTab === TELEMATICS_ALERTS && (
          <div className="telematics-alerts">
            <div className="telematics-alerts__cards">
              {telematicsAlertsData.map(item => (
                <div key={item.id} className="telematics-alerts__card">
                  <StatusCard item={item} isPMTab={false} />
                </div>
              ))}
            </div>

            <div className="telematics-alerts__table">
              <Table
                columns={telematicsAlertsColumns}
                rows={telematicsAlertsRows}
                totalRecords={telematicsAlertsRows.length}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal for Geofence Details */}
      <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Create Geofence
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* Geofence Name */}
            <TextInput
              label="Geofence Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              isRequired
            />

            {/* Select Shape */}
            <Select
              label="Select Shape"
              name="shape"
              options={[
                { label: 'Circle', value: 'circle' },
                { label: 'Polygon', value: 'polygon' },
              ]}
              value={formData.shape}
              onChange={handleInputChange}
              isRequired
            />

            {/* Set Location - Only show for polygon or when no shape is drawn yet */}
            {formData.shape === 'polygon' ||
              (!currentShape && (
                <>
                  <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                    Set Location <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextInput
                      label="Latitude"
                      name="lat"
                      type="number"
                      value={formData.location.lat}
                      onChange={handleLocationChange('lat')}
                      error={errors.location}
                    />
                    <TextInput
                      label="Longitude"
                      name="lng"
                      type="number"
                      value={formData.location.lng}
                      onChange={handleLocationChange('lng')}
                      error={errors.location}
                    />
                  </Box>
                </>
              ))}

            {/* Circle-specific fields */}
            {formData.shape === 'circle' && formData.circleData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Circle Location & Properties
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <TextInput
                    label="Center Latitude"
                    name="centerLat"
                    type="number"
                    value={formData.circleData.centerLat}
                    onChange={handleCircleDataChange('centerLat')}
                  />
                  <TextInput
                    label="Center Longitude"
                    name="centerLng"
                    type="number"
                    value={formData.circleData.centerLng}
                    onChange={handleCircleDataChange('centerLng')}
                  />
                </Box>
                <TextInput
                  label="Radius (meters)"
                  name="radius"
                  type="number"
                  value={formData.circleData.radius}
                  onChange={handleCircleDataChange('radius')}
                />
              </Box>
            )}

            {/* Polygon-specific fields */}
            {formData.shape === 'polygon' && formData.polygonData && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Polygon Vertices
                </Typography>
                {formData.polygonData.vertices.map((vertex, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    <TextInput
                      label={`Vertex ${index + 1} Lat`}
                      name={`vertex${index}Lat`}
                      type="number"
                      value={vertex.lat}
                      onChange={handleVertexChange(index, 'lat')}
                    />
                    <TextInput
                      label={`Vertex ${index + 1} Lng`}
                      name={`vertex${index}Lng`}
                      type="number"
                      value={vertex.lng}
                      onChange={handleVertexChange(index, 'lng')}
                    />
                    <Button
                      variant="outline"
                      size="fit"
                      onClick={() => removeVertex(index)}
                    //classValue="remove-vertex-btn"
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outline"
                  size="fit"
                  onClick={addVertex}
                //classValue="add-vertex-btn"
                >
                  Add Vertex
                </Button>
              </Box>
            )}

            {/* Select Group */}
            <Select
              label="Select Group / Tag"
              name="tagLookupId"
              options={tagData?.data?.map((tag: TagLookupData) => ({ label: tag.tag_name, value: String(tag.tag_lookup_id) }))}
              value={formData.tagLookupId}
              onChange={handleInputChange}
              error={errors.tagLookupId}
              isRequired
            />

            <TextInput
              label="Geofence Location"
              name="locationName"
              value={formData.locationName}
              onChange={handleInputChange}
              error={errors.locationName}
              isRequired
            />
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              isRequired
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={isLoading} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} variant="filled">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Geofences;

