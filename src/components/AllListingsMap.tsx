import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Listing } from '../types';
import { useNavigate } from 'react-router-dom';
import { Navigation, Layers } from 'lucide-react';

interface AllListingsMapProps {
  listings: Listing[];
}

export const AllListingsMap: React.FC<AllListingsMapProps> = ({ listings }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapLayer, setMapLayer] = useState<'standard' | 'grayscale' | 'satellite'>('standard');
  const navigate = useNavigate();

  // SSU Bulan Campus coordinates
  const ssuLat = 12.6712;
  const ssuLng = 123.8721;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [ssuLat, ssuLng],
        zoom: 15,
        scrollWheelZoom: false,
        keyboard: true
      });

      const tileUrls = {
        standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        grayscale: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      };

      const layer = L.tileLayer(tileUrls[mapLayer], {
        attribution: '&copy; OpenStreetMap contributors & Esri World Imagery'
      }).addTo(map);

      tileLayerRef.current = layer;

      // SSU Campus Marker (Blue/Gold)
      const ssuIcon = L.divIcon({
        className: 'custom-ssu-marker',
        html: `<div style="background-color: #2563eb; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-size: 11px;">SSU</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker([ssuLat, ssuLng], { icon: ssuIcon })
        .addTo(map)
        .bindPopup(`<b>Sorsogon State University – Bulan Campus</b><br/>Main Campus Gate (Reference Center)`);

      // Boarding House Marker Icon (Maroon/Amber)
      const bhIcon = L.divIcon({
        className: 'custom-bh-marker',
        html: `<div style="background-color: #800000; color: #fde047; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); font-size: 10px;">BH</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      listings.forEach(listing => {
        if (listing.latitude && listing.longitude) {
          const popupContent = document.createElement('div');
          popupContent.className = 'space-y-2 p-1 max-w-xs';
          popupContent.innerHTML = `
            <div>
              <strong style="color: #800000; font-size: 13px;">${listing.name}</strong>
              <p style="font-size: 11px; color: #52525b; margin-top: 2px;">${listing.address}</p>
              <div style="font-size: 12px; font-weight: bold; color: #18181b; margin-top: 4px;">₱${listing.monthly_price.toLocaleString()} / month</div>
            </div>
            <button id="view-btn-${listing.id}" style="width: 100%; background: #800000; color: #fde047; border: none; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 11px; cursor: pointer; margin-top: 4px;">
              View Boarding House Details
            </button>
          `;

          const marker = L.marker([listing.latitude, listing.longitude], { icon: bhIcon }).addTo(map);
          marker.bindPopup(popupContent);

          marker.on('popupopen', () => {
            const btn = document.getElementById(`view-btn-${listing.id}`);
            if (btn) {
              btn.onclick = () => navigate(`/listings/${listing.id}`);
            }
          });

          // Draw dashed line to SSU
          L.polyline([[ssuLat, ssuLng], [listing.latitude, listing.longitude]], {
            color: '#800000',
            weight: 2,
            dashArray: '4, 4',
            opacity: 0.5
          }).addTo(map);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, navigate]);

  // Handle Map Layer Switcher
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const tileUrls = {
      standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      grayscale: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    };

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(tileUrls[mapLayer], {
      attribution: '&copy; OpenStreetMap contributors & Esri World Imagery'
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (e.key === 'ArrowUp') {
      map.panBy([0, -60]);
    } else if (e.key === 'ArrowDown') {
      map.panBy([0, 60]);
    } else if (e.key === 'ArrowLeft') {
      map.panBy([-60, 0]);
    } else if (e.key === 'ArrowRight') {
      map.panBy([60, 0]);
    } else if (e.key === '+' || e.key === '=') {
      map.zoomIn();
    } else if (e.key === '-' || e.key === '_') {
      map.zoomOut();
    }
  };

  return (
    <div 
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Interactive map of verified boarding houses near SSU Bulan Campus. Use Arrow keys to pan and + / - to zoom."
      className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-zinc-200 shadow-sm z-10 focus:outline-none focus:ring-2 focus:ring-[#800000]"
    >
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-zinc-200 text-xs text-zinc-800 shadow-lg z-[1000] space-y-1.5 pointer-events-none">
        <strong className="text-zinc-900 block font-bold flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-[#800000]" />
          SSU Bulan Campus Map Legend
        </strong>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block border border-white"></span>
          <span>SSU Bulan Campus (Main Gate)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#800000] inline-block border border-white"></span>
          <span>Verified Boarding Houses ({listings.length})</span>
        </div>
        <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-200">
          Tip: Use <kbd className="px-1.5 py-0.5 bg-zinc-100 border rounded font-mono">Arrow Keys</kbd> to pan & <kbd className="px-1.5 py-0.5 bg-zinc-100 border rounded font-mono">+/-</kbd> to zoom.
        </div>
      </div>

      {/* Map Layer Switcher */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-zinc-200 shadow-lg z-[1000] flex items-center gap-1">
        <span className="text-[10px] font-bold text-zinc-500 px-2 flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#800000]" /> Layer:
        </span>
        <button
          onClick={() => setMapLayer('standard')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${mapLayer === 'standard' ? 'bg-[#800000] text-amber-300 shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'}`}
        >
          Standard
        </button>
        <button
          onClick={() => setMapLayer('grayscale')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${mapLayer === 'grayscale' ? 'bg-[#800000] text-amber-300 shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'}`}
        >
          Grayscale
        </button>
        <button
          onClick={() => setMapLayer('satellite')}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${mapLayer === 'satellite' ? 'bg-[#800000] text-amber-300 shadow-xs' : 'text-zinc-600 hover:bg-zinc-100'}`}
        >
          Satellite
        </button>
      </div>
    </div>
  );
};
