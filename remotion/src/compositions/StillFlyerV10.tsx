import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV10Props = {
  role: 'contractor' | 'nurse' | 'security';
  ctaLine1: string;
  ctaLine2: string;
  trialLine: string;
  subline: string;
};

const ROLE_ASSET: Record<StillFlyerV10Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v5.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v4.png',
};

export const StillFlyerV10: React.FC<StillFlyerV10Props> = (p) => {
  // New recipe: diagonal split + stacked CTA + floating match card.
  const ink = '#07101A';
  const white = 'rgba(255,255,255,0.86)';
  const stroke = 'rgba(7,16,26,0.10)';

  return (
    <AbsoluteFill style={{ background: '#0B1020', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* diagonal light panel */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, #F6F9FF 0%, #F6F9FF 56%, #0B1020 56%, #0B1020 100%)' }} />

      {/* color glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 18%, rgba(0,229,255,0.38), rgba(0,229,255,0.0) 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 62% 70%, rgba(255,0,122,0.22), rgba(255,0,122,0.0) 60%)' }} />

      {/* Header */}
      <div style={{ position: 'absolute', left: 56, right: 56, top: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark_v2.png')} style={{ height: 130, width: 130, borderRadius: 36, boxShadow: '0 30px 90px rgba(0,0,0,0.22)' }} />
          <div>
            <div style={{ fontSize: 46, fontWeight: 950, letterSpacing: -0.9, color: ink, lineHeight: 1.0 }}>MaxContrax</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 900, color: 'rgba(7,16,26,0.68)' }}>Contract Alerts</div>
          </div>
        </div>

        <div style={{
          padding: '20px 24px',
          borderRadius: 999,
          background: white,
          border: `2px solid ${stroke}`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.14)',
          fontSize: 20,
          fontWeight: 950,
          color: 'rgba(7,16,26,0.78)',
        }}>New matches daily</div>
      </div>

      {/* Big CTA block (left) */}
      <div style={{ position: 'absolute', left: 64, top: 230, width: 560 }}>
        <div style={{ fontSize: 94, fontWeight: 950, letterSpacing: -1.8, lineHeight: 0.92, color: ink, textShadow: '0 24px 90px rgba(0,0,0,0.10)' }}>
          {p.ctaLine1}
        </div>
        <div style={{ marginTop: 10, fontSize: 86, fontWeight: 950, letterSpacing: -1.6, lineHeight: 0.92, color: ink }}>
          {p.ctaLine2}
        </div>
        <div style={{ marginTop: 10, fontSize: 16, fontWeight: 900, color: 'rgba(7,16,26,0.62)' }}>{p.trialLine}</div>
        <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900, color: 'rgba(7,16,26,0.74)' }}>{p.subline}</div>
      </div>

      {/* Floating matches card (center-left) */}
      <div style={{ position: 'absolute', left: 64, bottom: 88, width: 560 }}>
        <div style={{ position: 'absolute', inset: -16, borderRadius: 42, background: 'linear-gradient(135deg, rgba(0,229,255,0.22), rgba(255,0,122,0.14), rgba(0,0,0,0.0))', filter: 'blur(14px)' }} />
        <div style={{ position: 'relative', borderRadius: 34, overflow: 'hidden', background: '#fff', border: `1px solid ${stroke}`, boxShadow: '0 34px 110px rgba(0,0,0,0.18)' }}>
          <Img src={staticFile('assets/maxcontrax/ui_matches_dark_v1.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* Person on the dark side (right) */}
      <div style={{ position: 'absolute', right: -120, bottom: -40, width: 760, height: 1340 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.30)', filter: 'blur(22px)', transform: 'translateY(28px)', opacity: 0.22, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 34px 90px rgba(0,0,0,0.35))' }} />
      </div>

      {/* bottom corners */}
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 34, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ padding: '18px 24px', borderRadius: 999, background: white, border: `2px solid ${stroke}`, boxShadow: '0 22px 70px rgba(0,0,0,0.12)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.72)' }}>Cancel anytime</div>
        <div style={{ padding: '18px 24px', borderRadius: 999, background: white, border: `2px solid ${stroke}`, boxShadow: '0 22px 70px rgba(0,0,0,0.12)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.72)' }}>Made for busy owners</div>
      </div>
    </AbsoluteFill>
  );
};
