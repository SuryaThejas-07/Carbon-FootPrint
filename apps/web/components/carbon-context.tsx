'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { calculateCarbonFootprint, generateRecommendations } from '@carbonwise/shared';
import type { CarbonInput } from '@carbonwise/shared';
import { demoCarbonInput } from '@/lib/data';

type CarbonContextValue = {
  input: CarbonInput;
  setInput: React.Dispatch<React.SetStateAction<CarbonInput>>;
  result: ReturnType<typeof calculateCarbonFootprint>;
  recommendations: ReturnType<typeof generateRecommendations>;
};

const CarbonContext = createContext<CarbonContextValue | null>(null);

export function CarbonProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState(demoCarbonInput);
  const result = useMemo(() => calculateCarbonFootprint(input), [input]);
  const recommendations = useMemo(() => generateRecommendations(input), [input]);

  return (
    <CarbonContext.Provider value={{ input, setInput, result, recommendations }}>
      {children}
    </CarbonContext.Provider>
  );
}

export function useCarbon() {
  const context = useContext(CarbonContext);
  if (!context) {
    throw new Error('useCarbon must be used within CarbonProvider');
  }
  return context;
}
