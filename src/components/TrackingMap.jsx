// src/components/TrackingMap.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🛵 Premium tracking pin layout icon setup
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42], // Pins the precise bottom tip to the coordinate location
  popupAnchor: [0, -42],
});

// Helper component that acts as the map camera controller
function MapCameraController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      // Smoothly fly and re-center on the new location updates
      map.flyTo(position, 15, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function TrackingMap({ liveCoordinates }) {
  const defaultCenter = [9.03, 38.74]; // Default map view center (Addis Ababa)
  const currentPosition = liveCoordinates || defaultCenter;

  return (
    <div className="w-full h-[400px] md:h-[600px] relative z-10">
      <MapContainer center={defaultCenter} zoom={13} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Handles dynamic viewport movement */}
        <MapCameraController position={currentPosition} />

        <Marker position={currentPosition} icon={deliveryIcon}>
          <Popup>
            <div className="text-xs font-bold text-gray-800">
              ⚡ Courier is moving!
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
