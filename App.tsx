import React, { useState, useCallback } from 'react';
import { UploadZone } from './components/UploadZone';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { analyzeImage } from './services/geminiService';
import { AnalysisResponse, AppState, HistoryItem } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    // 1. Read file for preview & history capture
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setCurrentImage(base64Image);
      
      // 2. State to Analyzing
      setAppState(AppState.ANALYZING);
      setErrorMsg(null);

      try {
        // 3. Call Service
        const data = await analyzeImage(file);
        setResult(data);
        
        // 4. Add to History
        const newHistoryItem: HistoryItem = {
          id: data.analysis_id || Date.now().toString(),
          timestamp: Date.now(),
          imageSrc: base64Image,
          analysis: data
        };
        
        setHistory(prev => [newHistoryItem, ...prev]);
        setAppState(AppState.RESULT);
        
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Analysis failed. Please try again or check your API key.");
        setAppState(AppState.ERROR);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const reset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setCurrentImage(null);
    setErrorMsg(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showHistory = () => {
    setAppState(AppState.HISTORY);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadFromHistory = (item: HistoryItem) => {
    setResult(item.analysis);
    setCurrentImage(item.imageSrc);
    setAppState(AppState.RESULT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFAQ = () => {
    const scroll = () => {
      const el = document.getElementById('faq');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    if (appState !== AppState.IDLE) {
      setAppState(AppState.IDLE);
      setResult(null);
      setCurrentImage(null);
      setErrorMsg(null);
      // Wait for state update and render
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-neural-accent selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-white/5 bg-neural-900/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
            <img src="/favicon.svg" alt="K-ANALYZE" className="w-8 h-8 hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tight text-white">K-ANALYZE</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <button 
              onClick={reset} 
              className={`hover:text-white transition-colors hover:scale-105 ${appState === AppState.IDLE ? 'text-white' : ''}`}
            >
              Detect
            </button>
            <button 
              onClick={scrollToFAQ} 
              className="hover:text-white transition-colors hover:scale-105"
            >
              FAQs
            </button>
            <button 
              onClick={showHistory} 
              className={`hover:text-white transition-colors hover:scale-105 ${appState === AppState.HISTORY ? 'text-white' : ''}`}
            >
              History
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute w-full left-0 top-20 bg-neural-900/95 backdrop-blur-xl border-b border-white/10 animate-fade-in z-50 shadow-2xl">
             <div className="flex flex-col p-6 space-y-2 font-medium text-lg">
                <button 
                  onClick={reset} 
                  className={`text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-colors ${appState === AppState.IDLE ? 'text-white bg-white/5' : 'text-gray-300'}`}
                >
                  Detect
                </button>
                <button 
                  onClick={scrollToFAQ} 
                  className="text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300"
                >
                  FAQs
                </button>
                <button 
                  onClick={showHistory} 
                  className={`text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-colors ${appState === AppState.HISTORY ? 'text-white bg-white/5' : 'text-gray-300'}`}
                >
                  History
                </button>
             </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-6 pb-20">
        
        {/* Title Area - Only show when IDLE */}
        {appState === AppState.IDLE && (
          <div className="text-center mb-16 space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              Truth in <span className="gradient-text animate-pulse">Every Pixel</span>
            </h1>
            <p className="text-xl text-neural-light max-w-2xl mx-auto leading-relaxed">
              Distinguish between AI-generated art and human photography with our advanced neural analysis engine.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {['Generative Adversarial Networks', 'Diffusion Models', 'Deepfakes', 'Metadata Forensics'].map((tag) => (
                <span key={tag} className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-neural-accent/20 hover:border-neural-accent hover:text-white cursor-default shadow-lg hover:shadow-neural-accent/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Switcher */}
        <div className="relative z-10">
          {appState === AppState.IDLE && (
            <div className="space-y-32">
              <UploadZone onFileSelect={handleFileSelect} />
              
              {/* FAQ Section */}
              <div id="faq" className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
                  <div className="w-16 h-1 bg-neural-accent mx-auto rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      q: "How accurate is the detection?",
                      a: "Our system achieves 85-95% accuracy depending on image complexity. Detection is probabilistic, using multiple neural networks to analyze pixel patterns."
                    },
                    {
                      q: "Do you store my images?",
                      a: "No. Images are processed in real-time in the browser or secure temporary memory and are immediately discarded after analysis. Privacy is our priority."
                    },
                    {
                      q: "Can it detect all AI models?",
                      a: "We detect popular models like Midjourney, DALL-E, and Stable Diffusion. However, as new models emerge daily, results for cutting-edge generators may vary."
                    },
                    {
                      q: "How long does analysis take?",
                      a: "Typically under 3 seconds, even for large high-resolution files. Our optimized pipeline processes visual artifacts rapidly."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-neural-blue/30 transition-all hover:-translate-y-1 duration-300">
                      <h3 className="text-lg font-semibold text-white mb-3">{faq.q}</h3>
                      <p className="text-neural-light text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {appState === AppState.ANALYZING && (
            <Loader />
          )}

          {appState === AppState.ERROR && (
            <div className="max-w-xl mx-auto text-center p-8 glass-panel rounded-2xl border-red-500/30">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">!</div>
              <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
              <p className="text-gray-400 mb-6">{errorMsg}</p>
              <button onClick={reset} className="px-6 py-2 bg-white text-neural-900 font-bold rounded-lg hover:bg-gray-200">Try Again</button>
            </div>
          )}

          {appState === AppState.RESULT && result && currentImage && (
            <AnalysisResult data={result} onReset={reset} imageSrc={currentImage} />
          )}

          {appState === AppState.HISTORY && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Analysis History</h2>
                <div className="text-sm text-gray-400">{history.length} items stored</div>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No history yet</h3>
                  <p className="text-gray-400 mb-6">Upload images to build your detection history.</p>
                  <button onClick={reset} className="px-6 py-2 bg-neural-accent hover:bg-neural-blue text-white rounded-lg transition-colors">
                    Start Detecting
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => loadFromHistory(item)}
                      className="glass-panel rounded-xl overflow-hidden cursor-pointer group hover:border-neural-blue/50 transition-all duration-300"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img src={item.imageSrc} alt="History thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neural-900/90 to-transparent"></div>
                        <div className="absolute bottom-3 left-3">
                           <p className="text-white text-sm font-medium truncate w-64">{item.analysis.file_info.name}</p>
                           <p className="text-gray-400 text-xs">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-mono border ${
                            item.analysis.detection.verdict === 'AI-Generated' 
                              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                              : item.analysis.detection.verdict === 'Human-Made'
                              ? 'bg-green-500/10 border-green-500/30 text-green-300'
                              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                          }`}>
                            {item.analysis.detection.verdict}
                          </span>
                          <span className="text-lg font-bold text-white">
                            {item.analysis.detection.verdict === 'AI-Generated' 
                              ? item.analysis.detection.ai_probability.toFixed(0) 
                              : item.analysis.detection.human_probability.toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2 h-8">
                          {item.analysis.detection.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <p>&copy; 2025 K-ANALYZE. All rights reserved.</p>
        <p className="mt-2 text-xs">K-ANALYZE</p>
      </footer>
    </div>
  );
}

export default App;