import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 30,
      blur: 10,
      maxZoom: 18,
      max: 1.0,
      minOpacity: 0.7,
    });

    heatLayer.addTo(map);

    const latLngs = points.map((p) => L.latLng(p[0], p[1]));
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export function MapPage() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/locations");  
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();

        const pointsWithIntensity = data.map((point) => {
          if (point.length === 2) {
            return [...point, 0.7];
          }
          return point;
        });

        setPoints(pointsWithIntensity);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }

    fetchLocations();
  }, []);

  return (
    <div className="App">
      <div className="App-header2">
        <h1>Heatmap - Infrastructure Issue Locations</h1>
        <MapContainer
          center={[12.9716, 77.5946]} 
          zoom={13}
          style={{ height: "90vh", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer points={points} />
        </MapContainer>
      </div>
    </div>
  );
}
