import React, { useState, useEffect } from 'react';
import { Wind, Info, Check, RotateCcw, Flame, Snowflake, Microscope, ArrowUp, ArrowDown, Users, User } from 'lucide-react';

type GasType = 'AIR' | 'HELIUM' | 'STEAM';

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

// --- Reusable Tooltip Component ---
const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute top-16 left-1/2 -translate-x-1/2 hidden group-hover:block w-64 bg-slate-900/95 text-white text-xs p-3 rounded-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 text-center animate-fadeIn backdrop-blur-sm pointer-events-none">
    {text}
    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-t border-l border-white/10 rotate-45"></div>
  </div>
);

const GAS_CONFIG = {
  AIR: {
    id: 'AIR',
    name: 'Air',
    emoji: '💨',
    description: 'Air is a mix of gases. It has weight, so it doesn\'t float away on its own.',
    weightFact: 'Air is heavier than Helium. That is why an air balloon does not float up!',
    balloonClass: 'bg-blue-500',
    balloonBehavior: 'translate-y-2', // Hangs down (heavy)
    particleClass: 'bg-slate-400 shadow-[0_0_5px_rgba(148,163,184,0.8)]',
    baseSpeed: 6,
    animationName: 'chaotic-move-air',
    sourceType: 'INCENSE',
    actionLabel: 'Light Incense',
    fillLabel: 'Pump Air'
  },
  HELIUM: {
    id: 'HELIUM',
    name: 'Helium',
    emoji: '🎈',
    description: 'Helium is a very light gas. It loves to go up!',
    weightFact: 'Helium is lighter than Air! It floats to the top because air pushes it up.',
    balloonClass: 'bg-pink-500',
    balloonBehavior: '-translate-y-4 animate-float', // Pulls up (light)
    particleClass: 'bg-pink-300 shadow-[0_0_5px_rgba(249,168,212,0.8)]',
    baseSpeed: 3,
    animationName: 'chaotic-move-helium',
    sourceType: 'TANK',
    actionLabel: 'Open Valve',
    fillLabel: 'Fill Helium'
  },
  STEAM: {
    id: 'STEAM',
    name: 'Steam',
    emoji: '♨️',
    description: 'Steam is hot water gas. Hot gas is lighter than cold air.',
    weightFact: 'Heat makes gas expand and get lighter. That is why steam rises!',
    balloonClass: 'bg-gray-300',
    balloonBehavior: '-translate-y-1 animate-pulse', // Rises slightly
    particleClass: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]',
    baseSpeed: 10,
    animationName: 'chaotic-move-steam',
    sourceType: 'KETTLE',
    actionLabel: 'Boil Water',
    fillLabel: 'Pump Steam'
  }
};

