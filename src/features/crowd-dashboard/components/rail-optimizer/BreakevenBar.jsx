import React from "react";

const BreakevenBar = ({ totalCost, progress, isProfitable, diff }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-sm font-mono">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 border-b border-slate-800/80 pb-3">
        
        {/* METRIC 1: CUMULATIVE FARES */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">CUMULATIVE_FARES</span>
          <span className="text-xl font-black text-slate-100 font-mono tracking-tight">
            ¥{totalCost.toLocaleString()}
          </span>
        </div>

        {/* METRIC 2: DELTA TO THRESHOLD */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">VARIANCE_VS_PASS</span>
          <span className={`text-xl font-black font-mono tracking-tight ${isProfitable ? "text-emerald-400" : "text-slate-300"}`}>
            {isProfitable ? `+¥${diff.toLocaleString()} [YIELD]` : `-¥${diff.toLocaleString()} [MARGIN]`}
          </span>
        </div>

        {/* METRIC 3: STATUS BADGE */}
        <div className="md:text-right flex flex-col justify-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">VERDICT_STATUS</span>
          <span className={`text-xs font-bold px-2 py-1 inline-block rounded-sm w-max md:ml-auto border ${
            isProfitable 
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800" 
              : "bg-slate-950 text-slate-400 border-slate-800"
          }`}>
            {isProfitable ? "[BREAKEVEN_ACHIEVED]" : "[NOT_AT_BREAKEVEN]"}
          </span>
        </div>
      </div>

      {/* TERMINAL PROGRESS BAR */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>BASE_THRESHOLD: ¥0</span>
          <span>PROGRESS: {progress}%</span>
          <span>TARGET_PASS: ¥50,000</span>
        </div>
        <div className="w-full bg-slate-950 h-2 border border-slate-800 rounded-sm overflow-hidden p-0.5">
          <div
            className={`h-full transition-all duration-300 ${
              isProfitable ? "bg-emerald-500" : "bg-cyan-600"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BreakevenBar;