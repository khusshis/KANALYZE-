import React from 'react';
import { AnalysisResponse, Signal } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisResultProps {
  data: AnalysisResponse;
  onReset: () => void;
  imageSrc: string;
}

const ResultCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`glass-panel rounded-2xl p-6 border border-neural-700 ${className}`}>
    <h3 className="text-neural-light text-sm uppercase tracking-wider font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const ProbabilityGauge: React.FC<{ aiProb: number; humanProb: number; color: string }> = ({ aiProb, humanProb, color }) => {
  const data = [
    { name: 'AI', value: aiProb, color: color },
    { name: 'Human', value: humanProb, color: '#1E2A4A' }, // Matches dark card background
  ];

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-5xl font-bold font-mono text-white">{aiProb.toFixed(1)}%</span>
        <span className="text-neural-light text-sm mt-2">AI Probability</span>
      </div>
    </div>
  );
};

const SignalBar: React.FC<{ signal: Signal }> = ({ signal }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-center mb-1">
      <span className="text-white font-medium text-sm">{signal.indicator}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        signal.severity === 'high' ? 'bg-red-500/20 text-red-300' :
        signal.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
        'bg-blue-500/20 text-blue-300'
      }`}>
        {signal.severity.toUpperCase()}
      </span>
    </div>
    <div className="w-full bg-neural-900 rounded-full h-2 mb-1 overflow-hidden border border-white/5">
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${Math.min(signal.confidence, 100)}%`, backgroundColor: signal.severity === 'high' ? '#ef4444' : signal.severity === 'medium' ? '#eab308' : '#3BA3F8' }}
      />
    </div>
    <p className="text-xs text-gray-400">{signal.evidence}</p>
  </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset, imageSrc }) => {
  const isAI = data.detection.verdict === 'AI-Generated';
  const mainColor = data.ui_hints.confidence_bar_color;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Header Result */}
      <div className="text-center space-y-4">
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-mono mb-2 border ${
          isAI ? 'bg-red-500/10 border-red-500/50 text-red-300' : 'bg-green-500/10 border-green-500/50 text-green-300'
        }`}>
          {data.detection.risk_level.replace('_', ' ')}
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">{data.detection.verdict}</h1>
        <p className="text-neural-light max-w-2xl mx-auto">{data.detection.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Image & Gauge */}
        <div className="space-y-8">
          <div className="relative rounded-2xl overflow-hidden border border-neural-700 group shadow-lg shadow-black/50">
            <img src={imageSrc} alt="Analyzed" className="w-full h-auto object-cover" />
            {/* Heatmap Overlay Simulation */}
            {data.heatmap_data?.enabled && data.heatmap_data.regions.map((region, i) => (
               <div
                  key={i}
                  className="absolute border-2 border-neural-accent/50 bg-neural-accent/20 rounded-lg animate-pulse"
                  style={{
                    left: `${(region.x / 1000) * 100}%`,
                    top: `${(region.y / 1000) * 100}%`,
                    width: `${(region.width / 1000) * 100}%`,
                    height: `${(region.height / 1000) * 100}%`,
                  }}
                  title={region.label}
               />
            ))}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
               <p className="text-xs font-mono text-gray-300">{data.file_info.name} • {data.file_info.dimensions}</p>
            </div>
          </div>

          <ResultCard title="Confidence Level">
            <ProbabilityGauge 
              aiProb={data.detection.ai_probability} 
              humanProb={data.detection.human_probability} 
              color={mainColor} 
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">Certainty: <span className="text-white font-semibold">{data.detection.certainty_level}</span></p>
            </div>
          </ResultCard>
        </div>

        {/* Center Col: Signals & Technical */}
        <div className="space-y-8">
          <ResultCard title="Detection Signals">
            <div className="space-y-6">
              {data.signals.map((signal, idx) => (
                <SignalBar key={idx} signal={signal} />
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Metadata Analysis">
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">EXIF Present</span>
                <span className={data.metadata_analysis.exif_present ? "text-green-400" : "text-red-400"}>
                  {data.metadata_analysis.exif_present ? "Yes" : "No"}
                </span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Camera Model</span>
                <span className="text-white text-right">{data.metadata_analysis.camera_model || "N/A"}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Software</span>
                <span className="text-white text-right">{data.metadata_analysis.software_detected || "N/A"}</span>
              </li>
            </ul>
          </ResultCard>
        </div>

        {/* Right Col: Prompt & Technical */}
        <div className="space-y-8">
          {data.prompt_reconstruction.available && (
            <ResultCard title="Prompt Reconstruction" className="bg-neural-accent/5 border-neural-accent/30">
               <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-neural-blue mb-4 leading-relaxed overflow-x-auto border border-white/5">
                 {data.prompt_reconstruction.estimated_prompt}
               </div>
               <div className="space-y-2">
                 <p className="text-xs text-gray-400 font-semibold uppercase">Style Keywords</p>
                 <div className="flex flex-wrap gap-2">
                   {data.prompt_reconstruction.breakdown.style_keywords.map((kw, i) => (
                     <span key={i} className="px-2 py-1 bg-neural-800 rounded text-xs text-white border border-white/10">{kw}</span>
                   ))}
                 </div>
               </div>
            </ResultCard>
          )}

          <ResultCard title="Visual Breakdown">
             <div className="space-y-5">
               {[
                 { label: 'Lighting Realism', score: data.visual_breakdown.lighting_realism },
                 { label: 'Anatomical Accuracy', score: data.visual_breakdown.anatomical_accuracy },
                 { label: 'Texture Consistency', score: data.visual_breakdown.texture_consistency },
               ].map((item, i) => {
                 // Smart Normalization: 
                 // Handles string inputs ("90"), 0-100 scales, and 0-1 scales safely.
                 let rawScore = Number(item.score);
                 if (isNaN(rawScore)) rawScore = 0;

                 let normalizedPercentage = 0;
                 let displayScore = 0;
                 
                 if (rawScore > 10) {
                    // Assume 0-100 scale
                    normalizedPercentage = rawScore; 
                    displayScore = parseFloat((rawScore / 10).toFixed(1));
                 } else if (rawScore <= 1 && rawScore > 0) {
                    // Assume 0-1 scale
                    normalizedPercentage = rawScore * 100;
                    displayScore = parseFloat((rawScore * 10).toFixed(1));
                 } else {
                    // Assume 0-10 scale
                    normalizedPercentage = rawScore * 10;
                    displayScore = parseFloat(rawScore.toFixed(1));
                 }

                 // Clamp max width to 100%
                 normalizedPercentage = Math.min(Math.max(normalizedPercentage, 0), 100);

                 return (
                   <div key={i}>
                     <div className="flex justify-between text-xs mb-2 text-gray-300 font-medium">
                       <span>{item.label}</span>
                       <span className="font-mono text-neural-blue">{displayScore}/10</span>
                     </div>
                     <div className="h-2 bg-neural-900 rounded-full w-full overflow-hidden border border-white/5">
                       <div className="h-full bg-neural-accent rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,163,248,0.5)]" style={{ width: `${normalizedPercentage}%` }}></div>
                     </div>
                   </div>
                 );
               })}
             </div>
          </ResultCard>

          <button 
            onClick={onReset}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/10 text-white font-semibold transition-all flex items-center justify-center gap-2 group shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-rotate-180 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v3.25a1 1 0 11-2 0V13.007a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Analyze Another Image
          </button>
        </div>

      </div>
    </div>
  );
};