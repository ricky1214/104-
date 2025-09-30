import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
      <h3 className="font-bold mb-2">發生錯誤</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
};
