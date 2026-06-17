'use client';

import { AiCoach } from '@/components/ai-coach';
import { useCarbon } from '@/components/carbon-context';

export function InsightsPanel() {
  const { result, recommendations } = useCarbon();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <AiCoach
        context={`Annual footprint ${result.totalAnnual.toFixed(0)} kg, score ${result.score}, transport ${result.transport.toFixed(0)} kg.`}
      />

      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-white">Recommendations</h2>
        <p className="mt-1 text-sm text-slate-400">Personalized actions ranked by impact.</p>
        <div className="mt-5 space-y-3">
          {recommendations.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                  −{item.estimatedCo2ReductionKg} kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
