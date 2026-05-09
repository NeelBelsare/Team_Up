import { Shield, LayoutDashboard, BarChart2, Video, FileText, Settings, CloudSun, Ambulance } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, pendingCount = 0 }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'cctv', icon: Video, label: 'Live CCTV Grid' },
    { id: 'weather', icon: CloudSun, label: 'Weather Core' },
    { id: 'emergency', icon: Ambulance, label: 'Emergency Response' },
    { id: 'notices', icon: FileText, label: 'Municipal Notices' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300 transition-all shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <Shield className="text-blue-500" size={28} />
        <div>
          <h1 className="font-bold text-slate-100 leading-tight">URBAN SAFETY<br/>INITIATIVE</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner' 
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-500'} /> 
              <span className="flex-1 text-left">{item.label}</span>
              
              {/* 🔥 NEW: Glowing Red Notification Dot for Emergency Tab */}
              {item.id === 'emergency' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-auto border-t border-slate-800 pt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400">
            <Settings size={18} /> Settings
          </button>
        </div>
      </nav>
    </div>
  );
}