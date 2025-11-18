
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 bg-slate-900/70 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
          Cross-Lingual Grammar-Aware Translation
        </h1>
        <p className="text-slate-400 mt-2">For Indian Languages</p>
      </div>
    </header>
  );
};

export default Header;
