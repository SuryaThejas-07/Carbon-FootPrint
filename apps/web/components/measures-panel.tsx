'use client';

import { useState } from 'react';
import { useCarbon } from '@/components/carbon-context';

type Measure = {
  id: string;
  category: 'Home' | 'Travel' | 'Food' | 'Waste';
  title: string;
  co2ReductionKg: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  icon: string;
};

const sustainabilityMeasures: Measure[] = [
  {
    id: 'led-bulbs',
    category: 'Home',
    title: 'Retrofit to Smart LED Lighting',
    co2ReductionKg: 140,
    difficulty: 'Easy',
    description: 'Replacing standard lightbulbs with energy-efficient LEDs reduces household electricity demand immediately.',
    icon: '💡',
  },
  {
    id: 'public-transit',
    category: 'Travel',
    title: 'Use Transit 3 Days a Week',
    co2ReductionKg: 220,
    difficulty: 'Medium',
    description: 'Swap three car-driven commutes for clean public transportation like trains, buses, or light rails.',
    icon: '🚊',
  },
  {
    id: 'plant-based',
    category: 'Food',
    title: 'Swap 2 Meals/Week to Plant-Based',
    co2ReductionKg: 180,
    difficulty: 'Medium',
    description: 'Avoiding meat for two dinners weekly reduces land and methane footprints dramatically.',
    icon: '🥗',
  },
  {
    id: 'smart-strips',
    category: 'Home',
    title: 'Install Smart Power Strips',
    co2ReductionKg: 80,
    difficulty: 'Easy',
    description: 'Prevent vampire energy drain by automatically powering down devices on standby when not in use.',
    icon: '🔌',
  },
  {
    id: 'green-tariff',
    category: 'Home',
    title: 'Switch to Green Energy Tariff',
    co2ReductionKg: 420,
    difficulty: 'Easy',
    description: 'Instruct your utility supplier to match 100% of your power consumption with solar, wind, or hydro credits.',
    icon: '☀️',
  },
  {
    id: 'composting',
    category: 'Waste',
    title: 'Compost Organic Kitchen Waste',
    co2ReductionKg: 110,
    difficulty: 'Medium',
    description: 'Diverting food waste from landfills prevents anaerobic decomposition and reduces greenhouse gas generation.',
    icon: '♻️',
  },
  {
    id: 'train-not-plane',
    category: 'Travel',
    title: 'Choose Trains Over Short Flights',
    co2ReductionKg: 350,
    difficulty: 'Hard',
    description: 'Avoid short-haul regional flights by travelling on standard or high-speed rail instead.',
    icon: '🚄',
  },
  {
    id: 'eco-driving',
    category: 'Travel',
    title: 'Practice Eco-Driving Techniques',
    co2ReductionKg: 90,
    difficulty: 'Easy',
    description: 'Keep tires inflated, drive within speed limits, and avoid heavy acceleration to optimize fuel efficiency.',
    icon: '🚗',
  },
];

