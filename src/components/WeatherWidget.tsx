import React from 'react';
import { CloudSun, Thermometer, Wind, Droplets, MapPin } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-[#330000] dark:bg-zinc-800 p-6 rounded-3xl border border-amber-400/30 text-white space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#660000] dark:border-zinc-700 pb-3">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Bulan, Sorsogon Weather</h4>
        </div>
        <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
          <MapPin className="w-3 h-3" /> SSU Campus Area
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2.5 bg-[#4d0000] dark:bg-zinc-900 p-3 rounded-2xl border border-amber-400/20">
          <Thermometer className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-zinc-300 block">Temperature</span>
            <strong className="text-sm font-extrabold text-white">28°C</strong>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#4d0000] dark:bg-zinc-900 p-3 rounded-2xl border border-amber-400/20">
          <CloudSun className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-zinc-300 block">Condition</span>
            <strong className="text-xs font-bold text-white">Partly Cloudy</strong>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#4d0000] dark:bg-zinc-900 p-3 rounded-2xl border border-amber-400/20">
          <Droplets className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-zinc-300 block">Humidity</span>
            <strong className="text-xs font-bold text-white">78%</strong>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-[#4d0000] dark:bg-zinc-900 p-3 rounded-2xl border border-amber-400/20">
          <Wind className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-zinc-300 block">Wind Speed</span>
            <strong className="text-xs font-bold text-white">12 km/h</strong>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-zinc-300 italic text-center pt-1">
        Ideal weather for walking around SSU Bulan Campus and inspecting boarding houses!
      </p>
    </div>
  );
};
