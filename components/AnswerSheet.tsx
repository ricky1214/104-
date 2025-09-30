import React, { useState, useMemo } from 'react';
import { QuestionType } from '../types';

interface AnswerSheetProps {
  questionType: QuestionType;
  questionText: string;
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export const AnswerSheet: React.FC<AnswerSheetProps> = ({ questionType, questionText, onSubmit, isSubmitting, isSubmitted }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  const formElements = useMemo(() => {
    switch (questionType) {
      case QuestionType.Cloze: {
        const clozeOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        return Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
          <div key={num} className="flex flex-col gap-1">
            <label htmlFor={`cloze-${num}`} className="font-semibold text-slate-300 text-sm">{num}.</label>
            <select
              id={`cloze-${num}`}
              value={answers[num] || ''}
              onChange={(e) => handleAnswerChange(String(num), e.target.value)}
              disabled={isSubmitted}
              className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            >
              <option value="">-</option>
              {clozeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ));
      }
      case QuestionType.ReadingComprehension: {
        const questionMatches = questionText.match(/(\d\.\s[\s\S]*?)(?=\n\d\.|$)/g) || [];
        return questionMatches.map((q, index) => {
          const questionNumber = q.match(/^(\d)\./)?.[1] || String(index + 1);
          return (
            <div key={questionNumber} className="p-3 rounded-lg bg-slate-700/50">
              <p className="font-semibold mb-2 text-slate-300">{questionNumber}.</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-slate-300">
                    <input
                      type="radio"
                      name={`rc-${questionNumber}`}
                      value={opt}
                      checked={answers[questionNumber] === opt}
                      onChange={(e) => handleAnswerChange(questionNumber, e.target.value)}
                      disabled={isSubmitted}
                      className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-600 ring-offset-gray-800 focus:ring-2"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          );
        });
      }
       case QuestionType.ParagraphStructure: {
        return Array.from({ length: 4 }, (_, i) => i + 1).map(num => (
          <div key={num} className="flex flex-col gap-1">
            <label htmlFor={`ps-${num}`} className="font-semibold text-slate-300 text-sm">{num}.</label>
            <input
              type="text"
              id={`ps-${num}`}
              maxLength={1}
              value={answers[num] || ''}
              onChange={(e) => handleAnswerChange(String(num), e.target.value.toUpperCase())}
              disabled={isSubmitted}
              className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 text-center"
              placeholder="A-E"
            />
          </div>
        ));
      }
      case QuestionType.Mixed: {
         const numQuestions = (questionText.match(/^\d\./gm) || []).length || 5;
         return Array.from({ length: numQuestions }, (_, i) => i + 1).map(num => (
            <div key={num} className="flex flex-col gap-1 sm:col-span-2 md:col-span-3 lg:col-span-5">
                <label htmlFor={`mixed-${num}`} className="font-semibold text-slate-300 text-sm">{num}.</label>
                <input
                type="text"
                id={`mixed-${num}`}
                value={answers[num] || ''}
                onChange={(e) => handleAnswerChange(String(num), e.target.value)}
                disabled={isSubmitted}
                className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                />
            </div>
         ));
      }
      default:
        return <p>This question type does not support interactive answering yet.</p>;
    }
  }, [questionType, answers, isSubmitted, questionText]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mt-4 p-5 md:p-6 bg-slate-800/80 rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold text-slate-200 border-b border-slate-600 pb-3 mb-4">作答區</h3>
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 ${questionType === QuestionType.ReadingComprehension ? 'grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1' : ''}`}>
        {formElements}
      </div>
      {!isSubmitted && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 text-base font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isSubmitting ? '批改中...' : '提交批改'}
        </button>
      )}
    </form>
  );
};
