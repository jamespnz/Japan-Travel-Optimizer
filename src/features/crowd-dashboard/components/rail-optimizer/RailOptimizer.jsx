import React, { useState } from "react";
import BreakevenBar from "./BreakevenBar";
import TripCard from "./TripCard";
import { PlusCircle, TrainFront } from "lucide-react";

const RailOptimizer = ({
  selectedTrips,
  stats,
  toggleNozomi,
  removeTrip,
  addTrip,
  availableRoutes,
  clearTrips, // Added back
}) => {
  // --- 1. HOOKS & LOGIC ---
  const [selectedRouteId, setSelectedRouteId] = useState("");

  const handleAddClick = () => {
    if (!selectedRouteId) return;
    const routeToAdd = availableRoutes.find((r) => r.id === selectedRouteId);
    if (routeToAdd) {
      addTrip(routeToAdd);
      setSelectedRouteId(""); 
    }
  };

  const handleShare = () => {
    const verdict = stats.isProfitable ? "✅ Pass Worth It" : "❌ Tickets Cheaper";
    const itineraryText = selectedTrips
      .map((t) => `- ${t.origin} to ${t.destination}: ¥${(t.total + (t.isNozomi ? t.nozomi_supplement : 0)).toLocaleString()}`)
      .join("\n");

    const shareContent = `🚅 Japan Rail Summary\n\n${itineraryText}\n\nTotal: ¥${stats.totalIndividualCost.toLocaleString()}\nVerdict: ${verdict}`;
    navigator.clipboard.writeText(shareContent);
    alert("Itinerary copied to clipboard!");
  };

  // --- 2. UI RENDER ---
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 lg:p-8">
      {/* Header Branding */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/20 rounded-2xl">
          <TrainFront className="text-indigo-400" size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Rail Optimizer</h1>
          <p className="text-slate-400 text-sm">Compare fares vs. the ¥50,000 JR Pass</p>
        </div>
      </div>

      {/* Financial Overview Progress Bar */}
      <BreakevenBar
        totalCost={stats.totalIndividualCost}
        progress={stats.progressPercent}
        isProfitable={stats.isProfitable}
        diff={Math.abs(stats.savings)}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: ITINERARY */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-slate-300 font-semibold px-1 text-sm uppercase tracking-wider">Your Itinerary</h2>
              {selectedTrips.length > 0 && (
                <button 
                  onClick={clearTrips}
                  className="text-[10px] text-slate-500 hover:text-rose-400 font-bold border border-slate-800 px-2 py-0.5 rounded transition-all"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* ROUTE PICKER */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="bg-slate-800 text-white text-xs rounded-lg px-2 py-1.5 border border-slate-700 focus:ring-1 focus:ring-indigo-500 outline-none flex-grow sm:flex-grow-0"
              >
                <option value="">Select Route...</option>
                {availableRoutes?.map((route) => (
                  <option key={route.id} value={route.id}>{route.origin} → {route.destination}</option>
                ))}
              </select>
              <button
                onClick={handleAddClick}
                disabled={!selectedRouteId}
                className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-400 disabled:opacity-30 transition-all active:scale-95"
              >
                <PlusCircle size={16} />
              </button>
            </div>
          </div>

          {/* TRIP LIST */}
          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {selectedTrips.length === 0 ? (
              <div className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center">
                <p className="text-slate-500 text-sm italic text-balance">
                  No trips added. Start by selecting a route above.
                </p>
              </div>
            ) : (
              selectedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onToggleNozomi={toggleNozomi} onRemove={removeTrip} />
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BENTO INSIGHTS */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Optimizer Insights
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="text-indigo-400 font-mono text-xs font-bold">01.</span>
                <p>National JR Pass requires a supplement fee for Nozomi/Mizuho trains.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-mono text-xs font-bold">02.</span>
                <p>{stats.isProfitable ? "Pass Achieved! The pass is now saving you money." : "Individual tickets are currently cheaper."}</p>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <button
              onClick={handleShare}
              disabled={selectedTrips.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
            >
              SHARE SUMMARY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RailOptimizer;