import React from "react";

const BreakevenBar = ({ totalCost, progress, isProfitable, diff }) => {
  return (
    <div className="bg-slate-900/60 border border-white/5 rounded-[2rem] p-6 shadow-xl backdrop-blur-md">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Total Individual Fares
          </p>
          <h3 className="text-3xl font-black text-white tracking-tighter">
            ¥{totalCost.toLocaleString()}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Status
          </p>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isProfitable 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {isProfitable ? "PASS WORTH IT" : "NOT AT BREAKEVEN"}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative h-4 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
        {/* The Actual Progress Fill */}
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
            isProfitable ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-indigo-500"
          }`}
          style={{ width: `${progress}%` }}
        />
        
        {/* 50k Marker Line */}
        <div className="absolute top-0 left-[100%] w-0.5 h-full bg-white/20" />
      </div>

      <div className="flex justify-between mt-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          ¥0
        </p>
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
          {isProfitable 
            ? `Saving ¥${diff.toLocaleString()}` 
            : `¥${diff.toLocaleString()} to Breakeven`}
        </p>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          ¥50,000
        </p>
      </div>
    </div>
  );
};

export default BreakevenBar;