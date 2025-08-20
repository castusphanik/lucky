import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import {
  TbMap,
  TbList,
  TbFilter,
  TbDownload,
  TbChevronRight,
  TbChevronLeft,
  TbCheck,
  TbX,
  TbPlayerPlay,
  TbPlayerPause,
  TbSearch,
} from 'react-icons/tb';
import InfoCard from '@/components/InfoCard';
import Tabs from '@/components/Tabs';
// import DevExtremeTable from '@/components/DevExtremeTable';
import ManageColumns from '@/components/ManageColumns';
import Button from '@/components/Button';
// import type { TColumns } from '@/components/DevExtremeTable';
import { ClusteredFleetMarkers } from '@/components/ClusteredFleetMarkers';
import PageLoader from '@/components/PageLoader';
import type { ViewMode, FleetAsset } from '@/types/fleet';
import {
  useGetFleetListViewQuery,
  useLazyGetFleetListViewQuery,
  useGetEquipmentCountsQuery,
  useLazyGetEquipmentCountsQuery,
} from '@/services/fleet';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import {
  setPanelFilter,
  resetPanelFilters,
  type PanelFilters,
  setActiveFilterType,
} from '@/features/fleetViewFilters/fleetViewFiltersSlice';
import DynamicForm, { type TFormData } from '@/components/DynamicForm';
import PanelFilterCard from '@/components/PanelFilterCard';
// import { toQueryString } from '@/helpers/utils'; // Available for building query strings if needed
import '@/components/FleetMarker/FleetMarker.scss';
import Table, { type TColumns } from '@/components/Table';
import './styles.scss';

// Custom styles for FleetView InfoCards
const fleetViewInfoCardStyles = {
  '&.fleet-view-info-card': {
    maxWidth: '120px !important',
    '& .MuiCardContent-root': {
      padding: '8px !important',
      '&:last-child': { paddingBottom: '8px !important' },
    },
    '& .MuiTypography-root': {
      fontSize: '12px !important',
      '&[style*="font-weight: bold"]': {
        fontSize: '16px !important',
      },
    },
  },
};

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const initialColumns: TColumns = [
  { label: 'Trailer Model', field: 'trailerModel' },
  { label: 'Unit #', field: 'unitNumber' },
  { label: 'VIN#', field: 'vinNumber' },
  { label: 'Recent Location', field: 'recentLocation' },
  { label: 'Last GPS Coordinates', field: 'lastGPSCoordinates' },
  { label: 'Alarm Code Status', field: 'alarmCodeStatus' },
  { label: 'Motion Status', field: 'motionStatus' },
  { label: 'Last GPS Update', field: 'lastGPSUpdate' },
  { label: 'Arrival Time', field: 'arrivalTime' },
  { label: 'Location / Address', field: 'locationAddress' },
];

