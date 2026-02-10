import React, { useState, useEffect } from 'react';
import { Info, Check, RotateCcw, Microscope } from 'lucide-react';

type LiquidType = 'WATER' | 'OIL' | 'MILK';

// --- Reusable Tooltip Component ---
const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-slate-900/95 text-white text-xs p-3 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 text-center animate-fadeIn backdrop-blur-sm pointer-events-none">
    {text}
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-white/10 rotate-45"></div>
  </div>
);

const LIQUID_CONFIG = {
  WATER: {
    id: 'WATER',
    name: 'Water',
    emoji: '💧',
    fillClass: 'bg-gradient-to-t from-cyan-600 to-liquid-water',
    streamClass: 'bg-cyan-400',
    hexColor: '#22d3ee',
    bubbleClass: 'bg-white/40',
    waveClass: 'bg-white/30',
    btnClass: 'bg-liquid-water text-blue-900'
  },
  OIL: {
    id: 'OIL',
    name: 'Cooking Oil',
    emoji: '🌻',
    fillClass: 'bg-gradient-to-t from-yellow-600 to-liquid-oil',
    streamClass: 'bg-yellow-400',
    hexColor: '#eab308',
    bubbleClass: 'bg-yellow-100/30',
    waveClass: 'bg-yellow-200/20',
    btnClass: 'bg-liquid-oil text-yellow-900'
  },
  MILK: {
    id: 'MILK',
    name: 'Milk',
    emoji: '🥛',
    fillClass: 'bg-gradient-to-t from-slate-200 to-liquid-milk',
    streamClass: 'bg-slate-100',
    hexColor: '#f8fafc',
    bubbleClass: 'bg-gray-200/20',
    waveClass: 'bg-slate-200/30',
    btnClass: 'bg-liquid-milk text-slate-600'
  }
};

