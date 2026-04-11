import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV9Props = {
  role: 'contractor' | 'nurse' | 'security';
  ctaText: string;
  subline: string;
  offerLine: string;
};

const ROLE_ASSET: Record<StillFlyerV9Props['role'], string> = {
  contractor: 'assets/maxcontrax/people/contractor_v5.png',
  nurse: 'assets/maxcontrax/people/nurse_v3.png',
  security: 'assets/maxcontrax/people/security_v3.png',
};

export const StillFlyerV9: React.FC<StillFlyerV9Props> = (p) => {
  // CTA is standalone typography (no bubble/card).
  const ink = '#07101A';
  const stroke = 'rgba(7,16,26,0.10)';
  const white = 'rgba(255,255,255,0.86)';

  const raw = (p.ctaText || '').replace(/\\n/g, '\n');
  const m = raw.match(/^(.*?)(\s*\(7\s*Days\)\s*)$/i);
  const ctaMain = (m ? m[1] : raw).trim();
  const ctaSmall = m ? m[2].trim() : '';

  return (
    <AbsoluteFill style={{ background: '#F6F9FF', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system' }}>
      {/* Brighter blobs */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 16% 16%, rgba(34,211,238,0.34), rgba(34,211,238,0.0) 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 20%, rgba(99,102,241,0.26), rgba(99,102,241,0.0) 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 52% 82%, rgba(34,197,94,0.20), rgba(34,197,94,0.0) 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 72%, rgba(255,77,141,0.18), rgba(255,77,141,0.0) 60%)' }} />

      {/* Header */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{ height: 150, width: 150, borderRadius: 40, boxShadow: '0 30px 90px rgba(0,0,0,0.20)' }} />
          <div>
            <div style={{ fontSize: 48, fontWeight: 950, letterSpacing: -0.9, color: ink, lineHeight: 1.0 }}>MaxContrax</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 900, color: 'rgba(7,16,26,0.68)' }}>Contract Alerts</div>
          </div>
        </div>
        <div style={{
          padding: '22px 26px',
          borderRadius: 999,
          background: white,
          border: `2px solid ${stroke}`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.14)',
          fontSize: 22,
          fontWeight: 950,
          letterSpacing: -0.2,
          color: 'rgba(7,16,26,0.78)',
        }}>7-day trial</div>
      </div>

      {/* Person RIGHT */}
      <div style={{ position: 'absolute', right: -80, bottom: -40, width: 720, height: 1300 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.10)', filter: 'blur(18px)', transform: 'translateY(22px)', opacity: 0.25, borderRadius: 999 }} />
        <Img src={staticFile(ROLE_ASSET[p.role])} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 34px 90px rgba(0,0,0,0.20))' }} />
      </div>

      {/* CTA - standalone */}
      <div style={{ position: 'absolute', left: 60, top: 232, width: 640, zIndex: 3 }}>
        <div style={{
          fontSize: 86,
          fontWeight: 950,
          letterSpacing: -1.6,
          lineHeight: 0.98,
          color: ink,
          textShadow: '0 22px 70px rgba(0,0,0,0.10)',
          whiteSpace: 'pre-wrap',
        }}>{ctaMain}</div>

        {ctaSmall ? (
          <div style={{
            marginTop: 6,
            fontSize: 30,
            fontWeight: 950,
            letterSpacing: -0.4,
            color: 'rgba(7,16,26,0.70)',
          }}>{ctaSmall}</div>
        ) : null}

        <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900, color: 'rgba(7,16,26,0.72)' }}>{p.subline}</div>

        {/* Trial/pricing line (small, NOT part of CTA) */}
        <div style={{ marginTop: 6, fontSize: 16, fontWeight: 900, color: 'rgba(7,16,26,0.62)' }}>{p.offerLine}</div>

        {/* Feature chips (still ok to be pills) */}
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ padding: '12px 16px', borderRadius: 999, background: 'rgba(14,165,233,0.14)', border: '1px solid rgba(14,165,233,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>Janitorial</div>
          <div style={{ padding: '12px 16px', borderRadius: 999, background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>Security</div>
          <div style={{ padding: '12px 16px', borderRadius: 999, background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>Nurse</div>
          <div style={{ padding: '12px 16px', borderRadius: 999, background: 'rgba(255,77,141,0.14)', border: '1px solid rgba(255,77,141,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>Cybersecurity</div>
          <div style={{ padding: '12px 16px', borderRadius: 999, background: 'rgba(99,102,241,0.14)', border: '1px solid rgba(99,102,241,0.22)', fontSize: 16, fontWeight: 950, color: 'rgba(7,16,26,0.78)' }}>Contractor</div>
        </div>
      </div>

      {/* Angled contract alerts card */}
      <div style={{ position: 'absolute', left: 60, bottom: 90, width: 560, zIndex: 1 }}>
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

      {/* Corner buttons */}
      <div style={{ position: 'absolute', left: 60, right: 60, bottom: 34, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{
          padding: '20px 26px',
          borderRadius: 999,
          background: white,
          border: `2px solid ${stroke}`,
          boxShadow: '0 22px 70px rgba(0,0,0,0.12)',
          fontSize: 20,
          fontWeight: 950,
          color: 'rgba(7,16,26,0.72)',
        }}>Cancel anytime</div>

        <div style={{
          padding: '20px 26px',
          borderRadius: 999,
          background: white,
          border: `2px solid ${stroke}`,
          boxShadow: '0 22px 70px rgba(0,0,0,0.12)',
          fontSize: 20,
          fontWeight: 950,
          color: 'rgba(7,16,26,0.72)',
        }}>Made for busy owners</div>
      </div>
    </AbsoluteFill>
  );
};
