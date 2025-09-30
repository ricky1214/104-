import React from 'react';

interface HighlightedQuestionProps {
  text: string;
}

export const HighlightedQuestion: React.FC<HighlightedQuestionProps> = ({ text }) => {
  const regex = /(\(\d+\)|^\d+\.)/gm;
  const parts = text.split(regex);

  return (
    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-['Times_New_Roman'] text-lg">
      {parts.map((part, index) => {
        if (part && (part.match(/^\(\d+\)$/) || part.match(/^\d+\.$/))) {
          return (
            <mark key={index} className="bg-yellow-400 text-slate-900 px-1 rounded-sm">
              {part}
            </mark>
          );
        }
        return part;
      })}
    </div>
  );
};
