import React from 'react';
import CrowdMap from './features/crowd-dashboard/components/CrowdMap';
import RailOptimizer from './features/crowd-dashboard/components/rail-optimizer/RailOptimizer';
import { useRailCalculator } from './hooks/useRailCalculator';
import faresData from "./data/fares.json";

function App() {
  const { selectedTrips, stats, toggleNozomi, removeTrip, addTrip, setSelectedTrips } = useRailCalculator([]);

  const cityCoords = faresData.cities;

  const clearTrips = () => {
    if (window.confirm("Are you sure you want to clear your entire itinerary?")) {
      setSelectedTrips([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono antialiased selection:bg-cyan-900 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* 1. MAP CONTAINER LAYER WITH DARK SLATE OVERLAY FILTER */}
      <div className="fixed inset-0 z-0 bg-slate-950 pointer-events-none overflow-hidden">
        {/* Darkening tint overlay to neutralize Mapbox background fog */}
        <div className="absolute inset-0 bg-slate-950/85 z-10 pointer-events-none" />
        
        {/* Mapbox Canvas */}
        <div className="w-full h-full opacity-60">
          <CrowdMap 
            selectedTrips={selectedTrips} 
            cityCoords={cityCoords} 
          />
        </div>
      </div>

      {/* 2. FOREGROUND TERMINAL INTERFACE */}
      <div className="relative z-20 flex flex-col justify-between min-h-screen p-2 sm:p-4 lg:p-6 pointer-events-none">
        
        {/* Header Bar */}
        <header className="pointer-events-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-950 border border-slate-800 p-3 rounded-sm shadow-2xl max-w-5xl mx-auto w-full mb-3">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-emerald-400 tracking-wider flex items-center gap-2">
              JAPAN TRAVEL OPTIMIZER
              <span className="text-[10px] text-cyan-400 font-mono border border-cyan-800 bg-cyan-950 px-1.5 py-0.5">2026_EDITION</span>
            </h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">
              Smart Mobility Agent // Wall Street Terminal Protocol
            </p>
          </div>
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NETLIFY_EDGE_NODE</span>
          </div>
        </header>

        {/* Opaque Solid Terminal Shell */}
        <main className="pointer-events-auto w-full max-w-5xl mx-auto my-auto bg-slate-950 border border-slate-800 rounded-sm shadow-2xl overflow-hidden">
          <RailOptimizer 
            selectedTrips={selectedTrips}
            stats={stats}
            toggleNozomi={toggleNozomi}
            removeTrip={removeTrip}
            addTrip={addTrip}
            clearTrips={clearTrips} 
            availableRoutes={faresData.routes} 
          />
        </main>

        {/* Terminal Footer */}
        <footer className="pointer-events-auto max-w-5xl mx-auto w-full mt-3 pt-2 border-t border-slate-900 text-center sm:text-left text-[10px] text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>HEADSUP APP DESIGN STUDIO // SYSTEM_ARCHITECT_PROTOCOL</span>
          <span>LATENCY: ZERO_LOCAL_COMPUTE</span>
        </footer>

      </div>
    </div>
  );
}

export default App;