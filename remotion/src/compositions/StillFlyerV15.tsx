import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillFlyerV15Props = {
  cta: string; // EXACT: Get Government Contracts Free
  trialLine: string;
  subline: string;
};

export const StillFlyerV15: React.FC<StillFlyerV15Props> = (p) => {
  // Totally different recipe: editorial serif headline + strict grid + minimal palette.
  const ink = '#0B1220';

  return (
    <AbsoluteFill style={{background: '#F7F3EC', fontFamily: 'ui-serif, Georgia, Times, serif'}}>
      {/* Subtle border */}
      <div style={{position: 'absolute', left: 34, top: 34, right: 34, bottom: 34, borderRadius: 44, border: '3px solid rgba(11,18,32,0.18)'}} />

      {/* Top bar */}
      <div style={{position: 'absolute', left: 70, right: 70, top: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Img src={staticFile('assets/maxcontrax/logo_mark.png')} style={{height: 96, width: 96, borderRadius: 28}} />
          <div>
            <div style={{fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', fontSize: 30, fontWeight: 950, letterSpacing: -0.6, color: ink}}>MaxContrax</div>
            <div style={{marginTop: 4, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', fontSize: 16, fontWeight: 900, color: 'rgba(11,18,32,0.62)'}}>Contract Alerts</div>
          </div>
        </div>
        <div style={{fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', padding: '14px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.70)', border: '2px solid rgba(11,18,32,0.12)', fontSize: 16, fontWeight: 950, color: 'rgba(11,18,32,0.72)'}}>7-day trial</div>
      </div>

      {/* Left: serif CTA */}
      <div style={{position: 'absolute', left: 70, top: 210, width: 560}}>
        <div style={{fontSize: 78, fontWeight: 900, letterSpacing: -1.2, lineHeight: 0.98, color: ink}}>{p.cta}</div>
        <div style={{marginTop: 10, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', fontSize: 14, fontWeight: 900, color: 'rgba(11,18,32,0.58)'}}>{p.trialLine}</div>
        <div style={{marginTop: 14, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', fontSize: 22, fontWeight: 900, color: 'rgba(11,18,32,0.76)', lineHeight: 1.15}}>{p.subline}</div>

        {/* Minimal tags */}
        <div style={{marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
          {['Janitorial', 'Security', 'Nurse', 'Cybersecurity', 'Contractor'].map((t) => (
            <div key={t} style={{fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', padding: '10px 14px', borderRadius: 999, background: 'rgba(11,18,32,0.06)', border: '1px solid rgba(11,18,32,0.10)', fontSize: 14, fontWeight: 950, color: 'rgba(11,18,32,0.70)'}}>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Right column: UI card + hero */}
      <div style={{position: 'absolute', right: 70, top: 220, width: 420}}>
        <div style={{position: 'relative', borderRadius: 34, overflow: 'hidden', background: '#fff', border: '2px solid rgba(11,18,32,0.12)', boxShadow: '0 30px 110px rgba(0,0,0,0.18)'}}>
          <Img src={staticFile('assets/maxcontrax/ui_contract_alert_card_v1.png')} style={{width: '100%', height: 'auto'}} />
        </div>
      </div>

      {/* Cyber hero bottom-right (new person) */}
      <div style={{position: 'absolute', right: -90, bottom: -120, width: 680, height: 1260}}>
        <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', filter: 'blur(22px)', transform: 'translateY(28px)', opacity: 0.20, borderRadius: 999}} />
        <Img src={staticFile('assets/maxcontrax/people/cyber_v2.png')} style={{position: 'relative', width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 34px 90px rgba(0,0,0,0.22))'}} />
      </div>

      {/* Footer */}
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 44, display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system', color: 'rgba(11,18,32,0.60)', fontSize: 14, fontWeight: 900}}>
        <span>Cancel anytime</span>
        <span>Made for busy owners</span>
      </div>
    </AbsoluteFill>
  );
};
