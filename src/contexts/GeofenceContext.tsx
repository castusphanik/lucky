import type { GeofenceAPIData } from '@/types/geofence';
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Enhanced geofence data structure
export interface GeofenceData {
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
  group: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  createdBy: string;
  description?: string;
  alertsConfigured?: number;
  accounts?: string[];
}

interface GeofenceContextType {
  // Geofences data
  geofences: GeofenceData[];
  setGeofences: React.Dispatch<React.SetStateAction<GeofenceData[]>>;

  // Selected geofence for details
  selectedGeofence: GeofenceAPIData | null;
  setSelectedGeofence: React.Dispatch<React.SetStateAction<GeofenceAPIData | null>>;

  // Navigation state
  showDetailsPage: boolean;
  setShowDetailsPage: React.Dispatch<React.SetStateAction<boolean>>;

  // UI state
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  viewMode: 'map' | 'list';
  setViewMode: React.Dispatch<React.SetStateAction<'map' | 'list'>>;

  // Modal state
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Drawing state
  currentShape: {
    shape: google.maps.Circle | google.maps.Polygon;
    type: 'circle' | 'polygon';
  } | null;
  setCurrentShape: React.Dispatch<
    React.SetStateAction<{
      shape: google.maps.Circle | google.maps.Polygon;
      type: 'circle' | 'polygon';
    } | null>
  >;

  // Autocomplete state
  selectedPlace: google.maps.places.Place | null;
  setSelectedPlace: React.Dispatch<React.SetStateAction<google.maps.places.Place | null>>;
}

const GeofenceContext = createContext<GeofenceContextType | undefined>(undefined);

export const useGeofenceContext = () => {
  const context = useContext(GeofenceContext);
  if (context === undefined) {
    throw new Error('useGeofenceContext must be used within a GeofenceProvider');
  }
  return context;
};

interface GeofenceProviderProps {
  children: ReactNode;
}

export const GeofenceProvider: React.FC<GeofenceProviderProps> = ({ children }) => {
  // Geofences data
  const [geofences, setGeofences] = useState<GeofenceData[]>([]);
  const [selectedGeofence, setSelectedGeofence] = useState<GeofenceAPIData | null>(null);

  // Navigation state
  const [showDetailsPage, setShowDetailsPage] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('geofences');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drawing state
  const [currentShape, setCurrentShape] = useState<{
    shape: google.maps.Circle | google.maps.Polygon;
    type: 'circle' | 'polygon';
  } | null>(null);

  // Autocomplete state
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);

  const value: GeofenceContextType = {
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
  };

  return <GeofenceContext.Provider value={value}>{children}</GeofenceContext.Provider>;
};
