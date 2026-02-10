import React, { useState } from 'react';
import { INTRO_ITEMS } from '../constants';
import { MatterItem } from '../types';
import { Info } from 'lucide-react';

export const IntroStation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [items, setItems] = useState(INTRO_ITEMS);
  const [naturalBin, setNaturalBin] = useState<MatterItem[]>([]);
  const [manMadeBin, setManMadeBin] = useState<MatterItem[]>([]);
  const [feedback, setFeedback] = useState("Drag items to the correct basket!");

  const handleDragStart = (e: React.DragEvent, item: MatterItem) => {
    e.dataTransfer.setData('itemId', item.id);
  };

  const handleDrop = (e: React.DragEvent, type: 'NATURAL' | 'MAN_MADE') => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const item = items.find((i) => i.id === itemId);

    if (item) {
      if (item.type === type) {
        // Correct
        setItems(items.filter((i) => i.id !== itemId));
        if (type === 'NATURAL') setNaturalBin([...naturalBin, item]);
        else setManMadeBin([...manMadeBin, item]);
        setFeedback(`Yay! That is ${type === 'NATURAL' ? 'Natural' : 'Man-made'}!`);
      } else {
        // Incorrect
        setFeedback("Oops! Try the other basket.");
      }
    }
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  if (items.length === 0 && feedback !== "You did it! Let's explore States of Matter!") {
    setFeedback("You did it! Let's explore States of Matter!");
    setTimeout(onComplete, 2000);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 animate-fadeIn">
      
       {/* Concept Card */}
       <div className="bg-slate-800 border-l-4 border-kid-green p-6 rounded-r-xl shadow-lg mb-8 max-w-2xl w-full">
        <div className="flex items-start gap-4">
          <div className="bg-green-900/50 p-3 rounded-full">
            <Info className="text-kid-green" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-kid-green mb-1">Welcome Scientist!</h2>
            <p className="text-slate-300">
              Before we study matter, we need to sort things.
              <br/><strong>Natural</strong> things come from nature. <strong>Man-Made</strong> things are built by humans.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xl font-bold text-slate-900 mb-8 bg-kid-yellow px-6 py-2 rounded-full shadow-[0_0_20px_rgba(253,224,71,0.5)] animate-pulse">{feedback}</p>

      {/* Items Pool */}
      <div className="flex gap-4 mb-12 min-h-[140px]">
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="text-6xl cursor-grab hover:scale-110 transition-transform p-6 bg-slate-700 rounded-2xl shadow-xl border-2 border-slate-600 flex flex-col items-center w-32"
          >
            <div className="drop-shadow-lg">{item.image}</div>
            <p className="text-sm text-center font-bold text-slate-300 mt-2">{item.name}</p>
          </div>
        ))}
      </div>

      {/* Bins */}
      <div className="flex flex-col md:flex-row w-full justify-around gap-8">
        {/* Natural Bin */}
        <div
          onDrop={(e) => handleDrop(e, 'NATURAL')}
          onDragOver={allowDrop}
          className="flex-1 h-64 border-4 border-dashed border-green-500/50 rounded-3xl bg-slate-800/50 flex flex-col items-center justify-end pb-4 relative overflow-hidden transition-colors hover:bg-slate-800"
        >
          <span className="absolute top-4 text-2xl font-bold text-kid-green bg-green-900/30 px-4 py-1 rounded-full">🌲 Natural</span>
          <div className="flex flex-wrap gap-2 justify-center z-10 mb-4">
            {naturalBin.map((i) => <span key={i.id} className="text-5xl animate-bounce">{i.image}</span>)}
          </div>
          <div className="w-full h-2 bg-green-500/30 absolute bottom-0"></div>
        </div>

        {/* Man Made Bin */}
        <div
          onDrop={(e) => handleDrop(e, 'MAN_MADE')}
          onDragOver={allowDrop}
          className="flex-1 h-64 border-4 border-dashed border-purple-500/50 rounded-3xl bg-slate-800/50 flex flex-col items-center justify-end pb-4 relative overflow-hidden transition-colors hover:bg-slate-800"
        >
          <span className="absolute top-4 text-2xl font-bold text-purple-400 bg-purple-900/30 px-4 py-1 rounded-full">🔨 Man-Made</span>
          <div className="flex flex-wrap gap-2 justify-center z-10 mb-4">
            {manMadeBin.map((i) => <span key={i.id} className="text-5xl animate-bounce">{i.image}</span>)}
          </div>
          <div className="w-full h-2 bg-purple-500/30 absolute bottom-0"></div>
        </div>
      </div>
    </div>
  );
};