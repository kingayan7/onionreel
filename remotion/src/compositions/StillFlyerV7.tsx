import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV7Props = {
  role: 'contractor' | 'nurse' | 'security';
  ctaText: string;
  subline: string;
  offerLine: string;
};

const ROLE_ASSET: Record<StillFlyerV7Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v3.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v3.png',
};

export const StillFlyerV7: React.FC<StillFlyerV7Props> = (p) => {
  // Different recipe: editorial / print-ad vibe (white space used as structure), bold border + stamps.
  const ink = '#0A0F1A';
  const blue = '#2563EB';
  const magenta = '#FF2D8D';

  return (
    <AbsoluteFill style={{ background: '#F8FAFC', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* Paper texture-ish */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.10), rgba(37,99,235,0.0) 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 35%, rgba(255,45,141,0.08), rgba(255,45,141,0.0) 58%)' }} />

      {/* Bold frame */}
      <div style={{ position: 'absolute', left: 36, top: 36, right: 36, bottom: 36, borderRadius: 42, border: `6px solid ${ink}`, background: 'rgba(255,255,255,0.92)' }} />

      {/* Logo masthead (HUGE) */}
      <div style={{ position: 'absolute', left: 72, top: 70, right: 72, display: 'flex', alignItems: 'center', gap: 20 }}>
        <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{ height: 160, width: 160, borderRadius: 44, border: `6px solid ${ink}`, background: '#fff' }} />
        <div>
          <div style={{ fontSize: 64, fontWeight: 950, letterSpacing: -1.2, color: ink }}>MaxContrax</div>
          <div style={{ marginTop: 6, fontSize: 20, fontWeight: 900, color: 'rgba(10,15,26,0.70)' }}>{p.subline}</div>
        </div>
      </div>

      {/* Person in cutout circle */}
      <div style={{ position: 'absolute', left: 72, bottom: 82, width: 520, height: 520 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'linear-gradient(135deg, rgba(37,99,235,0.16), rgba(255,45,141,0.10))', border: `6px solid ${ink}` }} />
        <div style={{ position: 'absolute', inset: 18, borderRadius: 999, background: '#fff', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 20%, rgba(37,99,235,0.10), rgba(37,99,235,0.0) 60%)' }} />
          <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'absolute', left: -40, right: -40, top: -40, bottom: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'contain' }} />
        </div>

        {/* Stamp */}
        <div style={{ position: 'absolute', right: -14, bottom: 28, transform: 'rotate(-10deg)', padding: '10px 14px', borderRadius: 14, background: magenta, color: '#fff', fontSize: 18, fontWeight: 950, border: `4px solid ${ink}`, boxShadow: '0 18px 44px rgba(0,0,0,0.18)' }}>
          NEW
        </div>
      </div>

      {/* Alerts card right */}
      <div style={{ position: 'absolute', right: 72, top: 270, width: 420 }}>
        <div style={{ position: 'absolute', inset: -10, borderRadius: 34, background: 'rgba(10,15,26,0.06)' }} />
        <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', border: `5px solid ${ink}`, background: '#fff' }}>
          <Img src={staticFile('assets/maxcontrax/ui_alerts_v1.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* CTA block right-bottom (CENTERED within block) */}
      <div style={{ position: 'absolute', right: 72, bottom: 86, width: 420 }}>
        <div style={{ borderRadius: 28, border: `6px solid ${ink}`, background: 'linear-gradient(90deg, rgba(37,99,235,0.10), rgba(255,45,141,0.10))', padding: 18 }}>
          <div style={{ textAlign: 'center', fontSize: 46, fontWeight: 950, letterSpacing: -0.9, lineHeight: 1.05, color: ink }}>{p.ctaText}</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 12px', borderRadius: 999, background: blue, color: '#fff', fontSize: 16, fontWeight: 950, border: `4px solid ${ink}` }}>{p.offerLine}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', left: 72, right: 72, bottom: 54, display: 'flex', justifyContent: 'space-between', color: 'rgba(10,15,26,0.60)', fontSize: 14, fontWeight: 900 }}>
        <span>Cancel anytime</span>
        <span>Made for busy owners</span>
      </div>
    </AbsoluteFill>
  );
};
