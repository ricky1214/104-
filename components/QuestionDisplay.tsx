import React from 'react';

interface QuestionDisplayProps {
  answer: string;
  showAnswer: boolean;
  onToggleAnswer: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ answer, showAnswer, onToggleAnswer }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-4">
      <div className="px-5 md:px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-xl">
        <button
          onClick={onToggleAnswer}
          className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          {showAnswer ? '隱藏答案與解析' : '顯示答案與解析'}
        </button>
        {showAnswer && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
             <h4 className="text-lg font-bold text-green-400 mb-3">官方答案與解析</h4>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-['Times_New_Roman'] text-sm">
              {answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
