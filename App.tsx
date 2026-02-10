import React, { useState } from 'react';
import { IntroStation } from './components/IntroStation';
import { SolidStation } from './components/SolidStation';
import { LiquidStation } from './components/LiquidStation';
import { GasStation } from './components/GasStation';
import { MatterState } from './types';
import { Box, Droplets, Wind, Home, FlaskConical } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<MatterState>('INTRO');

  const renderContent = () => {
    switch (gameState) {
      case 'INTRO':
        return <IntroStation onComplete={() => setGameState('SOLID')} />;
      case 'SOLID':
        return <SolidStation />;
      case 'LIQUID':
        return <LiquidStation />;
      case 'GAS':
        return <GasStation />;
      default:
        return <IntroStation onComplete={() => setGameState('SOLID')} />;
    }
  };

  return (
    <div className="min-h-screen bg-lab-bg font-sans selection:bg-kid-blue/30 text-slate-100 pb-32">
      {/* Top Logo Area */}
      <div className="pt-8 pb-4 flex justify-center animate-fadeIn">
         <div className="flex items-center gap-3 bg-slate-800/40 px-6 py-2 rounded-full border border-slate-700/30 backdrop-blur-sm shadow-sm">
           <div className="bg-kid-blue p-1.5 rounded-lg text-slate-900 shadow-[0_0_10px_rgba(56,189,248,0.5)]">
             <FlaskConical size={20} />
           </div>
           <h1 className="text-xl font-bold bg-gradient-to-r from-kid-blue to-kid-green bg-clip-text text-transparent tracking-wide">
             Matter Master Lab
           </h1>
         </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto flex justify-center px-4">
        {renderContent()}
      </main>

      {/* Floating Bottom Navigation Bar (Glassmorphism) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="flex justify-between items-center px-6 py-3 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
          
          <NavButton 
            active={gameState === 'INTRO'} 
            onClick={() => setGameState('INTRO')}
            icon={Home} 
            label="Home" 
            activeColor="bg-kid-green"
            textColor="text-green-400"
          />
          
          <NavButton 
            active={gameState === 'SOLID'} 
            onClick={() => setGameState('SOLID')}
            icon={Box} 
            label="Solid" 
            activeColor="bg-kid-orange"
            textColor="text-orange-400"
          />

          <NavButton 
            active={gameState === 'LIQUID'} 
            onClick={() => setGameState('LIQUID')}
            icon={Droplets} 
            label="Liquid" 
            activeColor="bg-kid-blue"
            textColor="text-cyan-400"
          />

          <NavButton 
            active={gameState === 'GAS'} 
            onClick={() => setGameState('GAS')}
            icon={Wind} 
            label="Gas" 
            activeColor="bg-purple-500"
            textColor="text-purple-400"
          />

        </div>
      </nav>
    </div>
  );
}

// Nav Button Component
interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  activeColor: string;
  textColor: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label, activeColor, textColor }) => (
  <button
    onClick={onClick}
    className={`
      relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ease-out group
      ${active ? '-translate-y-4 scale-110' : 'hover:bg-white/5'}
    `}
  >
    {/* Glow Effect behind active icon */}
    <span className={`
      absolute inset-0 rounded-full opacity-40 blur-xl transition-all duration-500
      ${active ? activeColor : 'opacity-0 scale-50'}
    `}></span>
    
    {/* Icon Container */}
    <div className={`
      relative z-10 p-3 rounded-2xl transition-all duration-300 border
      ${active 
        ? `${activeColor} border-white/20 text-slate-900 shadow-lg rotate-3` 
        : 'bg-transparent border-transparent text-slate-400 group-hover:text-white'}
    `}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    </div>
    
    {/* Label */}
    <span className={`
      absolute -bottom-6 text-[10px] font-bold tracking-wide transition-all duration-300
      ${active ? `${textColor} opacity-100 translate-y-0` : 'text-slate-500 opacity-0 -translate-y-2'}
    `}>
      {label}
    </span>
    
    {/* Active Dot indicator below */}
    {active && (
       <div className={`absolute -bottom-2 w-1 h-1 rounded-full ${activeColor} animate-pulse`} />
    )}
  </button>
);
