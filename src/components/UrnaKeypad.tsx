import React from 'react';
import { motion } from 'framer-motion';

interface UrnaKeypadProps {
  onNumberClick: (num: string) => void;
  onWhiteClick: () => void;
  onCorrigeClick: () => void;
  onConfirmaClick: () => void;
  disabled?: boolean;
}

export const UrnaKeypad: React.FC<UrnaKeypadProps> = ({
  onNumberClick,
  onWhiteClick,
  onCorrigeClick,
  onConfirmaClick,
  disabled = false,
}) => {
  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="bg-[#181d28] p-3.5 sm:p-5 md:p-6 rounded-2xl border border-slate-700/60 shadow-2xl flex flex-col justify-between select-none relative overflow-hidden">
      {/* Glossy Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5 mb-3.5 sm:mb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-500/50" />
          <span className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-wider text-slate-200 uppercase font-sans">
            SIMULADOR DE URNA
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-widest bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          NÃO OFICIAL
        </span>
      </div>

      {/* Numeric Buttons Grid 1-9 */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 max-w-[300px] mx-auto w-full">
        {numberButtons.slice(0, 9).map((num) => (
          <motion.button
            key={num}
            type="button"
            disabled={disabled}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.93, y: 3 }}
            onClick={() => onNumberClick(num)}
            className="h-12 sm:h-14 md:h-16 bg-gradient-to-b from-[#2e374c] via-[#21293a] to-[#181e2b] text-white text-xl sm:text-2xl md:text-3xl font-black font-mono rounded-xl border-b-4 border-[#0e121a] hover:brightness-125 transition-all shadow-lg shadow-black/40 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {num}
          </motion.button>
        ))}
      </div>

      {/* Zero Key Centered */}
      <div className="flex justify-center mt-2.5 sm:mt-3 max-w-[300px] mx-auto w-full">
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.93, y: 3 }}
          onClick={() => onNumberClick('0')}
          className="w-1/3 h-12 sm:h-14 md:h-16 bg-gradient-to-b from-[#2e374c] via-[#21293a] to-[#181e2b] text-white text-xl sm:text-2xl md:text-3xl font-black font-mono rounded-xl border-b-4 border-[#0e121a] hover:brightness-125 transition-all shadow-lg shadow-black/40 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          0
        </motion.button>
      </div>

      {/* Action Buttons Row: BRANCO, CORRIGE, CONFIRMA */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:gap-3.5 mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-slate-700/60 items-end">
        {/* BRANCO Button */}
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.93, y: 3 }}
          onClick={onWhiteClick}
          className="h-12 sm:h-14 md:h-16 bg-gradient-to-b from-[#ffffff] via-[#e2e8f0] to-[#cbd5e1] text-slate-950 font-black text-[10px] sm:text-xs md:text-sm tracking-wider uppercase rounded-xl border-b-4 border-[#94a3b8] hover:bg-white transition-all shadow-lg shadow-black/40 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          BRANCO
        </motion.button>

        {/* CORRIGE Button */}
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.93, y: 3 }}
          onClick={onCorrigeClick}
          className="h-12 sm:h-14 md:h-16 bg-gradient-to-b from-[#fb923c] via-[#ea580c] to-[#c2410c] text-white font-black text-[10px] sm:text-xs md:text-sm tracking-wider uppercase rounded-xl border-b-4 border-[#7c2d12] hover:brightness-110 transition-all shadow-lg shadow-orange-950/50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CORRIGE
        </motion.button>

        {/* CONFIRMA Button */}
        <motion.button
          type="button"
          disabled={disabled}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.93, y: 3 }}
          onClick={onConfirmaClick}
          className="h-14 sm:h-16 md:h-20 bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] text-white font-black text-[10px] sm:text-xs md:text-sm tracking-wider uppercase rounded-xl border-b-4 border-[#064e3b] hover:brightness-110 transition-all shadow-xl shadow-emerald-950/60 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed -mt-2 sm:-mt-3"
        >
          CONFIRMA
        </motion.button>
      </div>
    </div>
  );
};
