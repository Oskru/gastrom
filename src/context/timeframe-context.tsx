// src/context/timeframe-context.tsx
import { createContext, useContext } from 'react';
import { StatisticsRange } from '../schemas/statistics';

interface TimeframeContextType {
  timeframe: StatisticsRange;
}

export const TimeframeContext = createContext<TimeframeContextType>({
  timeframe: 'OVERALL',
});

export const useTimeframe = () => useContext(TimeframeContext);
