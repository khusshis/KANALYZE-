import React, { useCallback, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group rounded-3xl border-2 border-dashed transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-neural-accent bg-neural-accent/10 scale-102'
            : 'border-white/20 bg-white/5 hover:border-neural-blue/50 hover:bg-white/10'
        }`}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleFileInput}
          accept="image/*"
        />
        
        {/* Scanning Animation Layer - Activates on Hover */}
        <div className="absolute inset-0 pointer-events-none z-10 hidden group-hover:block">
           <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-neural-accent/10 to-transparent animate-scan">
             <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-neural-blue shadow-[0_0_15px_#3BA3F8]"></div>
           </div>
        </div>

        <div className="p-16 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
            isDragging ? 'bg-neural-accent text-white shadow-[0_0_30px_rgba(59,163,248,0.5)]' : 'bg-neural-800 text-neural-blue shadow-inner group-hover:shadow-[0_0_20px_rgba(99,210,255,0.3)]'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          
          <div className="space-y-2 group-hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white group-hover:text-neural-blue transition-colors">Upload to Analyze</h3>
            <p className="text-neural-light">Drag & drop or click to browse</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
            <span>JPG</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>PNG</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>WEBP</span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span>Max 500MB</span>
          </div>
        </div>

        {/* Decorative Grid with Hover Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-500" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
      </div>
    </div>
  );
};