import { permissionsData, permissionTypes } from './data';

export function bytesToKB(bytes: number): number {
  const kb = bytes / 1024;
  return Math.round(kb);
}

export function getLoggedInUserData() {
  const userData = localStorage.getItem('auth_tokens') || '{}';
  return JSON.parse(userData);
}

export const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return ''; // Invalid date check

  return date.toLocaleDateString('en-US'); // MM/DD/YYYY
};

export function toQueryString(params: object): string {
  const searchParams = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      searchParams.set(key, value.join(','));
      return;
    }
    searchParams.set(key, String(value));
  });
  return searchParams.toString();
}

export function getTransformedPermissions(data: typeof permissionsData): string[] {
  return data
    .flatMap((item: Record<string, string | boolean | number>) => {
      return permissionTypes.map(({ key, prefix }) => {
        if (typeof item[key] === 'boolean' && item[key]) {
          return `${prefix}:${item.modulePermission}`;
        }
      });
    })
    .filter(item => item !== undefined);
}

export const getLocationName = (results: google.maps.GeocoderResult[]): string => {
  if (!results || results.length === 0) return 'Unknown location';

  // Try to pick the most detailed result (preferably with 'locality' or 'administrative_area_level_1')
  const bestResult = results.find(result =>
    result.address_components.some(comp =>
      comp.types.includes('locality') || comp.types.includes('administrative_area_level_1')
    )
  ) || results[0]; // fallback

  const components = bestResult.address_components;

  const city =
    components.find(c => c.types.includes('locality'))?.long_name ||
    components.find(c => c.types.includes('sublocality'))?.long_name ||
    components.find(c => c.types.includes('administrative_area_level_2'))?.long_name;

  const state = components.find(c => c.types.includes('administrative_area_level_1'))?.short_name;

  const country = components.find(c => c.types.includes('country'))?.short_name;

  // Build label
  if (city && state) return `${city}, ${state}`;
  if (!city && state) return state;
  if (!state && city) return city;
  if (!city && !state && country) return country;

  return bestResult.formatted_address || 'Unknown location';
};

export const convertToWKTPolygon = (polygonData: any, manualPolygonVertices: any) => {
  const vertices = polygonData ?
    (polygonData as google.maps.Polygon)
      ?.getPath()
      ?.getArray()
      ?.map((latLng: google.maps.LatLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      })) || [] : manualPolygonVertices;

  if (vertices.length > 0 && (vertices[0].lat !== vertices[vertices.length - 1].lat || vertices[0].lng !== vertices[vertices.length - 1].lng)) {
    vertices.push(vertices[0]);
  }

  return `POLYGON((${vertices.map((point) => `${point.lng} ${point.lat}`).join(', ')}))`;
}