export const GasStation: React.FC = () => {
  const [selectedGas, setSelectedGas] = useState<GasType>('AIR');
  const [balloonSize, setBalloonSize] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isFlowing, setIsFlowing] = useState(false);
  const [showObservation, setShowObservation] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [particleCount, setParticleCount] = useState(60);
  const [showMicroscope, setShowMicroscope] = useState(false);

  const currentGas = GAS_CONFIG[selectedGas];

  // Reset state when gas changes
  useEffect(() => {
    setBalloonSize(1);
    setParticles([]);
    setIsFlowing(false);
    setShowObservation(false);
    setTemperature(1);
    setParticleCount(60);
  }, [selectedGas]);

  const handlePump = () => {
    setBalloonSize(prev => Math.min(prev + 0.5, 5));
  };

  const handleReleaseGas = () => {
    setIsFlowing(true);
    setShowObservation(false);
    
    // 1. Initialize particles at the source (bottom center)
    const count = particleCount;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 50, // Start center
      top: 90,  // Start bottom
      duration: currentGas.baseSpeed + (Math.random() * 2 - 1), 
      delay: Math.random() * 0.5
    }));
    
    setParticles(newParticles);

    // 2. Trigger expansion based on Gas Type (Simulating Density/Weight)
    setTimeout(() => {
       const spreadParticles = newParticles.map(p => {
         let targetTop = 0;
         
         if (selectedGas === 'HELIUM') {
            // Helium rises to the ceiling (0% - 30%)
            targetTop = Math.random() * 30; 
         } else if (selectedGas === 'STEAM') {
            // Steam rises but spreads (0% - 60%)
            targetTop = Math.random() * 60;
         } else {
            // Air fills the room evenly/sinks (10% - 90%)
            targetTop = Math.random() * 80 + 10;
         }

         return {
           ...p,
           left: Math.random() * 90 + 5, 
           top: targetTop 
         };
       });
       setParticles(spreadParticles);
       
       setTimeout(() => setShowObservation(true), 2000);
    }, 100);
  };

  const renderSource = () => {
    switch (currentGas.sourceType) {
        case 'INCENSE':
            return (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <div className="w-1.5 h-1.5 bg-red-500 animate-pulse rounded-full shadow-[0_0_10px_red] mb-0.5 relative z-20"></div>
                    <div className="w-1 h-12 bg-amber-800 rounded-t-sm relative z-10"></div>
                </div>
            );
        case 'TANK':
            return (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <div className="w-4 h-4 bg-gray-400 rounded-t-md relative top-1"></div>
                    <div className="w-16 h-20 bg-pink-700 rounded-t-3xl border-2 border-pink-900 shadow-inner flex items-center justify-center">
                         <span className="text-pink-200 font-bold text-xs opacity-50">He</span>
                    </div>
                </div>
            );
        case 'KETTLE':
            return (
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                    <div className="absolute -left-8 bottom-4 w-8 h-8 border-4 border-slate-300 rounded-tl-xl border-r-0 border-b-0 transform -rotate-12"></div>
                    <div className="absolute -right-6 bottom-6 w-10 h-10 border-4 border-slate-700 rounded-full border-l-0 border-b-0"></div>
                    <div className="w-20 h-16 bg-slate-200 rounded-t-full border-b-4 border-slate-300 shadow-md relative z-10"></div>
                </div>
            );
        default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-4 overflow-hidden animate-fadeIn">
      
       {/* Concept Card with Microscope */}
       <div className="bg-slate-800 border-l-4 border-purple-500 p-6 rounded-r-xl shadow-lg mb-8 max-w-2xl w-full z-20">
        <div className="flex items-start gap-4">
          <div className="bg-purple-900/50 p-3 rounded-full shrink-0">
            <Info className="text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-purple-400 mb-1">Concept: Gases Fill Space</h2>
            <p className="text-slate-300">
              A <strong>Gas</strong> is made of particles that move freely. They spread out to fill <em>all</em> the space in the container.
            </p>

            <button 
                onClick={() => setShowMicroscope(!showMicroscope)}
                className="mt-4 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-purple-400 font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-slate-600"
            >
                <Microscope size={18} />
                {showMicroscope ? "Hide Microscope" : "Why? See Inside!"}
            </button>

            {/* Microscope View */}
            {showMicroscope && (
                <div className="mt-4 bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-6 animate-fadeIn">
                <div className="relative w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden flex flex-wrap content-center justify-center p-3 shadow-inner shrink-0">
                    <div className="absolute inset-0 bg-purple-500/10 pointer-events-none rounded-full z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
                    <div className="relative w-full h-full">
                        {Array.from({length: 5}).map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute w-3 h-3 bg-purple-400 rounded-full shadow-sm"
                                style={{
                                    left: '40%',
                                    top: '40%',
                                    animationName: 'chaotic-move-air',
                                    animationDuration: `${1 + Math.random()}s`,
                                    animationDelay: `${Math.random()}s`,
                                    animationTimingFunction: 'ease-in-out',
                                    animationIterationCount: 'infinite',
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="text-purple-400 font-bold text-lg mb-1">Moving Fast!</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        Gas particles are <strong>far apart</strong> and have lots of energy. They zoom around and bounce off things. That's why gases expand to fill any room!
                    </p>
                </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Gas Selector */}
      <div className="flex gap-4 mb-4 bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50">
        <span className="text-slate-400 font-bold self-center mr-2">Choose Gas:</span>
        {(Object.keys(GAS_CONFIG) as GasType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedGas(type)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105
              ${selectedGas === type ? 'bg-purple-600 text-white ring-4 ring-purple-500/30 scale-105' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}
            `}
          >
            <span className="text-xl">{GAS_CONFIG[type].emoji}</span>
            {GAS_CONFIG[type].name}
            {selectedGas === type && <Check size={16} />}
          </button>
        ))}
      </div>

      {/* Gas Facts Panel */}
       <div className="mb-8 w-full max-w-2xl bg-slate-800/80 p-4 rounded-xl border border-slate-600/50 flex items-start gap-4 transition-all">
          <div className="p-3 bg-slate-900 rounded-lg">
             {selectedGas === 'HELIUM' ? <ArrowUp className="text-pink-400" size={24} /> : 
              selectedGas === 'STEAM' ? <ArrowUp className="text-slate-200" size={24} /> :
              <ArrowDown className="text-blue-400" size={24} />}
          </div>
          <div>
              <h4 className="text-lg font-bold text-white mb-1">
                Why {selectedGas === 'AIR' ? 'is Air heavy?' : selectedGas === 'HELIUM' ? 'does Helium float?' : 'does Steam rise?'}
              </h4>
              <p className="text-slate-300 text-sm">{currentGas.weightFact}</p>
          </div>
       </div>

      <div className="flex flex-wrap w-full justify-center gap-12">
        {/* Balloon Activity */}
        <div className="flex flex-col items-center bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 w-80 relative overflow-hidden group">
          <Tooltip text="Gas doesn't have a shape. It pushes out to fill the whole balloon!" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <h3 className="text-xl font-bold text-white mb-4">Activity 1: Fill a Balloon</h3>
          <div className="h-64 flex items-center justify-center relative w-full border-b border-slate-700/50 mb-4 bg-slate-900/30 rounded-xl overflow-hidden">
            {/* The Balloon */}
            <div 
              className={`
                 ${currentGas.balloonClass} rounded-full transition-all duration-1000 ease-in-out shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2)] 
                 flex items-center justify-center text-white font-bold relative z-10
                 ${currentGas.balloonBehavior}
              `}
              style={{ 
                width: `${balloonSize * 30}px`, 
                height: `${balloonSize * 36}px`,
                maxWidth: '220px',
                maxHeight: '260px',
                transformOrigin: 'bottom center'
              }}
            >
              <span className="opacity-80 drop-shadow-md text-sm">{currentGas.name}</span>
              {/* Shine effect */}
              <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-white/20 rounded-full blur-sm"></div>
              
              {/* String - Changes based on gas (Taut if floating up, loose if hanging) */}
              <div 
                  className={`absolute -bottom-12 w-0.5 h-12 bg-slate-400/50 transition-transform origin-top duration-500
                  ${selectedGas === 'HELIUM' ? 'scale-y-100' : 'scale-y-75 rotate-3'}
                  `}
               ></div>
            </div>
            
            {/* Pump Nozzle (Visual only) */}
            <div className="absolute bottom-0 w-4 h-8 bg-slate-600 rounded-t-lg z-0"></div>
          </div>
          
          <div className="flex gap-2">
             <button
                onClick={() => setBalloonSize(1)}
                className="p-3 rounded-full bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600"
                title="Reset Balloon"
             >
                 <RotateCcw size={20} />
             </button>
             <button
                onClick={handlePump}
                className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-purple-500 hover:scale-105 transition-all flex items-center gap-2"
            >
                <Wind size={20} /> {currentGas.fillLabel}
            </button>
          </div>
        </div>

        {/* Room/Particles Activity */}
        <div className="flex flex-col items-center bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 w-96 relative overflow-visible group">
          <Tooltip text="Gas particles move fast and fly everywhere to fill all the space in the room!" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-500 to-slate-300"></div>
          <h3 className="text-xl font-bold text-white mb-4">Activity 2: Fill a Room</h3>
          
          {/* The Room Container */}
          <div className="relative w-full h-64 border-8 border-slate-600 bg-slate-900 overflow-hidden rounded-lg shadow-inner group">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

             {/* Dynamic Source (Kettle, Tank, Stick) */}
             {renderSource()}

             {/* Particles */}
             {particles.map((p) => (
               <div 
                  key={p.id}
                  className={`absolute rounded-full mix-blend-screen ${currentGas.particleClass}`}
                  style={{
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                    width: '12px',
                    height: '12px',
                    opacity: 0.8,
                    // Use CSS transition for the initial "spread" from source to random pos
                    transition: 'left 2s ease-out, top 2s ease-out',
                    // Use CSS animation for the continuous "wiggling"
                    // Adjust duration based on temperature: Higher temp = faster speed = lower duration
                    animationName: currentGas.animationName,
                    animationDuration: `${p.duration / temperature}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${p.delay}s`
                  }}
               ></div>
             ))}

             {/* Observation Label */}
             {showObservation && (
                <div className="absolute top-4 w-full text-center text-slate-100 font-bold opacity-0 animate-fadeIn bg-black/40 py-1 backdrop-blur-sm z-30 flex flex-col items-center">
                  <span>
                      {selectedGas === 'HELIUM' ? 'The Helium floats to the top!' : 
                       selectedGas === 'AIR' ? 'Air fills the room evenly.' : 
                       'The hot Steam rises up!'}
                  </span>
                </div>
             )}
          </div>
          
          {/* Controls */}
          <div className="flex flex-col gap-4 mt-6 w-full">
            {/* Density Slider */}
            <div className={`flex flex-col gap-2 bg-slate-700/40 p-3 rounded-xl border border-slate-600 transition-opacity ${isFlowing ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Density</span>
                    <span>{particleCount < 40 ? 'Low' : particleCount > 80 ? 'High' : 'Medium'} ({particleCount} particles)</span>
                </div>
                <div className="flex items-center gap-3">
                    <User className="text-slate-400" size={18} />
                    <input 
                        type="range" 
                        min="20" 
                        max="100" 
                        step="10" 
                        value={particleCount}
                        onChange={(e) => setParticleCount(parseInt(e.target.value, 10))}
                        disabled={isFlowing}
                        className="flex-1 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer accent-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Users className="text-slate-400" size={18} />
                </div>
            </div>

            {/* Temperature Slider */}
            {isFlowing && (
                <div className="flex flex-col gap-2 bg-slate-700/40 p-3 rounded-xl border border-slate-600 animate-fadeIn">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                         <span>Temperature</span>
                         <span>{temperature < 1 ? 'Cold' : temperature > 1.5 ? 'Hot' : 'Normal'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Snowflake className="text-cyan-300" size={18} />
                        <input 
                            type="range" 
                            min="0.5" 
                            max="3.0" 
                            step="0.5" 
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <Flame className="text-orange-500" size={18} />
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                 <button
                    onClick={() => { setIsFlowing(false); setParticles([]); setShowObservation(false); setTemperature(1); setParticleCount(60); }}
                    className="p-3 rounded-full bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600"
                    title="Clear Room"
                 >
                     <RotateCcw size={20} />
                 </button>
                <button
                    onClick={handleReleaseGas}
                    disabled={isFlowing}
                    className={`flex-1 px-6 py-3 rounded-full font-bold shadow-lg transition-all border border-slate-500 ${isFlowing ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-slate-500 text-white hover:bg-slate-400 hover:scale-105'}`}
                >
                    {currentGas.actionLabel}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};