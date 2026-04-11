import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type StillAdProps = {
  size: '1080x1080' | '1080x1350' | '1080x1920';
  headline: string;
  subline?: string;
  ctaText: string;
  offerLine: string;
  priceLine: string;
  theme: 'sunset' | 'violet' | 'ice' | 'night';
  showPerson: boolean;
};

const THEMES: Record<StillAdProps['theme'], { bg: string; accent: string; cta: string; headline: string; body: string }> = {
  sunset: {
    bg: 'linear-gradient(135deg, #ff5a7a 0%, #8b5cf6 35%, #f59e0b 100%)',
    accent: '#F59E0B',
    cta: '#F59E0B',
    headline: '#FFFFFF',
    body: 'rgba(255,255,255,0.9)',
  },
  violet: {
    bg: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 45%, #a855f7 100%)',
    accent: '#F97316',
    cta: '#F97316',
    headline: '#FFFFFF',
    body: 'rgba(255,255,255,0.92)',
  },
  ice: {
    bg: 'linear-gradient(135deg, #e0f2fe 0%, #f8fafc 55%, #dbeafe 100%)',
    accent: '#2563EB',
    cta: '#2563EB',
    headline: '#0B0B0B',
    body: 'rgba(15,23,42,0.8)',
  },
  night: {
    bg: 'linear-gradient(135deg, #0b1020 0%, #111827 45%, #1f2937 100%)',
    accent: '#E17B3B',
    cta: '#E17B3B',
    headline: '#FFFFFF',
    body: 'rgba(255,255,255,0.90)',
  },
};

const dims = (size: StillAdProps['size']) => {
  if (size === '1080x1080') return { w: 1080, h: 1080 };
  if (size === '1080x1350') return { w: 1080, h: 1350 };
  return { w: 1080, h: 1920 };
};

export const StillAd: React.FC<StillAdProps> = (p) => {
  const t = THEMES[p.theme];
  const { h } = dims(p.size);
  const topPad = p.size === '1080x1920' ? 90 : 70;

  return (
    <AbsoluteFill style={{ background: t.bg, fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}>
      {/* Logo */}
      <div style={{ position: 'absolute', left: 70, top: topPad, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Img src={staticFile('assets/maxcontrax/logo.png')} style={{ height: 56, width: 'auto' }} />
      </div>

      {/* Headline block (structured + glow) */}
      <div style={{ position: 'absolute', left: 70, top: topPad + 110, width: 600 }}>
        {/* glow blob behind headline */}
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: -30,
            width: 520,
            height: 260,
            borderRadius: 999,
            background:
              p.theme === 'ice'
                ? 'radial-gradient(circle at 30% 30%, rgba(37,99,235,0.25), rgba(37,99,235,0.0) 65%)'
                : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0.0) 65%)',
            filter: 'blur(10px)',
          }}
        />

        <div
          style={{
            position: 'relative',
            color: t.headline,
            fontSize: 92,
            fontWeight: 950,
            letterSpacing: -1.4,
            lineHeight: 0.92,
            textTransform: 'uppercase',
            textShadow:
              p.theme === 'ice'
                ? '0 10px 30px rgba(0,0,0,0.12)'
                : '0 18px 50px rgba(0,0,0,0.32)',
          }}
        >
          {p.headline}
        </div>

        {p.subline ? (
          <div
            style={{
              marginTop: 18,
              color: p.theme === 'ice' ? 'rgba(15,23,42,0.75)' : 'rgba(255,255,255,0.92)',
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -0.2,
            }}
          >
            {p.subline}
          </div>
        ) : null}
      </div>

      {/* Offer pill */}
      <div style={{
        position: 'absolute',
        left: 70,
        top: topPad + 430,
        padding: '14px 18px',
        borderRadius: 18,
        background: 'rgba(255,255,255,0.22)',
        border: '1px solid rgba(255,255,255,0.28)',
        color: p.theme === 'ice' ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.92)',
        fontSize: 24,
        fontWeight: 800,
        backdropFilter: 'blur(10px)',
      }}>
        {p.offerLine}
      </div>

      {/* CTA card (structured + premium glow) */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: topPad + 520,
          width: 540,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.94)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 26px 70px rgba(0,0,0,0.22)',
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
          <div>
            <div style={{ fontSize: 62, fontWeight: 950, letterSpacing: -1.2, color: '#0B0B0B', lineHeight: 0.95 }}>
              START FREE
            </div>
            <div style={{ marginTop: 8, fontSize: 34, fontWeight: 850, color: '#0B0B0B' }}>7-day trial</div>
            <div style={{ marginTop: 10, fontSize: 24, fontWeight: 750, color: 'rgba(15,23,42,0.68)' }}>{p.priceLine}</div>
          </div>
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.06)',
              fontSize: 14,
              fontWeight: 900,
              color: 'rgba(15,23,42,0.65)',
            }}
          >
            PREMIUM MATCHES
          </div>
        </div>

        {/* CTA button with glow */}
        <div style={{ marginTop: 18, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              top: 10,
              height: 60,
              borderRadius: 18,
              background: t.cta,
              opacity: 0.35,
              filter: 'blur(18px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              background: t.cta,
              color: '#fff',
              borderRadius: 18,
              padding: '16px 18px',
              fontSize: 30,
              fontWeight: 950,
              textAlign: 'center',
              letterSpacing: -0.2,
              boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
            }}
          >
            {p.ctaText}
          </div>
        </div>
      </div>

      {/* UI card (with soft glow) */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          top: p.size === '1080x1080' ? 220 : p.size === '1080x1350' ? 330 : 520,
          width: 440,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -18,
            borderRadius: 42,
            background:
              p.theme === 'ice'
                ? 'radial-gradient(circle at 30% 30%, rgba(37,99,235,0.18), rgba(37,99,235,0.0) 70%)'
                : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16), rgba(255,255,255,0.0) 70%)',
            filter: 'blur(14px)',
          }}
        />
        <div
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            boxShadow: '0 34px 90px rgba(0,0,0,0.26)',
            border: '1px solid rgba(0,0,0,0.10)',
            background: 'rgba(255,255,255,0.96)',
          }}
        >
          <Img src={staticFile('assets/maxcontrax/ui_card.png')} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>

      {/* Optional person cutout placeholder (v1): currently off unless we add cutout extraction) */}
      {p.showPerson ? (
        <div style={{
          position: 'absolute',
          right: 40,
          bottom: 0,
          width: 520,
          height: Math.min(820, h * 0.5),
          background: 'rgba(255,255,255,0.0)',
        }} />
      ) : null}

      {/* Safe margins */}
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, borderRadius: 0 }} />
    </AbsoluteFill>
  );
};
