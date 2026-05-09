import { Video } from 'lucide-react';

export default function CCTVFeed() {
  // 🔥 Static IP for Laptop 3
  const LAPTOP_3_IP = "172.16.132.22"; 

  const feeds = [
    { id: 'CAM-07', name: 'LIVE AI VISION', isStream: true, url: `http://${LAPTOP_3_IP}:5002/video_feed` },
    { id: 'CAM-01', name: 'Jalgaon Road Hwy', ytId: 'aJjE2rZ_u3Y' },
    { id: 'CAM-02', name: 'Kranti Chowk', ytId: 'KBsqQez-O4w' }
  ];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-100 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
          <Video size={16} className="text-blue-400" />
          Live CCTV Feed
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {feeds.map((feed) => (
          <div key={feed.id} className="relative rounded-lg overflow-hidden border border-slate-600 group bg-black aspect-video">
            
            {feed.isStream ? (
              <img src={feed.url} className="w-full h-full object-cover" alt="AI Stream" />
            ) : (
              <iframe 
                className="w-full h-full scale-[1.15] pointer-events-none" 
                src={`https://www.youtube.com/embed/${feed.ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${feed.ytId}&modestbranding=1`} 
                title={feed.name}
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            )}
            
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded border border-slate-600 font-mono flex items-center gap-2 z-10">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
               {feed.id} • {feed.name}
            </div>
            
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay z-20"></div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition-colors">
        Expand Camera Grid
      </button>
    </div>
  );
}