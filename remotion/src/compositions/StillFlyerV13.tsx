import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV13Props = {
  cta: string; // must be EXACT single-line: Get Gov Contracts Free
  trialLine: string;
  subline: string;
};

export const StillFlyerV13: React.FC<StillFlyerV13Props> = (p) => {
  // Totally different recipe: poster-style geometric bg + huge single-line CTA + left vertical UI strip.
  const ink = '#07101A';

  return (
    <AbsoluteFill style={{ background: '#fff', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      <Img src={staticFile('assets/maxcontrax/bg_geo_v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Brand bar */}
      <div style={{ position: 'absolute', left: 54, right: 54, top: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark_v2.png')} style={{ height: 120, width: 120, borderRadius: 34, boxShadow: '0 28px 90px rgba(0,0,0,0.18)' }} />
          <div>
            <div style={{ fontSize: 44, fontWeight: 950, letterSpacing: -0.9, color: ink, lineHeight: 1.0 }}>MaxContrax</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 900, color: 'rgba(7,16,26,0.68)' }}>Contract Alerts</div>
          </div>
        </div>
        <div style={{ padding: '18px 22px', borderRadius: 999, background: 'rgba(255,255,255,0.78)', border: '2px solid rgba(7,16,26,0.10)', boxShadow: '0 24px 80px rgba(0,0,0,0.12)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>7-day trial</div>
      </div>

      {/* CTA (standalone, SINGLE LINE) */}
      <div style={{ position: 'absolute', left: 54, right: 54, top: 210 }}>
        <div style={{ fontSize: 86, fontWeight: 950, letterSpacing: -1.6, lineHeight: 0.96, color: ink, textShadow: '0 22px 70px rgba(0,0,0,0.10)' }}>
          {p.cta}
        </div>
        <div style={{ marginTop: 10, fontSize: 16, fontWeight: 900, color: 'rgba(7,16,26,0.62)' }}>{p.trialLine}</div>
        <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900, color: 'rgba(7,16,26,0.74)' }}>{p.subline}</div>
      </div>

      {/* Janitor hero (left) */}
      <div style={{ position: 'absolute', left: -120, bottom: -60, width: 720, height: 1320 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)', filter: 'blur(26px)', transform: 'translateY(30px)', opacity: 0.18, borderRadius: 999 }} />
        <Img src={staticFile('assets/maxcontrax/people/janitor_v1.png')} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 40px 120px rgba(0,0,0,0.28))' }} />
      </div>

      {/* Right vertical UI strip */}
      <div style={{ position: 'absolute', right: 54, top: 390, width: 420 }}>
        <div style={{ position: 'absolute', inset: -16, borderRadius: 44, background: 'rgba(255,255,255,0.40)', filter: 'blur(14px)' }} />
        <div style={{ position: 'relative', borderRadius: 36, overflow: 'hidden', background: '#fff', border: '2px solid rgba(7,16,26,0.10)', boxShadow: '0 34px 110px rgba(0,0,0,0.18)' }}>
          <Img src={staticFile('assets/maxcontrax/ui_contract_alerts_v1.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* Bottom */}
      <div style={{ position: 'absolute', left: 54, right: 54, bottom: 34, display: 'flex', justifyContent: 'space-between', color: 'rgba(7,16,26,0.62)', fontSize: 14, fontWeight: 900 }}>
        <span>Cancel anytime</span>
        <span>Made for busy owners</span>
      </div>
    </AbsoluteFill>
  );
};
