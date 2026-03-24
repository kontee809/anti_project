// Mock data for Flood Monitoring System in Vietnam

// Helper to generate a random coordinate near a center
const randomOffset = (val, maxOffset) => val + (Math.random() - 0.5) * maxOffset;

// Generate Water Level Stations (Central & South VN)
export const waterLevelStations = Array.from({ length: 45 }).map((_, i) => ({
  id: `wl-${i}`,
  name: `Trạm đo Cấp Nước ${i + 1}`,
  type: 'waterLevel',
  coordinates: [randomOffset(15.5, 9), randomOffset(106.0, 3.5)], // Lat, Lng
  value: Math.floor(Math.random() * 100), // cm
  unit: 'cm',
  status: 'normal', // will dynamically assign based on value below
  timestamp: new Date().toISOString(),
})).map(station => {
  // Update status based on value
  if (station.value > 75) station.status = 'critical';
  else if (station.value > 50) station.status = 'warning';
  else if (station.value > 25) station.status = 'elevated';
  return station;
});

// Generate Rainfall Stations (mostly North & Central)
export const rainfallStations = Array.from({ length: 60 }).map((_, i) => ({
  id: `rf-${i}`,
  name: `Trạm quan trắc Mưa ${i + 1}`,
  type: 'rainfall',
  coordinates: [randomOffset(18.0, 6), randomOffset(105.5, 2)],
  value: Math.floor(Math.random() * 200), // mm
  unit: 'mm',
  timestamp: new Date().toISOString(),
}));

// Generate Flood Warning Towers
export const warningTowers = Array.from({ length: 15 }).map((_, i) => ({
  id: `wt-${i}`,
  name: `Tháp Báo Lụt số ${i + 1}`,
  type: 'warning',
  coordinates: [randomOffset(14.0, 7), randomOffset(106.8, 2)],
  active: Math.random() > 0.6, // 40% chance of being active
  message: 'Cảnh báo ngập sâu khu vực hạ lưu.',
  timestamp: new Date().toISOString(),
}));
