'use client';

import { useState } from 'react';
import type { FoodHabit } from '@carbonwise/shared';
import { useCarbon } from '@/components/carbon-context';

const transportOptions = [
  { key: 'carKmPerDay', label: 'Car (km/day)' },
  { key: 'bikeKmPerDay', label: 'Bike (km/day)' },
  { key: 'publicTransportKmPerDay', label: 'Public transport (km/day)' },
  { key: 'evKmPerDay', label: 'EV (km/day)' },
] as const;

export function CalculatorPanel() {
  const { input, setInput, result } = useCarbon();

  // Commute Simulator state
  const [commuteDistance, setCommuteDistance] = useState(15);
  const [commuteDays, setCommuteDays] = useState(5);

  const annualTrips = commuteDays * 52 * 2; // round-trip
  const totalCommuteKm = commuteDistance * annualTrips;

  // Emissions calculations (kg CO2 per year)
  const carCommuteCo2 = totalCommuteKm * 0.21;
  const evCommuteCo2 = totalCommuteKm * 0.05;
  const transitCommuteCo2 = totalCommuteKm * 0.09;
  const bikeCommuteCo2 = 0;

  // Estimated costs per km in USD
  const carCost = totalCommuteKm * 0.15;
  const evCost = totalCommuteKm * 0.03;
  const transitCost = totalCommuteKm * 0.05;
  const bikeCost = 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] xl:grid-cols-[1.6fr_0.8fr] 2xl:grid-cols-[1.8fr_0.7fr]">
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Carbon calculator
          </h2>
          <p className="mt-1 text-sm text-slate-400">Adjust your daily habits to see live footprint estimates update.</p>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-emerald-400">1. Transport habits</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {transportOptions.map((option) => (
              <label key={option.key} className="space-y-2 flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15">
                <span className="text-xs font-semibold text-slate-300">{option.label}</span>
                <input
                  type="number"
                  min="0"
                  value={input.transport[option.key]}
                  onChange={(event) =>
                    setInput((previous) => ({
                      ...previous,
                      transport: { ...previous.transport, [option.key]: Math.max(0, Number(event.target.value)) },
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none glow-input"
                />
              </label>
            ))}
          </div>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-emerald-400">2. Home & Lifestyle</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label className="space-y-2 flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15">
              <span className="text-xs font-semibold text-slate-300">Monthly electricity (kWh)</span>
              <input
                type="number"
                min="0"
                value={input.energy.monthlyKwh}
                onChange={(event) =>
                  setInput((previous) => ({
                    ...previous,
                    energy: { ...previous.energy, monthlyKwh: Math.max(0, Number(event.target.value)) },
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none glow-input"
              />
            </label>
            <label className="space-y-2 flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15">
              <span className="text-xs font-semibold text-slate-300">Renewable energy share (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={input.energy.renewableSharePercent}
                onChange={(event) =>
                  setInput((previous) => ({
                    ...previous,
                    energy: { ...previous.energy, renewableSharePercent: Math.min(100, Math.max(0, Number(event.target.value))) },
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none glow-input"
              />
            </label>
            <label className="space-y-2 flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15">
              <span className="text-xs font-semibold text-slate-300">Diet Habit</span>
              <select
                value={input.food.habit}
                onChange={(event) =>
                  setInput((previous) => ({
                    ...previous,
                    food: { habit: event.target.value as FoodHabit },
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none glow-input"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="mixed">Mixed Diet</option>
                <option value="meat-heavy">Meat-heavy</option>
              </select>
            </label>
            <label className="space-y-2 flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15">
              <span className="text-xs font-semibold text-slate-300">Recycling frequency (times/week)</span>
              <input
                type="number"
                min="0"
                value={input.waste.recyclingFrequencyPerWeek}
                onChange={(event) =>
                  setInput((previous) => ({
                    ...previous,
                    waste: { ...previous.waste, recyclingFrequencyPerWeek: Math.max(0, Number(event.target.value)) },
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none glow-input"
              />
            </label>
          </div>
        </div>

        {/* Unique Feature: Travel Commute Route & Mode Simulator */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-sky-500/15">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🚴</span> Commute Mode Simulator
          </h2>
          <p className="text-xs text-slate-400 mt-1">Compare annual carbon footprints and costs for your regular commutes.</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">One-way Commute Distance: <span className="text-emerald-400">{commuteDistance} km</span></label>
              <input
                type="range"
                min="1"
                max="100"
                value={commuteDistance}
                onChange={(e) => setCommuteDistance(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-white/10 accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-semibold block">Commutes per week: <span className="text-emerald-400">{commuteDays} days</span></label>
              <input
                type="range"
                min="1"
                max="7"
                value={commuteDays}
                onChange={(e) => setCommuteDays(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-white/10 accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* Mode 1: Car */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">🚗 Standard gasoline car</span>
                <span className="text-rose-400 font-bold">{carCommuteCo2.toFixed(0)} kg CO₂ | ${carCost.toFixed(0)}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-rose-500" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Mode 2: EV */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">⚡ Electric Vehicle (EV)</span>
                <span className="text-sky-300 font-bold">{evCommuteCo2.toFixed(0)} kg CO₂ | ${evCost.toFixed(0)}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-sky-400" style={{ width: `${(evCommuteCo2 / carCommuteCo2) * 100}%` }} />
              </div>
            </div>

            {/* Mode 3: Transit */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">🚊 Public Transit</span>
                <span className="text-teal-300 font-bold">{transitCommuteCo2.toFixed(0)} kg CO₂ | ${transitCost.toFixed(0)}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-teal-400" style={{ width: `${(transitCommuteCo2 / carCommuteCo2) * 100}%` }} />
              </div>
            </div>

            {/* Mode 4: Bike */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">🚴 Bicycle / Walk</span>
                <span className="text-emerald-400 font-bold">0 kg CO₂ | $0</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: '0%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/10 text-xs text-slate-300 leading-5">
            💡 <span className="font-semibold text-white">Green commuting tip:</span> Cycling or walking for this commute saves you <span className="text-emerald-300 font-bold">{carCommuteCo2.toFixed(0)} kg CO₂</span> and <span className="text-emerald-300 font-bold">${carCost.toFixed(0)}</span> per year compared to driving a standard fuel car!
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-slate-400 font-medium">Annual footprint</p>
          <p className="mt-2 text-4xl font-bold text-white">{result.totalAnnual.toFixed(0)} kg</p>
          <p className="mt-1 text-xs text-slate-300">CO₂ equivalent per year</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <p className="text-sm text-slate-400 font-medium">Monthly footprint</p>
          <p className="mt-2 text-3xl font-bold text-white">{result.totalMonthly.toFixed(0)} kg</p>
        </div>
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400 font-medium">Sustainability score</p>
            <span className="text-lg font-bold text-emerald-300">{result.score}/100</span>
          </div>
          <div className="mt-4 h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500"
              style={{ width: `${result.score}%` }}
            />
          </div>
          <p className="mt-3 text-xs capitalize text-slate-300 font-medium">Rating: {result.band.replace('-', ' ')}</p>
        </div>
      </div>
    </div>
  );
}
