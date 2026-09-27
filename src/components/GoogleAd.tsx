import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdProps {
  slot?: string;
  client?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  slot = '1353374377',
  client = 'ca-pub-4314567878531382',
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocalhost(isLocal);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense push error:', e);
      }
    }
  }, []);

  return (
    <div className={`my-6 text-center overflow-hidden min-h-[90px] w-full flex flex-col items-center justify-center ${className}`}>
      {/* Real AdSense Ins Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />

      {/* Visual Placeholder for Localhost / Preview Mode */}
      {isLocalhost && (
        <div className="w-full max-w-4xl py-4 px-6 bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs my-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-200 block">Google AdSense • Espaço do Anúncio</span>
              <span className="text-[11px] text-slate-500">
                O Google AdSense bloqueia anúncios em <code className="text-amber-400 font-mono">localhost</code>. Em produção ({client}), os anúncios reais aparecerão aqui.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-700 shrink-0">
            SLOT: {slot}
          </span>
        </div>
      )}
    </div>
  );
};
