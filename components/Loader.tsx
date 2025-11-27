import React from 'react';

export const Loader: React.FC<{ text?: string }> = ({ text = "Analyzing pixel patterns..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-neural-accent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-neural-blue animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-neural-accent/20 rounded-full animate-pulse-fast blur-xl"></div>
        </div>
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
           </svg>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">Processing Image</h3>
      <p className="text-neural-light font-mono text-sm">{text}</p>
    </div>
  );
};