'use client';

import { useState } from 'react';
import { fetchJson } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type ChatResponse = {
  data: {
    assistant: string;
    message: string;
    quickActions: string[];
  };
};

type RoadmapTask = {
  week: number;
  title: string;
  co2Saving: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
};

export function AiCoach({ context }: { context?: string }) {
  const { getIdToken } = useAuth();
  const [message, setMessage] = useState(
    'How can I reduce my transport emissions this week?',
  );
  const [reply, setReply] = useState(
    'Switching 3 weekly car trips to public transport can reduce your annual emissions by 220 kg CO₂. Pair that with two plant-based meals per week for a compound effect.',
  );
  const [loading, setLoading] = useState(false);

  // 4-Week Roadmap state
  const [tasks, setTasks] = useState<RoadmapTask[]>([
    { week: 1, title: 'Unplug standby electronics & reduce food waste', co2Saving: 85, difficulty: 'Easy', completed: false },
    { week: 2, title: 'Replace 2 solo car commutes with transit or EV sharing', co2Saving: 145, difficulty: 'Medium', completed: false },
    { week: 3, title: 'Swap standard lightbulbs for smart LED bulbs', co2Saving: 140, difficulty: 'Easy', completed: false },
    { week: 4, title: 'Switch to a 100% green utility electricity tariff', co2Saving: 420, difficulty: 'Hard', completed: false },
  ]);

  const toggleTask = (week: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.week === week ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  const projectedSavings = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.co2Saving, 0);

  async function askCoach(nextMessage?: string) {
    const prompt = nextMessage ?? message;
    setLoading(true);

    try {
      const token = await getIdToken();
      const response = await fetchJson<ChatResponse>('/v1/insights/chat', {
        method: 'POST',
        token,
        body: JSON.stringify({ message: prompt, context }),
      });
      setReply(response.data.message);
      if (nextMessage) setMessage(nextMessage);
    } catch {
      setReply('The AI coach is temporarily unavailable. Try focusing on transport, energy, and food habits first.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Coach Card */}
      <div className="glass-card rounded-[2rem] p-6 border border-emerald-500/10">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🤖</span> AI Carbon Coach
        </h3>
        <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-slate-200">
          {loading ? 'Thinking through your sustainability plan…' : reply}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <label htmlFor="ai-coach-message-input" className="sr-only">
            Ask your AI Carbon Coach
          </label>
          <textarea
            id="ai-coach-message-input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none glow-input"
            placeholder="Type your question to the AI Carbon Coach here..."
          />
          <button
            type="button"
            onClick={() => askCoach()}
            disabled={loading}
            className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            Ask for advice
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
          {['Daily tips', 'Weekly challenges', 'Action plans', 'Offset suggestions'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => askCoach(`Give me ${chip.toLowerCase()} for my carbon footprint`)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* 4-Week Net-Zero Roadmap Card */}
      <div className="glass-card rounded-[2rem] p-6 border border-sky-500/15">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📅</span> 4-Week Roadmap to Net-Zero
            </h3>
            <p className="text-xs text-slate-400 mt-1">Take guided weekly actions to establish clean habits.</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Roadmap Progress</span>
            <p className="text-sm font-bold text-emerald-300">{progressPercent}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-white/10 mt-4 overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timeline Grid */}
        <div className="mt-6 space-y-4">
          {tasks.map((task) => (
            <div
              key={task.week}
              role="checkbox"
              aria-checked={task.completed}
              tabIndex={0}
              onClick={() => toggleTask(task.week)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleTask(task.week);
                }
              }}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                task.completed
                  ? 'border-emerald-500/30 bg-emerald-950/10 shadow-sm'
                  : 'border-white/5 bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/20 bg-black/20 text-white transition-all">
                {task.completed && <span className="text-xs text-emerald-400 font-bold">✓</span>}
              </div>
              <div className="flex-1 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Week {task.week}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-3xs font-semibold text-slate-300">
                    -{task.co2Saving} kg/yr
                  </span>
                </div>
                <p className={`text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-white font-medium'}`}>
                  {task.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Forecast Metric */}
        {projectedSavings > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Projected Annual Savings</span>
            <span className="text-sm font-bold text-emerald-300">-{projectedSavings} kg CO₂/year</span>
          </div>
        )}
      </div>
    </div>
  );
}

