import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV2Props = {
  role: 'contractor' | 'nurse' | 'security';
  headline: string;
  subline: string;
  ctaText: string;
  offerLine: string;
  priceLine: string;
};

const ROLE_ASSET: Record<StillFlyerV2Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v2.png',
  nurse: 'assets/maxcontrax/people/nurse_v2.png',
  security: 'assets/maxcontrax/people/security_v2.png',
};

export const StillFlyerV2: React.FC<StillFlyerV2Props> = (p) => {
  // Fresh colors that pop (IG-ad familiar): soft blue base + subtle gradient + orange accent.
  const bg = 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 45%, #e0f2fe 100%)';
  const blue = '#2563EB';
  const orange = '#F97316';

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}>
      {/* Top bar */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 54, height: 86, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{ height: 54, width: 54, borderRadius: 14 }} />
          <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: -0.6, color: '#0B0B0B' }}>MaxContrax</div>
        </div>
        <div style={{
          fontSize: 14,
          fontWeight: 950,
          color: 'rgba(15,23,42,0.62)',
          padding: '10px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}>AI Contract Matches</div>
      </div>

      {/* Person right (no overlap with copy column) */}
      <div style={{ position: 'absolute', right: 10, bottom: -10, width: 520, height: 980 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.14)', filter: 'blur(18px)', transform: 'translateY(22px)', opacity: 0.35, borderRadius: 999 }} />
        <Img
          src={staticFile(ROLE_ASSET[p.role])}
          style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 26px 60px rgba(0,0,0,0.18))' }}
        />
      </div>

      {/* Copy column left */}
      <div style={{ position: 'absolute', left: 60, top: 180, width: 600 }}>
        <div style={{
          fontSize: 96,
          fontWeight: 950,
          letterSpacing: -1.5,
          lineHeight: 0.92,
          color: '#0B0B0B',
          textTransform: 'uppercase',
          textShadow: '0 16px 46px rgba(0,0,0,0.14)',
        }}>{p.headline}</div>

        <div style={{ marginTop: 18, fontSize: 30, fontWeight: 900, color: 'rgba(15,23,42,0.70)' }}>{p.subline}</div>

        <div style={{ marginTop: 28, padding: '12px 16px', borderRadius: 16, background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.18)', display: 'inline-block', fontSize: 24, fontWeight: 950, color: 'rgba(15,23,42,0.80)' }}>
          {p.offerLine}
        </div>

        {/* CTA Card */}
        <div style={{ marginTop: 26, width: 560, borderRadius: 28, background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 26px 70px rgba(0,0,0,0.18)', padding: 24 }}>
          <div style={{ fontSize: 62, fontWeight: 950, letterSpacing: -1.2, color: '#0B0B0B', lineHeight: 0.95 }}>START FREE</div>
          <div style={{ marginTop: 8, fontSize: 34, fontWeight: 900, color: '#0B0B0B' }}>7-day trial</div>
          <div style={{ marginTop: 10, fontSize: 24, fontWeight: 800, color: 'rgba(15,23,42,0.66)' }}>{p.priceLine}</div>

          <div style={{ marginTop: 18, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 18, right: 18, top: 10, height: 70, borderRadius: 18, background: orange, opacity: 0.30, filter: 'blur(18px)' }} />
            <div style={{ position: 'relative', background: orange, borderRadius: 18, padding: '14px 18px', textAlign: 'center', color: '#fff', fontSize: 28, fontWeight: 950, letterSpacing: -0.2, boxShadow: '0 14px 30px rgba(0,0,0,0.14)', lineHeight: 1.05 }}>
              {p.ctaText}
            </div>
          </div>
        </div>
      </div>

      {/* UI card bottom-right (kept clear of text) */}
      <div style={{ position: 'absolute', right: 70, bottom: 90, width: 420 }}>
        <div style={{ position: 'absolute', inset: -18, borderRadius: 42, background: 'radial-gradient(circle at 30% 30%, rgba(249,115,22,0.14), rgba(37,99,235,0.10) 40%, rgba(37,99,235,0.0) 75%)', filter: 'blur(14px)' }} />
        <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.10)', boxShadow: '0 34px 90px rgba(0,0,0,0.20)' }}>
          <Img src={staticFile('assets/maxcontrax/ui_card_v2.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
