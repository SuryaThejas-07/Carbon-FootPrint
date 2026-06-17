'use client';

import { useState, useEffect } from 'react';
import { AuthBar } from '@/components/auth-bar';
import { AnalyticsPanel } from '@/components/analytics-panel';
import { CalculatorPanel } from '@/components/calculator-panel';
import { CarbonProvider, useCarbon } from '@/components/carbon-context';
import { InsightsPanel } from '@/components/insights-panel';
import { ModulesGallery } from '@/components/modules-gallery';
import { MeasuresPanel } from '@/components/measures-panel';
import { TabBar } from '@/components/tab-bar';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'measures', label: 'Measures' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'insights', label: 'AI Insights' },
  { id: 'modules', label: 'Modules' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function MainShell() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <CarbonProvider>
      <main className="relative min-h-screen overflow-hidden">
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-25" />

        <div className="relative mx-auto w-full max-w-[1600px] px-6 py-8 md:px-10 lg:px-12">
          <header className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                  CarbonWise AI
                </p>
                <p className="text-xs text-slate-400">Premium sustainability awareness engine</p>
              </div>
            </div>
            <AuthBar />
          </header>

          <section className="mt-8">
            <TabBar tabs={[...tabs]} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
          </section>

          <section className="mt-8 pb-16">
            {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
            {activeTab === 'calculator' && <CalculatorPanel />}
            {activeTab === 'measures' && <MeasuresPanel />}
            {activeTab === 'analytics' && <AnalyticsPanel />}
            {activeTab === 'insights' && <InsightsPanel />}
            {activeTab === 'modules' && <ModulesGallery />}
          </section>

          <footer className="border-t border-white/10 pt-8 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} CarbonWise AI. Built for Google Cloud. Track smarter. Emit less.</p>
          </footer>
        </div>
      </main>
    </CarbonProvider>
  );
}

function OverviewTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const { result } = useCarbon();
  
  // Offset Simulator State
  const [trees, setTrees] = useState(5);
  const [greenPower, setGreenPower] = useState(25);
  const [oceanPlastic, setOceanPlastic] = useState(10);

  // Mount animation state for gauge sweep
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Carbon offset conversion rates:
  // 1 tree = 22 kg CO2 / year
  // 1% green power funded = 18 kg CO2 / year
  // 1 kg ocean plastic = 8 kg CO2 / year
  const treesSaved = trees * 22;
  const powerSaved = greenPower * 18;
  const plasticSaved = oceanPlastic * 8;
  const totalOffset = treesSaved + powerSaved + plasticSaved;
  const netFootprint = Math.max(0, result.totalAnnual - totalOffset);
  const offsetPercentage = Math.min(100, Math.round((totalOffset / Math.max(1, result.totalAnnual)) * 100));

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              🌱 Version 2.0 Live - Premium Sustainability Tracking
            </div>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]">
              Understand your footprint. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                Take action with confidence.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Measure emissions across transport, energy, food, and waste. Get AI-powered insights,
              adopt real-world saving measures, and simulate virtual carbon offsets.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('calculator')}
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 hover:scale-[1.02]"
            >
              Start calculating
            </button>
            <button
              type="button"
              onClick={() => onNavigate('measures')}
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 hover:scale-[1.02]"
            >
              Explore Measures
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Measure', 'Live footprint calculator & route comparisons', '📊'],
              ['Analyze', 'Category breakdowns and trend charts', '📈'],
              ['Improve', 'AI carbon coach & targeted timelines', '🤖'],
            ].map(([title, detail, emoji]) => (
              <div key={title} className="glass-card rounded-2xl p-5 hover:border-emerald-500/20 transition group">
                <span className="text-2xl group-hover:scale-110 inline-block transition-transform duration-200">{emoji}</span>
                <p className="text-sm font-bold text-emerald-300 mt-2">{title}</p>
                <p className="mt-1 text-xs text-slate-300 leading-5">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Widescreen Interactive Eco Score Gauge */}
        <div className="glass-card rounded-3xl p-8 border border-emerald-500/10 shadow-emerald-950/20 shadow-2xl flex flex-col justify-between items-center relative overflow-hidden min-h-[450px] h-full">
          {/* Circular Backdrop Glow */}
          <div className="absolute -inset-10 bg-gradient-to-tr from-emerald-500/5 via-transparent to-sky-500/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs text-emerald-300 font-bold z-10 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Eco Score
          </div>
          
          <div className="w-full flex-1 flex items-center justify-center mt-10">
            <div className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center">
              {/* Subtle inner light */}
              <div className="absolute inset-4 rounded-full bg-slate-950/40 border border-white/5 shadow-inner" />
              
              {/* Circular SVG Gauge */}
              <svg className="w-full h-full rotate-[-90deg] relative z-10" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="43" stroke="rgba(255,255,255,0.03)" strokeWidth="5.5" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="43"
                  stroke="url(#ecoGaugeGradient)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="270"
                  strokeDashoffset={animate ? (270 - (270 * result.score) / 100) : 270}
                  strokeLinecap="round"
                  className="transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1)"
                />
                <defs>
                  <linearGradient id="ecoGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none">
                <span className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tighter leading-none select-none">
                  {result.score}
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-extrabold mt-3">
                  Eco Score
                </span>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-white/10 pt-5 text-center mt-6 relative z-10">
            <div className="text-sm text-slate-400 font-medium tracking-wide">Annual Carbon Footprint</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              {result.totalAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg CO₂e
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Rating:</span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold capitalize text-emerald-400">
                {result.band.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* New Section: Core Concepts Explainer */}
      <div className="glass-card rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-slate-950/20">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Core Concepts</span>
          <h2 className="text-2xl font-bold text-white mt-2">What is a Carbon Footprint & How does this platform work?</h2>
          <p className="text-slate-300 text-sm mt-3 leading-6">
            A **carbon footprint** represents the total volume of greenhouse gases (measured in carbon dioxide equivalent or CO₂e) generated by our daily habits, such as fossil-fuel travel, household heating/cooling, dietary consumption, and plastic waste disposal. Understanding and reducing this number is the single most critical step in avoiding severe global climate changes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8 pt-6 border-t border-white/5">
          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Interactive Calculation</h4>
            <p className="text-xs text-slate-400 leading-5">
              Input metrics in the **Calculator** tab to see your footprint instantly divided across Transport, Energy, Food, and Waste.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Reduction-First Focus</h4>
            <p className="text-xs text-slate-400 leading-5">
              Use the **Measures** catalog to adopt real-world actions like LED lights or transit swaps. Reduction is always prioritized over off-setting.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Offsetting Sandbox</h4>
            <p className="text-xs text-slate-400 leading-5">
              For residual emissions that cannot be completely eliminated, simulate supporting wind farms, ocean cleanups, or planting forests.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
              4
            </div>
            <h4 className="text-sm font-bold text-white">AI Mentorship</h4>
            <p className="text-xs text-slate-400 leading-5">
              Interact with the **AI Coach** and follow a guided 4-week step-by-step roadmap to establish long-term clean habits.
            </p>
          </div>
        </div>
      </div>

      {/* Unique Feature: Interactive Carbon Offset Simulator */}
      <div className="glass-card rounded-[2.5rem] p-6 md:p-8 border border-emerald-500/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🌳</span> Carbon Offset Sandbox
            </h2>
            <p className="text-sm text-slate-400 mt-1">Simulate investing in verified global carbon removal programs.</p>
          </div>
          <div className="bg-black/30 border border-white/10 px-4 py-2 rounded-2xl text-right">
            <span className="text-xs text-slate-400 font-medium">Estimated Net Annual Footprint</span>
            <p className="text-xl font-bold text-white mt-0.5">
              {netFootprint.toFixed(0)} kg CO₂ <span className="text-xs text-emerald-400 font-normal">(-{offsetPercentage}%)</span>
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] mt-6">
          <div className="space-y-6">
            {/* Slide 1 - Reforestation */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  🌲 Afforestation (Planted Trees)
                </span>
                <span className="text-emerald-300 font-bold">{trees} Trees (-{treesSaved} kg)</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={trees}
                onChange={(e) => setTrees(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-white/10 accent-emerald-400 cursor-pointer"
              />
              <div className="flex flex-wrap gap-1 min-h-[20px]">
                {Array.from({ length: Math.min(25, trees) }).map((_, i) => (
                  <span key={i} className="text-sm animate-float" style={{ animationDelay: `${i * 0.15}s` }}>🌳</span>
                ))}
                {trees > 25 && <span className="text-xs text-slate-500 self-center">+{trees - 25} more...</span>}
              </div>
            </div>

            {/* Slide 2 - Solar Energy */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  ☀️ Solar / Wind Farm Contribution
                </span>
                <span className="text-sky-300 font-bold">{greenPower}% Capacity (-{powerSaved} kg)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={greenPower}
                onChange={(e) => setGreenPower(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-white/10 accent-sky-400 cursor-pointer"
              />
              <div className="flex gap-4 text-xs text-slate-400 pt-1">
                <span className={`flex items-center gap-1 ${greenPower > 0 ? 'text-amber-400 font-semibold' : ''}`}>
                  ⚡ Solar Grid Match
                </span>
                <span className={`flex items-center gap-1 ${greenPower > 50 ? 'text-sky-400 font-semibold animate-pulse' : ''}`}>
                  🌀 Wind Spin Active
                </span>
              </div>
            </div>

            {/* Slide 3 - Ocean Cleanups */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  🌊 Ocean Plastic Recovery
                </span>
                <span className="text-teal-300 font-bold">{oceanPlastic} kg (-{plasticSaved} kg)</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={oceanPlastic}
                onChange={(e) => setOceanPlastic(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-white/10 accent-teal-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Sandbox metrics display */}
          <div className="bg-black/20 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Sandbox Summary</h4>
              
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-300">Planted Trees Offset</span>
                <span className="font-semibold text-slate-200">-{treesSaved} kg/yr</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-300">Clean Grid Funding</span>
                <span className="font-semibold text-slate-200">-{powerSaved} kg/yr</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-slate-300">Ocean Plastic Cleared</span>
                <span className="font-semibold text-slate-200">-{plasticSaved} kg/yr</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold text-emerald-300 pt-2">
                <span>Total Offset Achieved</span>
                <span>-{totalOffset} kg/yr</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full bg-white/5 rounded-xl px-4 py-3 text-center border border-white/5">
                <p className="text-2xs text-slate-400 uppercase tracking-widest font-semibold">Virtual Reward Status</p>
                <p className="text-sm font-bold text-emerald-300 mt-1">
                  {totalOffset >= 1000 ? '🏅 Platinum Planet Saver' : totalOffset >= 500 ? '🥇 Gold Eco Investor' : totalOffset >= 200 ? '🥈 Silver Footprint Balancer' : '🥉 Bronze Contributor'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

