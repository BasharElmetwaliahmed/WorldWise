import { useEffect } from "react";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import  Button  from "./Button.jsx";
import { useNavigate } from "react-router-dom";
import { useCities } from "../Context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import styles from "./Map.module.css";
import useUrlPosition from "../hooks/useUrlPosition.js";
function Map() {
  const [currentPosition, setCurrentPosition] = useState([40, 40]);
  const { cities } = useCities();
  const {
    isLoading: geolocationLoading,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [lat,lng] =useUrlPosition()

  useEffect(() => {
    if (lat && lng) setCurrentPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geolocationPosition)
      setCurrentPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {geolocationLoading ? "loading..." : "Get Your Position"}
        </Button>
      )}
      <MapContainer
        center={currentPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>
                {city.emoji} <span>{city.cityName}</span>
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={currentPosition} />
        <DetectClick />
      </MapContainer>
      ,
    </div>
  );
}

export default Map;

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      console.log("e");
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
  return null;
}