export function MeasuresPanel() {
  const { result } = useCarbon();
  const [adoptedIds, setAdoptedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'All' | 'Home' | 'Travel' | 'Food' | 'Waste'>('All');

  const toggleAdopt = (id: string) => {
    setAdoptedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredMeasures = filter === 'All'
    ? sustainabilityMeasures
    : sustainabilityMeasures.filter((m) => m.category === filter);

  const totalReduction = sustainabilityMeasures
    .filter((m) => adoptedIds.includes(m.id))
    .reduce((sum, m) => sum + m.co2ReductionKg, 0);

  const netFootprint = Math.max(0, result.totalAnnual - totalReduction);
  const updatedScore = Math.max(0, Math.min(100, Math.round(100 - (netFootprint / 80))));

  const getDifficultyColor = (diff: Measure['difficulty']) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20';
      case 'Medium': return 'bg-amber-400/10 text-amber-300 border-amber-400/20';
      case 'Hard': return 'bg-rose-400/10 text-rose-300 border-rose-400/20';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] xl:grid-cols-[1.6fr_0.8fr] 2xl:grid-cols-[1.8fr_0.7fr]">
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Sustainability Measures</h2>
              <p className="mt-1 text-sm text-slate-400">Adopt everyday measures to cut your carbon footprint.</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 rounded-xl bg-black/30 p-1">
              {(['All', 'Home', 'Travel', 'Food', 'Waste'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    filter === cat ? 'bg-emerald-400 text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="list">
            {filteredMeasures.map((measure) => {
              const isAdopted = adoptedIds.includes(measure.id);
              return (
                <article
                  key={measure.id}
                  role="listitem"
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition duration-300 ${
                    isAdopted
                      ? 'border-emerald-400/40 bg-emerald-950/10 shadow-md shadow-emerald-950/20'
                      : 'border-white/10 bg-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{measure.icon}</span>
                      <div className="flex gap-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-2xs font-semibold ${getDifficultyColor(measure.difficulty)}`}>
                          {measure.difficulty}
                        </span>
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-2xs font-semibold text-slate-200">
                          {measure.category}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{measure.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{measure.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4 pt-3 border-t border-white/5">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Reduction</span>
                      <p className="text-sm font-bold text-emerald-300">-{measure.co2ReductionKg} kg CO₂</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAdopt(measure.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        isAdopted
                          ? 'bg-emerald-400 text-slate-950 shadow hover:bg-emerald-300'
                          : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {isAdopted ? 'Active' : 'Adopt Action'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white">My Active Reductions</h3>
          <p className="mt-1 text-xs text-slate-400">See the combined impact of your adopted lifestyle changes.</p>
          
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-black/30 p-4 border border-white/5">
              <span className="text-xs text-slate-400">Calculated Annual Footprint</span>
              <p className="text-xl font-medium text-slate-300 mt-1">{result.totalAnnual.toFixed(0)} kg</p>
            </div>
            
            <div className="rounded-2xl bg-emerald-950/20 p-4 border border-emerald-500/20">
              <span className="text-xs text-emerald-400">Adopted Reductions Saving</span>
              <p className="text-2xl font-bold text-emerald-300 mt-1">-{totalReduction} kg CO₂</p>
            </div>

            <div className="rounded-2xl bg-black/30 p-4 border border-white/5">
              <span className="text-xs text-slate-400">Estimated Net Footprint</span>
              <p className="text-3xl font-extrabold text-white mt-1">{netFootprint.toFixed(0)} kg</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-300">Projected Sustainability Score</span>
              <span className="font-bold text-emerald-300">{updatedScore}/100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500"
                style={{ width: `${updatedScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h3 className="text-md font-semibold text-white">Reduction Badges</h3>
          <p className="mt-1 text-xs text-slate-400 font-medium">Badges unlocked by adopting green measures.</p>
          
          <div className="mt-4 flex flex-wrap gap-3">
            {adoptedIds.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No badges unlocked yet. Adopt some measures to unlock badges!</span>
            ) : (
              <>
                {adoptedIds.includes('led-bulbs') && (
                  <span className="flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/25 px-3 py-1 text-xs text-yellow-300">
                    💡 Glow-Getter
                  </span>
                )}
                {adoptedIds.includes('public-transit') && (
                  <span className="flex items-center gap-1.5 rounded-full bg-sky-400/10 border border-sky-400/25 px-3 py-1 text-xs text-sky-300">
                    🚊 Commuter Pro
                  </span>
                )}
                {adoptedIds.includes('plant-based') && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 px-3 py-1 text-xs text-emerald-300">
                    🥗 Herbivore Hero
                  </span>
                )}
                {adoptedIds.length >= 3 && (
                  <span className="flex items-center gap-1.5 rounded-full bg-purple-400/10 border border-purple-400/25 px-3 py-1 text-xs text-purple-300">
                    🏆 Eco Warrior
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
