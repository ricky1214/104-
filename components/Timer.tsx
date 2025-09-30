import React from 'react';

interface TimerProps {
  elapsedTime: number;
}

export const Timer: React.FC<TimerProps> = ({ elapsedTime }) => {
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-center gap-2 shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-xl font-mono font-semibold text-slate-200" aria-label="Elapsed time">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
};
