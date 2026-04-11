import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV3Props = {
  role: 'contractor' | 'nurse' | 'security';
  headline: string;
  subline: string;
  ctaText: string;
  offerLine: string;
  priceLine: string;
};

const ROLE_ASSET: Record<StillFlyerV3Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v3.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v3.png',
};

export const StillFlyerV3: React.FC<StillFlyerV3Props> = (p) => {
  // Fresh IG-ad colors: electric blue + aqua + orange button.
  const bg = 'linear-gradient(135deg, #0b5cff 0%, #3aa3ff 35%, #e8f6ff 100%)';
  const orange = '#F97316';

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}>
      {/* soft light */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 25% 20%, rgba(255,255,255,0.38), rgba(255,255,255,0.0) 60%)' }} />

      {/* Header */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{ height: 54, width: 54, borderRadius: 14 }} />
          <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: -0.6, color: '#FFFFFF' }}>MaxContrax</div>
        </div>
        <div style={{
          fontSize: 14,
          fontWeight: 950,
          color: 'rgba(255,255,255,0.92)',
          padding: '10px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(10px)',
        }}>AI Contract Matches</div>
      </div>

      {/* Person LEFT */}
      <div style={{ position: 'absolute', left: 0, bottom: -10, width: 520, height: 1040 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.16)', filter: 'blur(18px)', transform: 'translateY(22px)', opacity: 0.28, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 26px 60px rgba(0,0,0,0.22))' }} />
      </div>

      {/* UI card RIGHT */}
      <div style={{ position: 'absolute', right: 70, top: 250, width: 440 }}>
        <div style={{ position: 'absolute', inset: -18, borderRadius: 42, background: 'radial-gradient(circle at 30% 30%, rgba(249,115,22,0.20), rgba(255,255,255,0.0) 70%)', filter: 'blur(14px)' }} />
        <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.10)', boxShadow: '0 34px 90px rgba(0,0,0,0.28)' }}>
          <Img src={staticFile('assets/maxcontrax/ui_card_v3.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* Copy + CTA RIGHT BOTTOM (no overlap with UI) */}
      <div style={{ position: 'absolute', right: 70, bottom: 90, width: 560 }}>
        <div style={{
          fontSize: 86,
          fontWeight: 950,
          letterSpacing: -1.4,
          lineHeight: 0.92,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          textShadow: '0 18px 60px rgba(0,0,0,0.35)',
        }}>{p.headline}</div>

        <div style={{ marginTop: 14, fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.92)' }}>{p.subline}</div>

        <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.20)', display: 'inline-block', fontSize: 22, fontWeight: 950, color: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)' }}>
          {p.offerLine}
        </div>

        <div style={{ marginTop: 18, fontSize: 22, fontWeight: 850, color: 'rgba(255,255,255,0.90)' }}>{p.priceLine}</div>

        {/* CTA Button */}
        <div style={{ marginTop: 18, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 18, right: 18, top: 10, height: 72, borderRadius: 20, background: orange, opacity: 0.34, filter: 'blur(18px)' }} />
          <div style={{ position: 'relative', background: orange, borderRadius: 20, padding: '18px 18px', textAlign: 'center', color: '#fff', fontSize: 30, fontWeight: 950, letterSpacing: -0.2, boxShadow: '0 16px 34px rgba(0,0,0,0.22)' }}>
            {p.ctaText}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
