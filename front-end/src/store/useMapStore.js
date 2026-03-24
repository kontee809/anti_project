import { create } from 'zustand';

export const useMapStore = create((set) => ({
  activeLayers: {
    waterLevel: true,
    rainfall: true,
    warnings: true,
  },
  toggleLayer: (layerName) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerName]: !state.activeLayers[layerName],
      },
    })),
  mapCenter: [16.047079, 108.206230], // Centered at Da Nang / Central Vietnam initially
  mapZoom: 6,
  setMapCenter: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
}));
