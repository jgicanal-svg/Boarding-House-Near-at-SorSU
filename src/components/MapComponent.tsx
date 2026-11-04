import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  boardingHouseName: string;
  address: string;
  showRadius?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, boardingHouseName, address, showRadius = true }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // SSU Bulan Campus coordinates
  const ssuLat = 12.6712;
  const ssuLng = 123.8721;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered between SSU Campus and Boarding House
      const centerLat = (latitude + ssuLat) / 2;
      const centerLng = (longitude + ssuLng) / 2;

      const map = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: 15,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom maroon icon for Boarding House
      const bhIcon = L.divIcon({
        className: 'custom-bh-marker',
        html: `<div style="background-color: #800000; color: #fde047; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">BH</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      // Custom blue/gold icon for SSU Campus Gate
      const ssuIcon = L.divIcon({
        className: 'custom-ssu-marker',
        html: `<div style="background-color: #2563eb; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">SSU</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      // Boarding House Marker
      L.marker([latitude, longitude], { icon: bhIcon })
        .addTo(map)
        .bindPopup(`<b>${boardingHouseName}</b><br/>${address}`);

      // SSU Bulan Campus Marker
      L.marker([ssuLat, ssuLng], { icon: ssuIcon })
        .addTo(map)
        .bindPopup(`<b>Sorsogon State University – Bulan Campus</b><br/>Main Campus Gate`);

      // Draw dashed walking path line between SSU Campus and Boarding House
      L.polyline([[ssuLat, ssuLng], [latitude, longitude]], {
        color: '#800000',
        weight: 3,
        dashArray: '6, 6'
      }).addTo(map).bindPopup('Walking Path to SSU Bulan Campus Gate');

      // Draw 500m walking radius circle around property
      if (showRadius) {
        L.circle([latitude, longitude], {
          radius: 500, // 500 meters walking radius
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 0.12,
          weight: 2,
          dashArray: '4, 4'
        }).addTo(map).bindPopup('500m Walking Radius Zone');
      }

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, boardingHouseName, address, showRadius]);

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm z-10">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-zinc-200 text-[11px] font-medium text-zinc-700 shadow-md z-[1000] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#800000] inline-block shadow-xs"></span>
          <span className="font-bold text-zinc-900">{boardingHouseName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block shadow-xs"></span>
          <span>SSU Bulan Campus (Main Gate)</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 text-[10px] text-zinc-500">
          <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500 inline-block"></span>
          <span>500m Walking Radius Circle</span>
        </div>
      </div>
    </div>
  );
};
