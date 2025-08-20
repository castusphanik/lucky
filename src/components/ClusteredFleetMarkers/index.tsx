import { InfoWindow } from '@vis.gl/react-google-maps';
import React, { useCallback, useMemo, useState } from 'react';
import { type FleetAsset } from '../../types/fleet';
import FleetMarker from '../FleetMarker';
import { FleetClusterMarker } from '../FleetClusterMarker';
import { useSupercluster } from '../../hooks/useSupercluster';
import type { FeatureCollection, Point } from 'geojson';
import type Supercluster from 'supercluster';
import type { ClusterProperties } from 'supercluster';
import FleetDetailsCard from '../FleetDetailsCard';

export type ClusteredFleetMarkersProps = {
  assets: FleetAsset[];
};

const superclusterOptions: Supercluster.Options<{ asset: FleetAsset }, ClusterProperties> = {
  extent: 256,
  radius: 80,
  maxZoom: 12,
};

/**
 * The ClusteredFleetMarkers component integrates fleet assets with supercluster
 */
export const ClusteredFleetMarkers = ({ assets }: ClusteredFleetMarkersProps) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  // Convert fleet assets to GeoJSON format for Supercluster
  const geojson: FeatureCollection<Point, { asset: FleetAsset }> = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: assets.map(asset => ({
        type: 'Feature',
        id: asset.id,
        geometry: {
          type: 'Point',
          coordinates: [asset.position.lng, asset.position.lat],
        },
        properties: {
          asset,
        },
      })),
    }),
    [assets]
  );

  const { clusters } = useSupercluster(geojson, superclusterOptions);

  const selectedAsset = useMemo(
    () => (assets && selectedAssetId ? assets.find(a => a.id === selectedAssetId)! : null),
    [assets, selectedAssetId]
  );

  // Get the raw fleet data for the selected asset
  const selectedFleetData = useMemo(() => {
    if (!selectedAsset) return null;

    // Extract the raw fleet data from the asset
    // The asset should contain the original fleet object data
    return selectedAsset.__rawFleetData || null;
  }, [selectedAsset]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedAssetId(null);
  }, []);

  const handleAssetMarkerClick = useCallback((asset: FleetAsset) => {
    setSelectedAssetId(asset.id);
  }, []);

  const handleClusterClick = useCallback(() => {
    // Optional: Add cluster click behavior if needed
    // Could zoom to cluster bounds or show cluster info
  }, []);

  return (
    <>
      {clusters.map(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const clusterProperties = feature.properties as ClusterProperties;
        const isCluster: boolean = clusterProperties?.cluster;

        return isCluster ? (
          <FleetClusterMarker
            key={feature.id}
            clusterId={clusterProperties.cluster_id}
            position={{ lat, lng }}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count_abbreviated)}
            onMarkerClick={handleClusterClick}
          />
        ) : (
          <FleetMarker
            key={feature.id}
            asset={(feature.properties as { asset: FleetAsset }).asset}
            assetId={feature.id as string}
            position={{ lat, lng }}
            onMarkerClick={() =>
              handleAssetMarkerClick((feature.properties as { asset: FleetAsset }).asset)
            }
          />
        );
      })}

      {selectedAssetId && selectedAsset && (
        <InfoWindow position={selectedAsset.position} onCloseClick={handleInfoWindowClose}>
          <FleetDetailsCard fleetData={selectedFleetData} />
        </InfoWindow>
      )}
    </>
  );
};
