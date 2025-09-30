import React from 'react';
import { GradingResult as GradingResultType } from '../types';

interface GradingResultProps {
  result: GradingResultType;
}

export const GradingResult: React.FC<GradingResultProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-5 md:p-6 bg-slate-800/80 rounded-xl border border-slate-700 shadow-lg">
      <h3 className="text-xl font-bold text-slate-200 border-b border-slate-600 pb-3 mb-4">AI 批改結果</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-sm font-medium text-slate-400">得分</p>
          <p className={`text-6xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
          <p className="text-lg font-medium text-slate-400">/ 100</p>
        </div>
        <div className="flex-1 border-t-2 md:border-t-0 md:border-l-2 border-slate-700 pt-4 md:pt-0 md:pl-6">
           <h4 className="font-semibold text-slate-300 mb-2">AI 回饋與建議:</h4>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.feedback}</p>
        </div>
      </div>
    </div>
  );
};
