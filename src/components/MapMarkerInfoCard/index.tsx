import React from "react";
import { Typography, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Button from "../Button";
import "./styles.scss";

type MapMarkerInfoCardProps = {
  title: string;
  address: string;
  phone: string;
  hours: string;
  onRequestService?: () => void;
};

const MapMarkerInfoCard: React.FC<MapMarkerInfoCardProps> = ({
  title,
  address,
  phone,
  hours,
  onRequestService,
}) => {
  return (
    <div className="map-marker-card">
      <div className="map-marker-card__header">
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </div>

      <div className="map-marker-card__content-section">
        <div className="map-marker-card__info">
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">Address</Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {address}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">Phone</Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {phone}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={1}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">Hours</Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {hours}
            </Typography>
          </Stack>
        </div>

        <Button
          color="primary"
          classValue="map-marker-card__button"
          onClick={onRequestService}
          size="fit"
        >
          Request Service
        </Button>
      </div>

      <div className="map-marker-card__pointer" />
    </div>
  );
};

export default MapMarkerInfoCard;
