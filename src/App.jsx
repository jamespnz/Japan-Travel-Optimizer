import React from 'react';
import CrowdMap from './features/crowd-dashboard/components/CrowdMap';
import RailOptimizer from './features/crowd-dashboard/components/rail-optimizer/RailOptimizer'; // Path corrected
import { useRailCalculator } from './hooks/useRailCalculator';
import faresData from "./data/fares.json";

function App() {
  // Initialize the logic hook
  const { selectedTrips, stats, toggleNozomi, removeTrip, addTrip, setSelectedTrips } = useRailCalculator([]);

  const cityCoords = faresData.cities;

  const clearTrips = () => {
    if (window.confirm("Are you sure you want to clear your entire itinerary?")) {
      setSelectedTrips([]);
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-sans text-white">
      
      {/* 1. Map Layer (Background) */}
      <div className="absolute inset-0 z-0">
        <CrowdMap 
          selectedTrips={selectedTrips} 
          cityCoords={cityCoords} 
        />
      </div>

      {/* 2. UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Branding */}
        <header className="flex flex-col gap-1 drop-shadow-lg">
          <h1 className="text-3xl font-black text-emerald-400 tracking-tighter">
            JAPAN TRAVEL OPTIMIZER
          </h1>
          <p className="text-slate-300 text-xs font-bold uppercase tracking-widest opacity-80">
            2026 Edition — Smart Mobility Agent
          </p>
        </header>

        {/* Floating Dashboard Panel */}
        <div className="pointer-events-auto w-full max-w-5xl mx-auto mb-4 bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
          <RailOptimizer 
            selectedTrips={selectedTrips}
            stats={stats}
            toggleNozomi={toggleNozomi}
            removeTrip={removeTrip}
            addTrip={addTrip}
            clearTrips={clearTrips} 
            availableRoutes={faresData.routes} 
          />
        </div>

      </div>
    </div>
  );
}

export default App;