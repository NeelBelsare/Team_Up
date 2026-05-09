import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  Car, MapPin, Bell, Activity, AlertTriangle, TrendingUp, Clock, Zap, 
  Crosshair, Cpu, CloudSun, Wind, Droplets, ThermometerSun, Eye, 
  CloudLightning, Navigation, Search, ShieldCheck, Route as RouteIcon, 
  Home, Radar, FilterX, FileText, Ambulance, Stethoscope, Siren, Flame, PawPrint, Truck, CheckCircle2, XCircle
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import IncidentMap from './components/IncidentMap';
import AlertsTicker from './components/AlertsTicker';
import DistributionChart from './components/DistributionChart';
import CCTVFeed from './components/CCTVFeed';
import Workflow from './components/Workflow';

// 🔥 Backend Connection Configuration
const socket = io('http://localhost:5002');

// 🔥 Static IP for Laptop 3 Vision Node
const LAPTOP_3_IP = "172.16.132.22";

const initialAlerts = [
  { id: 1, type: 'Critical', hazard: 'Accident', location: 'NH-52', time: '10:04 AM', img: '🚗' },
  { id: 2, type: 'Warning', hazard: 'Pothole detected', location: 'Main St.', time: '10:02 AM', img: '🕳️' },
  { id: 3, type: 'Info', hazard: 'Stray Animal', location: 'Downtown Junction', time: '10:05 AM', img: '🐄' },
];

