import React from 'react';
import { Train, Zap, ArrowRight, Trash2 } from 'lucide-react';

const TripCard = ({ trip, onToggleNozomi, onRemove }) => {
  return (
    <div className="group relative p-4 bg-slate-800/50 border border-slate-700 rounded-2xl transition-all hover:bg-slate-800 hover:border-indigo-500/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-white font-bold tracking-tight">
          <span>{trip.origin}</span>
          <ArrowRight size={14} className="text-slate-500" />
          <span>{trip.destination}</span>
        </div>
        <button 
          onClick={() => onRemove(trip.id)}
          className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors rounded-lg hover:bg-rose-500/10"
          title="Remove Trip"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        {/* Nozomi Toggle */}
        <button
          onClick={() => onToggleNozomi(trip.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            trip.isNozomi 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
              : 'bg-slate-700/50 text-slate-400 border border-transparent hover:bg-slate-700'
          }`}
        >
          <Zap size={12} fill={trip.isNozomi ? "currentColor" : "none"} />
          {trip.isNozomi ? 'NOZOMI / MIZUHO' : 'HIKARI / KODAMA'}
        </button>

        {/* Individual Leg Price */}
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Est. Fare</p>
          <p className="text-lg font-mono font-bold text-indigo-400">
            ¥{(trip.total + (trip.isNozomi ? trip.nozomi_supplement : 0)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripCard;