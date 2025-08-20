export interface FleetAsset {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'alert';
  category: 'equipment' | 'vehicle' | 'trailer';
  position: {
    lat: number;
    lng: number;
  };
  lastUpdated: string;
  hasGPS?: boolean;
  hasAlert?: boolean;
  __rawFleetData?: any; // Raw fleet data from API for use in FleetDetailsCard
}

export interface FleetStats {
  totalAssets: number;
  totalActiveUnits: number;
  unitsWithActiveGPS: number;
  idleUnits: number;
  unitsDueForMaintenance: number;
  unitsWithActiveAlerts: number;
}

export type ViewMode = 'map' | 'list';

export interface FleetFilters {
  status?: string;
  category?: string;
  hasGPS?: boolean;
  hasAlert?: boolean;
}
