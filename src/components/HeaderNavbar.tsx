import React from 'react';
import { motion } from 'framer-motion';
import { ViewTab } from '../types';
import { Volume2, VolumeX, BarChart2, Users, Monitor, ShieldCheck, Vote } from 'lucide-react';

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
    { id: 'SIMULATOR', label: 'Urna Eletrônica', icon: Vote },
    { id: 'CANDIDATES', label: 'Candidatos', icon: Users },
    { id: 'RESULTS', label: 'Apuração', icon: BarChart2, badge: totalVotesCount },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-700 p-0.5 shadow-lg shadow-emerald-950/60">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
              🗳️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black text-white tracking-tight">
                Simulador de Urna Eletrônica
              </h1>
              <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                NÃO OFICIAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Simulação demonstrativa (Sem vínculo com a Justiça Eleitoral)</p>
          </div>
        </div>

        {/* Animated Tabs (animate-ui style layout) */}
        <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold relative">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-colors z-10 ${
                  isActive ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-emerald-950' : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mute & Sound Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onToggleMute}
            className={`p-2.5 rounded-xl border transition-all ${
              isMuted
                ? 'bg-red-950/40 text-red-400 border-red-800/40'
                : 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700 shadow-sm'
            }`}
            title={isMuted ? 'Ativar som da Urna (Pilili)' : 'Silenciar som'}
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </motion.button>
        </div>

      </div>
    </header>
  );
};