const FleetView = () => {
  const selectedAccountIds = useAppSelector(
    state => state.selectedAccounts.selectedAccountIds
  ).filter(item => item !== 'select-all');
  const tablePage = useAppSelector(state => state.table.page);
  const tableLimit = useAppSelector(state => state.table.limit);
  const accountIdCsv = selectedAccountIds.join(',');

  type FleetApiItem = {
    equipment_id?: number | string;
    vin?: string;
    unitNumber?: string;
    accountName?: string;
    account?: string | null;
    motionStatus?: string;
    lastGpsUpdate?: string;
    alarmCodeStatus?: unknown;
    latitude?: string | number;
    longitude?: string | number;
    model?: string;
    make?: string | null;
    year?: string | number | null;
    color?: string | null;
    doorType?: string | null;
    floorType?: string | null;
    wallType?: string | null;
    rimType?: string | null;
    trailerHeight?: string | number | null;
    trailerWidth?: string | number | null;
    roofType?: string | null;
    trailerLength?: string | number | null;
    tireSize?: string | null;
    dateInService?: string | null;
    licensePlateNumber?: string | null;
    licensePlateState?: string | null;
    last_gps_coordinates?: string | null;
    arrival_time?: string | null;
    location?: string | null;
  };

  // Separate data for map and list views
  const [mapViewFleetItems, setMapViewFleetItems] = useState<FleetApiItem[]>([]);
  const [isMapAccumulating, setIsMapAccumulating] = useState<boolean>(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [resetMapToDefault, setResetMapToDefault] = useState<boolean>(false);

  // Equipment counts accumulation for map view
  const [mapViewEquipmentCounts, setMapViewEquipmentCounts] = useState<FleetApiItem[]>([]);
  const [isEquipmentCountsAccumulating, setIsEquipmentCountsAccumulating] =
    useState<boolean>(false);

  // List view uses the API data directly, no accumulation needed

  const [activeView, setActiveView] = useState<ViewMode>('map');
  const [columns, setColumns] = useState<TColumns>(initialColumns);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showFilterContent, setShowFilterContent] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [childAccount, setChildAccount] = useState('');
  const [loadStatus, setLoadStatus] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Redux dispatch and state
  const dispatch = useAppDispatch();
  const fleetViewFilters = useAppSelector(state => state.fleetViewFilters);

  // Debounced search for unitNumber
  const [searchValue, setSearchValue] = useState('');

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setPanelFilter({ key: 'unitNumber', value: searchValue }));
      // Log the current filter state for debugging
      console.log('Updated unitNumber filter:', searchValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue, dispatch]);

  // Log current filter state for debugging
  React.useEffect(() => {
    console.log('Current fleet view filters:', fleetViewFilters);
  }, [fleetViewFilters]);

  // Map view data (independent of table pagination)
  const { data: firstPageData, isFetching: isFirstFetching } = useGetFleetListViewQuery(
    {
      page: 1,
      perPage: 1000,
      account_id: accountIdCsv,
      unit_number: fleetViewFilters.panelFilters.unitNumber || undefined,
    },
    {
      // Refetch when filters change
      refetchOnMountOrArgChange: true,
    }
  );

  // List view data (driven by table pagination)
  const { data: listData, isFetching: isListFetching } = useGetFleetListViewQuery(
    {
      page: tablePage,
      perPage: tableLimit,
      account_id: accountIdCsv,
      unit_number: fleetViewFilters.panelFilters.unitNumber || undefined,
    },
    {
      // Refetch when filters change
      refetchOnMountOrArgChange: true,
    }
  );

  const [fetchFleetPage] = useLazyGetFleetListViewQuery();
  const [fetchEquipmentCountsPage] = useLazyGetEquipmentCountsQuery();

  // Equipment counts API call - different parameters for map and list views
  const equipmentCountsParams =
    activeView === 'map'
      ? {
          account_id: accountIdCsv,
          filterBy: fleetViewFilters.panelFilters.filterBy || undefined,
          page: 1,
          perPage: 1000, // For map view, use perPage of 1000
        }
      : {
          account_id: accountIdCsv,
          filterBy: fleetViewFilters.panelFilters.filterBy || undefined,
          page: tablePage,
          perPage:
            activeView === 'list' && fleetViewFilters.panelFilters.filterBy ? 10 : tableLimit, // For list view with card filter, use 10, otherwise use table limit
        };

  const { data: equipmentCountsData, isFetching: isEquipmentCountsFetching } =
    useGetEquipmentCountsQuery(equipmentCountsParams, {
      // Only fetch if we have account IDs
      skip: !accountIdCsv || accountIdCsv.length === 0,
      // Refetch when account IDs change or filterBy changes
      refetchOnMountOrArgChange: true,
    });

  // Determine which data source to use based on the selected filter
  const shouldUseFilteredData =
    fleetViewFilters.activeFilterType === 'card' &&
    fleetViewFilters.panelFilters.filterBy &&
    fleetViewFilters.panelFilters.filterBy !== 'totalFleet';

  // Use filtered data from getEquipmentCounts when card filter is active
  const filteredData = useMemo(() => {
    return shouldUseFilteredData
      ? activeView === 'map' && mapViewEquipmentCounts.length > 0
        ? mapViewEquipmentCounts // Use accumulated data for map view
        : equipmentCountsData?.data?.data
        ? (equipmentCountsData.data.data as FleetApiItem[])
        : []
      : [];
  }, [shouldUseFilteredData, activeView, mapViewEquipmentCounts, equipmentCountsData?.data?.data]);

  // Use getListView data when panel filter is active or no filter is active
  const listViewData = shouldUseFilteredData
    ? []
    : (listData?.data?.data as FleetApiItem[] | undefined) ?? [];

  // Combine data sources - filtered data takes precedence when available
  const combinedData = shouldUseFilteredData ? filteredData : listViewData;

  // Map view assets - processed from combined data
  const mapViewAssets: FleetAsset[] = useMemo(() => {
    // Use filtered data if available, otherwise use accumulated map data
    const rawItems =
      shouldUseFilteredData && filteredData.length > 0
        ? filteredData
        : ((mapViewFleetItems ?? []) as FleetApiItem[]);

    if (!rawItems) return [];
    return rawItems
      .map((item: FleetApiItem, index: number) => {
        const latitude = parseFloat(item.latitude as string);
        const longitude = parseFloat(item.longitude as string);
        if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

        const id = String(item.equipment_id ?? item.vin ?? index);
        const name = String(item.unitNumber ?? item.accountName ?? id);
        const motion = String(item.motionStatus || '').toLowerCase();
        const status: FleetAsset['status'] = motion.includes('stop') ? 'idle' : 'active';

        const asset: FleetAsset = {
          id,
          name,
          status,
          category: 'trailer',
          position: { lat: latitude, lng: longitude },
          lastUpdated: item.lastGpsUpdate ?? new Date().toISOString(),
          hasGPS: true,
          hasAlert: Boolean(item.alarmCodeStatus),
          // Add the raw fleet data for use in FleetDetailsCard
          __rawFleetData: item,
        };

        return asset;
      })
      .filter(Boolean) as FleetAsset[];
  }, [mapViewFleetItems, filteredData, shouldUseFilteredData]);

  // Update table rows to use the combined data
  const tableRows = useMemo(() => {
    return combinedData.map((item, idx) => {
      const lat = item.latitude != null ? Number(item.latitude) : undefined;
      const lng = item.longitude != null ? Number(item.longitude) : undefined;
      return {
        id: String(item.equipment_id ?? item.vin ?? idx),
        trailerModel: String(item.model ?? ''),
        unitNumber: String(item.unitNumber ?? ''),
        vinNumber: String(item.vin ?? ''),
        recentLocation: String(item.location ?? ''),
        lastGPSCoordinates:
          lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)
            ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
            : '',
        alarmCodeStatus: item.alarmCodeStatus ? 'Alert' : '',
        motionStatus: String(item.motionStatus ?? ''),
        lastGPSUpdate: item.lastGpsUpdate ? new Date(item.lastGpsUpdate).toLocaleDateString() : '',
        arrivalTime: String(item.arrival_time ?? ''),
        locationAddress: String(item.location ?? ''),
        status: String(item.motionStatus ?? ''),
        category: 'trailer',
        __rawItem: item,
      };
    });
  }, [combinedData]);

  // Handle InfoCard clicks to filter data
  const handleInfoCardClick = (filterType: string) => {
    // Clear the selected coordinates to reset map center when applying filters
    setSelectedCoordinates(null);

    // Clear the search input field
    setSearchValue('');

    // Clear the panel search data by resetting the unitNumber filter
    dispatch(setPanelFilter({ key: 'unitNumber', value: '' }));

    // Set flag to reset map to default position and zoom
    setResetMapToDefault(true);

    // Close all filter panels
    setShowFilterPanel(false);
    setShowFilterContent(false);
    setShowFilters(false);

    // Clear accumulated equipment counts data when switching filters
    setMapViewEquipmentCounts([]);

    if (filterType === 'totalFleet') {
      // For total fleet, clear the filter and use getListView API
      dispatch(setPanelFilter({ key: 'filterBy', value: '' }));
      dispatch(setActiveFilterType('none'));
    } else {
      // For other cards, set the filterBy value to match the API stats properties
      const filterMap: Record<string, string> = {
        gpsEquipped: 'gpsEquippedCount',
        accessWithoutGps: 'accessWithoutGpsCount',
        idleUnits: 'idleUnitsCount',
        activeErsEvents: 'activeErsEventsCount', // You may need to add this to your API
        activeGeofences: 'geofenceCount',
        overdueDot: 'overdueDotCount', // You may need to add this to your API
      };

      const apiFilterValue = filterMap[filterType] || filterType;
      dispatch(setPanelFilter({ key: 'filterBy', value: apiFilterValue }));
      dispatch(setActiveFilterType('card'));
    }
  };

  // Handle result card click to center map on coordinates
  const handleResultCardClick = (item: FleetAsset) => {
    if (item.position) {
      // Store the selected coordinates in state
      setSelectedCoordinates(item.position);
    }
  };

  // Map centering component using useMap hook
  const MapCenteringComponent = () => {
    const map = useMap();

    // Center the map when coordinates are selected
    React.useEffect(() => {
      if (map && selectedCoordinates) {
        map.panTo(selectedCoordinates);
        map.setZoom(12); // Zoom in to show more detail
      }
    }, [map]);

    // Reset map to default position and zoom when resetMapToDefault is true
    React.useEffect(() => {
      if (map && resetMapToDefault) {
        map.panTo(mapOptions.defaultCenter);
        map.setZoom(mapOptions.defaultZoom);
        setResetMapToDefault(false); // Reset the flag
      }
    }, [map]);

    return null; // This component doesn't render anything
  };

  // Log data separation for debugging
  React.useEffect(() => {
    console.log('Map view data (accumulated):', mapViewFleetItems.length, 'items');
    console.log('List view data (current page):', listData?.data?.data?.length || 0, 'items');
    console.log('Equipment counts data:', equipmentCountsData);
    console.log('Equipment counts loading:', isEquipmentCountsFetching);
    console.log('Map view equipment counts (accumulated):', mapViewEquipmentCounts.length, 'items');
  }, [
    mapViewFleetItems,
    listData,
    equipmentCountsData,
    isEquipmentCountsFetching,
    mapViewEquipmentCounts,
  ]);

  // Accumulate all pages for map view when first page arrives or account list changes
  React.useEffect(() => {
    let isCancelled = false;
    const accumulate = async () => {
      setIsMapAccumulating(true);
      const firstItems = (firstPageData?.data?.data as FleetApiItem[] | undefined) ?? [];
      const totalRecords = firstPageData?.data?.totalRecords ?? firstItems.length;
      const perPage = firstPageData?.data?.perPage ?? 1000;
      const totalPages = Math.max(1, Math.ceil(totalRecords / perPage));

      let combined: FleetApiItem[] = [...firstItems];
      // Fetch remaining pages sequentially to stay simple; could be parallel if backend allows
      for (let page = 2; page <= totalPages; page++) {
        const { data } = await fetchFleetPage(
          {
            page,
            perPage,
            account_id: accountIdCsv,
            unit_number: fleetViewFilters.panelFilters.unitNumber || undefined,
          },
          true
        );
        const items = (data?.data?.data as FleetApiItem[] | undefined) ?? [];
        combined = combined.concat(items);
        if (isCancelled) return;
      }
      if (!isCancelled) setMapViewFleetItems(combined);
      if (!isCancelled) setIsMapAccumulating(false);
    };
    accumulate();
    return () => {
      isCancelled = true;
      setIsMapAccumulating(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountIdCsv, firstPageData?.data?.totalRecords, fleetViewFilters.panelFilters]);

  // Accumulate equipment counts for map view when card filter is active
  React.useEffect(() => {
    let isCancelled = false;

    const accumulateEquipmentCounts = async () => {
      // Only accumulate for map view and when card filter is active
      if (activeView !== 'map' || !shouldUseFilteredData || !equipmentCountsData) {
        return;
      }

      setIsEquipmentCountsAccumulating(true);
      const firstItems = (equipmentCountsData?.data?.data as FleetApiItem[] | undefined) ?? [];
      const totalRecords = equipmentCountsData?.data?.totalRecords ?? firstItems.length;
      const perPage = 1000; // Use 1000 for map view
      const totalPages = Math.max(1, Math.ceil(totalRecords / perPage));

      let combined: FleetApiItem[] = [...firstItems];

      // Fetch remaining pages if needed
      for (let page = 2; page <= totalPages; page++) {
        if (isCancelled) return;

        const { data } = await fetchEquipmentCountsPage(
          {
            account_id: accountIdCsv,
            filterBy: fleetViewFilters.panelFilters.filterBy || undefined,
            page,
            perPage: perPage,
          },
          true
        );
        const items = (data?.data?.data as FleetApiItem[] | undefined) ?? [];
        combined = combined.concat(items);
      }

      if (!isCancelled) {
        setMapViewEquipmentCounts(combined);
        setIsEquipmentCountsAccumulating(false);
      }
    };

    accumulateEquipmentCounts();

    return () => {
      isCancelled = true;
      setIsEquipmentCountsAccumulating(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeView,
    shouldUseFilteredData,
    equipmentCountsData?.data?.totalRecords,
    fleetViewFilters.panelFilters.filterBy,
    accountIdCsv,
  ]);

  // Filter form data - simplified to only include fields that are actually used
  const fleetFilters: TFormData = [
    {
      label: 'Unit Number',
      name: 'unitNumber',
      type: 'textInput',
      props: { placeholder: 'Enter Unit Number' },
    },
  ];

  // Filter options
  const childAccountOptions = ['All Accounts', 'Account A', 'Account B', 'Account C'];

  const mapOptions = {
    mapId: '49ae42fed52588c3',
    defaultCenter: { lat: 39.8283, lng: -98.5795 }, // Center of US
    defaultZoom: 4,
    gestureHandling: 'greedy',
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  };

  const tabOptions = [
    { label: 'Map View', value: 'map', icon: TbMap },
    { label: 'List View', value: 'list', icon: TbList },
  ];

  // Build simple stats from map view data (accumulated)
  const fleetStats = useMemo(() => {
    return {
      totalAssets: 0,
      totalActiveUnits: 0,
      unitsWithActiveGPS: 0,
      idleUnits: 0,
      unitsDueForMaintenance: 0,
      unitsWithActiveAlerts: 0,
    };
  }, []);

  const renderInfoCards = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: 2,
        position: 'relative',
        zIndex: 220,
        ...fleetViewInfoCardStyles,
      }}
    >
      <InfoCard
        title="Total Fleet"
        value={
          equipmentCountsData?.data?.stats?.totalCount
            ? equipmentCountsData.data.stats.totalCount.toLocaleString()
            : 0
        }
        variant="simple"
        className="fleet-view-info-card"
        onClick={() => handleInfoCardClick('totalFleet')}
        isActive={!fleetViewFilters.panelFilters.filterBy}
      />

      <InfoCard
        title="GPS Equipped Assets"
        value={
          equipmentCountsData?.data?.stats?.gpsEquippedCount
            ? equipmentCountsData.data.stats.gpsEquippedCount.toLocaleString()
            : 0
        }
        variant="simple"
        className="fleet-view-info-card"
        onClick={() => handleInfoCardClick('gpsEquipped')}
        isActive={fleetViewFilters.panelFilters.filterBy === 'gpsEquippedCount'}
      />
      <InfoCard
        title="Assets Without GPS"
        value={
          equipmentCountsData?.data?.stats?.accessWithoutGpsCount
            ? equipmentCountsData.data.stats.accessWithoutGpsCount.toLocaleString()
            : 0
        }
        variant="simple"
        className="fleet-view-info-card"
        onClick={() => handleInfoCardClick('accessWithoutGps')}
        isActive={fleetViewFilters.panelFilters.filterBy === 'accessWithoutGpsCount'}
      />
      <InfoCard
        title="Idle Units"
        value={
          equipmentCountsData?.data?.stats?.idleUnitsCount
            ? equipmentCountsData.data.stats.idleUnitsCount.toLocaleString()
            : 0
        }
        variant="simple"
        className="fleet-view-info-card"
        onClick={() => handleInfoCardClick('idleUnits')}
        isActive={fleetViewFilters.panelFilters.filterBy === 'idleUnitsCount'}
      />
      <InfoCard
        title="Active ERS Events"
        value={fleetStats.unitsDueForMaintenance.toLocaleString()}
        variant="simple"
        className="fleet-view-info-card"
        onClick={() => handleInfoCardClick('activeErsEvents')}
        isActive={fleetViewFilters.panelFilters.filterBy === 'activeErsEventsCount'}
      />
      <InfoCard
        title="Active Geofences"
        value={
          equipmentCountsData?.data?.stats?.geofenceCount
            ? equipmentCountsData.data.stats.geofenceCount.toLocaleString()
            : 0
        }
        variant="simple"
        className="fleet-view-info-card"
        onClick={() => handleInfoCardClick('activeGeofences')}
        isActive={fleetViewFilters.panelFilters.filterBy === 'geofenceCount'}
      />
      <InfoCard
        title="Overdue DOT"
        value={fleetStats.unitsWithActiveAlerts.toLocaleString()}
        variant="simple"
        className="fleet-view-info-card"
        onClick={() => handleInfoCardClick('overdueDot')}
        isActive={fleetViewFilters.panelFilters.filterBy === 'overdueDotCount'}
      />
    </Box>
  );

  const renderMapView = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
    >
      <APIProvider apiKey={API_KEY} libraries={['marker', 'geometry']}>
        <Map {...mapOptions} style={{ width: '100%', height: '100%' }} className="fleet-marker-map">
          <ClusteredFleetMarkers assets={mapViewAssets} />
          <MapCenteringComponent />
        </Map>
        <PageLoader
          isLoading={isFirstFetching || isMapAccumulating || isEquipmentCountsAccumulating}
          message="Fetching fleet locations..."
          className="map-loader"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            background: 'rgba(255,255,255,0.35)',
          }}
        />
      </APIProvider>
    </Box>
  );

  const renderListView = () => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      {/* Action Bar */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <Button
          variant="outline"
          icon={<TbFilter />}
          iconPosition="left"
          size="fit"
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-btn ${showFilters ? 'active' : ''}`}
        >
          Filter
        </Button>
        <Button variant="filled" icon={<TbDownload />} iconPosition="left" size="fit">
          Download to CSV
        </Button>
        <ManageColumns columns={columns} onApply={data => setColumns(data)} />
      </Box>

      {/* Advanced Filters */}
      <motion.div
        className="filters-wrapper"
        initial={{ height: 0 }}
        animate={{ height: showFilters ? 'auto' : 0 }}
        style={{ overflow: 'hidden' }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ padding: '0.8rem', paddingBottom: 0 }}
        >
          Filter by
        </Typography>

        <Stack
          direction="column"
          // alignItems="flex-end"
          gap={1}
          sx={{ padding: '0.8rem', paddingTop: '0.5rem' }}
        >
          <DynamicForm
            formData={fleetFilters}
            className="filters-inputs-container"
            onSubmit={values => {
              // Update Redux store with filter values
              Object.entries(values).forEach(([key, value]) => {
                if (value && value !== '') {
                  dispatch(setPanelFilter({ key: key as keyof PanelFilters, value }));
                }
              });
              console.log('Applied filters:', values);
            }}
          />

          <Button
            size="md"
            className="search-btn"
            onClick={() => {
              // Reset filters
              dispatch(resetPanelFilters());
              console.log('Filters reset');
            }}
          >
            Reset
          </Button>
        </Stack>
      </motion.div>

      {/* Table */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {/* <DevExtremeTable
          columns={columns.filter(item => !item.hide)}
          rows={tableRows}
          totalRecords={selectedAssets.length}
          checkboxSelection={true}
          disableSearch={false}
          clickableField="trailerModel"
        /> */}
        <Table
          columns={columns.filter(item => !item.hide)}
          rows={tableRows}
          totalRecords={
            shouldUseFilteredData
              ? (equipmentCountsData?.data?.totalRecords as number | undefined) ?? 0
              : (listData?.data?.totalRecords as number | undefined) ?? 0
          }
          checkboxSelection={true}
          disableSearch={false}
          clickableField="trailerModel"
          onClick={row => {
            const item = (row && row.__rawItem) as FleetApiItem | undefined;
            if (!item) return;
            // Prepare only exact-matching fields
            const gpsInfo = {
              motionStatus: item.motionStatus ?? '',
              lastGpsUpdate: item.lastGpsUpdate ?? '',
              location: item.location ?? '',
            };
            const equipmentSpecificationsInfo = {
              unitNumber: String(item.unitNumber ?? ''),
              vin: String(item.vin ?? ''),
              make: String(item.make ?? ''),
              year: String(item.year ?? ''),
              color: item.color == null || item.color === 'null' ? '' : String(item.color),
              doorType: String(item.doorType ?? ''),
              floorType: String(item.floorType ?? ''),
              wallType: String(item.wallType ?? ''),
              rimType: String(item.rimType ?? ''),
              trailerHeight: String(item.trailerHeight ?? ''),
              trailerWidth: String(item.trailerWidth ?? ''),
              roofType: String(item.roofType ?? ''),
              trailerLength: String(item.trailerLength ?? ''),
              tireSize: String(item.tireSize ?? ''),
              dateInService: String(item.dateInService ?? ''),
            } as Record<string, string>;
            const equipmentContractInfo = {
              account: String(item.account ?? ''),
            } as Record<string, string>;
            navigate('/fleet/fleet-view-details', {
              state: {
                gpsInfo,
                equipmentSpecificationsInfo,
                equipmentContractInfo,
              },
            });
          }}
          isLoading={isListFetching}
        />
      </Box>
    </Box>
  );

  if (activeView === 'list') {
    return (
      <Box>
        {/* Grid Container for Top Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '250px auto',
            gap: 2,
            p: '0 16px 16px',
            alignItems: 'start',
          }}
        >
          {/* Left: Tab Navigation */}
          <Box sx={{ pt: '5px' }}>
            <Tabs
              variant="secondary"
              options={tabOptions}
              activeTab={activeView}
              onChange={value => setActiveView(value as ViewMode)}
            />
          </Box>

          {/* Right: Info Cards */}
          <Box>{renderInfoCards()}</Box>
        </Box>

        {/* Full List View */}
        <Box sx={{ px: 2, height: 'calc(100% - 160px)' }}>{renderListView()}</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
      {/* Map Background - Always visible */}
      {renderMapView()}
      overflowY: 'auto',
      {/* Grid Container for Top Section */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'grid',
          gridTemplateColumns: '250px auto',
          gap: 2,
          p: 2,
          pt: '64px',
          alignItems: 'start',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        {/* Left: Tab Navigation */}
        <Box sx={{ pointerEvents: 'auto' }}>
          <Tabs
            variant="secondary"
            options={tabOptions}
            activeTab={activeView}
            onChange={value => setActiveView(value as ViewMode)}
          />

          {/* Show Panel Button */}
          <Box sx={{ mt: '2rem', mb: 1 }}>
            <Button
              variant="filled"
              icon={showFilterPanel ? <TbChevronLeft /> : <TbChevronRight />}
              iconPosition="left"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              size="fit"
            >
              {showFilterPanel ? 'Close Panel' : 'Show Panel'}
            </Button>
          </Box>

          {/* Filter Panel */}
          {showFilterPanel && (
            <Box sx={{ width: '280px' }}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  overflowY: 'auto',
                  height: '400px',
                  p: 2,
                }}
              >
                {/* Search Bar with Filter Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      position: 'relative',
                    }}
                  >
                    <TbSearch
                      size={20}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#666',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search Assets"
                      value={searchValue}
                      onChange={e => setSearchValue(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 40px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                  </Box>
                  <TbFilter
                    size={20}
                    style={{ cursor: 'pointer', color: '#666' }}
                    onClick={() => setShowFilterContent(!showFilterContent)}
                  />
                </Box>

                {/* Filter Content - Hidden by default, shown when filter icon is clicked */}
                {showFilterContent && (
                  <>
                    {/* Child Account - Full Width */}
                    <Box sx={{ mb: 1, mt: 1 }}>
                      <label
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Child Account:
                      </label>
                      <select
                        value={childAccount}
                        onChange={e => setChildAccount(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '14px',
                        }}
                      >
                        <option value="">Select Option</option>
                        {childAccountOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Box>

                    {/* Load Section */}
                    <Box sx={{ mb: 1 }}>
                      <label
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Load:
                      </label>
                      <Box sx={{ width: '100%' }}>
                        <Tabs
                          variant="secondary"
                          options={[
                            { label: 'Loaded', value: 'loaded', icon: TbCheck },
                            { label: 'Not Loaded', value: 'not_loaded', icon: TbX },
                          ]}
                          activeTab={loadStatus}
                          onChange={setLoadStatus}
                          className="full-width-tabs"
                        />
                      </Box>
                    </Box>

                    {/* Status Section */}
                    <Box>
                      <label
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Status:
                      </label>
                      <Box sx={{ width: '100%' }}>
                        <Tabs
                          variant="secondary"
                          options={[
                            { label: 'Motion', value: 'motion', icon: TbPlayerPlay },
                            { label: 'Stopped', value: 'stopped', icon: TbPlayerPause },
                          ]}
                          activeTab={statusFilter}
                          onChange={setStatusFilter}
                          className="full-width-tabs"
                        />
                      </Box>
                    </Box>
                  </>
                )}

                {/* Result Cards - Only show when search input has text */}
                {searchValue && mapViewAssets.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {/* Results Count */}
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginBottom: '1rem', fontWeight: '500' }}
                    >
                      Showing {mapViewAssets.length} results
                    </Typography>

                    {/* Result Cards */}
                    {mapViewAssets.map(item => (
                      <Box
                        key={item.id}
                        onClick={() => handleResultCardClick(item)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            borderRadius: '4px',
                          },
                        }}
                      >
                        <PanelFilterCard
                          unitNumber={item.name}
                          year={String(item.__rawFleetData?.year || 'N/A')}
                          make={String(item.__rawFleetData?.make || 'N/A')}
                          model={String(item.__rawFleetData?.model || 'N/A')}
                          trailerLength={String(item.__rawFleetData?.trailerLength || 'N/A')}
                          vehicleType="VAN"
                          lastGpsUpdate={item.lastUpdated}
                          loadStatus={item.status}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Advanced Filters - Hidden by default, shown when Advanced Filters button is clicked */}
                <motion.div
                  className="filters-wrapper"
                  initial={{ height: 0 }}
                  animate={{ height: showFilters ? 'auto' : 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ padding: '0.8rem', paddingBottom: 0 }}
                  >
                    Filter by
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="flex-end"
                    gap={1}
                    sx={{ padding: '0.8rem', paddingTop: '0.5rem' }}
                  >
                    <DynamicForm
                      formData={fleetFilters}
                      className="filters-inputs-container"
                      onSubmit={values => {
                        // Update Redux store with filter values
                        Object.entries(values).forEach(([key, value]) => {
                          if (value && value !== '') {
                            dispatch(setPanelFilter({ key: key as keyof PanelFilters, value }));
                          }
                        });
                        console.log('Applied filters:', values);
                      }}
                    />

                    <Button
                      size="md"
                      className="search-btn"
                      onClick={() => {
                        // Reset filters
                        dispatch(resetPanelFilters());
                        console.log('Filters reset');
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, pointerEvents: 'auto' }}>
          {renderInfoCards()}
        </Box>

        {/* Right: Info Cards */}
      </Box>
    </Box>
  );
};

export default FleetView;
