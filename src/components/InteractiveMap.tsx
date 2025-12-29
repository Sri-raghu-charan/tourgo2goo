//npm install leaflet react-leaflet run thuis command in terminal to inlcude live interacting map

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/utils/leafletIconFix";

const InteractiveMap = () => {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-large">
      <MapContainer
        center={[17.0, 81.8]} // Rajahmundry (default center)
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Example Marker */}
        <Marker position={[17.0, 81.8]}>
          <Popup>
            <strong>Rajahmundry</strong>
            <br />
            Welcome to TourGo 🚀
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
