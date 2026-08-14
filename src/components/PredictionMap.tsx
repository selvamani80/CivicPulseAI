import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RiskPrediction, CitizenReport } from '../types.js';
import { AlertTriangle, Clock, ShieldCheck, Cpu, MapPin, Sparkles, Navigation, Layers, Filter, Activity, Gauge } from 'lucide-react';
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
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, zoom: 13, district: 'Madurai', activeSensors: 24 },
  { name: 'Karaikudi', lat: 10.0689, lng: 78.7801, zoom: 14, district: 'Sivaganga', activeSensors: 16 },
  { name: 'Trichy', lat: 10.7905, lng: 78.7047, zoom: 13, district: 'Tiruchirappalli', activeSensors: 28 },
  { name: 'Devakottai', lat: 9.9481, lng: 78.8252, zoom: 14, district: 'Sivaganga', activeSensors: 12 }
];

export const PREDICTION_ALGORITHMS = [
  { id: 'xgboost', name: 'XGBoost Spatio-Temporal Risk', desc: 'Multi-factor gradient boosted trees combining rainfall radar, terrain slope, citizen reports, and culvert capacity.', tag: 'ML Hybrid' },
  { id: 'dbscan', name: 'DBSCAN Spatial Cluster Engine', desc: 'Density-based spatial clustering with noise filtering (ε=300m, MinPts=3) for incident hotspot detection.', tag: 'Cluster' },
  { id: 'bayesian', name: 'Bayesian Runoff Surge Model', desc: 'Probabilistic hydraulic surcharge modeling estimating pipe inundation under monsoon cloudbursts.', tag: 'Hydrology' },
  { id: 'infrastructure', name: 'Asset Vulnerability Index', desc: 'Age-weighted infrastructure decay degradation scoring across road, drainage, and power nodes.', tag: 'Heuristic' }
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
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('xgboost');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [timeHorizon, setTimeHorizon] = useState<string>('24h');

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

  // Filtered predictions & reports
  const filteredPredictions = predictions.filter(p => {
    if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) return false;
    return true;
  });

  const filteredReports = reports.filter(r => {
    if (selectedCategoryFilter !== 'all' && r.category !== selectedCategoryFilter) return false;
    return true;
  });

  // Calculate city specific stats
  const cityReportCount = (cityName: string) => reports.filter(r => r.location.ward?.includes(cityName) || r.location.areaName?.includes(cityName) || r.location.district?.toLowerCase().includes(cityName.toLowerCase())).length;
  const cityPredCount = (cityName: string) => predictions.filter(p => p.location.ward?.includes(cityName) || p.location.areaName?.includes(cityName) || p.location.district?.toLowerCase().includes(cityName.toLowerCase())).length;

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 flex flex-col">
      {/* Top Header Control Ribbon */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100">Live Spatial Prediction Engine</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Connected Corridors: Madurai • Karaikudi • Trichy
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Correlating multi-source citizen signals, Doppler weather radar, and elevation topology.
            </p>
          </div>
        </div>

        {/* Algorithm Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center">
            <Cpu className="w-3.5 h-3.5 mr-1 text-purple-400" />
            Model:
          </span>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="bg-slate-800 text-cyan-300 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
          >
            {PREDICTION_ALGORITHMS.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name} ({algo.tag})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative flex-1 w-full h-full">
        {/* Floating Quick Action Panel */}
        <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur border border-slate-700/90 rounded-xl p-3.5 shadow-2xl text-white text-xs max-w-sm space-y-3">
          {/* Regional City Switcher */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1.5 flex items-center">
              <Navigation className="w-3 h-3 mr-1 text-cyan-400" />
              Focus Urban Corridor:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {REGIONAL_CITIES.map(city => {
                const isSelected = activeCity === city.name;
                const reportsInCity = cityReportCount(city.name);
                const predsInCity = cityPredCount(city.name);
                return (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city)}
                    className={`px-2.5 py-1.5 rounded-lg text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/25 border border-cyan-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-cyan-400'}`} />
                      <span className="text-xs">{city.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px]">
                      <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                        {reportsInCity + predsInCity} sig
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Model Description Banner */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-purple-500/30 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-purple-300 font-bold text-[11px]">
              <span className="flex items-center">
                <Activity className="w-3 h-3 mr-1 text-purple-400" />
                Algorithm Telemetry
              </span>
              <span className="text-[10px] bg-purple-900/60 text-purple-200 px-1.5 py-0.5 rounded font-mono">
                {PREDICTION_ALGORITHMS.find(a => a.id === selectedAlgorithm)?.tag}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[10.5px]">
              {PREDICTION_ALGORITHMS.find(a => a.id === selectedAlgorithm)?.desc}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-1 pt-1 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center">
              <Filter className="w-3 h-3 mr-1 text-slate-400" />
              Category Filter:
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All Issues' },
                { id: 'waterlogging', label: 'Waterlogging' },
                { id: 'drainage_blockage', label: 'Drainage' },
                { id: 'sewage_overflow', label: 'Sewage' },
                { id: 'pothole', label: 'Pothole' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[10px] gap-2 pt-1 border-t border-slate-800 text-slate-300">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1 shadow-xs shadow-red-500"></span> Critical (≥80%)</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1 shadow-xs shadow-orange-500"></span> High (60-79%)</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1 shadow-xs shadow-amber-400"></span> Citizen Signal</span>
          </div>
        </div>

        {/* Map Container */}
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
            <LayersControl.Overlay checked name="AI Predicted Risks & Corridors">
              <LayerGroup>
                {filteredPredictions.map(pred => {
                  const color = getRiskColor(pred.riskProbability);
                  return (
                    <React.Fragment key={pred.id}>
                      {/* Outer Risk Radius Circle */}
                      <CircleMarker
                        center={[pred.location.latitude, pred.location.longitude]}
                        radius={36}
                        pathOptions={{
                          color: color,
                          fillColor: color,
                          fillOpacity: 0.22,
                          weight: 2,
                          dashArray: '4, 4'
                        }}
                      />

                      {/* Center Point */}
                      <CircleMarker
                        center={[pred.location.latitude, pred.location.longitude]}
                        radius={13}
                        pathOptions={{
                          color: '#ffffff',
                          fillColor: color,
                          fillOpacity: 0.95,
                          weight: 2
                        }}
                        eventHandlers={{
                          click: () => onSelectPrediction && onSelectPrediction(pred)
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="p-1 max-w-xs text-slate-900 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white bg-slate-900 flex items-center space-x-1">
                                <Cpu className="w-3 h-3 text-cyan-400" />
                                <span>{selectedAlgorithm.toUpperCase()} MODEL</span>
                              </span>
                              <span className="text-xs font-bold text-red-600 flex items-center">
                                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                                {Math.round(pred.riskProbability * 100)}% Risk
                              </span>
                            </div>

                            <div>
                              <h3 className="font-bold text-sm text-slate-900 capitalize leading-tight">
                                {pred.category.replace('_', ' ')}
                              </h3>
                              <p className="text-xs text-slate-600 flex items-center mt-0.5 font-medium">
                                <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                                {pred.location.areaName} ({pred.location.ward})
                              </p>
                            </div>

                            <div className="text-[11px] bg-slate-100 p-2 rounded-lg border border-slate-200 space-y-1">
                              <span className="font-bold text-slate-800 flex items-center">
                                <Clock className="w-3 h-3 mr-1 text-amber-600" />
                                Hazard Window: {pred.expectedTimeWindow}
                              </span>
                              <p className="text-slate-700 leading-snug">
                                <strong>Advisory:</strong> {pred.recommendedAction}
                              </p>
                              {pred.contributingFactors && pred.contributingFactors.length > 0 && (
                                <div className="pt-1 border-t border-slate-200 mt-1">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">Key SHAP Driver:</span>
                                  <p className="text-[10.5px] text-slate-700 font-medium">
                                    • {pred.contributingFactors[0].factor} ({(pred.contributingFactors[0].importanceScore * 100).toFixed(0)}% weight)
                                  </p>
                                </div>
                              )}
                            </div>

                            {onSelectPrediction && (
                              <button
                                onClick={() => onSelectPrediction(pred)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm transition flex items-center justify-center cursor-pointer"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cyan-300" />
                                Review SHAP Factors & Dispatch Squad
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
            <LayersControl.Overlay checked name="Citizen Telemetry Signals">
              <LayerGroup>
                {filteredReports.map(rep => (
                  <Marker
                    key={rep.id}
                    position={[rep.location.latitude, rep.location.longitude]}
                    eventHandlers={{
                      click: () => onSelectReport && onSelectReport(rep)
                    }}
                  >
                    <Popup>
                      <div className="p-1 max-w-xs text-slate-900 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Citizen Signal ({rep.id})
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            {rep.language} • {rep.severity.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 capitalize">
                          {rep.category.replace('_', ' ')}
                        </h4>
                        <p className="text-xs text-slate-700 italic leading-snug bg-slate-50 p-1.5 rounded border border-slate-200">
                          "{rep.description}"
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center font-medium">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          {rep.location.areaName} ({rep.location.ward})
                        </p>
                        {rep.extractedEntities && rep.extractedEntities.length > 0 && (
                          <div className="text-[10px] text-slate-500 flex flex-wrap gap-1">
                            {rep.extractedEntities.map((ent, idx) => (
                              <span key={idx} className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                                {ent}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
};
