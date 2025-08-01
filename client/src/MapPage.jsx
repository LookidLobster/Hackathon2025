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
  const [dbPoints, setDbPoints] = useState([]);

  // Hardcoded sample points concentrated in Bangalore for demonstration
  const bangaloreSamples = [
    [12.9765, 77.5990, 0.9],   // MG Road
    [12.9719, 77.6050, 0.85],  // Brigade Road
    [12.9352, 77.6245, 0.75],  // Koramangala Main Road
    [12.9695, 77.7508, 0.8],   // Whitefield Main Road
    [12.9718, 77.6409, 0.7],   // Indiranagar 100 Feet Road
    [12.9338, 77.5848, 0.65],  // Jayanagar 4th Block
    [13.0344, 77.5996, 0.7],   // Hebbal Flyover
    [12.9043, 77.5847, 0.6],   // Bannerghatta Road
    [12.8399, 77.6770, 0.75],  // Electronic City
    [12.9141, 77.6101, 0.65],  // BTM Layout
  ];

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("/locations"); 
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();

        const pointsWithIntensity = data.map((point) =>
          point.length === 2 ? [...point, 0.7] : point
        );

        setDbPoints(pointsWithIntensity);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }

    fetchLocations();
  }, []);

  const combinedPoints = [...dbPoints, ...bangaloreSamples];

  return (
    <div className="App">
      <div className="App-header2">
        <h1>Heatmap with Database Data</h1>
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={13}
          style={{ height: "90vh", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer points={combinedPoints} />
        </MapContainer>
      </div>
    </div>
  );
}
