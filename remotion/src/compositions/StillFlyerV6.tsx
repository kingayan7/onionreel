import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV6Props = {
  role: 'contractor' | 'nurse' | 'security';
  ctaText: string;
  subline: string;
  offerLine: string;
};

const ROLE_ASSET: Record<StillFlyerV6Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v3.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v3.png',
};

export const StillFlyerV6: React.FC<StillFlyerV6Props> = (p) => {
  // Totally different: dark neon, centered logo, sticker CTA, phone mock on right.
  const bg = 'radial-gradient(circle at 20% 15%, #1b2bff 0%, #090a14 40%, #060611 100%)';

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* Neon accents */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 25%, rgba(34,211,238,0.35), rgba(34,211,238,0.0) 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 70%, rgba(255,77,141,0.28), rgba(255,77,141,0.0) 60%)' }} />

      {/* Big centered logo */}
      <div style={{ position: 'absolute', top: 42, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{ height: 160, width: 160, borderRadius: 44, boxShadow: '0 40px 120px rgba(0,0,0,0.55)' }} />
        <div style={{ color: '#fff', fontSize: 56, fontWeight: 950, letterSpacing: -1.0, textShadow: '0 22px 80px rgba(0,0,0,0.60)' }}>MaxContrax</div>
      </div>

      {/* Person as huge background left */}
      <div style={{ position: 'absolute', left: -220, bottom: -120, width: 860, height: 1460, opacity: 0.92 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.26)', filter: 'blur(22px)', transform: 'translateY(28px)', opacity: 0.35, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 34px 90px rgba(0,0,0,0.40))' }} />
      </div>

      {/* Phone mock (alerts) right */}
      <div style={{ position: 'absolute', right: 60, top: 250, width: 440 }}>
        <div style={{ position: 'absolute', inset: -18, borderRadius: 64, background: 'linear-gradient(135deg, rgba(34,211,238,0.25), rgba(255,77,141,0.18))', filter: 'blur(18px)' }} />
        <div style={{ position: 'relative', borderRadius: 56, padding: 14, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(14px)', boxShadow: '0 44px 140px rgba(0,0,0,0.55)' }}>
          <div style={{ borderRadius: 44, overflow: 'hidden', background: '#fff' }}>
            <Img src={staticFile('assets/maxcontrax/ui_alerts_v1.png')} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 850 }}>
            <span>Live alerts</span>
            <span>Updated daily</span>
          </div>
        </div>
      </div>

      {/* CTA sticker centered */}
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 86 }}>
        <div style={{
          margin: '0 auto',
          width: 820,
          transform: 'rotate(-2deg)',
          borderRadius: 32,
          padding: '18px 22px',
          background: 'linear-gradient(90deg, #22d3ee, #ff4d8d)',
          boxShadow: '0 34px 120px rgba(0,0,0,0.55)',
        }}>
          <div style={{ textAlign: 'center', color: '#07101A', fontSize: 62, fontWeight: 950, letterSpacing: -1.0, lineHeight: 1.02, textShadow: '0 14px 44px rgba(255,255,255,0.25)' }}>
            {p.ctaText}
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ padding: '10px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.84)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.86)' }}>{p.subline}</div>
            <div style={{ padding: '10px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.84)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.86)' }}>{p.offerLine}</div>
          </div>
        </div>
      </div>

      {/* Footer microcopy */}
      <div style={{ position: 'absolute', bottom: 24, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 800 }}>
        <span>Contracts matched to your business</span>
        <span>Cancel anytime</span>
      </div>
    </AbsoluteFill>
  );
};
