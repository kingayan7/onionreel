import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV8Props = {
  role: 'contractor' | 'nurse' | 'security';
  ctaText: string;
  subline: string;
  offerLine: string;
};

const ROLE_ASSET: Record<StillFlyerV8Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v5.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v3.png',
};

export const StillFlyerV8: React.FC<StillFlyerV8Props> = (p) => {
  // Modern catchy: clean light base + neon blobs + glass cards + big type.
  const ink = '#07101A';
  const white = 'rgba(255,255,255,0.86)';
  const stroke = 'rgba(7,16,26,0.10)';

  return (
    <AbsoluteFill style={{ background: '#F6F9FF', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* Color play (brighter + punchier) */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 16% 16%, rgba(34,211,238,0.34), rgba(34,211,238,0.0) 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 20%, rgba(99,102,241,0.26), rgba(99,102,241,0.0) 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 52% 82%, rgba(34,197,94,0.20), rgba(34,197,94,0.0) 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 72%, rgba(255,77,141,0.18), rgba(255,77,141,0.0) 60%)' }} />

      {/* Header: HUGE logo */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{ height: 150, width: 150, borderRadius: 40, boxShadow: '0 30px 90px rgba(0,0,0,0.20)' }} />
          <div>
            <div style={{ fontSize: 48, fontWeight: 950, letterSpacing: -0.9, color: ink, lineHeight: 1.0 }}>MaxContrax</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 900, color: 'rgba(7,16,26,0.68)' }}>Bid alerts matched to your business</div>
          </div>
        </div>
        <div style={{
          padding: '12px 14px',
          borderRadius: 999,
          background: white,
          border: `1px solid ${stroke}`,
          boxShadow: '0 18px 60px rgba(0,0,0,0.10)',
          fontSize: 14,
          fontWeight: 950,
          color: 'rgba(7,16,26,0.70)',
        }}>7-day trial</div>
      </div>

      {/* Person RIGHT (big) */}
      <div style={{ position: 'absolute', right: -80, bottom: -40, width: 720, height: 1300 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.10)', filter: 'blur(18px)', transform: 'translateY(22px)', opacity: 0.25, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 34px 90px rgba(0,0,0,0.20))' }} />
      </div>

      {/* Left stack: CTA + chips */}
      <div style={{ position: 'absolute', left: 60, top: 250, width: 620 }}>
        {/* CTA glass card */}
        <div style={{
          borderRadius: 36,
          background: white,
          border: `1px solid ${stroke}`,
          boxShadow: '0 44px 140px rgba(0,0,0,0.16)',
          padding: 26,
          backdropFilter: 'blur(14px)',
        }}>
          <div style={{ textAlign: 'center', fontSize: 76, fontWeight: 950, letterSpacing: -1.4, lineHeight: 1.02, color: ink }}>
            {p.ctaText}
          </div>
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 22, fontWeight: 900, color: 'rgba(7,16,26,0.74)' }}>{p.subline}</div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '10px 14px', borderRadius: 999, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>Daily Bid Alerts</div>
            <div style={{ padding: '10px 14px', borderRadius: 999, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>Match Score</div>
            <div style={{ padding: '10px 14px', borderRadius: 999, background: 'rgba(255,77,141,0.12)', border: '1px solid rgba(255,77,141,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>{p.offerLine}</div>
          </div>
        </div>

        {/* Angled alerts card (modern ad feel) */}
        <div style={{ marginTop: 22, position: 'relative', width: 560 }}>
          <div style={{ position: 'absolute', inset: -16, borderRadius: 40, background: 'linear-gradient(135deg, rgba(14,165,233,0.18), rgba(124,58,237,0.16), rgba(255,77,141,0.10))', filter: 'blur(14px)' }} />
          <div style={{
            position: 'relative',
            transform: 'rotate(-2deg)',
            borderRadius: 34,
            overflow: 'hidden',
            background: '#fff',
            border: `1px solid ${stroke}`,
            boxShadow: '0 34px 110px rgba(0,0,0,0.18)',
          }}>
            <Img src={staticFile('assets/maxcontrax/ui_contract_alerts_v1.png')} style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 40, display: 'flex', justifyContent: 'space-between', color: 'rgba(7,16,26,0.55)', fontSize: 14, fontWeight: 850 }}>
        <span>Cancel anytime</span>
        <span>Made for busy owners</span>
      </div>
    </AbsoluteFill>
  );
};
