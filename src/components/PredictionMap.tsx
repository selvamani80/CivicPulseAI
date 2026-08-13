import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RiskPrediction, CitizenReport } from '../types.js';
import { AlertTriangle, Clock, ShieldCheck, Cpu, MapPin, Sparkles, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Helper component to control map panning dynamically
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

interface PredictionMapProps {
  predictions: RiskPrediction[];
  reports: CitizenReport[];
  selectedPredictionId?: string;
  onSelectPrediction?: (pred: RiskPrediction) => void;
  onSelectReport?: (report: CitizenReport) => void;
  isDarkMode?: boolean;
}

export const REGIONAL_CITIES = [
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, zoom: 13 },
  { name: 'Karaikudi', lat: 10.0689, lng: 78.7801, zoom: 14 },
  { name: 'Devakottai', lat: 9.9481, lng: 78.8252, zoom: 14 },
  { name: 'Trichy', lat: 10.7905, lng: 78.7047, zoom: 13 }
];

export const PredictionMap: React.FC<PredictionMapProps> = ({
  predictions,
  reports,
  selectedPredictionId,
  onSelectPrediction,
  onSelectReport,
  isDarkMode = true
}) => {
  // Default map center: Madurai
  const [mapCenter, setMapCenter] = useState<[number, number]>([9.9252, 78.1198]);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [activeCity, setActiveCity] = useState<string>('Madurai');

  useEffect(() => {
    if (selectedPredictionId) {
      const p = predictions.find(pred => pred.id === selectedPredictionId);
      if (p) {
        setMapCenter([p.location.latitude, p.location.longitude]);
        setMapZoom(14);
      }
    }
  }, [selectedPredictionId, predictions]);

  const handleCityClick = (city: typeof REGIONAL_CITIES[0]) => {
    setMapCenter([city.lat, city.lng]);
    setMapZoom(city.zoom);
    setActiveCity(city.name);
  };

  const getRiskColor = (prob: number) => {
    if (prob >= 0.8) return '#ef4444'; // Red (Critical)
    if (prob >= 0.6) return '#f97316'; // Orange (High)
    if (prob >= 0.4) return '#eab308'; // Yellow (Medium)
    return '#10b981'; // Green (Low)
  };

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-900">
      {/* Map Control Overlay Banner */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur border border-slate-700/90 rounded-xl p-3 shadow-2xl text-white text-xs max-w-sm space-y-2">
        <div className="flex items-center space-x-2 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>OpenStreetMap Predictive Hotspots</span>
        </div>
        <p className="text-[11px] text-slate-300">
          Showing real-time civic risk signals & AI predictions across <strong>Madurai, Karaikudi, Devakottai, Trichy</strong>.
        </p>

        {/* Quick Regional City Jump Buttons */}
        <div className="pt-1.5 border-t border-slate-800">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-1 flex items-center">
            <Navigation className="w-3 h-3 mr-1 text-cyan-400" />
            Quick Pan To Region:
          </span>
          <div className="flex flex-wrap gap-1">
            {REGIONAL_CITIES.map(city => (
              <button
                key={city.name}
                onClick={() => handleCityClick(city)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer ${
                  activeCity === city.name
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] gap-2 pt-1.5 border-t border-slate-800">
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span> Critical (≥80%)</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1"></span> High (60-79%)</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span> Citizen Report</span>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-1"
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            isDarkMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        <LayersControl position="topright">
          {/* Layer 1: Predicted Risk Hotspots */}
          <LayersControl.Overlay checked name="Predicted Risks Engine">
            <LayerGroup>
              {predictions.map(pred => {
                const color = getRiskColor(pred.riskProbability);
                return (
                  <React.Fragment key={pred.id}>
                    {/* Outer Risk Radius Circle */}
                    <CircleMarker
                      center={[pred.location.latitude, pred.location.longitude]}
                      radius={32}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.25,
                        weight: 2,
                        dashArray: '4, 4'
                      }}
                    />

                    {/* Center Point */}
                    <CircleMarker
                      center={[pred.location.latitude, pred.location.longitude]}
                      radius={12}
                      pathOptions={{
                        color: '#ffffff',
                        fillColor: color,
                        fillOpacity: 0.9,
                        weight: 2
                      }}
                      eventHandlers={{
                        click: () => onSelectPrediction && onSelectPrediction(pred)
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="p-1 max-w-xs text-slate-900">
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white bg-slate-900">
                              AI Prediction
                            </span>
                            <span className="text-xs font-bold text-red-600 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {Math.round(pred.riskProbability * 100)}% Risk
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-slate-900 capitalize leading-tight">
                            {pred.category.replace('_', ' ')}
                          </h3>
                          <p className="text-xs text-slate-600 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                            {pred.location.areaName} ({pred.location.ward})
                          </p>

                          <div className="mt-2 text-[11px] bg-slate-100 p-2 rounded border border-slate-200">
                            <span className="font-semibold text-slate-800 flex items-center mb-1">
                              <Clock className="w-3 h-3 mr-1 text-amber-600" />
                              Window: {pred.expectedTimeWindow}
                            </span>
                            <p className="text-slate-600 line-clamp-2">
                              <strong>Rec Action:</strong> {pred.recommendedAction}
                            </p>
                          </div>

                          {onSelectPrediction && (
                            <button
                              onClick={() => onSelectPrediction(pred)}
                              className="mt-2.5 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded shadow transition flex items-center justify-center"
                            >
                              <Cpu className="w-3.5 h-3.5 mr-1" />
                              Inspect SHAP Factors & Dispatch
                            </button>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  </React.Fragment>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 2: Citizen Signals */}
          <LayersControl.Overlay checked name="Citizen Signals & Reports">
            <LayerGroup>
              {reports.map(rep => (
                <Marker
                  key={rep.id}
                  position={[rep.location.latitude, rep.location.longitude]}
                  eventHandlers={{
                    click: () => onSelectReport && onSelectReport(rep)
                  }}
                >
                  <Popup>
                    <div className="p-1 max-w-xs text-slate-900">
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Citizen Report
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {rep.language.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 capitalize">
                        {rep.category.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-slate-700 mt-1 line-clamp-2 italic">
                        "{rep.description}"
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Ward: {rep.location.ward} • {rep.location.areaName}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};
