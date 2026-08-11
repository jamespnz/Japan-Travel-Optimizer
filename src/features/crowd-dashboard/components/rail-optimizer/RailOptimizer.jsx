import React, { useState } from "react";
import BreakevenBar from "./BreakevenBar";
import TripCard from "./TripCard";
import { PlusCircle, Terminal, Share2, Trash2 } from "lucide-react";

const RailOptimizer = ({
  selectedTrips,
  stats,
  toggleNozomi,
  removeTrip,
  addTrip,
  availableRoutes,
  clearTrips,
}) => {
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

    const shareContent = `🚅 JAPAN RAIL FINANCIAL SUMMARY\n\n${itineraryText}\n\nTotal: ¥${stats.totalIndividualCost.toLocaleString()}\nVerdict: ${verdict}`;
    navigator.clipboard.writeText(shareContent);
    alert("Terminal summary copied to clipboard.");
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto p-3 lg:p-6 font-mono text-slate-200 antialiased">
      
      {/* TERMINAL HEADER STRIP */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 bg-slate-950/80 px-4 py-2.5 rounded-sm">
        <div className="flex items-center gap-3">
          <Terminal className="text-cyan-500" size={18} />
          <div>
            <h1 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              RAIL_OPTIMIZER // FINANCIAL_ANALYTICS_TERMINAL
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-cyan-400 border border-slate-700">v4.0.26</span>
            </h1>
            <p className="text-[11px] text-slate-500">JR PASS METRIC ENGINE // ¥50,000 BASELINE THRESHOLD</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYS_STATUS: OPERATIONAL</span>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW BAR */}
      <BreakevenBar
        totalCost={stats.totalIndividualCost}
        progress={stats.progressPercent}
        isProfitable={stats.isProfitable}
        diff={Math.abs(stats.savings)}
      />

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT PANEL: ITINERARY BUILDER (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3 bg-slate-900/40 border border-slate-800 p-4 rounded-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">[ITINERARY_LEDGER]</span>
              {selectedTrips.length > 0 && (
                <button 
                  onClick={clearTrips}
                  className="text-[10px] text-rose-400 hover:text-white hover:bg-rose-950/50 border border-rose-900/50 px-2 py-0.5 rounded-sm transition-all font-mono flex items-center gap-1"
                >
                  <Trash2 size={10} />
                  CLEAR
                </button>
              )}
            </div>

            {/* ROUTE PICKER CONTROL */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="bg-slate-950 text-slate-200 text-xs rounded-sm px-2 py-1.5 border border-slate-700 focus:border-cyan-500 focus:outline-none flex-grow font-mono"
              >
                <option value="">-- SELECT ROUTE CORRIDOR --</option>
                {availableRoutes?.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.origin} → {route.destination} (¥{route.fare.toLocaleString()})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddClick}
                disabled={!selectedRouteId}
                className="bg-cyan-900/30 text-cyan-400 border border-cyan-700 hover:bg-cyan-800 hover:text-white p-1.5 rounded-sm disabled:opacity-20 transition-all font-mono"
                title="Add Route to Ledger"
              >
                <PlusCircle size={16} />
              </button>
            </div>
          </div>

          {/* TRIP CARDS LIST */}
          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
            {selectedTrips.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-sm p-8 text-center bg-slate-950/30">
                <p className="text-slate-500 text-xs font-mono">
                  [NO_DATA] Ledger empty. Select a corridor route above to execute calculation.
                </p>
              </div>
            ) : (
              selectedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onToggleNozomi={toggleNozomi} onRemove={removeTrip} />
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL: BENTO TELEMETRY & INSIGHTS (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-4 rounded-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400" />
                SYSTEM_DIAGNOSTICS & RULES
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-400 font-mono">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-sm">
                <span className="text-cyan-500 font-bold mr-2">01. NOZOMI_SUPPLEMENT</span>
                <p className="text-slate-400 text-[11px] mt-1">
                  JR Pass baseline excludes Nozomi/Mizuho Shinkansen express services. Toggling express options applies localized surcharge logic.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-sm">
                <span className="text-cyan-500 font-bold mr-2">02. FINANCIAL_VERDICT</span>
                <p className={`text-[11px] font-bold mt-1 ${stats.isProfitable ? "text-emerald-400" : "text-amber-400"}`}>
                  {stats.isProfitable 
                    ? "[STATUS: BREAKEVEN_EXCEEDED] - Standard 7-Day National Pass yield is positive." 
                    : "[STATUS: INDIVIDUAL_FARES_OPTIMAL] - Point-to-point ticketing remains optimal."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handleShare}
              disabled={selectedTrips.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-cyan-900/40 text-cyan-400 hover:text-cyan-200 border border-slate-700 hover:border-cyan-600 disabled:opacity-20 text-xs font-bold py-2.5 px-4 rounded-sm transition-all font-mono"
            >
              <Share2 size={14} />
              EXPORT_TERMINAL_SUMMARY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RailOptimizer;