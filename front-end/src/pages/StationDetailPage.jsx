import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStationHistory, getPublicStations } from '../services/api';
import { ArrowLeft, Droplets, Waves, AlertTriangle } from 'lucide-react';

const StationDetailPage = () => {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const [stationsData, historyData] = await Promise.all([
          getPublicStations(),
          getStationHistory(id)
        ]);
        const s = stationsData.find(st => st.id.toString() === id);
        setStation(s);
        setHistory(historyData.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
    const interval = setInterval(fetchInfo, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Đang tải biểu đồ...</div>;
  if (!station) return <div className="p-8 text-center text-red-500 font-bold">Không tìm thấy trạm</div>;

  const maxLevel = Math.max(...history.map(h => h.waterLevel), station.thresholdDanger + 1, 5);
  const chartHeight = 300;

  return (
    <div className="p-8 max-w-5xl mx-auto w-full pt-20">
      <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline mb-6"><ArrowLeft size={18}/> Quay lại bản đồ</Link>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3"><Waves className="text-blue-500"/> {station.name}</h1>
            <p className="text-slate-500 mt-2 font-medium">{station.location} (Lat: {station.latitude}, Lng: {station.longitude})</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase ${
              station.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-700' :
              station.status === 'WARNING' ? 'bg-orange-100 text-orange-700' :
              station.status === 'DANGER' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
            }`}>{station.status}</span>
            <div className="text-4xl font-black text-blue-600 mt-3">{station.lastWaterLevel !== null ? station.lastWaterLevel.toFixed(2) : '-'} <span className="text-lg text-slate-400">m</span></div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Cập nhật: {station.lastUpdated ? new Date(station.lastUpdated).toLocaleString('vi-VN') : 'Mới nhất'}</div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-6 text-sm font-bold bg-slate-50 p-4 rounded-xl border border-slate-100">
           <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div> Nguy hiểm: &ge; {station.thresholdDanger}m</div>
           <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div> Cảnh báo: &ge; {station.thresholdWarning}m</div>
           <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-full shadow-sm"></div> An toàn: &lt; {station.thresholdWarning}m</div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-6 mt-8">Biểu đồ Lịch sử Mức nước (Real-time IoT)</h3>
        
        <div className="relative w-full overflow-x-auto pb-4 custom-scrollbar bg-slate-50/50 rounded-2xl p-4">
          <div className="min-w-[700px] h-[300px] flex items-end gap-[4px] border-b-2 border-l-2 border-slate-300 relative pt-10 px-4">
             {/* Threshold lines */}
             <div className="absolute w-full border-t-2 border-red-500/50 border-dashed left-0 flex items-end pl-2 z-0" style={{ bottom: `${(station.thresholdDanger / maxLevel) * chartHeight}px`}}>
               <span className="bg-white/90 text-xs font-bold text-red-600 px-2 py-0.5 rounded shadow-sm -translate-y-1/2">Nguy hiểm ({station.thresholdDanger}m)</span>
             </div>
             <div className="absolute w-full border-t-2 border-orange-500/50 border-dashed left-0 flex items-end pl-2 z-0" style={{ bottom: `${(station.thresholdWarning / maxLevel) * chartHeight}px`}}>
               <span className="bg-white/90 text-xs font-bold text-orange-600 px-2 py-0.5 rounded shadow-sm -translate-y-1/2">Cảnh báo ({station.thresholdWarning}m)</span>
             </div>

             {history.length === 0 ? <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold text-lg">Đang chờ tín hiệu IoT...</div> :
             history.map((h, i) => {
               const heightPercent = (h.waterLevel / maxLevel) * 100;
               let barColor = 'bg-blue-400 hover:bg-blue-500 shadow-[0_0_10px_rgba(96,165,250,0.5)]';
               if (h.waterLevel >= station.thresholdDanger) barColor = 'bg-red-500 hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
               else if (h.waterLevel >= station.thresholdWarning) barColor = 'bg-orange-500 hover:bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
               
               return (
                 <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative z-10 cursor-pointer">
                    <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white p-2 rounded-xl whitespace-nowrap pointer-events-none shadow-2xl flex flex-col items-center gap-1 z-50">
                      <p className="font-black text-lg leading-none">{h.waterLevel.toFixed(2)}m</p>
                      <p className="text-[10px] text-slate-300 font-medium">{new Date(h.recordedAt).toLocaleTimeString('vi-VN')}</p>
                    </div>
                    <div className={`w-full rounded-t-sm transition-all duration-500 ${barColor}`} style={{ height: `${heightPercent}%`, minHeight: '4px' }}></div>
                 </div>
               )
             })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StationDetailPage;
