import React from 'react';

export const Header = () => {
  return (
    <header className="w-full p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 shadow-lg sticky top-0 z-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
        高中素養題目出題工具（學測字彙L1～3）
      </h1>
    </header>
  );
};