const initialLiveUnits = [
  { id: 'u1', name: 'Unit AMB-042 (Critical)', target: 'Jalgaon Road Highway', eta: '4m', icon: <Ambulance/>, color: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500' },
  { id: 'u2', name: 'Police Cruiser P-12', target: 'Kranti Chowk', eta: '2m', icon: <Siren/>, color: 'text-blue-500', border: 'border-blue-500', bg: 'bg-blue-500' },
  { id: 'u3', name: 'Fire Engine F-03', target: 'CIDCO Sector 14', eta: '7m', icon: <Flame/>, color: 'text-orange-500', border: 'border-orange-500', bg: 'bg-orange-500' }
];

const analyticsData = {
  daily: { title: 'Hourly', processed: 1248, time: '1.2s', conf: '96.8%', trends: [{ label: '06:00', value: 20 }, { label: '10:00', value: 85 }, { label: '14:00', value: 50 }, { label: '18:00', value: 95 }, { label: '22:00', value: 30 }] },
  weekly: { title: 'Daily', processed: 8430, time: '1.3s', conf: '95.5%', trends: [{ label: 'Mon', value: 60 }, { label: 'Tue', value: 80 }, { label: 'Wed', value: 45 }, { label: 'Thu', value: 90 }, { label: 'Fri', value: 120 }, { label: 'Sat', value: 110 }, { label: 'Sun', value: 70 }] },
  monthly: { title: 'Weekly', processed: 34150, time: '1.4s', conf: '94.2%', trends: [{ label: 'Week 1', value: 70 }, { label: 'Week 2', value: 85 }, { label: 'Week 3', value: 65 }, { label: 'Week 4', value: 95 }] }
};

// ==========================================
// GOV COMMAND CENTER
// ==========================================
function GovDashboard({ alerts, setAlerts, pendingDispatches, handleDeploy, dismissDispatch, liveUnits }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeframe, setTimeframe] = useState('daily'); 
  const [selectedRegion, setSelectedRegion] = useState(null);

  const simulateAIAlert = () => {
    const aiHazards = [
      { type: 'Critical', hazard: 'Leopard Spotted', location: 'CIDCO Sector N-5', img: '🐆' }, 
      { type: 'Critical', hazard: 'Building Fire', location: 'JNEC Campus', img: '🔥' },
      { type: 'Warning', hazard: 'Stray Dog Pack', location: 'Osmanpura', img: '🐕' }
    ];
    const randomHazard = aiHazards[Math.floor(Math.random() * aiHazards.length)];
    const newAlert = { 
      id: Date.now(), 
      ...randomHazard, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setAlerts([newAlert, ...alerts]);
  };

  const baseStats = analyticsData[timeframe];
  
  const activeStats = selectedRegion ? {
    title: selectedRegion.name, 
    processed: Math.floor(baseStats.processed * 0.15), 
    time: '0.8s', 
    conf: '98.5%',
    trends: baseStats.trends.map(t => ({ label: t.label, value: Math.max(10, Math.floor(t.value * 0.3)) })) 
  } : { ...baseStats, title: 'Citywide' };

  // Generate localized distribution data when a region is selected from IncidentMap
  const localDistribution = selectedRegion ? {
    accidents: Math.floor(Math.abs(Math.sin(selectedRegion.pos.lat) * 40) + 10),
    potholes: Math.floor(Math.abs(Math.cos(selectedRegion.pos.lng) * 30) + 10),
    animals: Math.floor(Math.abs(Math.tan(selectedRegion.pos.lat) * 15) + 5),
    others: 0 
  } : null;

  if (localDistribution) {
    localDistribution.others = 100 - (localDistribution.accidents + localDistribution.potholes + localDistribution.animals);
  }

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={pendingDispatches.length} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
          <h2 className="text-xl font-semibold text-slate-100 uppercase tracking-widest">
            {activeTab === 'dashboard' ? 'Command Center' : 
             activeTab === 'analytics' ? 'Data Analytics Core' : 
             activeTab === 'cctv' ? 'City-Wide Camera Grid' : 
             activeTab === 'weather' ? 'Meteorological Core' : 
             activeTab === 'emergency' ? 'Unified Emergency Network' : 'Municipal Broadcasts'}
          </h2>
          <div className="flex items-center gap-4">
            <div 
              className="hidden md:flex items-center gap-3 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 text-xs shadow-inner cursor-pointer hover:bg-slate-700 transition" 
              onClick={() => setActiveTab('weather')}
            >
              <div className="flex items-center gap-1.5 pr-3 border-r border-slate-700">
                <CloudSun size={16} className="text-amber-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-100 leading-tight">36°C</span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Sambhajinagar</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono">
                <Wind size={12} className="text-blue-400" /> 14 km/h
              </div>
            </div>
            
            <button 
              onClick={simulateAIAlert} 
              className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]"
            >
              <Cpu size={14} className="animate-pulse" /> INJECT AI ALERT
            </button>
            <span className="text-emerald-400 text-sm font-mono animate-pulse ml-2">● LIVE</span>
          </div>
        </header>

        <div className="flex-1 p-4 overflow-hidden flex flex-col relative">
          
          {activeTab === 'dashboard' && (
            <div className="flex-1 flex gap-4 overflow-hidden">
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <IncidentMap setSelectedRegion={setSelectedRegion} />
                <div className="h-44 shrink-0">
                  <Workflow />
                </div>
              </div>
              
              <div className="w-[320px] flex flex-col gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide">
                <div className={`p-4 rounded-xl border flex flex-col gap-2 shadow-md transition-all duration-300 ${selectedRegion ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700'}`}>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Source Filter</span>
                     {selectedRegion && (
                       <button onClick={() => setSelectedRegion(null)} className="text-[9px] text-red-400 hover:text-red-300 uppercase flex items-center gap-1">
                         <FilterX size={10}/> Clear
                       </button>
                     )}
                   </div>
                   
                   <div className={`text-sm font-bold p-2 rounded border flex items-center justify-center text-center ${selectedRegion ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                     {selectedRegion ? <><MapPin size={14} className="mr-1"/> {selectedRegion.name}</> : 'GLOBAL CITY VIEW'}
                   </div>
                   
                   {selectedRegion && (
                     <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-slate-900/80 rounded border border-slate-700 p-2 text-center">
                          <span className="block text-[9px] text-slate-500 uppercase mb-0.5">Local Traffic</span>
                          <span className="block text-[11px] font-bold leading-tight" style={{ color: selectedRegion.color }}>
                            {selectedRegion.status}
                          </span>
                        </div>
                        <div className="bg-slate-900/80 rounded border border-slate-700 p-2 text-center">
                          <span className="block text-[9px] text-slate-500 uppercase mb-0.5">Avg Speed</span>
                          <span className="block text-sm font-bold text-white leading-tight">
                            {selectedRegion.speed}<span className="text-[9px] text-slate-400 ml-1">km/h</span>
                          </span>
                        </div>
                     </div>
                   )}
                </div>

                <AlertsTicker alerts={alerts} />
                <DistributionChart data={localDistribution} />
                <CCTVFeed />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
              <div className="flex justify-between items-end mb-2">
                <div className="flex gap-2 bg-slate-900 p-1 w-fit rounded-lg border border-slate-800 shadow-inner">
                  {['daily', 'weekly', 'monthly'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setTimeframe(t)} 
                      className={`px-6 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${timeframe === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                
                {selectedRegion && (
                  <div className="bg-blue-900/30 border border-blue-500/50 text-blue-300 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 animate-pulse">
                    <MapPin size={14}/> FILTERED TO: {selectedRegion.name.toUpperCase()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg"><Activity className="text-blue-500" size={24}/></div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Hazards Processed</p>
                    <h3 className="text-2xl font-bold text-white transition-all">{activeStats.processed.toLocaleString()}</h3>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex items-center gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-lg"><Clock className="text-amber-500" size={24}/></div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Response Time</p>
                    <h3 className="text-2xl font-bold text-white">{activeStats.time}</h3>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg"><Zap className="text-purple-500" size={24}/></div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Model Confidence</p>
                    <h3 className="text-2xl font-bold text-white">{activeStats.conf}</h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl flex flex-col">
                  <h3 className="text-slate-100 font-bold uppercase tracking-wider text-sm flex justify-between items-center mb-6">
                    <span className="flex items-center gap-2"><TrendingUp size={16} className="text-blue-400" /> {activeStats.title} Incident Frequency</span>
                  </h3>
                  <div className="flex-1 flex items-end justify-between gap-2 h-48 border-b border-slate-700 pb-2 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-t border-slate-500 w-full"></div>
                      <div className="border-t border-slate-500 w-full"></div>
                      <div className="border-t border-slate-500 w-full"></div>
                    </div>
                    {activeStats.trends.map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1 group z-10 h-full justify-end">
                        <div 
                          className="w-full max-w-[40px] bg-blue-500 hover:bg-blue-400 rounded-t-md transition-all duration-500 relative overflow-hidden" 
                          style={{ height: `${d.value}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-1">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 h-full">
                  <DistributionChart data={localDistribution} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl flex flex-col">
                  <h3 className="text-slate-100 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" /> Repeated Incident Database
                  </h3>
                  <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[220px]">
                    {[
                      { hazard: 'Severe Vehicle Collision', loc: 'Jalgaon Road Highway', count: 18, status: 'Critical Hotspot', icon: '🚗', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                      { hazard: 'Stray Cattle / Dogs', loc: 'Kranti Chowk Junction', count: 14, status: 'High Risk', icon: '🐄', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
                      { hazard: 'Massive Pothole Cluster', loc: 'JNEC Campus Road', count: 9, status: 'Moderate Risk', icon: '🕳️', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' }
                    ].map((item, idx) => (
                        <div key={idx} className={`flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border ${item.border}`}>
                          <div className="flex items-center gap-3">
                            <div className={`text-xl w-10 h-10 flex items-center justify-center rounded-lg ${item.bg} border border-slate-700`}>{item.icon}</div>
                            <div>
                              <h4 className="font-bold text-slate-200 text-sm">{item.hazard}</h4>
                              <p className="text-xs text-slate-500">{item.loc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-bold uppercase tracking-wider ${item.color} flex items-center gap-1 justify-end`}>
                              {item.status === 'Critical Hotspot' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                              {item.status}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5"><span className="text-white font-bold">{item.count}</span> occurrences</div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1 bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl flex flex-col">
                  <h3 className="text-slate-100 font-bold uppercase tracking-wider text-sm mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Radar size={16} className="text-red-500" /> AI Hotspot Map</span>
                    <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">AUTO-FLAGGING</span>
                  </h3>
                  <div className="flex-1 bg-slate-950 rounded-lg border border-slate-700 relative overflow-hidden min-h-[220px]">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0,50 Q 150,150 300,50 T 600,100" fill="none" stroke="#64748b" strokeWidth="2" />
                        <path d="M 100,0 L 150,250" fill="none" stroke="#64748b" strokeWidth="2" />
                      </svg>

                      <div className="absolute top-1/4 left-1/3 group cursor-crosshair">
                        <div className="absolute -inset-6 bg-red-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                        <div className="absolute -inset-3 bg-red-500/40 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444] relative z-10 border border-white/50"></div>
                        <div className="absolute top-4 left-4 bg-slate-900 border border-red-500/50 text-white text-[10px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-20 transition-opacity">
                          CRITICAL: Jalgaon Rd (18 Alerts)
                        </div>
                      </div>

                      <div className="absolute bottom-1/3 right-1/4 group cursor-crosshair">
                        <div className="absolute -inset-3 bg-amber-500/30 rounded-full animate-pulse"></div>
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b] relative z-10 border border-white/50"></div>
                        <div className="absolute top-4 left-4 bg-slate-900 border border-amber-500/50 text-white text-[10px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-20 transition-opacity">
                          WARNING: Kranti Chowk (14 Alerts)
                        </div>
                      </div>

                      <div className="absolute top-2/3 left-1/4 group cursor-crosshair">
                        <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] relative z-10"></div>
                        <div className="absolute top-3 left-3 bg-slate-900 border border-blue-500/50 text-white text-[10px] whitespace-nowrap px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-20 transition-opacity">
                          INFO: JNEC Road (9 Alerts)
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cctv' && (
            <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-y-auto shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-red-500 animate-pulse">●</span> Live City Matrix
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: '07', name: 'AI VISION NODE', isStream: true, url: `http://${LAPTOP_3_IP}:5002/video_feed` },
                  { id: '01', name: 'Jalgaon Hwy', ytId: 'aJjE2rZ_u3Y' }, 
                  { id: '02', name: 'Kranti Chowk', ytId: 'KBsqQez-O4w' }, 
                  { id: '03', name: 'Downtown', ytId: 'wqctLW0Hb_0' }, 
                  { id: '04', name: 'Sector 4', ytId: 'aJjE2rZ_u3Y' }, 
                  { id: '05', name: 'Market', ytId: 'KBsqQez-O4w' }
                ].map((cam) => (
                  <div key={cam.id} className="bg-black rounded-xl border border-slate-700 aspect-video relative overflow-hidden group">
                    {cam.isStream ? (
                       <img src={cam.url} className="w-full h-full object-cover" alt="AI Stream" />
                    ) : (
                       <iframe className="w-full h-full scale-[1.15] pointer-events-none" src={`https://www.youtube.com/embed/${cam.ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${cam.ytId}&modestbranding=1`} allowFullScreen></iframe>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded border border-slate-700 font-mono z-10">
                      CAM-{cam.id} • {cam.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-8">
              <div className="bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 rounded-xl border border-blue-500/30 p-8 shadow-2xl flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-2 flex items-center gap-2"><MapPin size={14}/> Chhatrapati Sambhajinagar</h2>
                  <div className="flex items-center gap-6">
                    <CloudSun size={72} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                    <div>
                      <h1 className="text-6xl font-black text-white tracking-tighter">36°C</h1>
                      <p className="text-xl text-blue-200 font-medium mt-1">Clear Skies, Intense Heat</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 relative overflow-hidden">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Road Temp</span>
                  <span className="text-3xl font-bold text-amber-500">44°C</span>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 relative overflow-hidden">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Visibility</span>
                  <span className="text-3xl font-bold text-emerald-400">10 km</span>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 relative overflow-hidden">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Wind Gusts</span>
                  <span className="text-3xl font-bold text-blue-400">14 km/h</span>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 relative overflow-hidden">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Precipitation</span>
                  <span className="text-3xl font-bold text-slate-100">0 mm</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
             <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-8 relative">
               {pendingDispatches.length > 0 && (
                 <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-10 rounded-xl overflow-y-auto pb-10">
                   <div className="bg-slate-900 border-2 border-red-500 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.4)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                      <div className="bg-red-500 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold flex items-center gap-2 animate-pulse">
                          <AlertTriangle /> INCOMING CRITICAL REPORT
                        </h3>
                        <span className="text-xs font-mono bg-red-700 px-2 py-1 rounded">
                          {pendingDispatches.length} Pending
                        </span>
                      </div>
                      
                      <div className="p-6 flex flex-col gap-6">
                        {pendingDispatches.map(dispatch => (
                          <div key={dispatch.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col gap-4 relative overflow-hidden shadow-lg">
                            <div className={`absolute top-0 left-0 w-2 h-full ${dispatch.service.bg.split('/')[0]}`}></div>
                            
                            <div className="flex justify-between items-start pl-2">
                              <div>
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Threat Detected</p>
                                <h4 className="text-white text-2xl font-bold">{dispatch.alert.hazard}</h4>
                                <p className="text-slate-400 flex items-center gap-1 mt-1 font-mono text-sm">
                                  <MapPin size={14}/> {dispatch.alert.location}
                                </p>
                              </div>
                              <div className={`p-4 rounded-xl border border-slate-600 ${dispatch.service.bg} ${dispatch.service.text}`}>
                                {dispatch.service.icon}
                              </div>
                            </div>

                            <div className="bg-slate-950 rounded-lg p-5 border border-slate-800 mt-2">
                              <p className="text-slate-300 text-sm mb-4 flex items-center gap-2">
                                <Zap size={16} className="text-blue-400"/>
                                AI Action Required: <strong className="text-white">Deploy {dispatch.service.team} in {dispatch.alert.location} immediately.</strong>
                              </p>
                              
                              <div className="flex gap-3">
                                <button 
                                  onClick={() => handleDeploy(dispatch.id, dispatch.service, dispatch.alert.location)}
                                  className={`flex-1 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${dispatch.service.bg} ${dispatch.service.text} border ${dispatch.service.border.replace('bg-', 'border-')} hover:text-white hover:opacity-90`}
                                >
                                  DEPLOY {dispatch.service.team.toUpperCase()}
                                </button>
                                
                                <button 
                                  onClick={() => dismissDispatch(dispatch.id)} 
                                  className="px-6 py-4 rounded-lg font-bold uppercase tracking-wider text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2 text-sm"
                                >
                                  <XCircle size={18}/> Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-4 gap-4">
                 <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 hover:border-emerald-500/50 transition-colors">
                   <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Ambulance size={12}/> Medical Services</span>
                   <span className="text-3xl font-bold text-emerald-400">14 / 45</span>
                   <span className="text-[10px] text-slate-500">Active Ambulances</span>
                 </div>
                 <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 hover:border-blue-500/50 transition-colors">
                   <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Siren size={12}/> Police Force</span>
                   <span className="text-3xl font-bold text-blue-400">32</span>
                   <span className="text-[10px] text-slate-500">Patrol Units Active</span>
                 </div>
                 <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 hover:border-orange-500/50 transition-colors">
                   <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Flame size={12}/> Fire Brigade</span>
                   <span className="text-3xl font-bold text-orange-500">8 / 12</span>
                   <span className="text-[10px] text-slate-500">Engines on Standby</span>
                 </div>
                 <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col gap-2 hover:border-amber-500/50 transition-colors">
                   <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><PawPrint size={12}/> Wildlife Rescue</span>
                   <span className="text-3xl font-bold text-amber-500">3</span>
                   <span className="text-[10px] text-slate-500">Rescue Vans on Call</span>
                 </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl flex flex-col">
                     <h3 className="text-slate-100 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                       <ShieldCheck size={18} className="text-blue-400"/> Regional Infrastructure Status
                     </h3>
                     <div className="flex flex-col gap-3">
                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between items-center hover:border-emerald-500/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20"><Stethoscope className="text-emerald-500" size={20}/></div>
                            <div>
                              <h4 className="font-bold text-white text-sm">GMCH (Govt Medical College)</h4>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10}/> Ghati Road</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-1 rounded">45 Beds Avail</div>
                            <div className="text-red-400 text-xs font-bold mt-1">2 ICU Avail</div>
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between items-center hover:border-blue-500/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20"><Siren className="text-blue-500" size={20}/></div>
                            <div>
                              <h4 className="font-bold text-white text-sm">Kranti Chowk Police HQ</h4>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10}/> Kranti Chowk</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-blue-400 font-bold text-sm bg-blue-500/10 px-2 py-1 rounded">Fully Manned</div>
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between items-center hover:border-orange-500/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded border border-orange-500/20"><Flame className="text-orange-500" size={20}/></div>
                            <div>
                              <h4 className="font-bold text-white text-sm">CIDCO Fire Station</h4>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10}/> CIDCO N-5</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-orange-400 font-bold text-sm bg-orange-500/10 px-2 py-1 rounded">Ready Status</div>
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between items-center hover:border-amber-500/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20"><PawPrint className="text-amber-500" size={20}/></div>
                            <div>
                              <h4 className="font-bold text-white text-sm">Siddharth Garden Animal Rescue</h4>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10}/> Central Bus Stand Rd</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-amber-400 font-bold text-sm bg-amber-500/10 px-2 py-1 rounded">2 Teams Avail</div>
                          </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl flex flex-col">
                     <h3 className="text-slate-100 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                       <Radar size={18} className="text-red-500"/> Live Units En Route
                     </h3>
                     <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[350px]">
                        {liveUnits.map((unit) => (
                          <div key={unit.id} className={`bg-slate-900 border ${unit.bg.replace('bg-', 'border-').replace('/20', '/30')} p-4 rounded-lg flex items-center gap-4 relative overflow-hidden animate-in slide-in-from-right-4`}>
                             <div className={`absolute left-0 top-0 bottom-0 w-1 ${unit.bg.split('/')[0]}`}></div>
                             <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                               <span className={`${unit.color} animate-pulse`}>{unit.icon}</span>
                             </div>
                             <div className="flex-1">
                               <h4 className="font-bold text-white text-sm">{unit.name}</h4>
                               <p className="text-xs text-slate-400">Heading to: {unit.target}</p>
                             </div>
                             <div className="text-right">
                               <span className="text-xl font-mono font-bold text-white">{unit.eta}</span>
                               <span className="block text-[10px] text-slate-400 uppercase tracking-wider">ETA</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'notices' && (
             <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-y-auto shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText size={20} className="text-blue-400"/> Municipal Broadcasts & Dispatches
                </h2>
                <div className="flex flex-col gap-3">
                {alerts.map(a => (
                  <div key={a.id} className="p-4 bg-slate-900 border border-slate-700 rounded-lg flex justify-between items-center group hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700 group-hover:scale-110 transition-transform">{a.img}</span>
                      <div>
                        <h4 className="text-slate-200 font-bold">{a.hazard}</h4>
                        <p className="text-slate-500 text-sm flex items-center gap-1">
                          <MapPin size={12}/> {a.location} <span className="mx-1">•</span> <Clock size={12}/> {a.time}
                        </p>
                      </div>
                    </div>
                    <button className="bg-blue-600/20 text-blue-400 border border-blue-500 hover:bg-blue-600 hover:text-white px-4 py-2 rounded text-sm transition-colors font-bold tracking-wide uppercase">
                      Update Status
                    </button>
                  </div>
                ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PUBLIC PORTAL (Citizen App)
// ==========================================
function PublicPortal({ alerts, setAlerts }) {
  const [activeTab, setActiveTab] = useState('home'); 
  const [isReporting, setIsReporting] = useState(false);
  
  const [destination, setDestination] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [routeReport, setRouteReport] = useState(null);

  const [reportType, setReportType] = useState('🚗 Severe Accident');
  const [reportLocation, setReportLocation] = useState('');

  const handleScanRoute = (e) => {
    e.preventDefault();
    if(!destination) return;
    
    setIsScanning(true);
    setRouteReport(null);
    
    setTimeout(() => {
      const hazardOnRoute = alerts[Math.floor(Math.random() * alerts.length)];
      setRouteReport(hazardOnRoute);
      setIsScanning(false);
    }, 1500);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    
    const icon = reportType.split(' ')[0];
    const hazardText = reportType.substring(reportType.indexOf(' ') + 1);
    const severity = hazardText.includes('Accident') ? 'Critical' : 'Warning';

    const newAlert = { 
      id: Date.now(), 
      type: severity, 
      hazard: hazardText, 
      location: reportLocation || 'Chhatrapati Sambhajinagar', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      img: icon 
    };
    
    setAlerts([newAlert, ...alerts]); 
    setIsReporting(false); 
    setReportLocation(''); 
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 min-h-[850px] shadow-2xl rounded-[2.5rem] border-[8px] border-slate-900 overflow-hidden relative my-8 flex flex-col">
      <header className="bg-blue-600 text-white p-8 pb-12 rounded-b-[2rem] shadow-md relative overflow-hidden shrink-0">
        <h1 className="text-3xl font-bold flex items-center gap-2 relative z-10"><Car className="text-blue-200" size={32} />DriveSafe</h1>
        <p className="text-blue-100 text-sm mt-2 relative z-10">Your city, verified by AI.</p>
        
        {activeTab === 'home' ? (
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-3 border border-white/30 relative z-10 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <span className="text-sm font-bold flex items-center gap-2">
                <CloudSun size={18} className="text-amber-300"/> 36°C, Clear
              </span>
              <span className="text-xs font-medium bg-blue-700/50 px-2 py-1 rounded">Sambhajinagar</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status: Scanning City</span>
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-blue-100 flex items-center gap-2 relative z-10">
            <Navigation size={18} /> Safe Route Planner
          </div>
        )}
      </header>

      <div className="p-6 -mt-6 relative z-20 flex-1 overflow-y-auto pb-24">
        {activeTab === 'home' && (
          <>
            <h2 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" /> Live Hazards Near You
            </h2>
            <div className="flex flex-col gap-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 animate-in fade-in">
                  <div className="text-4xl bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner shrink-0">
                    {alert.img}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{alert.hazard}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1 truncate">
                      <MapPin size={12} className="shrink-0" /> {alert.location}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider shrink-0">
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'route' && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">
            <form onSubmit={handleScanRoute} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
                <input type="text" value="Current Location" readOnly className="flex-1 bg-slate-50 border border-slate-100 p-3 rounded-xl text-slate-500 font-medium outline-none text-sm" />
              </div>
              <div className="w-0.5 h-4 bg-slate-200 ml-1.5 -my-2"></div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-red-500 shrink-0 ml-[-1px]" />
                <input type="text" placeholder="Where to?" value={destination} onChange={(e) => setDestination(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 p-3 rounded-xl text-slate-800 font-bold outline-none text-sm transition-colors" required />
              </div>
              <button type="submit" disabled={isScanning} className="mt-2 w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2">
                {isScanning ? <span className="animate-pulse">Analyzing CCTVs...</span> : <><Search size={18} /> Scan Route for Hazards</>}
              </button>
            </form>

            {routeReport && (
              <div className="bg-white p-5 rounded-2xl shadow-lg border-2 border-amber-200 flex flex-col gap-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="text-emerald-500" /> AI Route Report</h3>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded uppercase tracking-wider">Caution</span>
                </div>
                <p className="text-sm text-slate-600">We cross-referenced your route to <strong className="text-slate-800">{destination}</strong> with live CCTV data. 1 hazard found:</p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="text-2xl bg-white w-10 h-10 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">{routeReport.img}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{routeReport.hazard}</h4>
                    <p className="text-slate-500 text-xs">At {routeReport.location}</p>
                  </div>
                </div>
                <button className="w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors flex justify-center items-center gap-2 mt-2">
                  <Navigation size={18} /> Start Navigation Anyway
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === 'home' && (
        <button onClick={() => setIsReporting(true)} className="absolute bottom-24 right-6 bg-red-500 text-white p-4 rounded-full shadow-[0_8px_20px_rgba(239,68,68,0.4)] hover:scale-110 transition-transform z-30 flex items-center justify-center">
          <Bell size={24} />
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-4 pb-8 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Home size={24} className={activeTab === 'home' ? 'fill-blue-100' : ''} />
          <span className="text-[10px] font-bold">Live Map</span>
        </button>
        <button onClick={() => setActiveTab('route')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'route' ? 'text-blue-600' : 'text-slate-400'}`}>
          <RouteIcon size={24} className={activeTab === 'route' ? 'fill-blue-100' : ''} />
          <span className="text-[10px] font-bold">Safe Route</span>
        </button>
      </div>

      {isReporting && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsReporting(false)}></div>
          <div className="bg-white rounded-t-[2rem] p-6 relative z-10 shadow-2xl h-[70%] flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Report</h2>
            <form className="flex-1 flex flex-col gap-4" onSubmit={handleReportSubmit}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider -mb-2">Select Hazard</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-medium outline-none focus:border-blue-500 transition-colors">
                <option>🚗 Severe Accident</option>
                <option>🕳️ Massive Pothole</option>
                <option>🐆 Leopard Spotted</option>
                <option>🐄 Stray Animal</option>
                <option>🌊 Flooded Road</option>
                <option>🔥 Building Fire</option>
              </select>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider -mb-2 mt-2">Exact Location</label>
              <input type="text" value={reportLocation} onChange={(e) => setReportLocation(e.target.value)} placeholder="e.g. JNEC Campus Road" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-medium outline-none focus:border-blue-500 transition-colors" />
              <button type="submit" className="mt-auto w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-colors">
                Submit Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN ROUTER
// ==========================================
export default function App() {
  const [alerts, setAlerts] = useState(initialAlerts);

  // Global State (Persistent across tabs)
  const [autoDispatch, setAutoDispatch] = useState(null);
  const [pendingDispatches, setPendingDispatches] = useState([]);
  const [liveUnits, setLiveUnits] = useState(initialLiveUnits);
  
  const prevAlertsLength = useRef(alerts.length);

  // 🔥 Listen for external AI triggers from Laptop 3 Vision Node
  useEffect(() => {
    socket.on('ai_hazard_detected', (aiData) => {
      const newAlert = {
        id: Date.now(),
        type: aiData.type || 'Critical',
        hazard: aiData.hazard,
        location: aiData.location,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        img: aiData.img || '⚠️'
      };
      setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    });

    return () => {
      socket.off('ai_hazard_detected');
    };
  }, []);

  // AI Pipeline: Queue up dispatches when new hazards are added
  useEffect(() => {
    if (alerts.length > prevAlertsLength.current) {
      const newestAlert = alerts[0]; 
      
      let emergencyService = { 
        name: 'Municipal Maint.', team: 'Maintenance Crew', 
        icon: <Truck size={24}/>, iconSmall: <Truck size={16}/>, 
        border: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-500/20' 
      };
      
      const hazardStr = newestAlert.hazard.toLowerCase();
      if (hazardStr.includes('accident') || hazardStr.includes('collision') || hazardStr.includes('crash')) {
        emergencyService = { name: 'Medical & Police', team: 'Ambulance', icon: <Ambulance size={24}/>, iconSmall: <Ambulance size={16}/>, border: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/20' };
      } else if (hazardStr.includes('animal') || hazardStr.includes('leopard') || hazardStr.includes('dog') || hazardStr.includes('cattle') || hazardStr.includes('elephant')) {
        emergencyService = { name: 'Wildlife Rescue', team: 'Animal Rescue Team', icon: <PawPrint size={24}/>, iconSmall: <PawPrint size={16}/>, border: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/20' };
      } else if (hazardStr.includes('fire') || hazardStr.includes('smoke')) {
        emergencyService = { name: 'Fire Department', team: 'Fire Brigade', icon: <Flame size={24}/>, iconSmall: <Flame size={16}/>, border: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/20' };
      }

      setAutoDispatch({ alert: newestAlert, service: emergencyService });
      const timer = setTimeout(() => setAutoDispatch(null), 6000);
      
      setPendingDispatches(prev => [{ id: newestAlert.id, alert: newestAlert, service: emergencyService }, ...prev]);

      prevAlertsLength.current = alerts.length;
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  const handleDeploy = (dispatchId, service, location) => {
    setPendingDispatches(pendingDispatches.filter(d => d.id !== dispatchId));
    
    // Broadcast trigger to Laptop 2
    try {
      let targetService = "Municipal";
      if (service.name.includes('Wildlife')) targetService = "Forest";
      if (service.name.includes('Medical') || service.name.includes('Police') || service.name.includes('Fire')) targetService = "112";

      socket.emit('new_alert', {
         service_name: targetService,
         hazard_type: pendingDispatches.find(d => d.id === dispatchId)?.alert.hazard || 'Emergency Incident',
         location: location,
         eta: '4 mins'
      });
    } catch(e) {
      console.log('Socket broadcast failed', e);
    }
    
    const newUnit = {
      id: Date.now(),
      name: `${service.team} (Unit-${Math.floor(Math.random() * 99)})`,
      target: location,
      eta: '1m', 
      icon: service.iconSmall,
      color: service.text,
      border: `border-${service.border.split('-')[1]}-500`,
      bg: service.border
    };
    setLiveUnits([newUnit, ...liveUnits]);
  };

  const dismissDispatch = (dispatchId) => {
    setPendingDispatches(pendingDispatches.filter(d => d.id !== dispatchId));
  };

  return (
    <BrowserRouter>
      {/* Global Command Toast Overlay */}
      {autoDispatch && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[500px] animate-in slide-in-from-top-10 fade-in duration-500 pointer-events-none">
          <div className="bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-700 overflow-hidden relative">
            <div className={`h-1.5 w-full ${autoDispatch.service.border} animate-pulse`}></div>
            <div className="p-5 flex gap-5">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border border-slate-700 shadow-inner ${autoDispatch.service.bg} ${autoDispatch.service.text}`}>
                {autoDispatch.service.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                    <Zap size={12}/> AI Threat Detected
                  </h4>
                  <span className="text-[9px] text-slate-500 font-mono">{autoDispatch.alert.time}</span>
                </div>
                <h2 className="text-white font-bold text-lg mt-1 leading-tight">{autoDispatch.alert.hazard}</h2>
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                  <MapPin size={12}/> {autoDispatch.alert.location}
                </p>
                <div className="mt-4 bg-slate-950 rounded-lg p-3 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Awaiting Operator Dispatch</p>
                  <p className={`text-sm font-bold flex items-center gap-1 ${autoDispatch.service.text}`}>
                    Action required in Emergency Tab <Navigation size={14}/>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Navigation Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md rounded-full px-2 py-2 z-[100] flex gap-2 border border-slate-700 shadow-2xl pointer-events-auto">
          <Link to="/" className="px-6 py-2 rounded-full text-xs font-bold bg-slate-900 text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition">GOV COMMAND CENTER</Link>
          <Link to="/public" className="px-6 py-2 rounded-full text-xs font-bold bg-slate-900 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700 transition">CITIZEN APP VIEW</Link>
      </div>

      <Routes>
        <Route path="/" element={
          <GovDashboard 
            alerts={alerts} 
            setAlerts={setAlerts}
            pendingDispatches={pendingDispatches}
            liveUnits={liveUnits}
            handleDeploy={handleDeploy}
            dismissDispatch={dismissDispatch}
          />
        } />
        <Route path="/public" element={
          <div className="min-h-screen bg-slate-200 flex items-center justify-center pt-16">
            <PublicPortal alerts={alerts} setAlerts={setAlerts} />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}