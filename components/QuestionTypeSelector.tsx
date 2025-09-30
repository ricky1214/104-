import React from 'react';
import { QUESTION_TYPES } from '../constants';
import { QuestionType } from '../types';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType | null;
  onSelectType: (type: QuestionType) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ selectedType, onSelectType, onGenerate, isLoading }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-800/50 rounded-xl border border-slate-700 shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-300 mb-1">1. 選擇題型</h2>
        <p className="text-sm text-slate-400">請選擇您想要練習的學測英文題型。</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {QUESTION_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500
              ${selectedType === type
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            {type}
          </button>
        ))}
      </div>
       <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-300 mb-1">2. 開始生成</h2>
        <p className="text-sm text-slate-400">點擊按鈕，AI 將為您生成一份全新的高難度試題。</p>
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading || !selectedType}
        className="w-full px-6 py-4 text-base font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 disabled:text-slate-400"
      >
        {isLoading ? '正在生成中...' : selectedType ? `生成 "${selectedType}" 試題` : '請先選擇題型'}
      </button>
    </div>
  );
};
