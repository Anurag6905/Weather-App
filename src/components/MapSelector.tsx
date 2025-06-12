import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapSelectorProps {
  onSelect: (lat: number, lon: number) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onSelect }) => {
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos([lat, lng]);
        onSelect(lat, lng);
      },
    });

    return markerPos ? <Marker position={markerPos} /> : null;
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[20.5937, 78.9629]} // India center
        zoom={4}
        style={{ height: '350px', width: '100%', borderRadius: '16px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default MapSelector;
