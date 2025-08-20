import type { FleetAsset, FleetStats } from '../types/fleet';

// Major US cities with their coordinates for realistic distribution
const majorCities = [
  { name: 'New York', lat: 40.7128, lng: -74.006, weight: 15 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, weight: 12 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, weight: 10 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698, weight: 8 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.074, weight: 6 },
  { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, weight: 7 },
  { name: 'San Antonio', lat: 29.4241, lng: -98.4936, weight: 5 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611, weight: 6 },
  { name: 'Dallas', lat: 32.7767, lng: -96.797, weight: 7 },
  { name: 'San Jose', lat: 37.3382, lng: -121.8863, weight: 5 },
  { name: 'Austin', lat: 30.2672, lng: -97.7431, weight: 4 },
  { name: 'Jacksonville', lat: 30.3322, lng: -81.6557, weight: 3 },
  { name: 'Fort Worth', lat: 32.7555, lng: -97.3308, weight: 4 },
  { name: 'Columbus', lat: 39.9612, lng: -82.9988, weight: 4 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, weight: 6 },
  { name: 'Charlotte', lat: 35.2271, lng: -80.8431, weight: 4 },
  { name: 'Indianapolis', lat: 39.7684, lng: -86.1581, weight: 4 },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321, weight: 5 },
  { name: 'Denver', lat: 39.7392, lng: -104.9903, weight: 5 },
  { name: 'Boston', lat: 42.3601, lng: -71.0589, weight: 6 },
  { name: 'El Paso', lat: 31.7619, lng: -106.485, weight: 3 },
  { name: 'Detroit', lat: 42.3314, lng: -83.0458, weight: 4 },
  { name: 'Nashville', lat: 36.1627, lng: -86.7816, weight: 3 },
  { name: 'Memphis', lat: 35.1495, lng: -90.049, weight: 3 },
  { name: 'Portland', lat: 45.5152, lng: -122.6784, weight: 4 },
  { name: 'Oklahoma City', lat: 35.4676, lng: -97.5164, weight: 3 },
  { name: 'Las Vegas', lat: 36.1699, lng: -115.1398, weight: 4 },
  { name: 'Louisville', lat: 38.2527, lng: -85.7585, weight: 3 },
  { name: 'Milwaukee', lat: 43.0389, lng: -87.9065, weight: 3 },
  { name: 'Albuquerque', lat: 35.0844, lng: -106.6504, weight: 2 },
  { name: 'Tucson', lat: 32.2226, lng: -110.9747, weight: 2 },
  { name: 'Fresno', lat: 36.7468, lng: -119.7726, weight: 2 },
  { name: 'Sacramento', lat: 38.5816, lng: -121.4944, weight: 3 },
  { name: 'Kansas City', lat: 39.0997, lng: -94.5786, weight: 3 },
  { name: 'Mesa', lat: 33.4152, lng: -111.8315, weight: 2 },
  { name: 'Atlanta', lat: 33.749, lng: -84.388, weight: 6 },
  { name: 'Colorado Springs', lat: 38.8339, lng: -104.8214, weight: 2 },
  { name: 'Raleigh', lat: 35.7796, lng: -78.6382, weight: 3 },
  { name: 'Omaha', lat: 41.2524, lng: -95.998, weight: 2 },
  { name: 'Miami', lat: 25.7617, lng: -80.1918, weight: 5 },
  { name: 'Long Beach', lat: 33.7701, lng: -118.1937, weight: 2 },
  { name: 'Virginia Beach', lat: 36.8529, lng: -75.978, weight: 2 },
  { name: 'Oakland', lat: 37.8044, lng: -122.2712, weight: 3 },
  { name: 'Minneapolis', lat: 44.9778, lng: -93.265, weight: 4 },
  { name: 'Tulsa', lat: 36.154, lng: -95.9928, weight: 2 },
  { name: 'Tampa', lat: 27.9506, lng: -82.4572, weight: 3 },
  { name: 'Arlington', lat: 32.7357, lng: -97.1081, weight: 2 },
  { name: 'New Orleans', lat: 29.9511, lng: -90.0715, weight: 3 },
];

const statuses = ['active', 'idle', 'maintenance', 'alert'] as const;
const categories = ['equipment', 'vehicle', 'trailer'] as const;
const equipmentTypes = [
  'Excavator',
  'Bulldozer',
  'Crane',
  'Loader',
  'Dump Truck',
  'Backhoe',
  'Forklift',
  'Compactor',
  'Grader',
  'Scraper',
  'Paver',
  'Roller',
  'Skid Steer',
  'Trencher',
  'Generator',
  'Concrete Mixer',
  'Pump Truck',
];

// Helper function to generate random coordinates around a city
function generateRandomLocationNearCity(city: (typeof majorCities)[0], radiusKm: number = 50) {
  const radiusInDegrees = radiusKm / 111; // Approximate conversion from km to degrees

  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.random() * radiusInDegrees;

  const lat = city.lat + radius * Math.cos(angle);
  const lng = city.lng + radius * Math.sin(angle);

  return { lat, lng };
}

// Helper function to generate weighted random city
function getWeightedRandomCity() {
  const totalWeight = majorCities.reduce((sum, city) => sum + city.weight, 0);
  let random = Math.random() * totalWeight;

  for (const city of majorCities) {
    random -= city.weight;
    if (random <= 0) {
      return city;
    }
  }

  return majorCities[0]; // fallback
}

// Generate fleet assets
export function generateMockFleetData(): FleetAsset[] {
  const assets: FleetAsset[] = [];

  for (let i = 0; i < 5000; i++) {
    const city = getWeightedRandomCity();
    const position = generateRandomLocationNearCity(city, 75); // 75km radius

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const equipmentType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];

    // Generate realistic asset name
    const assetNumber = String(i + 1).padStart(4, '0');
    const name = `${equipmentType} ${assetNumber}`;

    // Determine GPS and alert status based on status
    const hasGPS = Math.random() > 0.2; // 80% have GPS
    const hasAlert = status === 'alert' || (status === 'maintenance' && Math.random() > 0.7);

    // Generate last updated time (within last 24 hours)
    const lastUpdated = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString();

    assets.push({
      id: `asset-${i + 1}`,
      name,
      status,
      category,
      position,
      lastUpdated,
      hasGPS,
      hasAlert,
    });
  }

  return assets;
}

// Calculate fleet statistics from assets
export function calculateFleetStats(assets: FleetAsset[]): FleetStats {
  const totalAssets = assets.length;
  const totalActiveUnits = assets.filter(a => a.status === 'active').length;
  const unitsWithActiveGPS = assets.filter(a => a.hasGPS).length;
  const idleUnits = assets.filter(a => a.status === 'idle').length;
  const unitsDueForMaintenance = assets.filter(a => a.status === 'maintenance').length;
  const unitsWithActiveAlerts = assets.filter(a => a.hasAlert).length;

  return {
    totalAssets,
    totalActiveUnits,
    unitsWithActiveGPS,
    idleUnits,
    unitsDueForMaintenance,
    unitsWithActiveAlerts,
  };
}

// Pre-generate the data for consistent experience
export const mockFleetAssets = generateMockFleetData();
export const fleetStats = calculateFleetStats(mockFleetAssets);
