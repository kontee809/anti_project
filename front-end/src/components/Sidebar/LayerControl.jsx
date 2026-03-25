import React from 'react';
import { useMapStore } from '../../store/useMapStore';
import { Layers, Droplets, CloudRain, TriangleAlert, LifeBuoy } from 'lucide-react';

const LayerControl = () => {
  const { activeLayers, toggleLayer } = useMapStore();

  const layers = [
    { id: 'waterLevel', label: 'Mực nước', icon: <Droplets size={18} className="text-blue-500" /> },
    { id: 'rainfall', label: 'Lượng mưa', icon: <CloudRain size={18} className="text-indigo-500" /> },
    { id: 'warnings', label: 'Tháp báo lụt', icon: <TriangleAlert size={18} className="text-red-500" /> },
    { id: 'rescueRequests', label: 'Yêu cầu cứu trợ', icon: <LifeBuoy size={18} className="text-red-600" /> },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-5 border border-white/50 w-full" data-test-id="map-layer-control">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
        <Layers className="text-slate-400" size={18} />
        <h3 className="font-bold tracking-tight text-slate-800">Lớp Dữ Liệu</h3>
      </div>
      
      <div className="space-y-4">
        {layers.map((layer) => (
          <label key={layer.id} className="flex items-center justify-between cursor-pointer group" data-test-id={`map-layer-${layer.id}-label`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl transition-all duration-300 shadow-sm border border-slate-100 ${activeLayers[layer.id] ? 'bg-white shadow-slate-200' : 'bg-slate-50'}`}>
                {layer.icon}
              </div>
              <span className={`text-sm font-semibold transition-colors duration-300 ${activeLayers[layer.id] ? 'text-slate-800' : 'text-slate-400'}`}>
                {layer.label}
              </span>
            </div>
            
            <div className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${activeLayers[layer.id] ? 'bg-blue-500' : 'bg-slate-200'}`}>
              <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 ${activeLayers[layer.id] ? 'left-7 object-scale-down' : 'left-1'}`}></div>
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={activeLayers[layer.id]} 
                onChange={() => toggleLayer(layer.id)} 
                data-test-id={`map-layer-${layer.id}-toggle`}
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default LayerControl;
