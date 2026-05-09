import { useState } from 'react';
import { Crosshair, Activity } from 'lucide-react';
import { GoogleMap, useLoadScript, Circle, InfoWindow, TrafficLayer } from '@react-google-maps/api';

// Point Incidents (Accidents, Potholes)
const liveIncidents = [
  { id: 1, pos: { lat: 19.8762, lng: 75.3433 }, type: 'Critical', hazard: 'Accident (NH-52)', color: '#ef4444', pulse: true },
  { id: 2, pos: { lat: 19.8820, lng: 75.3350 }, type: 'Warning', hazard: 'Stray Animal', color: '#f59e0b', pulse: false },
  { id: 3, pos: { lat: 19.8710, lng: 75.3520 }, type: 'Info', hazard: 'Pothole Cluster', color: '#3b82f6', pulse: false },
];

// Ultra-Dark Map Style to make the Traffic Lines Glow
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] }, 
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ visibility: "off" }] }, 
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] }
];

export default function IncidentMap({ setSelectedRegion }) {
  const [activeIncident, setActiveIncident] = useState(null);
  const [scannedArea, setScannedArea] = useState(null);

  const mapCenter = { lat: 19.8762, lng: 75.3433 };

  // Leave API key blank for development
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: "" });

  if (loadError) return <div className="p-4 text-white">Error loading maps.</div>;
  if (!isLoaded) return <div className="p-4 text-white flex justify-center items-center h-full">Initializing Maps...</div>;

  // Simulate an AI scan when the user clicks anywhere on the map
  const handleMapClick = (e) => {
    setActiveIncident(null);
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    // Generate pseudo-random traffic data based on the coordinates
    const speeds = [12, 24, 35, 42, 55, 65];
    const statuses = ['Congested / Gridlock', 'Heavy Flow', 'Moderate Flow', 'Steady Flow', 'Free Flowing', 'Clear Route'];
    const areas = ['CIDCO Sector', 'Jalgaon Road Hwy', 'Kranti Chowk', 'Osmanpura', 'Beed Bypass', 'Downtown Grid'];
    
    const randomIdx = Math.floor(Math.abs(lat * lng * 100) % speeds.length);

    const scanData = {
      name: areas[randomIdx],
      pos: { lat, lng },
      speed: speeds[randomIdx],
      status: statuses[randomIdx],
      color: randomIdx < 2 ? '#ef4444' : randomIdx < 4 ? '#eab308' : '#22c55e'
    };

    setScannedArea(scanData);
    
    // Pass the data UP to the dashboard to update charts
    if (setSelectedRegion) {
      setSelectedRegion(scanData); 
    }
  };

  const closeScan = () => {
    setScannedArea(null);
    if (setSelectedRegion) {
      setSelectedRegion(null); 
    }
  };

  return (
    <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 flex flex-col shadow-2xl overflow-hidden relative group">
      
      {/* Map Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 z-20">
        <h2 className="font-bold text-slate-100 uppercase tracking-wider text-sm flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          Live City Traffic Matrix
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1 shadow-[0_0_8px_#10b981]">
             <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
             NATIVE TRAFFIC ENGINE
          </span>
        </div>
      </div>
      
      {/* The Map Canvas */}
      <div className="flex-1 relative z-10 w-full h-full">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={14}
          center={mapCenter}
          options={{ 
            styles: darkMapStyle, 
            disableDefaultUI: true, 
            zoomControl: true 
          }}
          onClick={handleMapClick}
        >
          {/* NATIVE TRAFFIC LAYER */}
          <TrafficLayer />

          {/* Point Incidents */}
          {liveIncidents.map((incident) => (
            <Circle
              key={incident.id}
              center={incident.pos}
              radius={incident.pulse ? 250 : 100}
              options={{ 
                fillColor: incident.color, 
                fillOpacity: 0.6, 
                strokeColor: incident.color, 
                strokeOpacity: 0.8, 
                strokeWeight: incident.pulse ? 3 : 1, 
                zIndex: 60 
              }}
              onClick={() => {
                closeScan();
                setActiveIncident(incident);
              }}
            />
          ))}

          {/* Popup Window for Point Incidents */}
          {activeIncident && (
            <InfoWindow position={activeIncident.pos} onCloseClick={() => setActiveIncident(null)}>
              <div className="p-1 text-slate-900 font-sans min-w-[120px]">
                <strong style={{ color: activeIncident.color }} className="text-sm uppercase tracking-wide">
                  {activeIncident.type} ALERT
                </strong>
                <p className="text-sm mt-1">{activeIncident.hazard}</p>
              </div>
            </InfoWindow>
          )}

          {/* Area Scanner Popup */}
          {scannedArea && (
            <InfoWindow position={scannedArea.pos} onCloseClick={closeScan}>
              <div className="p-2 text-slate-900 font-sans min-w-[160px]">
                <strong className="text-[10px] text-slate-500 uppercase tracking-wider block border-b border-slate-200 pb-1 mb-2 flex items-center gap-1">
                  <Crosshair size={12} /> {scannedArea.name}
                </strong>
                <div className="flex justify-between items-center mt-1">
                   <span className="text-xs font-bold text-slate-600">Status:</span>
                   <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wide" style={{ backgroundColor: scannedArea.color }}>
                     {scannedArea.status}
                   </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-xs font-bold text-slate-600">Avg Speed:</span>
                   <span className="text-sm font-mono font-bold" style={{ color: scannedArea.color }}>
                     {scannedArea.speed} km/h
                   </span>
                </div>
              </div>
            </InfoWindow>
          )}

        </GoogleMap>
      </div>
    </div>
  );
}