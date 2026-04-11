import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV11Props = {
  role: 'contractor' | 'nurse' | 'security';
  cta: string;
  trialLine: string;
  subline: string;
};

const ROLE_ASSET: Record<StillFlyerV11Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v5.png',
  nurse: 'assets/maxcontrax/people/nurse_v4.png',
  security: 'assets/maxcontrax/people/security_v4.png',
};

export const StillFlyerV11: React.FC<StillFlyerV11Props> = (p) => {
  // New concept recipe: big vertical CTA block + split canvas + dense left rail.
  const ink = '#07101A';
  const white = 'rgba(255,255,255,0.88)';
  const stroke = 'rgba(7,16,26,0.10)';

  return (
    <AbsoluteFill style={{ background: '#0B1020', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* base split */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #F6F9FF 0%, #F6F9FF 54%, #0B1020 54%, #0B1020 100%)' }} />

      {/* neon glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 18% 20%, rgba(0,229,255,0.38), rgba(0,229,255,0.0) 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 52% 84%, rgba(255,179,0,0.20), rgba(255,179,0,0.0) 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 30%, rgba(255,0,122,0.18), rgba(255,0,122,0.0) 60%)' }} />

      {/* Left rail */}
      <div style={{ position: 'absolute', left: 54, top: 44, width: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark_v2.png')} style={{ height: 126, width: 126, borderRadius: 34, boxShadow: '0 28px 90px rgba(0,0,0,0.20)' }} />
          <div>
            <div style={{ fontSize: 44, fontWeight: 950, letterSpacing: -0.9, color: ink, lineHeight: 1.0 }}>MaxContrax</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 900, color: 'rgba(7,16,26,0.68)' }}>Contract Alerts</div>
          </div>
        </div>

        {/* BIG CTA block (not bubble) */}
        <div style={{ marginTop: 26 }}>
          <div style={{ fontSize: 84, fontWeight: 950, letterSpacing: -1.6, lineHeight: 0.94, color: ink, whiteSpace: 'pre-wrap', textShadow: '0 24px 90px rgba(0,0,0,0.10)' }}>
            {p.cta}
          </div>
          <div style={{ marginTop: 10, fontSize: 16, fontWeight: 900, color: 'rgba(7,16,26,0.62)' }}>{p.trialLine}</div>
          <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900, color: 'rgba(7,16,26,0.74)' }}>{p.subline}</div>
        </div>

        {/* Matches today card */}
        <div style={{ marginTop: 24, position: 'relative', width: 520 }}>
          <div style={{ position: 'absolute', inset: -16, borderRadius: 40, background: 'linear-gradient(135deg, rgba(0,229,255,0.20), rgba(255,0,122,0.12), rgba(0,0,0,0.0))', filter: 'blur(14px)' }} />
          <div style={{ position: 'relative', borderRadius: 34, overflow: 'hidden', background: '#fff', border: `1px solid ${stroke}`, boxShadow: '0 34px 110px rgba(0,0,0,0.18)' }}>
            <Img src={staticFile('assets/maxcontrax/ui_matches_today_v1.png')} style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Person on right (hero) */}
      <div style={{ position: 'absolute', right: -120, bottom: -40, width: 760, height: 1340 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.30)', filter: 'blur(22px)', transform: 'translateY(28px)', opacity: 0.22, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 34px 90px rgba(0,0,0,0.35))' }} />
      </div>

      {/* Corner pills */}
      <div style={{ position: 'absolute', left: 54, right: 54, bottom: 34, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ padding: '18px 24px', borderRadius: 999, background: white, border: `2px solid ${stroke}`, boxShadow: '0 22px 70px rgba(0,0,0,0.12)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.72)' }}>Cancel anytime</div>
        <div style={{ padding: '18px 24px', borderRadius: 999, background: white, border: `2px solid ${stroke}`, boxShadow: '0 22px 70px rgba(0,0,0,0.12)', fontSize: 18, fontWeight: 950, color: 'rgba(7,16,26,0.72)' }}>Made for busy owners</div>
      </div>
    </AbsoluteFill>
  );
};
