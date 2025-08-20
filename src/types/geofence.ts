export type GeofenceAPIData = {
    id?: number;
    geofence_name?: string;
    geofence_shape?: string;
    accounts?: string[];
    center_lat?: number;
    center_lng?: number;
    created_at?: string;
    created_by?: number;
    created_by_user?: {};
    geofence_location?: string;
    description?: string;
    owner?: string;
    polygon?: {};
    radius_meters?: number;
    status?: string;
    tag_name?: string;
    updated_at?: string;
    updated_by?: string
}

export type GeofenceDetailsData = GeofenceAPIData & {
    tag_lookup_id: number;
};

export type TagLookupData = {
    tag_lookup_id?: number;
    tag_name?: string;
    status?: string;
    created_at?: string
}