import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV16Props = {
  cta: string; // EXACT: Get Government Contracts Free
  trialLine: string;
  subline: string;
};

export const StillFlyerV16: React.FC<StillFlyerV16Props> = (p) => {
  // New recipe: dark-neon base + left vertical CTA banner + dark-mode UI card + contractor hero.
  return (
    <AbsoluteFill style={{background: '#05070F', fontFamily: 'ui-sans-serif, system-ui, -apple-system'}}>
      <Img src={staticFile('assets/maxcontrax/bg_darkneon_v1.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />

      {/* Soft vignette */}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.10), rgba(0,0,0,0.55) 70%)'}} />

      {/* Left vertical banner */}
      <div style={{position: 'absolute', left: 40, top: 40, bottom: 40, width: 420, borderRadius: 44, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', boxShadow: '0 44px 160px rgba(0,0,0,0.55)'}}>
        <div style={{position: 'absolute', left: 26, top: 26, display: 'flex', alignItems: 'center', gap: 14}}>
          <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{height: 96, width: 96, borderRadius: 28, boxShadow: '0 20px 80px rgba(0,0,0,0.55)'}} />
          <div>
            <div style={{fontSize: 32, fontWeight: 950, letterSpacing: -0.6, color: '#fff'}}>MaxContrax</div>
            <div style={{marginTop: 4, fontSize: 16, fontWeight: 900, color: 'rgba(255,255,255,0.82)'}}>Contract Alerts</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 26, right: 26, top: 170}}>
          <div style={{fontSize: 64, fontWeight: 950, letterSpacing: -1.2, lineHeight: 0.98, color: '#fff', textShadow: '0 26px 120px rgba(0,0,0,0.70)'}}>
            {p.cta}
          </div>
          <div style={{marginTop: 10, fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,0.78)'}}>{p.trialLine}</div>
          <div style={{marginTop: 12, fontSize: 20, fontWeight: 900, color: 'rgba(255,255,255,0.88)', lineHeight: 1.15}}>{p.subline}</div>
        </div>

        <div style={{position: 'absolute', left: 26, right: 26, bottom: 26, display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.70)', fontSize: 14, fontWeight: 900}}>
          <span>Cancel anytime</span>
          <span>$19.99/mo after</span>
        </div>
      </div>

      {/* Dark-mode UI card (left of person; forced ABOVE via zIndex; no overlap) */}
      <div style={{position: 'absolute', left: 440, top: 520, width: 500, zIndex: 5}}>
        <div style={{position: 'absolute', inset: -18, borderRadius: 54, background: 'radial-gradient(circle at 30% 30%, rgba(0,229,255,0.22), rgba(0,229,255,0.0) 70%)', filter: 'blur(16px)'}} />
        <div style={{position: 'relative', borderRadius: 44, overflow: 'hidden', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 44px 160px rgba(0,0,0,0.55)'}}>
          <Img src={staticFile('assets/maxcontrax/ui_contract_alerts_dark_v1.png')} style={{width: '100%', height: 'auto'}} />
        </div>
      </div>

      {/* Contractor hero right (kept behind everything) */}
      <div style={{position: 'absolute', right: -40, bottom: -80, width: 760, height: 1500, zIndex: 1}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.40)', filter: 'blur(26px)', transform: 'translateY(32px)', opacity: 0.22, borderRadius: 999}} />
        <Img src={staticFile('assets/maxcontrax/people/contractor_v6.png')} style={{position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 44px 140px rgba(0,0,0,0.60))'}} />
      </div>

      {/* Bottom right tag */}
      <div style={{position: 'absolute', right: 60, bottom: 40, padding: '18px 22px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.88)', fontSize: 16, fontWeight: 950, backdropFilter: 'blur(14px)'}}>
        Live contract matches
      </div>
    </AbsoluteFill>
  );
};
