'use client';

import { platformImages } from '@/lib/platform-images';

function ModuleCard({
  emoji,
  src,
  alt,
  title,
  description,
  successLabel,
  successMetric,
  formula,
  benefits,
}: {
  emoji: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  successLabel: string;
  successMetric: string;
  formula: string;
  benefits: readonly string[];
}) {
  return (
    <article className="module-flip aspect-[16/10] cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:rounded-2xl" tabIndex={0}>
      <div className="module-flip-inner">
        {/* Front Face */}
        <div className="module-flip-face border border-white/10 bg-slate-950/50 shadow-lg rounded-2xl overflow-hidden relative">
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 select-none">
              <span className="text-2xl sm:text-3xl select-none">{emoji}</span> {title}
            </h3>
            <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-emerald-400 flex items-center gap-1.5 select-none">
              🔄 Hover to inspect
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div className="module-flip-face module-flip-back glass-card flex flex-col justify-between border border-emerald-400/20 p-6 sm:p-7 rounded-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1.5">
                🔍 Module Details
              </span>
              <span className="text-2xs font-mono text-slate-400 select-none bg-slate-950 px-2 py-0.5 rounded border border-white/5">
                V2.0
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">{emoji}</span> {title}
            </h3>
            
            <p className="text-sm sm:text-base leading-6 sm:leading-7 text-slate-300">
              {description}
            </p>

            {/* Core Equation Box */}
            <div className="bg-slate-950/60 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Core Equation</p>
              <p className="text-xs font-mono font-medium text-sky-300 mt-1 select-all break-words leading-relaxed">
                {formula}
              </p>
            </div>
            
            {/* Success Metric Box */}
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {successLabel}
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-300">
                {successMetric}
              </span>
            </div>
          </div>
          
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5 select-none mt-2">
            ↩️ Move mouse to flip back
          </span>
        </div>
      </div>
    </article>
  );
}

export function ModulesGallery() {
  return (
    <div className="space-y-8">
      {/* Dynamic guiding notice bar */}
      <div className="glass-card border border-emerald-500/20 bg-emerald-500/5 rounded-3xl p-6 flex items-start gap-4 shadow-lg relative overflow-hidden">
        {/* Subtle glow rings */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
        <div className="text-3xl sm:text-4xl select-none animate-bounce pt-1">💡</div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
            Interactive Modules Guide
          </h4>
          <p className="text-sm sm:text-base text-slate-300 leading-6 sm:leading-7">
            Hover or tap any of the cards below to flip them. Each card reveals detail breakdowns,
            underlying mathematical formulas, and environmental target alignments.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-2 select-none">
          🧩 Platform Modules
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          Core building blocks feeding telemetry into your live sustainability engine.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {platformImages.map((image) => (
          <ModuleCard key={image.title} {...image} />
        ))}
      </div>

      {/* Under the Hood Math Matrix */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 bg-slate-950/20 mt-12 relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Under the Hood</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-2 select-none">
            🧮 How Module Math Impacts Your Eco Score
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-6 sm:leading-7">
            Each active module processes raw telemetry inputs (e.g. smart meter parameters, travel log details, recycling weight measurements) and normalizes them against target carbon budgets.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto border border-white/10 rounded-2xl">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm text-slate-300">
            <thead>
              <tr className="bg-slate-950/60 border-b border-white/10">
                <th className="p-4 font-bold text-white text-xs sm:text-sm uppercase tracking-wider">Module</th>
                <th className="p-4 font-bold text-white text-xs sm:text-sm uppercase tracking-wider">Core Formula / Calculation</th>
                <th className="p-4 font-bold text-white text-xs sm:text-sm uppercase tracking-wider"> telemetry components</th>
                <th className="p-4 font-bold text-white text-xs sm:text-sm uppercase tracking-wider">Score weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/20">
              {platformImages.map((module) => (
                <tr key={module.title} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="text-xl sm:text-2xl select-none">{module.emoji}</span>
                    {module.title}
                  </td>
                  <td className="p-4 font-mono text-xs text-sky-300 break-all select-all">{module.formula}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {module.benefits.map((benefit) => (
                        <span key={benefit} className="bg-slate-950 px-2 py-0.5 rounded border border-white/5 text-[10px] sm:text-xs text-slate-300 font-medium">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-emerald-400 font-bold text-xs sm:text-sm">
                    {module.title.includes('Analytics') ? 'Master Aggregator' : module.title.includes('Footprint') ? 'Global Index' : '+15% Max Score Gain'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

