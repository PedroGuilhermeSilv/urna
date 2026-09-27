import React from 'react';
import { motion } from 'framer-motion';
import { ViewTab } from '../types';
import { Volume2, VolumeX, BarChart2, Users, Vote } from 'lucide-react';

interface HeaderNavbarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  totalVotesCount: number;
}

interface TabItem {
  id: ViewTab;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  onToggleMute,
  totalVotesCount,
}) => {
  const tabs: TabItem[] = [
    { id: 'SIMULATOR', label: 'Urna Eletrônica', shortLabel: 'Urna', icon: Vote },
    { id: 'CANDIDATES', label: 'Candidatos', shortLabel: 'Fotos', icon: Users },
    { id: 'RESULTS', label: 'Apuração', shortLabel: 'Placar', icon: BarChart2, badge: totalVotesCount },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-700 p-0.5 shadow-lg shadow-emerald-950/60 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-base sm:text-xl">
              🗳️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight">
                Simulador de Urna
              </h1>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded-full">
                NÃO OFICIAL
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">
              Simulação demonstrativa (Sem vínculo com a Justiça Eleitoral)
            </p>
          </div>
        </div>

        {/* Animated Mobile-Responsive Navigation Tabs */}
        <div className="flex items-center bg-slate-950/90 p-1 rounded-xl sm:rounded-2xl border border-slate-800 text-[11px] sm:text-xs font-semibold overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 transition-colors z-10 shrink-0 ${
                  isActive ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg sm:rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel || tab.label}</span>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[9px] sm:text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full ml-0.5 ${
                    isActive ? 'bg-white text-emerald-950' : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sound Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onToggleMute}
            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all ${
              isMuted
                ? 'bg-red-950/40 text-red-400 border-red-800/40'
                : 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700 shadow-sm'
            }`}
            title={isMuted ? 'Ativar som da Urna' : 'Silenciar som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
        </div>

      </div>
    </header>
  );
};
