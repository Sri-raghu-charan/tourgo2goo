//npm install leaflet react-leaflet run thuis command in terminal to inlcude live interacting map

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const InteractiveMap = () => {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden">
      <MapContainer
        center={[17.0, 81.8]} // Rajahmundry
        zoom={11}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={[17.0, 81.8]}>
          <Popup>Rajahmundry</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;

//after complition restart the server 

