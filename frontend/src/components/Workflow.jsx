import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

export default function Workflow() {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col shadow-xl h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-slate-100 uppercase tracking-wider text-sm flex items-center gap-2">
          <ListTodo size={16} className="text-purple-400" />
          Municipal Response Pipeline
        </h2>
        <span className="text-[10px] text-slate-400 font-mono border border-slate-700 px-2 py-0.5 rounded bg-slate-900">
          LIVE TICKETING
        </span>
      </div>

      {/* Kanban Board Layout (3 Columns) */}
      <div className="grid grid-cols-3 gap-4 flex-1">
        
        {/* Column 1: Pending */}
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 flex flex-col gap-2 shadow-inner">
          <h3 className="text-[10px] text-amber-500 uppercase tracking-widest font-bold flex justify-between items-center border-b border-slate-800 pb-2">
            Pending Dispatch <span className="bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-400">4</span>
          </h3>
          <div className="flex items-center justify-between text-xs p-2.5 bg-slate-800 rounded border border-slate-700 hover:border-amber-500/50 transition-colors">
            <span className="text-slate-300 truncate flex items-center gap-1.5">
              <AlertCircle size={14} className="text-amber-500 flex-shrink-0" /> Clear debris NH-52
            </span>
            <button className="text-[9px] font-bold bg-blue-600 px-3 py-1.5 rounded text-white hover:bg-blue-500 transition-colors uppercase tracking-wide shadow-lg">
              Dispatch
            </button>
          </div>
          <div className="flex items-center justify-between text-xs p-2.5 bg-slate-800 rounded border border-slate-700 opacity-50">
            <span className="text-slate-300 truncate flex items-center gap-1.5">
               <AlertCircle size={14} className="text-amber-500 flex-shrink-0" /> Stray dog on I-90
            </span>
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 flex flex-col gap-2 shadow-inner">
          <h3 className="text-[10px] text-blue-500 uppercase tracking-widest font-bold flex justify-between items-center border-b border-slate-800 pb-2">
            Active / En Route <span className="bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-400">2</span>
          </h3>
          <div className="flex items-center justify-between text-xs p-2.5 bg-slate-800 rounded border border-blue-500/30 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-blue-500/10 pointer-events-none"></div>
            <span className="text-slate-300 truncate flex items-center gap-1.5 relative z-10">
              <Clock size={14} className="text-blue-500 flex-shrink-0" /> Pothole repair Main St.
            </span>
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider relative z-10 animate-pulse">
              ETA: 12m
            </span>
          </div>
        </div>

        {/* Column 3: Resolved */}
        <div className="bg-slate-900 rounded-lg border border-slate-700 p-3 flex flex-col gap-2 shadow-inner overflow-hidden">
          <h3 className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold flex justify-between items-center border-b border-slate-800 pb-2">
            Resolved (Today) <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400">18</span>
          </h3>
          <div className="flex items-center justify-between text-xs p-2.5 bg-slate-800/50 rounded border border-slate-700 opacity-60">
            <span className="text-slate-400 truncate line-through flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> Animal control Downtown
            </span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase">Done</span>
          </div>
          <div className="flex items-center justify-between text-xs p-2.5 bg-slate-800/50 rounded border border-slate-700 opacity-60">
            <span className="text-slate-400 truncate line-through flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> Accident cleared Exit 4
            </span>
            <span className="text-[9px] font-bold text-emerald-600 uppercase">Done</span>
          </div>
        </div>

      </div>
    </div>
  );
}