// SVG Component for the Pouring Flask
const PouringFlask = ({ color, isPouring, isFull }: { color: string, isPouring: boolean, isFull: boolean }) => (
  <svg 
    width="120" 
    height="140" 
    viewBox="0 0 100 120" 
    className={`filter drop-shadow-xl transition-transform duration-500 ease-in-out origin-[80%_20%] ${isPouring ? 'rotate-[100deg] translate-y-4' : 'rotate-0'}`}
  >
    {/* Glass Bottle Body */}
    <path 
      d="M35,5 L65,5 L65,35 L85,55 L85,110 Q85,120 75,120 L25,120 Q15,120 15,110 L15,55 L35,35 Z" 
      fill="rgba(255, 255, 255, 0.1)" 
      stroke="#94a3b8" 
      strokeWidth="3"
    />
    {/* Liquid Inside - Opacity transitions slowly to simulate emptying */}
    <path 
      d="M36,15 L64,15 L64,36 L82,56 L82,108 Q82,116 74,116 L26,116 Q18,116 18,108 L18,56 L36,36 Z" 
      fill={color}
      className="transition-opacity ease-linear"
      style={{ opacity: isFull ? 0.9 : 0, transitionDuration: '1000ms', transitionDelay: isFull ? '0ms' : '500ms' }}
    />
    {/* Glass Reflections */}
    <path d="M25,60 L25,100" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
    <path d="M75,60 L75,80" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const LiquidStation: React.FC = () => {
  const [tab, setTab] = useState<'SHAPE' | 'SIPHON'>('SHAPE');
  const [selectedLiquid, setSelectedLiquid] = useState<LiquidType>('WATER');
  
  // Shape State
  const [pouredContainer, setPouredContainer] = useState<'NONE' | 'TALL' | 'WIDE'>('NONE');
  const [targetContainer, setTargetContainer] = useState<'NONE' | 'TALL' | 'WIDE'>('NONE');
  const [isPouring, setIsPouring] = useState(false);
  const [showMicroscope, setShowMicroscope] = useState(false);
  
  // Siphon State
  const [siphonActive, setSiphonActive] = useState(false);
  const [topLevel, setTopLevel] = useState(100);
  const [bottomLevel, setBottomLevel] = useState(0);
  const [warningMsg, setWarningMsg] = useState('');

  const currentLiquid = LIQUID_CONFIG[selectedLiquid];

  const handlePour = (target: 'TALL' | 'WIDE') => {
    if (isPouring || pouredContainer === target) return;
    
    // 1. Setup Animation State
    // Immediately "refill" the flask (visually) by emptying the current container
    // and setting target. This prepares the "Source".
    setPouredContainer('NONE'); 
    setTargetContainer(target); 
    setIsPouring(true); 
    
    // 2. Sequence:
    // 0ms: Pitcher moves & tilts (Flask is Full)
    // 400ms: Stream starts flowing (CSS animation delay)
    // 600ms: Stream hits bottom -> Start Filling Container & Emptying Flask
    setTimeout(() => {
      setPouredContainer(target);
    }, 600);

    // 1600ms: Stream finishes. End state.
    setTimeout(() => {
      setIsPouring(false);
      setTargetContainer('NONE'); 
    }, 1800); 
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    // Check flow conditions
    if (siphonActive) {
      // STOP if empty OR full
      if (topLevel <= 0 || bottomLevel >= 100) {
        setSiphonActive(false);
        if (topLevel < 0) setTopLevel(0);
        if (bottomLevel > 100) setBottomLevel(100);
      } else {
        interval = setInterval(() => {
          setTopLevel((prev) => {
              const next = prev - 0.5;
              return next < 0 ? 0 : next;
          }); 
          setBottomLevel((prev) => {
              // Volume Ratio Adjustment:
              const next = prev + 0.375; // 0.5 * 0.75
              return next > 100 ? 100 : next;
          });
        }, 30); 
      }
    }
    return () => clearInterval(interval);
  }, [siphonActive, topLevel, bottomLevel]);

  const handleStartSiphon = () => {
    if (topLevel <= 1) { // If empty or nearly empty
      setWarningMsg('The cylinder is empty!');
      setTimeout(() => setWarningMsg(''), 3000);
      return;
    }
    if (bottomLevel >= 99) {
      setWarningMsg('The bowl is already full!');
      setTimeout(() => setWarningMsg(''), 3000);
      return;
    }
    setSiphonActive(true);
  };

  const handleRefill = () => {
    setTopLevel(100);
    setBottomLevel(0);
    setWarningMsg('');
    setSiphonActive(false);
  };

  const getSiphonStatus = () => {
    if (warningMsg) return <span className="text-kid-orange animate-pulse flex items-center gap-2"><Info size={20} /> {warningMsg}</span>;
    if (siphonActive) return `${currentLiquid.name} is flowing! 🌊`;
    if (bottomLevel >= 100) return `The bowl is full! Good job! 🎉`;
    if (topLevel === 0) return `Great job! The ${currentLiquid.name} changed shape! 🎉`;
    return "Ready to flow!";
  };

  // Helper component for bubbles
  const Bubbles = () => (
    <>
      <div className={`absolute bottom-0 left-[20%] w-2 h-2 rounded-full animate-bubble-rise ${currentLiquid.bubbleClass}`} style={{ animationDelay: '0s' }}></div>
      <div className={`absolute bottom-0 left-[50%] w-3 h-3 rounded-full animate-bubble-rise ${currentLiquid.bubbleClass}`} style={{ animationDelay: '0.8s', animationDuration: '2.5s' }}></div>
      <div className={`absolute bottom-0 left-[75%] w-1.5 h-1.5 rounded-full animate-bubble-rise ${currentLiquid.bubbleClass}`} style={{ animationDelay: '1.5s', animationDuration: '2s' }}></div>
      <div className={`absolute bottom-0 left-[35%] w-2.5 h-2.5 rounded-full animate-bubble-rise ${currentLiquid.bubbleClass}`} style={{ animationDelay: '2.2s', animationDuration: '3.2s' }}></div>
    </>
  );

  return (
    <div className="flex flex-col items-center w-full h-full">
      
      {/* Custom Styles for Pouring Animation */}
      <style>{`
        @keyframes pour-stream {
          0% { height: 0; top: 90px; opacity: 1; }
          15% { height: 160px; top: 90px; opacity: 1; } /* Hit bottom fast */
          85% { height: 160px; top: 90px; opacity: 1; } /* Flow */
          100% { height: 0; top: 250px; opacity: 0; } /* Fall off */
        }
        .animate-pour-stream {
          animation: pour-stream 1.4s ease-out forwards;
        }
        @keyframes surface-ripple {
          0% { transform: scaleX(1); opacity: 0.5; }
          50% { transform: scaleX(1.1); opacity: 0.8; }
          100% { transform: scaleX(1); opacity: 0.5; }
        }
        .animate-surface-ripple {
          animation: surface-ripple 0.5s ease-in-out infinite;
        }
        @keyframes particle-tumble {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(4px, 2px) rotate(90deg); }
          66% { transform: translate(-2px, 5px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        .animate-particle-tumble {
          animation: particle-tumble 4s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Tab Nav */}
      <div className="flex gap-4 mb-4 bg-slate-800 p-2 rounded-full border border-slate-700">
        <button 
          onClick={() => setTab('SHAPE')}
          className={`px-8 py-2 rounded-full font-bold transition-colors ${tab === 'SHAPE' ? 'bg-kid-blue text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          1. Shape Change
        </button>
        <button 
          onClick={() => setTab('SIPHON')}
          className={`px-8 py-2 rounded-full font-bold transition-colors ${tab === 'SIPHON' ? 'bg-kid-blue text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          2. Flow (Siphon)
        </button>
      </div>

      {/* Liquid Selector */}
      <div className="flex gap-4 mb-8 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
        <span className="text-slate-400 font-bold self-center mr-2">Choose Liquid:</span>
        {(Object.keys(LIQUID_CONFIG) as LiquidType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedLiquid(type);
              setTopLevel(100);
              setBottomLevel(0);
              setSiphonActive(false);
              setPouredContainer('NONE');
              setWarningMsg('');
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105
              ${selectedLiquid === type ? `${LIQUID_CONFIG[type].btnClass} ring-4 ring-white/20 scale-105` : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}
            `}
          >
            <span className="text-xl">{LIQUID_CONFIG[type].emoji}</span>
            {LIQUID_CONFIG[type].name}
            {selectedLiquid === type && <Check size={16} />}
          </button>
        ))}
      </div>

      {tab === 'SHAPE' ? (
        <div className="flex flex-col items-center animate-fadeIn w-full">
          {/* Concept Card with Microscope */}
           <div className="bg-slate-800 border-l-4 border-kid-blue p-6 rounded-r-xl shadow-lg mb-8 max-w-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="bg-blue-900/50 p-3 rounded-full shrink-0">
                <Info className="text-kid-blue" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-kid-blue mb-1">Concept: Liquids Change Shape</h2>
                <p className="text-slate-300">
                  A <strong>Liquid</strong> has no definite shape. It takes the shape of whatever container you pour it into.
                  <br/><span className="text-sm text-slate-400 mt-2 block">Tap a "Pour Here" button to see the {currentLiquid.name.toLowerCase()} change!</span>
                </p>

                <button 
                  onClick={() => setShowMicroscope(!showMicroscope)}
                  className="mt-4 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-kid-blue font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-slate-600"
                >
                  <Microscope size={18} />
                  {showMicroscope ? "Hide Microscope" : "Why? See Inside!"}
                </button>

                 {/* Microscope View */}
                 {showMicroscope && (
                  <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-6 animate-fadeIn">
                    <div className="relative w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden flex flex-wrap content-center justify-center p-3 shadow-inner shrink-0">
                      <div className="absolute inset-0 bg-kid-blue/10 pointer-events-none rounded-full z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                      {/* Randomly placed particles */}
                      <div className="relative w-full h-full">
                        {Array.from({length: 8}).map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute w-4 h-4 bg-kid-blue rounded-full shadow-sm animate-particle-tumble"
                            style={{
                                left: `${Math.random() * 60 + 10}%`,
                                top: `${Math.random() * 60 + 20}%`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-kid-blue font-bold text-lg mb-1">Sliding Around!</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Liquid particles are close, but they are not locked in place. They can <strong>slide past each other</strong>. That's why liquids can flow and change shape!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Area - Grid Layout for alignment */}
          <div className="grid grid-cols-2 items-end min-h-[400px] relative w-full max-w-4xl px-4 gap-8">
            
            {/* Pitcher - Dynamic Positioning */}
            <div 
              className={`group transition-all duration-500 ease-in-out absolute top-0 z-30 flex flex-col items-center w-[120px]
                ${targetContainer === 'TALL' ? 'left-[25%] -translate-x-[100px]' : 
                  targetContainer === 'WIDE' ? 'left-[75%] -translate-x-[100px]' : 
                  'left-[50%] -translate-x-1/2'}
                ${isPouring ? 'translate-y-8' : 'translate-y-0'}
              `}
            >
              <Tooltip text="Liquids flow easily. Watch me pour!" />
              <div className="relative z-30 pointer-events-none">
                <PouringFlask color={currentLiquid.hexColor} isPouring={isPouring} isFull={pouredContainer === 'NONE'} />
              </div>
              
              {/* The Liquid Stream */}
              {isPouring && (
                 <div 
                    className={`absolute right-[10px] w-4 rounded-b-full animate-pour-stream z-20 shadow-[0_0_10px_rgba(255,255,255,0.2)] ${currentLiquid.streamClass}`}
                    style={{ animationDelay: '400ms' }}
                 >
                    {/* Particles/Sparkles in stream */}
                    <div className="absolute top-1/2 left-1 w-1 h-2 bg-white/60 rounded-full animate-ping"></div>
                    <div className="absolute bottom-10 left-0.5 w-1.5 h-3 bg-white/40 rounded-full animate-pulse"></div>
                 </div>
              )}
            </div>

            {/* Tall Glass Cell */}
            <div className="flex flex-col items-center group relative z-10 justify-self-center">
              <button 
                onClick={() => handlePour('TALL')}
                className={`mb-4 bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] transition-all ${isPouring ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
              >
                Pour Here
              </button>
              
              <Tooltip text="I'm a tall glass! The liquid will become tall and thin to fit inside me." />
              
              {/* Glass Container */}
              <div className="w-24 h-64 border-4 border-slate-400 border-t-0 rounded-b-xl relative bg-slate-700/20 overflow-hidden flex flex-col justify-end backdrop-blur-sm shadow-inner">
                {/* The Liquid */}
                <div 
                  className={`w-full transition-all ease-in-out relative shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] ${currentLiquid.fillClass}`}
                  style={{ height: pouredContainer === 'TALL' ? '85%' : '0%', transitionDuration: '1000ms' }}
                >
                    {/* Layered Wavy Surface */}
                    <div className={`absolute -top-4 left-0 w-[200%] h-8 rounded-[40%] animate-wave ${currentLiquid.waveClass}`} style={{ animationDuration: '3s' }}></div>
                    <div className={`absolute -top-3 left-0 w-[200%] h-6 rounded-[50%] animate-wave ${currentLiquid.waveClass}`}></div>
                    
                    {/* Filling Ripple Effect - Only visible during pour */}
                    {isPouring && targetContainer === 'TALL' && (
                        <div className={`absolute top-0 w-full h-4 bg-white/30 blur-sm animate-surface-ripple`}></div>
                    )}

                    {/* Bubbles */}
                    {pouredContainer === 'TALL' && <Bubbles />}
                </div>
              </div>
              <p className="text-slate-400 mt-2 font-bold">Tall Glass</p>
            </div>

            {/* Wide Bowl Cell */}
            <div className="flex flex-col items-center group relative z-10 justify-self-center">
               <button 
                onClick={() => handlePour('WIDE')}
                className={`mb-4 bg-cyan-400 text-slate-900 font-bold px-6 py-2 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] transition-all ${isPouring ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
              >
                Pour Here
              </button>
              
              <Tooltip text="I'm a wide bowl! The liquid will spread out to become wide like me." />
              
              {/* Bowl Container */}
              <div className="w-64 h-32 border-4 border-slate-400 border-t-0 rounded-b-[5rem] relative bg-slate-700/20 overflow-hidden flex flex-col justify-end backdrop-blur-sm shadow-inner">
                {/* The Liquid */}
                <div 
                  className={`w-full transition-all ease-in-out relative shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] ${currentLiquid.fillClass}`}
                  style={{ height: pouredContainer === 'WIDE' ? '85%' : '0%', transitionDuration: '1000ms' }}
                >
                   {/* Layered Wavy Surface */}
                   <div className={`absolute -top-5 left-0 w-[200%] h-10 rounded-[40%] animate-wave ${currentLiquid.waveClass}`} style={{ animationDuration: '3s' }}></div>
                   <div className={`absolute -top-4 left-0 w-[200%] h-8 rounded-[50%] animate-wave ${currentLiquid.waveClass}`}></div>
                   
                   {/* Filling Ripple Effect - Only visible during pour */}
                    {isPouring && targetContainer === 'WIDE' && (
                        <div className={`absolute top-0 w-full h-4 bg-white/30 blur-sm animate-surface-ripple`}></div>
                    )}
                   
                   {/* Bubbles */}
                   {pouredContainer === 'WIDE' && <Bubbles />}
                </div>
              </div>
              <p className="text-slate-400 mt-2 font-bold">Wide Bowl</p>
            </div>
          </div>
          
          {pouredContainer !== 'NONE' && !isPouring && (
            <div className="mt-8 text-xl font-bold text-kid-blue bg-blue-900/40 border border-blue-500/50 px-8 py-4 rounded-full animate-bounce">
              Observation: The {currentLiquid.name} changed shape to fit the {pouredContainer === 'TALL' ? 'Tall Glass' : 'Wide Bowl'}!
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-4xl animate-fadeIn">
           {/* Concept Card */}
           <div className="bg-slate-800 border-l-4 border-kid-blue p-6 rounded-r-xl shadow-lg mb-8 max-w-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="bg-blue-900/50 p-3 rounded-full">
                <Info className="text-kid-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-kid-blue mb-1">Concept: Liquids Flow</h2>
                <p className="text-slate-300">
                  Because liquids don't have a fixed shape, they can flow from one place to another.
                  <br/><span className="text-sm text-slate-400 mt-2 block">
                    The tube reaches the bottom to carry the {currentLiquid.name.toLowerCase()} up and out!
                    <br/>Click "Start Siphon" to watch gravity do the work.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Siphon Container */}
          <div className="relative group w-full max-w-2xl h-80 mx-auto mt-8 bg-slate-800/50 rounded-3xl border border-slate-700 shadow-inner overflow-hidden flex justify-center items-center">
            <Tooltip text="Gravity pulls the liquid down, but the liquid flows UP through the tube first!" />
            {/* Fixed Inner Stage for precise alignment */}
            <div className="relative w-[500px] h-full">
              
              {/* Top Container (Left) - Tall Cylinder */}
              <div className="absolute left-8 top-8 w-24 h-56 border-4 border-slate-400 border-t-0 bg-white/5 rounded-b-xl overflow-hidden flex flex-col justify-end z-10 backdrop-blur-sm shadow-xl">
                 {/* Graduation Marks */}
                 <div className="absolute right-0 top-4 w-2 h-0.5 bg-slate-400/50"></div>
                 <div className="absolute right-0 top-12 w-3 h-0.5 bg-slate-400/50"></div>
                 <div className="absolute right-0 top-20 w-2 h-0.5 bg-slate-400/50"></div>
                 <div className="absolute right-0 top-28 w-3 h-0.5 bg-slate-400/50"></div>
                 <div className="absolute right-0 top-36 w-2 h-0.5 bg-slate-400/50"></div>

                <div 
                  className={`w-full transition-all duration-75 relative ${currentLiquid.fillClass}`}
                  style={{ height: `${topLevel}%` }}
                >
                   <span className="absolute top-2 left-1 text-[10px] font-bold text-blue-900/50 mix-blend-multiply">Cylinder</span>
                   {/* Surface Wave Siphon */}
                   <div className={`absolute top-0 w-[200%] h-3 animate-wave rounded-full ${currentLiquid.waveClass}`}></div>
                   {topLevel > 10 && <Bubbles />}
                </div>
              </div>

              {/* Connecting Tube (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
                <defs>
                   {/* Glow Filter for the liquid */}
                   <filter id="liquidGlow" x="-50%" y="-50%" width="200%" height="200%">
                     <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                     <feMerge>
                       <feMergeNode in="coloredBlur"/>
                       <feMergeNode in="SourceGraphic"/>
                     </feMerge>
                   </filter>
                </defs>
                
                {/* Outer Glass Tube - Static */}
                <path 
                  d="M 80 190 L 80 50 Q 215 -30 356 180" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Active Liquid Body - The solid stream with glow */}
                <path 
                  d="M 80 190 L 80 50 Q 215 -30 356 180" 
                  fill="none" 
                  stroke={currentLiquid.hexColor}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={siphonActive ? 0.8 : 0}
                  filter="url(#liquidGlow)"
                  className="transition-all duration-300"
                />

                {/* Flow Animation - Moving Highlights/Bubbles */}
                <path 
                  d="M 80 190 L 80 50 Q 215 -30 356 180" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.5)" 
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="15 30"
                  strokeOpacity={siphonActive ? 0.6 : 0}
                  className={siphonActive ? "" : "hidden"}
                >
                   {siphonActive && <animate attributeName="stroke-dashoffset" from="45" to="0" dur="0.5s" repeatCount="indefinite" />}
                </path>

                {/* Flow Indicator Label */}
                {siphonActive && (
                  <g className="animate-bounce">
                    <rect x="180" y="-10" width="80" height="24" rx="12" fill="rgba(15, 23, 42, 0.8)" stroke={currentLiquid.hexColor} strokeWidth="2" />
                    <text x="220" y="6" textAnchor="middle" fill="white" className="text-xs font-bold tracking-wider">
                      FLOWING
                    </text>
                  </g>
                )}
              </svg>

              {/* Bottom Container (Right) - Wide Bowl */}
              <div className="absolute right-8 bottom-8 w-56 h-32 border-4 border-slate-400 border-t-0 bg-white/5 rounded-b-[3rem] overflow-hidden flex flex-col justify-end z-10 backdrop-blur-sm shadow-xl">
                <div 
                  className={`w-full transition-all duration-75 relative ${currentLiquid.fillClass}`}
                  style={{ height: `${bottomLevel}%` }}
                >
                   <span className="absolute top-2 left-4 text-xs font-bold text-blue-900/50 mix-blend-multiply">Wide Bowl</span>
                   {/* Surface Wave Siphon */}
                   <div className={`absolute top-0 w-[200%] h-4 animate-wave rounded-full ${currentLiquid.waveClass}`}></div>
                   {bottomLevel > 10 && <Bubbles />}
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="h-8 text-xl font-bold text-kid-blue transition-all">
              {getSiphonStatus()}
            </div>
            
            <div className="flex gap-4 items-center">
              <button
                 onClick={handleRefill}
                 disabled={siphonActive || topLevel > 95}
                 className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold border-2 transition-colors ${topLevel > 95 || siphonActive ? 'border-slate-700 text-slate-600 cursor-not-allowed' : 'border-slate-500 text-slate-300 hover:text-white hover:border-white hover:bg-slate-700'}`}
                 title="Refill Cylinder"
              >
                <RotateCcw size={20} />
                Refill
              </button>

              <button
                onClick={handleStartSiphon}
                disabled={siphonActive}
                className={`text-xl font-bold px-12 py-4 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-transform hover:scale-105 ${siphonActive ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-kid-blue text-slate-900 hover:bg-cyan-300'}`}
              >
                {siphonActive ? 'Flowing...' : 'Start Siphon!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
