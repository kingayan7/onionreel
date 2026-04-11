import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV5Props = {
  role: 'contractor' | 'nurse' | 'security';
  ctaText: string;
  subline: string;
  offerLine: string;
  priceLine: string;
};

const ROLE_ASSET: Record<StillFlyerV5Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v3.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v3.png',
};

export const StillFlyerV5: React.FC<StillFlyerV5Props> = (p) => {
  // New template: big centered CTA in a stacked card, diagonal split, dense layout.
  const bg = 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 40%, #ff4d8d 100%)';
  const card = 'rgba(255,255,255,0.88)';

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* Diagonal soft overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(115deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 35%, rgba(0,0,0,0.0) 60%)',
        }}
      />

      {/* Header */}
      <div style={{ position: 'absolute', left: 54, right: 54, top: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark_v2.png')} style={{ height: 140, width: 140, borderRadius: 34, boxShadow: '0 24px 70px rgba(0,0,0,0.35)' }} />
          <div style={{ fontSize: 44, fontWeight: 950, letterSpacing: -0.8, color: '#fff', textShadow: '0 18px 60px rgba(0,0,0,0.30)' }}>MaxContrax</div>
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 950,
          color: 'rgba(255,255,255,0.92)',
          padding: '10px 12px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.20)',
          backdropFilter: 'blur(10px)',
        }}>Bid Alerts • Daily</div>
      </div>

      {/* Person RIGHT large */}
      <div style={{ position: 'absolute', right: -60, bottom: -60, width: 720, height: 1260 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.20)', filter: 'blur(18px)', transform: 'translateY(22px)', opacity: 0.22, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.26))' }} />
      </div>

      {/* Main CTA card centered */}
      <div style={{ position: 'absolute', left: 60, right: 520, top: 220 }}>
        <div style={{
          background: card,
          borderRadius: 34,
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.26)',
          padding: 26,
        }}>
          <div style={{
            textAlign: 'center',
            fontSize: 74,
            fontWeight: 950,
            letterSpacing: -1.3,
            lineHeight: 1.02,
            color: '#07101A',
            textShadow: '0 16px 54px rgba(0,0,0,0.12)',
          }}>{p.ctaText}</div>

          <div style={{ marginTop: 14, textAlign: 'center', fontSize: 24, fontWeight: 900, color: 'rgba(7,16,26,0.75)' }}>{p.subline}</div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '10px 14px', borderRadius: 16, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.22)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>{p.offerLine}</div>
            <div style={{ padding: '10px 14px', borderRadius: 16, background: 'rgba(255,77,141,0.12)', border: '1px solid rgba(255,77,141,0.22)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>{p.priceLine}</div>
          </div>
        </div>
      </div>

      {/* Alerts UI bottom-left (fills space) */}
      <div style={{ position: 'absolute', left: 60, bottom: 70, width: 540 }}>
        <div style={{ position: 'absolute', inset: -18, borderRadius: 42, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.28), rgba(255,255,255,0.0) 70%)', filter: 'blur(14px)' }} />
        <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0,0,0,0.10)', boxShadow: '0 34px 90px rgba(0,0,0,0.22)' }}>
          <Img src={staticFile('assets/maxcontrax/ui_alerts_v1.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.0))' }} />
    </AbsoluteFill>
  );
};
