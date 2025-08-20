import React, { useEffect, useRef, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import DetailedOverview, { renderAccounts } from '../DetailedOverview';
import GeofenceRenderer from '../GeofenceRenderer';
import { useGeofenceContext } from '@/contexts/GeofenceContext';
import { useLazyGetGeofenceByIdQuery, useUpdateGeofenceMutation, useUpdateGeofenceStatusMutation } from '@/services/geofences';
import { convertToWKTPolygon, formatDate } from '@/helpers/utils';
import Button from '../Button';
import { useAppSelector } from '@/redux/store';
import { ACTIVE, INACTIVE, POLYGON } from '@/helpers/constants';
import toast from 'react-hot-toast';
import { Skeleton, Typography } from '@mui/material';
import type { GeofenceDetailsData } from '@/types/geofence';
import './styles.scss';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GeofenceDetails = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  const { selectedGeofence } = useGeofenceContext();
  const isActiveGeofence = selectedGeofence?.status == ACTIVE;

  const [getGeofence, { data, isLoading, isError }] = useLazyGetGeofenceByIdQuery();
  const [updateGeofence, { isLoading: isUpdating, isSuccess }] = useUpdateGeofenceMutation();
  const [updateGeofenceStatus, { isLoading: isUpdatingStatus }] = useUpdateGeofenceStatusMutation();

  const geofence = data?.data || {}

  const editedGeofenceRef = useRef<GeofenceDetailsData | null>(null);;
  const isActiveRef = useRef(isActiveGeofence);
  const isActive = isActiveRef.current
  const userData = geofence?.created_by_user

  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}') ?? null;
  const { selectedAccountIds } = useAppSelector(state => state.selectedAccounts);
  const accountIds = selectedAccountIds.filter(id => id !== 'select-all').map(id => Number(id));

  // if (!selectedGeofence) {
  //   return null;
  // }

  const handleToggleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const res = await updateGeofenceStatus({
        geofenceId: selectedGeofence?.id,
      });
      isActiveRef.current = event.target.checked;
      toast.success(res.data.message)
    } catch (err) {
      toast.error('Error updating status')
      console.error('Error updating geofence status:', err);
    }
  };

  useEffect(() => {
    if (selectedGeofence?.id) {
      getGeofence({ geofenceId: selectedGeofence?.id })
    }
  }, [selectedGeofence])

  const accountsObj = geofence.accounts
    ? Object.assign({}, geofence.accounts)
    : {};

  // Prepare data for DetailedOverview component
  const geofenceData = [
    {
      items: [
        { label: 'Geofence Name', value: geofence.geofence_name },
        {
          label: 'Geofence Shape',
          value: geofence.geofence_shape?.charAt(0).toUpperCase() + geofence.geofence_shape?.slice(1) || '',
        },
        {
          label: 'Geofence Location',
          value: geofence?.geofence_location || ''
        },
        { label: 'Accounts', value: geofence?.accounts ? renderAccounts(accountsObj) : '' },
        {
          label: 'No. of Alerts Configured',
          value: geofence?.alertsConfigured?.toString() || '',
        },
      ],
    },
    {
      items: [
        { label: 'Created Date', value: formatDate(geofence.created_at) },
        { label: 'Created By', value: userData ? `${userData?.first_name} ${userData?.last_name}` : '' },
        {
          label: 'Activate Geofence',
          value: isActive,
          type: 'switch',
          onChange: handleToggleChange,
          disabled: isUpdatingStatus
        },
        {
          label: 'Status',
          value: isActive ? ACTIVE : INACTIVE,
        },
        { label: 'Description', value: geofence?.description || '' },
      ],
    },
  ];

  const handleEditStart = () => {
    setIsEditMode(true)
    editedGeofenceRef.current = geofence
  }

  const handleEdit = (updated: GeofenceDetailsData) => {
    editedGeofenceRef.current = { ...editedGeofenceRef.current, ...updated };
  };

  const handleSaveEdit = async () => {
    const edited = editedGeofenceRef.current

    const polygonString = edited?.geofence_shape === POLYGON ? convertToWKTPolygon('', edited?.polygon) : '';

    const payload = {
      geofence_name: edited?.geofence_name,
      shape_type: edited?.geofence_shape,
      polygon: polygonString,
      owner: 'Admin',
      center_lat: edited?.center_lat,
      center_lng: edited?.center_lng,
      radius_meters: edited?.radius_meters,
      tag_lookup_id: edited?.tag_lookup_id,
      customer_id: userInfo?.customer_id,
      account_ids: accountIds,
      //account_ids: [1, 2, 3],
      description: edited?.description,
      geofence_location: edited?.geofence_location,
      status: edited?.status,
      created_by: userInfo.user_id,
    }

    try {
      const res = await updateGeofence({
        geofenceId: selectedGeofence?.id,
        ...payload
      }).unwrap();
    } catch (err) {
      console.error('Error updating geofence:', err);
    }
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    editedGeofenceRef.current = null;
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success("Geofence edited successfully!")
      getGeofence({ geofenceId: selectedGeofence?.id })
      setIsEditMode(false);
      editedGeofenceRef.current = null
    }
  }, [isSuccess])

  if (isLoading || isError) {
    return <div className="geofence-details-loading">
      {isError ? <Typography color='error'>Error fetching details.</Typography> :
        <>
          <Skeleton variant="rectangular" width="100%" height='35%' />
          <Skeleton variant="rectangular" width="100%" height='65%' />
        </>
      }
    </div>
  }

  // Map configuration - using same settings as main Geofences page
  const mapConfig = {
    mapId: '49ae42fed52588c3',
    defaultCenter: geofence?.geofence_location,
    defaultZoom: geofence?.drawnAtZoom || 15,
    gestureHandling: 'greedy',
    disableDefaultUI: false,
    zoomControl: true,
    scrollwheel: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  return (
    <div className="geofence-details-page">
      {/* Top section with geofence information */}
      <div className="geofence-details-page__info">
        <DetailedOverview data={geofenceData} />
      </div>

      {/* Bottom section with map */}
      <div className="geofence-details-page__map">
        <div style={{ padding: '5px' }} >
          {isEditMode ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button size='fit' disabled={isUpdating} onClick={handleSaveEdit}>Save</Button>
              <Button size='fit' disabled={isUpdating} color='light' variant='outline' onClick={handleCancelEdit}>Cancel</Button>
            </div>
          ) : <Button size='fit' onClick={handleEditStart}>Edit Geofence</Button>}
        </div>

        <APIProvider apiKey={API_KEY}>
          <Map {...mapConfig} style={{ width: '100%', height: '100%', paddingBottom: '30px' }}>
            <GeofenceRenderer geofence={editedGeofenceRef.current ? editedGeofenceRef.current : geofence} editable={isEditMode}
              onEdit={handleEdit} />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default GeofenceDetails;
