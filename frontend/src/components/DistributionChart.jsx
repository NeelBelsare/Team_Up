import React from 'react';

export default function DistributionChart({ data }) {
  // Use provided data or default to citywide percentages
  const stats = data || {
    accidents: 40,
    potholes: 30,
    animals: 20,
    others: 10
  };

  // Calculate cumulative percentages for the conic-gradient
  const p1 = stats.accidents;
  const p2 = p1 + stats.potholes;
  const p3 = p2 + stats.animals;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 h-full flex flex-col justify-center">
      <h2 className="font-bold text-slate-100 uppercase tracking-wider text-[10px] mb-4">
        Local Incident Distribution
      </h2>
      <div className="flex items-center gap-4">
        
        {/* Dynamic CSS Donut Chart */}
        <div 
          role="figure"
          aria-label="Incident distribution chart"
          className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
          style={{
            background: `conic-gradient(
              #ef4444 0% ${p1}%, 
              #eab308 ${p1}% ${p2}%, 
              #3b82f6 ${p2}% ${p3}%, 
              #22c55e ${p3}% 100%
            )`
          }}
        >
           <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center" aria-hidden="true">
              <span className="text-[10px] font-bold text-slate-500">LIVE</span>
           </div>
        </div>
        
        <div className="flex flex-col gap-1 text-[10px] text-slate-300">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div> Acc: {stats.accidents}%
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div> Pot: {stats.potholes}%
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Ani: {stats.animals}%
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Oth: {stats.others}%
          </span>
        </div>
      </div>
    </div>
  );
}