import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV14Props = {
  cta: string; // EXACT: Get Government Contracts Free
  trialLine: string;
  subline: string;
};

export const StillFlyerV14: React.FC<StillFlyerV14Props> = (p) => {
  // New recipe: full-bleed swoosh background + centered CTA + stacked alert card + hero person behind card.
  const ink = '#07101A';
  const white = 'rgba(255,255,255,0.88)';
  const stroke = 'rgba(7,16,26,0.10)';

  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system'}}>
      <Img src={staticFile('assets/maxcontrax/bg_swoosh_v1.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />

      {/* Logo centered top */}
      <div style={{position: 'absolute', top: 42, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
        <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{height: 120, width: 120, borderRadius: 34, boxShadow: '0 30px 90px rgba(0,0,0,0.18)'}} />
        <div>
          <div style={{fontSize: 44, fontWeight: 950, letterSpacing: -0.9, color: ink, lineHeight: 1.0}}>MaxContrax</div>
          <div style={{marginTop: 6, fontSize: 18, fontWeight: 900, color: 'rgba(7,16,26,0.68)'}}>Contract Alerts</div>
        </div>
      </div>

      {/* Hero person (right, behind everything) */}
      <div style={{position: 'absolute', right: -140, bottom: -70, width: 820, height: 1440, opacity: 0.95, zIndex: 1}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.16)', filter: 'blur(26px)', transform: 'translateY(30px)', opacity: 0.18, borderRadius: 999}} />
        <Img src={staticFile('assets/maxcontrax/people/security_v5.png')} style={{position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 40px 120px rgba(0,0,0,0.28))'}} />
      </div>

      {/* CTA moved left so nothing sits under the person */}
      <div style={{position: 'absolute', left: 70, right: 520, top: 210, textAlign: 'left', zIndex: 3}}>
        <div style={{fontSize: 82, fontWeight: 950, letterSpacing: -1.6, lineHeight: 0.96, color: ink, textShadow: '0 22px 70px rgba(0,0,0,0.10)'}}>
          {p.cta}
        </div>
        <div style={{marginTop: 14, fontSize: 16, fontWeight: 900, color: 'rgba(7,16,26,0.62)'}}>{p.trialLine}</div>
        <div style={{marginTop: 12, fontSize: 24, fontWeight: 900, color: 'rgba(7,16,26,0.74)', lineHeight: 1.15}}>{p.subline}</div>
      </div>

      {/* Alerts card moved up + larger to fill space, kept fully clear of person */}
      <div style={{position: 'absolute', left: 70, right: 520, bottom: 150, zIndex: 2}}>
        <div style={{position: 'absolute', inset: -18, borderRadius: 46, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.40), rgba(255,255,255,0.0) 70%)', filter: 'blur(14px)'}} />
        <div style={{position: 'relative', borderRadius: 38, overflow: 'hidden', background: '#fff', border: `2px solid ${stroke}`, boxShadow: '0 40px 140px rgba(0,0,0,0.22)'}}>
          <Img src={staticFile('assets/maxcontrax/ui_contract_alerts_v2.png')} style={{width: '100%', height: 'auto'}} />
        </div>
      </div>

      {/* Bottom micro */}
      <div style={{position: 'absolute', left: 60, right: 60, bottom: 34, display: 'flex', justifyContent: 'space-between', color: 'rgba(7,16,26,0.62)', fontSize: 14, fontWeight: 900}}>
        <span>Cancel anytime</span>
        <span>Made for busy owners</span>
      </div>

      {/* Corner pills */}
      <div style={{position: 'absolute', right: 60, bottom: 28, padding: '18px 22px', borderRadius: 999, background: white, border: `2px solid ${stroke}`, boxShadow: '0 24px 80px rgba(0,0,0,0.12)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.78)'}}>
        Live matches
      </div>
    </AbsoluteFill>
  );
};
