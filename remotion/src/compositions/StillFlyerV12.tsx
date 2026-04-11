import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV12Props = {
  cta: string;
  trialLine: string;
  subline: string;
};

export const StillFlyerV12: React.FC<StillFlyerV12Props> = (p) => {
  // Totally different recipe: full-bleed vibrant background + centered CTA + cyber hero silhouette.
  const ink = '#07101A';

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      <Img src={staticFile('assets/maxcontrax/bg_vibrant_v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* glass overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 40%, rgba(0,0,0,0.10) 100%)' }} />

      {/* Logo top-left */}
      <div style={{ position: 'absolute', left: 56, top: 54, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Img src={staticFile('assets/maxcontrax/logo_mark_v2.png')} style={{ height: 120, width: 120, borderRadius: 34, boxShadow: '0 34px 110px rgba(0,0,0,0.35)' }} />
        <div>
          <div style={{ fontSize: 44, fontWeight: 950, letterSpacing: -0.9, color: '#fff', textShadow: '0 18px 70px rgba(0,0,0,0.40)' }}>MaxContrax</div>
          <div style={{ marginTop: 6, fontSize: 18, fontWeight: 900, color: 'rgba(255,255,255,0.85)' }}>Contract Alerts</div>
        </div>
      </div>

      {/* Cyber hero right */}
      <div style={{ position: 'absolute', right: -80, bottom: -40, width: 720, height: 1320 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.30)', filter: 'blur(26px)', transform: 'translateY(30px)', opacity: 0.22, borderRadius: 999 }} />
        <Img src={staticFile('assets/maxcontrax/people/cyber_v1.png')} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 40px 120px rgba(0,0,0,0.45))' }} />
      </div>

      {/* Center CTA (standalone, no bubble) */}
      <div style={{ position: 'absolute', left: 60, top: 270, width: 620 }}>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: 92, fontWeight: 950, letterSpacing: -1.8, lineHeight: 0.94, color: '#FFFFFF', textShadow: '0 26px 120px rgba(0,0,0,0.55)' }}>
          {p.cta}
        </div>
        <div style={{ marginTop: 10, fontSize: 16, fontWeight: 900, color: 'rgba(255,255,255,0.86)' }}>{p.trialLine}</div>
        <div style={{ marginTop: 12, fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.92)' }}>{p.subline}</div>
      </div>

      {/* UI card bottom-left */}
      <div style={{ position: 'absolute', left: 60, bottom: 120, width: 560 }}>
        <div style={{ position: 'absolute', inset: -18, borderRadius: 46, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.28), rgba(255,255,255,0.0) 70%)', filter: 'blur(14px)' }} />
        <div style={{ position: 'relative', borderRadius: 38, overflow: 'hidden', background: '#fff', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 40px 140px rgba(0,0,0,0.45)' }}>
          <Img src={staticFile('assets/maxcontrax/ui_tabs_v1.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* Bottom micro */}
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 34, display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.70)', fontSize: 14, fontWeight: 900 }}>
        <span>Cancel anytime</span>
        <span>Made for busy owners</span>
      </div>
    </AbsoluteFill>
  );
};
