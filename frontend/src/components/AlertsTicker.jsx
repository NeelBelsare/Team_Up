export default function AlertsTicker({ alerts }) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <h2 className="font-bold text-slate-100 uppercase tracking-wider text-sm mb-3">Live Alerts Ticker</h2>
      <div className="flex flex-col gap-3">
        {alerts.map(alert => (
          <div key={alert.id} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2 last:border-0">
            <span className="text-slate-400 font-mono text-xs">{alert.time}</span>
            <span className="text-slate-200 flex-1 ml-4 truncate">{alert.hazard} at {alert.location}</span>
          </div>
        ))}
      </div>
    </div>
  );
}