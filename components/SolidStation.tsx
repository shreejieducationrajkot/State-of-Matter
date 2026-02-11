import React, { useState } from 'react';
import { Info, Layers, Box, RotateCcw, Check, ArrowDown, Hand, Microscope, X } from 'lucide-react';

type SolidType = 'WOOD' | 'ICE' | 'BRICK' | 'SPONGE';
type LocationType = 'SHELF' | 'BOWL' | 'BOX';

// --- Reusable Tooltip Component ---
const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 bg-slate-900/95 text-white text-xs p-3 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 text-center animate-fadeIn backdrop-blur-sm pointer-events-none">
    {text}
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-white/10 rotate-45"></div>
  </div>
);

// --- Realistic Texture Styles ---
const TEXTURES: Record<SolidType, React.CSSProperties> = {
  WOOD: {
    backgroundColor: '#8B5A2B',
    backgroundImage: `
      repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 4px),
      linear-gradient(to bottom right, #8B5A2B, #6F4E37)
    `,
    boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 6px rgba(0,0,0,0.3), 4px 8px 12px rgba(0,0,0,0.4)',
    borderRadius: '4px',
    border: '1px solid #5D4037',
  },
  ICE: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(165, 243, 252, 0.4) 50%, rgba(6, 182, 212, 0.3) 100%)',
    backdropFilter: 'blur(4px)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: 'inset 0 0 15px rgba(255,255,255,0.5), 4px 8px 15px rgba(0,0,0,0.15)',
    position: 'relative',
  },
  BRICK: {
    backgroundColor: '#991b1b',
    backgroundImage: `
      radial-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
      radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '6px 6px, 10px 10px',
    backgroundPosition: '0 0, 5px 5px',
    borderRadius: '2px',
    border: '1px solid #7f1d1d',
    boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.1), inset -2px -2px 5px rgba(0,0,0,0.4), 4px 8px 10px rgba(0,0,0,0.5)',
  },
  SPONGE: {
    backgroundColor: '#fbbf24',
    backgroundImage: `
      radial-gradient(rgba(180, 83, 9, 0.15) 15%, transparent 16%), 
      radial-gradient(rgba(180, 83, 9, 0.1) 15%, transparent 16%)
    `,
    backgroundSize: '12px 12px, 18px 18px',
    backgroundPosition: '0 0, 9px 9px',
    borderRadius: '16px',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05), 4px 6px 12px rgba(0,0,0,0.2)',
    border: '1px solid #f59e0b',
  }
};

const SOLID_CONFIG = {
  WOOD: {
    id: 'WOOD',
    name: 'Wood Block',
    description: 'Hard and strong. Great for building!',
    sound: 'Thud!',
    width: 'w-24',
    height: 'h-24'
  },
  ICE: {
    id: 'ICE',
    name: 'Ice Cube',
    description: 'Cold and slippery. Melts if hot!',
    sound: 'Clink!',
    width: 'w-20',
    height: 'h-20'
  },
  BRICK: {
    id: 'BRICK',
    name: 'Red Brick',
    description: 'Heavy and rough. Very sturdy.',
    sound: 'Thud!',
    width: 'w-28',
    height: 'h-16' // Brick shape
  },
  SPONGE: {
    id: 'SPONGE',
    name: 'Sponge',
    description: 'Soft and squishy, but still a solid!',
    sound: 'Squish!',
    width: 'w-24',
    height: 'h-16'
  }
};

// --- Extracted Component for Stability ---
const SolidBlock = ({ 
  type, 
  className = "", 
  style = {},
  animateDrop = false
}: { 
  type: SolidType, 
  className?: string, 
  style?: React.CSSProperties,
  animateDrop?: boolean 
}) => {
  const config = SOLID_CONFIG[type];
  
  // Animation classes
  let animClass = "";
  if (animateDrop) animClass = "animate-bounce-short"; 
  if (type === 'SPONGE') animClass += " active:scale-90 transition-transform duration-100 ease-in-out";
  if (type === 'ICE') animClass += " overflow-hidden";
  
  // Size override from config if not provided in className
  const widthClass = className.includes('w-') ? '' : config.width;
  const heightClass = className.includes('h-') ? '' : config.height;

  return (
    <div 
      className={`
        flex items-center justify-center relative shadow-xl flex-shrink-0 cursor-grab active:cursor-grabbing
        ${widthClass} ${heightClass} ${className} ${animClass}
      `}
      style={{ ...TEXTURES[type], ...style }}
    >
      {/* Ice Highlights */}
      {type === 'ICE' && (
        <>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/40 to-transparent pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-white/60 rounded-full blur-[2px] animate-pulse" />
          <div className="absolute bottom-2 left-2 w-full h-1/2 bg-gradient-to-t from-cyan-300/20 to-transparent pointer-events-none" />
        </>
      )}

      {/* Sponge Pores detail */}
      {type === 'SPONGE' && (
         <div className="absolute inset-0 opacity-20 bg-black mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, transparent 2px, black 3px)', backgroundSize: '8px 8px' }}></div>
      )}
      
      {/* Wood Texture Detail */}
      {type === 'WOOD' && (
          <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-black/10 mix-blend-multiply" />
      )}
    </div>
  );
};

export const SolidStation: React.FC = () => {
  const [tab, setTab] = useState<'SHAPE' | 'STACK'>('SHAPE');
  
  // --- SHAPE TEST STATE ---
  const [itemLocations, setItemLocations] = useState<Record<SolidType, LocationType>>({
    WOOD: 'SHELF',
    ICE: 'SHELF',
    BRICK: 'SHELF',
    SPONGE: 'SHELF'
  });
  const [heldItem, setHeldItem] = useState<SolidType | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showMicroscope, setShowMicroscope] = useState(false);

  // --- STACK TEST STATE ---
  // Store an array of types to allow mixing blocks
  const [towerStack, setTowerStack] = useState<SolidType[]>([]);
  const [selectedBlockType, setSelectedBlockType] = useState<SolidType>('WOOD');
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  // --- Handlers ---

  const handleDragStart = (e: React.DragEvent, type: SolidType) => {
    e.dataTransfer.setData('solidType', type);
    e.dataTransfer.effectAllowed = "move";
    setDragActive(true);
  };

  const handleDragEnd = () => {
    setDragActive(false);
  };

  // Generic drop handler for any location
  const handleDrop = (targetLocation: LocationType, e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('solidType') as SolidType;
    if (type) {
      moveItem(type, targetLocation);
    }
    setDragActive(false);
  };

  // Allow dropping on the background to reset to shelf (Snap Back)
  const handleBackgroundDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('solidType') as SolidType;
    if (type) {
      moveItem(type, 'SHELF'); // Snap back to shelf
    }
    setDragActive(false);
  };

  const handleTouchPickup = (type: SolidType) => {
    if (heldItem === type) {
        setHeldItem(null); // Deselect
        setDragActive(false);
    } else {
        setHeldItem(type);
        setDragActive(true);
    }
  };

  const handleContainerClick = (targetLocation: LocationType) => {
      if (heldItem) {
          moveItem(heldItem, targetLocation);
          setHeldItem(null);
          setDragActive(false);
      }
  };

  const moveItem = (type: SolidType, location: LocationType) => {
      setItemLocations(prev => ({
          ...prev,
          [type]: location
      }));
  };

  const handleResetShape = () => {
    setItemLocations({
        WOOD: 'SHELF',
        ICE: 'SHELF',
        BRICK: 'SHELF',
        SPONGE: 'SHELF'
    });
    setHeldItem(null);
    setDragActive(false);
  };

  // Stack Test Handlers
  const handleAddToTower = () => {
    if (towerStack.length < 6) {
      setTowerStack(prev => [...prev, selectedBlockType]);
      setAnimatingIndex(towerStack.length); // The new index is current length
      setTimeout(() => setAnimatingIndex(null), 500);
    }
  };

  const handleResetTower = () => {
      setTowerStack([]);
      setAnimatingIndex(null);
  };

  // Derived state for feedback
  const itemsInContainers = Object.values(itemLocations).filter(loc => loc !== 'SHELF').length;
  const allItemsPlaced = itemsInContainers === 4;

  return (
    <div className="flex flex-col items-center w-full h-full pb-12">
      
      {/* Global Styles for Animations */}
      <style>{`
        @keyframes bounce-short {
          0% { transform: translateY(-50px); opacity: 0; }
          40% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes particle-vibrate {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(1px, 1px); }
          50% { transform: translate(-1px, -1px); }
          75% { transform: translate(1px, -1px); }
        }
        .animate-particle-vibrate {
          animation: particle-vibrate 0.3s linear infinite;
        }
        @keyframes move-in-arc {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(100px, -30px) scale(0.9); }
          100% { transform: translate(140px, 30px) scale(1); }
        }
        .animate-move-in-arc {
          animation: move-in-arc 3s ease-in-out infinite;
        }
      `}</style>

      {/* Tab Nav */}
      <div className="flex gap-4 mb-8 bg-slate-800 p-2 rounded-full border border-slate-700">
        <button 
          onClick={() => setTab('SHAPE')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-colors ${tab === 'SHAPE' ? 'bg-kid-orange text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <Box size={20} /> 1. Shape Test
        </button>
        <button 
          onClick={() => setTab('STACK')}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-colors ${tab === 'STACK' ? 'bg-kid-orange text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <Layers size={20} /> 2. Tower Test
        </button>
      </div>

      {tab === 'SHAPE' ? (
        // --- SHAPE TEST ACTIVITY ---
        <div 
            className="flex flex-col items-center w-full max-w-4xl"
            onDragOver={(e) => e.preventDefault()} // Allow dragging everywhere
            onDrop={handleBackgroundDrop} // Background drop snaps to shelf
        >
           {/* Concept Card with Microscope */}
           <div className="bg-slate-800 border-l-4 border-kid-orange p-6 rounded-r-xl shadow-lg mb-8 max-w-2xl w-full relative overflow-hidden transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="bg-orange-900/50 p-3 rounded-full shrink-0">
                <Info className="text-kid-orange" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-kid-orange mb-1">Concept: Solids Keep Shape</h2>
                <p className="text-slate-300">
                  Solids have a definite shape. Even if you move them, they stay the same.
                  <br/><span className="text-sm text-slate-400 mt-2 block">Drag the items from the shelf into the bowl or box!</span>
                </p>
                
                {/* Visual Explanation Diagram */}
                <div className="mt-4 p-4 bg-slate-900/70 rounded-xl border border-slate-700">
                    <h4 className="text-sm font-bold text-center text-slate-400 mb-2">Watch! The block's shape never changes.</h4>
                    <svg viewBox="0 0 250 100" className="w-full h-auto">
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Arrow */}
                        <path d="M 70 50 L 120 50" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2">
                            <animate attributeName="stroke-dashoffset" from="6" to="0" dur="0.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M 115 45 L 125 50 L 115 55" fill="#64748b" />
                        
                        {/* Container */}
                        <path d="M 150 70 L 220 70 Q 185 100 150 70 Z" stroke="#94a3b8" strokeWidth="3" fill="rgba(148, 163, 184, 0.1)" />

                        {/* Animated Block */}
                        <rect x="25" y="40" width="30" height="30" rx="3" fill="#fb923c" stroke="#9a3412" strokeWidth="1.5" className="animate-move-in-arc" style={{ filter: 'url(#glow)' }} />
                    </svg>
                </div>

                <button 
                  onClick={() => setShowMicroscope(!showMicroscope)}
                  className="mt-4 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-kid-orange font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-slate-600"
                >
                  <Microscope size={18} />
                  {showMicroscope ? "Hide Microscope" : "Why? See Inside!"}
                </button>

                {/* Microscope View */}
                {showMicroscope && (
                  <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-6 animate-fadeIn">
                    <div className="relative w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden flex flex-wrap content-center justify-center p-3 shadow-inner shrink-0">
                      <div className="absolute inset-0 bg-kid-orange/5 pointer-events-none rounded-full z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                      {/* 3x3 Grid of particles */}
                      <div className="grid grid-cols-3 gap-1">
                        {Array.from({length: 9}).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-4 h-4 bg-kid-orange rounded-full shadow-sm animate-particle-vibrate"
                            style={{ animationDelay: `${i * 0.05}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-kid-orange font-bold text-lg mb-1">Packed Tight!</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Solid particles are <strong>packed closely together</strong>. They vibrate (shake) but cannot move away from each other. That's why solids hold their shape!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SHELF (SOURCE) */}
          <div 
            className="w-full max-w-3xl mb-12 relative p-4 bg-slate-800/50 rounded-2xl border-2 border-slate-700 shadow-inner flex justify-around items-end min-h-[140px] group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.stopPropagation(); handleDrop('SHELF', e); }} // Explicit shelf drop
            onClick={() => handleContainerClick('SHELF')}
          >
             <div className="absolute -top-4 left-4 bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-slate-600">
                 Material Shelf
             </div>
             
             {/* Render all 4 slots. If item is on shelf, show it. If not, show placeholder. */}
             {(Object.keys(SOLID_CONFIG) as SolidType[]).map((type) => {
                 const isOnShelf = itemLocations[type] === 'SHELF';
                 const isHeld = heldItem === type;
                 
                 return (
                    <div key={type} className="flex flex-col items-center justify-end h-32 w-24 relative group/item">
                        {isOnShelf && <Tooltip text="Solids have a definite shape. Drag me to a container!" />}
                        {isOnShelf ? (
                            <div 
                                draggable
                                onDragStart={(e) => handleDragStart(e, type)}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => { e.stopPropagation(); handleTouchPickup(type); }}
                                className={`
                                    transition-all duration-200 z-10
                                    ${isHeld ? 'scale-110 -translate-y-4' : 'hover:-translate-y-2'}
                                    ${dragActive && !isHeld ? 'opacity-50' : 'opacity-100'}
                                `}
                            >
                                <SolidBlock type={type} className={isHeld ? 'ring-4 ring-kid-orange ring-offset-2 ring-offset-slate-800' : ''} />
                            </div>
                        ) : (
                            // Placeholder Ghost
                            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-600/50 bg-slate-700/20 flex items-center justify-center">
                                <span className="text-2xl opacity-20 grayscale">{SOLID_CONFIG[type].name.charAt(0)}</span>
                            </div>
                        )}
                        <span className={`text-xs font-bold mt-2 ${isOnShelf ? 'text-slate-400' : 'text-slate-600'}`}>{SOLID_CONFIG[type].name}</span>
                    </div>
                 );
             })}
          </div>


          {/* CONTAINERS AREA */}
          <div className="flex flex-col md:flex-row w-full justify-center items-end gap-12 md:gap-24 mb-8 min-h-[250px]">
            
            {/* Arrow Hint */}
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-24 md:-translate-y-0 md:static flex flex-col items-center justify-center opacity-50 z-0">
                <ArrowDown className={`hidden md:block text-slate-500 mb-2 ${dragActive ? 'animate-bounce text-kid-orange opacity-100' : ''}`} size={32} strokeWidth={3} />
                {dragActive && <span className="text-kid-orange font-bold text-sm animate-pulse">DROP HERE</span>}
            </div>

            {/* Container: Glass Bowl */}
            <div 
              onDrop={(e) => { e.stopPropagation(); handleDrop('BOWL', e); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={(e) => { e.stopPropagation(); handleContainerClick('BOWL'); }}
              className={`flex flex-col items-center relative group cursor-pointer transition-transform duration-300 ${dragActive ? 'scale-105' : ''}`}
            >
              <Tooltip text="I'm a bowl! Solids go inside, but they don't change their shape to match mine." />
              <div className="relative w-56 h-40 flex items-end justify-center">
                 
                 {/* Bowl Back */}
                 <div className="absolute bottom-0 w-56 h-28 bg-slate-700/30 rounded-b-[7rem] border-4 border-slate-500/30 border-t-0 z-0 backdrop-blur-sm"></div>
                 
                 {/* Items in Bowl */}
                 <div className="z-10 absolute bottom-4 w-full h-24 flex items-end justify-center">
                     {(Object.keys(itemLocations) as SolidType[]).map((type, idx) => {
                         if (itemLocations[type] !== 'BOWL') return null;
                         const isHeld = heldItem === type;
                         const offset = (idx % 2 === 0 ? -1 : 1) * (idx * 10);
                         return (
                            <div 
                                key={type}
                                draggable
                                onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, type); }}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => { e.stopPropagation(); handleTouchPickup(type); }}
                                className={`absolute bottom-2 transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-110 hover:-translate-y-2 ${isHeld ? 'z-50 scale-110' : ''}`} 
                                style={{ transform: `translateX(${offset}px) rotate(${idx * 5}deg)`, zIndex: isHeld ? 50 : idx }}
                            >
                                <SolidBlock type={type} animateDrop={true} className={`w-16 h-16 shadow-lg ${isHeld ? 'ring-4 ring-kid-orange' : ''}`} />
                            </div>
                         )
                     })}
                 </div>

                 {/* Bowl Front */}
                 <div className="absolute bottom-0 w-56 h-28 bg-gradient-to-tr from-white/10 to-transparent rounded-b-[7rem] border-4 border-slate-400/50 border-t-0 z-20 backdrop-blur-[1px] pointer-events-none shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)]">
                    <div className="absolute bottom-4 right-8 w-12 h-6 bg-white/10 rounded-full blur-md transform -rotate-12"></div>
                 </div>
                 
                 {/* Drop Hint */}
                 {dragActive && (
                    <div className="absolute inset-0 bg-kid-orange/10 rounded-b-[7rem] animate-pulse z-0 border-2 border-dashed border-kid-orange/50"></div>
                 )}
              </div>
              <p className="text-slate-400 font-bold mt-2">Glass Bowl</p>
            </div>

            {/* Container: Cardboard Box */}
            <div 
              onDrop={(e) => { e.stopPropagation(); handleDrop('BOX', e); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={(e) => { e.stopPropagation(); handleContainerClick('BOX'); }}
              className={`flex flex-col items-center relative cursor-pointer transition-transform duration-300 group ${dragActive ? 'scale-105' : ''}`}
            >
              <Tooltip text="I'm a box! Solids can sit inside me, but they keep their own shape." />
              <div className="relative w-56 h-40 flex items-end justify-center">
                 
                 {/* Box Back */}
                 <div className="absolute bottom-0 w-48 h-24 bg-[#5d4037] border-4 border-[#3e2723] border-t-0 z-0 shadow-inner"></div>
                 <div className="absolute bottom-24 w-48 h-10 bg-[#4e342e] transform skew-x-12 origin-bottom-left z-0 opacity-80"></div>

                 {/* Items in Box */}
                 <div className="z-10 absolute bottom-4 w-full h-24 flex items-end justify-center">
                     {(Object.keys(itemLocations) as SolidType[]).map((type, idx) => {
                         if (itemLocations[type] !== 'BOX') return null;
                         const isHeld = heldItem === type;
                         const offset = (idx % 2 === 0 ? 1 : -1) * (idx * 12);
                         return (
                            <div 
                                key={type} 
                                draggable
                                onDragStart={(e) => { e.stopPropagation(); handleDragStart(e, type); }}
                                onDragEnd={handleDragEnd}
                                onClick={(e) => { e.stopPropagation(); handleTouchPickup(type); }}
                                className={`absolute bottom-2 transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-110 hover:-translate-y-2 ${isHeld ? 'z-50 scale-110' : ''}`}
                                style={{ transform: `translateX(${offset}px) rotate(${idx * -5}deg)`, zIndex: isHeld ? 50 : idx }}
                            >
                                <SolidBlock type={type} animateDrop={true} className={`w-16 h-16 shadow-lg ${isHeld ? 'ring-4 ring-kid-orange' : ''}`} />
                            </div>
                         )
                     })}
                 </div>

                 {/* Box Front */}
                 <div className="absolute bottom-0 w-48 h-12 bg-[#795548] border-4 border-[#5d4037] border-t-0 z-20 pointer-events-none flex items-end justify-center pb-1">
                    <span className="text-[#3e2723]/30 font-black text-xl rotate-12 mix-blend-multiply">BOX</span>
                 </div>
                 <div className="absolute bottom-[-10px] w-48 h-10 bg-[#6d4c41] transform -skew-x-12 origin-top-left z-20 shadow-xl"></div>
                 
                 {/* Drop Hint */}
                 {dragActive && (
                    <div className="absolute bottom-0 w-48 h-24 bg-kid-orange/10 animate-pulse z-30 border-2 border-dashed border-kid-orange/50"></div>
                 )}
              </div>
              <p className="text-slate-400 font-bold mt-4">Cardboard Box</p>
            </div>

          </div>

          <div className="flex gap-4">
             <button onClick={handleResetShape} className="flex items-center gap-2 bg-slate-700 text-slate-300 px-6 py-2 rounded-full hover:bg-slate-600 hover:text-white font-bold transition-all shadow-lg hover:shadow-xl active:scale-95">
               <RotateCcw size={18}/> Reset
             </button>
          </div>

          {/* Feedback Messages */}
          {itemsInContainers > 0 && (
            <div className={`mt-8 flex items-center gap-4 bg-slate-800/80 backdrop-blur border px-8 py-4 rounded-2xl animate-fadeIn shadow-lg transition-colors duration-500 ${allItemsPlaced ? 'border-green-500/50 bg-green-900/20' : 'border-kid-orange/30'}`}>
              <div className={`p-2 rounded-full text-slate-900 ${allItemsPlaced ? 'bg-green-500' : 'bg-kid-orange'}`}>
                  <Check size={24} strokeWidth={3} />
              </div>
              <div>
                  <h3 className={`text-xl font-bold ${allItemsPlaced ? 'text-green-400' : 'text-kid-orange'}`}>
                      {allItemsPlaced ? 'Excellent Job!' : 'Correct!'}
                  </h3>
                  <p className="text-slate-300">
                      {allItemsPlaced 
                        ? 'You placed all the solids! Notice how they kept their shape?' 
                        : 'The solid kept its shape perfectly inside the container.'}
                  </p>
              </div>
            </div>
          )}

        </div>
      ) : (
        // --- STACK TEST ACTIVITY ---
        <div className="flex flex-col items-center w-full max-w-4xl">
           <div className="bg-slate-800 border-l-4 border-kid-orange p-6 rounded-r-xl shadow-lg mb-8 max-w-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="bg-orange-900/50 p-3 rounded-full">
                <Info className="text-kid-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-kid-orange mb-1">Concept: Solids Build Up</h2>
                <p className="text-slate-300">
                  Because solids are hard and hold their shape, we can stack them to build towers!
                </p>
                  {/* Stacking Comparison Diagram */}
                  <div className="mt-4 p-4 bg-slate-900/70 rounded-xl border border-slate-700">
                      <svg viewBox="0 0 250 120" className="w-full h-auto">
                          {/* Divider */}
                          <line x1="125" y1="10" x2="125" y2="110" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />

                          {/* LEFT: Solids Stack */}
                          <g>
                              <rect x="40" y="70" width="50" height="20" rx="2" fill="#fb923c" stroke="#9a3412" strokeWidth="1.5" />
                              <rect x="40" y="48" width="50" height="20" rx="2" fill="#fb923c" stroke="#9a3412" strokeWidth="1.5" />
                              <rect x="40" y="26" width="50" height="20" rx="2" fill="#fb923c" stroke="#9a3412" strokeWidth="1.5" />
                              <text x="65" y="110" textAnchor="middle" fill="#f8fafc" className="text-[10px] font-bold">SOLIDS STACK</text>
                              {/* Checkmark */}
                              <circle cx="65" cy="15" r="8" fill="#166534" />
                              <path d="M 61 15 L 64 18 L 69 12" stroke="#4ade80" strokeWidth="2" fill="none" strokeLinecap="round" />
                          </g>

                          {/* RIGHT: Liquids Puddle */}
                          <g>
                              <path d="M 160 90 C 170 80, 210 80, 220 90 L 210 95 C 200 100, 180 100, 170 95 Z" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1.5" />
                              <text x="190" y="110" textAnchor="middle" fill="#f8fafc" className="text-[10px] font-bold">LIQUIDS CAN'T STACK</text>
                              {/* X Mark */}
                              <circle cx="190" cy="15" r="8" fill="#991b1b" />
                              <path d="M 186 11 L 194 19 M 194 11 L 186 19" stroke="#f87171" strokeWidth="2" fill="none" strokeLinecap="round" />
                          </g>
                      </svg>
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-end justify-center w-full">
              
              {/* Stack Controls / Picker */}
              <div className="flex flex-col gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 w-64 h-[400px]">
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">CHOOSE BLOCK:</h3>
                  <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                      {(Object.keys(SOLID_CONFIG) as SolidType[]).map(type => (
                          <button
                            key={type}
                            onClick={() => setSelectedBlockType(type)}
                            className={`
                              flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 group
                              ${selectedBlockType === type 
                                ? 'bg-slate-700/80 border-kid-orange ring-1 ring-kid-orange/50 shadow-md' 
                                : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-700/50'}
                            `}
                          >
                              <div className="w-10 h-10 rounded shadow-sm group-hover:scale-110 transition-transform" style={TEXTURES[type]}></div>
                              <span className={`font-bold ${selectedBlockType === type ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{SOLID_CONFIG[type].name}</span>
                          </button>
                      ))}
                  </div>
                  
                  <div className="w-full h-px bg-slate-700 my-2"></div>
                  
                  <button
                    onClick={handleAddToTower}
                    disabled={towerStack.length >= 6}
                    className={`
                        w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-lg
                        ${towerStack.length >= 6 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 text-slate-100 hover:bg-kid-orange hover:text-slate-900 active:scale-95 border-2 border-slate-500 hover:border-kid-orange'}
                    `}
                    >
                    <Layers size={24} /> Add Block
                 </button>
                 
                 <button onClick={handleResetTower} className="text-slate-500 hover:text-white text-xs font-bold flex items-center justify-center gap-2 py-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                     <RotateCcw size={14} /> Reset Tower
                 </button>
              </div>

              {/* The Tower */}
              <div className="relative group w-72 h-[400px] bg-slate-900 rounded-2xl border-4 border-slate-700 flex flex-col justify-end items-center pb-0 overflow-hidden shadow-2xl">
                <Tooltip text="Solids are hard and strong. We can stack them to make tall towers!" />
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

                {/* The Stack */}
                <div className="flex flex-col-reverse items-center relative z-10 w-full pb-8">
                    {towerStack.map((type, index) => (
                    <div 
                        key={index}
                        className="relative transition-all"
                        style={{ zIndex: towerStack.length - index }}
                    >
                        {/* The Block */}
                        <SolidBlock 
                            type={type} 
                            // Force standard dimensions for the tower so they stack neatly, regardless of their 'natural' shape
                            className="w-40 h-12 shadow-lg z-10 relative" 
                            animateDrop={index === towerStack.length - 1 && animatingIndex === (index + 1)}
                        />
                        {/* Shadow between blocks for depth */}
                        {index > 0 && <div className="absolute bottom-0 left-2 right-2 h-2 bg-black/40 blur-sm z-20"></div>}
                    </div>
                    ))}
                </div>

                {/* Floor */}
                <div className="absolute bottom-0 w-full h-8 bg-slate-700 border-t-4 border-slate-600 z-20 shadow-lg flex items-center justify-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Platform</span>
                </div>
              </div>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
             <span className={`w-2 h-2 rounded-full ${towerStack.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
             Tower Height: {towerStack.length} Units
          </div>

        </div>
      )}

    </div>
  );
};
