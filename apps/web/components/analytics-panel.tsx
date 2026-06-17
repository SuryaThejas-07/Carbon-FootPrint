'use client';

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCarbon } from '@/components/carbon-context';

const colorMap = ['#34d399', '#60a5fa', '#f87171', '#fbbf24', '#c084fc'];

export function AnalyticsPanel() {
  const { result } = useCarbon();

  const monthlyTrend = [
    { month: 'Jan', emissions: 1220 },
    { month: 'Feb', emissions: 1190 },
    { month: 'Mar', emissions: 1160 },
    { month: 'Apr', emissions: 1130 },
    { month: 'May', emissions: 1090 },
    { month: 'Jun', emissions: result.totalMonthly },
  ];

  const categoryData = [
    { name: 'Transport', value: result.transport },
    { name: 'Energy', value: result.energy },
    { name: 'Food', value: result.food },
    { name: 'Waste', value: result.waste },
    { name: 'Flights', value: result.flights },
  ];

  // Calculate highest emission driver
  const categories = [
    { name: 'Transport', value: result.transport, desc: 'daily travel and vehicle fuel' },
    { name: 'Energy', value: result.energy, desc: 'home electricity and heating' },
    { name: 'Food', value: result.food, desc: 'grocery choices and food packaging' },
    { name: 'Waste', value: result.waste, desc: 'landfill contributions and lack of recycling' },
    { name: 'Flights', value: result.flights, desc: 'regional and international aviation trips' },
  ];

  const sortedCategories = [...categories].sort((a, b) => b.value - a.value);
  const highest = sortedCategories[0];
  const total = result.totalAnnual || 1;
  const highestPercentage = Math.round((highest.value / total) * 100);

  // Compare against global average target (e.g. 2000 kg CO2 / year is the Paris Agreement sustainable target)
  const isTargetMet = result.totalAnnual <= 2000;
  const timesHigherThanTarget = (result.totalAnnual / 2000).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white">Monthly footprint trend</h2>
          <p className="mt-1 text-sm text-slate-400">Your monthly emissions output over the last six months.</p>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#cbd5e1" tick={{ fontSize: 14 }} dy={10} />
                <YAxis stroke="#cbd5e1" tick={{ fontSize: 14 }} dx={-5} />
                <Tooltip contentStyle={{ background: '#121614', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14 }} />
                <Line type="monotone" dataKey="emissions" stroke="#34d399" strokeWidth={4} dot={{ fill: '#34d399', r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white">Emissions by category</h2>
          <p className="mt-1 text-sm text-slate-400">A detailed split of your emissions in kg CO₂ equivalent.</p>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="#cbd5e1" tick={{ fontSize: 14 }} dy={10} />
                <YAxis stroke="#cbd5e1" tick={{ fontSize: 14 }} dx={-5} />
                <Tooltip contentStyle={{ background: '#121614', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14 }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={colorMap[index % colorMap.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Widescreen Section: Human-friendly Deep-Dive Analysis */}
      <div className="glass-card rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-slate-950/20">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🔍</span> Deep-Dive: Personal Footprint Analysis
        </h3>
        <p className="text-sm text-slate-400 mt-1">A developer-curated breakdown of your lifestyle carbon impact.</p>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] mt-8 pt-6 border-t border-white/5">
          {/* Left Column: Sorted Category Contributions */}
          <div className="space-y-5">
            <h4 className="text-base font-semibold text-white uppercase tracking-wider">Category Contribution Breakdowns</h4>
            <div className="space-y-4">
              {sortedCategories.map((cat, index) => {
                const percentage = Math.round((cat.value / total) * 100);
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-300">{cat.name}</span>
                      <span className="text-white">{cat.value.toFixed(0)} kg ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colorMap[index % colorMap.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Human-made style report commentary */}
          <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4 text-slate-200">
              <h4 className="text-base font-semibold text-emerald-400">Insight Summary</h4>
              <p className="text-base leading-7">
                After studying your carbon metrics, your primary footprint driver is <strong className="text-white font-bold">{highest.name}</strong>, accounting for <strong className="text-emerald-300 font-bold">{highestPercentage}%</strong> of your annual emissions. This is typically caused by {highest.desc}.
              </p>
              <p className="text-base leading-7">
                {isTargetMet ? (
                  <span className="text-emerald-300 font-semibold">
                    Awesome job! Your footprint of {result.totalAnnual.toFixed(0)} kg is below the global sustainable target of 2,000 kg CO₂ per year.
                  </span>
                ) : (
                  <span>
                    Your annual footprint is currently <strong className="text-rose-300 font-bold">{timesHigherThanTarget}x higher</strong> than the global sustainable target. Focusing on reducing your {highest.name.toLowerCase()} emissions will be your quickest path to improving your sustainability score.
                  </span>
                )}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-sm font-semibold">
              <span className="flex items-center gap-1.5 text-slate-400">
                🌏 National Average: ~15,000 kg
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                🎯 Paris Goal: 2,000 kg
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

