import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV4Props = {
  role: 'contractor' | 'nurse' | 'security';
  ctaText: string; // MAIN copy at top
  subline: string;
  offerLine: string;
  priceLine: string;
};

const ROLE_ASSET: Record<StillFlyerV4Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v3.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v3.png',
};

export const StillFlyerV4: React.FC<StillFlyerV4Props> = (p) => {
  // New template: CTA is the headline. No repeated GET GOV CONTRACTS typography.
  // Brighter palette + modern font stack.
  const bg = 'linear-gradient(135deg, #08AEEA 0%, #2AF598 45%, #FDFBFB 100%)';
  const blue = '#2563EB';
  const orange = '#FF4D8D';

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* soft gradients */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 22% 14%, rgba(255,255,255,0.38), rgba(255,255,255,0.0) 58%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 30%, rgba(255,77,141,0.20), rgba(255,77,141,0.0) 55%)' }} />

      {/* Header */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark_v2.png')} style={{ height: 54, width: 54, borderRadius: 14 }} />
          <div style={{ fontSize: 28, fontWeight: 950, letterSpacing: -0.5, color: '#0B0B0B' }}>MaxContrax</div>
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 950,
          color: 'rgba(15,23,42,0.65)',
          padding: '10px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}>Bid Alerts • Daily</div>
      </div>

      {/* Person: large, left */}
      <div style={{ position: 'absolute', left: -70, bottom: -40, width: 700, height: 1220 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)', filter: 'blur(18px)', transform: 'translateY(22px)', opacity: 0.28, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 26px 60px rgba(0,0,0,0.18))' }} />
      </div>

      {/* Right column */}
      <div style={{ position: 'absolute', left: 420, right: 60, top: 150 }}>
        {/* CTA headline (MUCH larger + centered) */}
        <div style={{
          textAlign: 'center',
          fontSize: 78,
          fontWeight: 950,
          letterSpacing: -1.2,
          lineHeight: 1.02,
          color: '#07101A',
          textTransform: 'none',
          textShadow: '0 18px 60px rgba(0,0,0,0.18)',
          padding: '18px 18px',
          borderRadius: 26,
          background: 'rgba(255,255,255,0.70)',
          border: '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 22px 70px rgba(0,0,0,0.16)',
        }}>{p.ctaText}</div>

        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 24, fontWeight: 900, color: 'rgba(7,16,26,0.78)' }}>{p.subline}</div>

        {/* Offer pill */}
        <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ padding: '10px 14px', borderRadius: 16, background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.18)', fontSize: 18, fontWeight: 950, color: 'rgba(15,23,42,0.78)' }}>{p.offerLine}</div>
          <div style={{ padding: '10px 14px', borderRadius: 16, background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.20)', fontSize: 18, fontWeight: 950, color: 'rgba(15,23,42,0.78)' }}>{p.priceLine}</div>
        </div>

        {/* Alerts UI big */}
        <div style={{ marginTop: 20, position: 'relative', width: 560 }}>
          <div style={{ position: 'absolute', inset: -18, borderRadius: 42, background: 'radial-gradient(circle at 30% 30%, rgba(37,99,235,0.16), rgba(249,115,22,0.10) 40%, rgba(0,0,0,0.0) 75%)', filter: 'blur(14px)' }} />
          <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.10)', boxShadow: '0 34px 90px rgba(0,0,0,0.20)' }}>
            <Img src={staticFile('assets/maxcontrax/ui_alerts_v1.png')} style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>

        {/* Small familiar CTA chip (NOT a bottom button) */}
        <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 999, background: orange, color: '#fff', fontSize: 18, fontWeight: 950, boxShadow: '0 16px 34px rgba(0,0,0,0.14)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.9)' }} />
          Tap to start free
        </div>
      </div>

      {/* Accent line */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: `linear-gradient(90deg, ${blue}, ${orange})` }} />
    </AbsoluteFill>
  );
};
