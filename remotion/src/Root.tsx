import React from 'react';
import {Composition} from 'remotion';
import {Reel30} from './compositions/Reel30';
import {StillAd} from './compositions/StillAd';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel30"
        component={Reel30}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          title: 'MaxContrax',
          cta: 'Start Free at MaxContrax.com',
          accent: '#E17B3B',
          bg: '#FFFFFF',
          fg: '#0B0B0B',
          projectId: 'maxcontrax-reel-v1',
          clips: {
            overwhelm: 'overwhelm_scroll.mp4',
            ai: 'ai_matching.mp4',
            email: 'email_alert.mp4',
            trust: 'handshake_trust.mp4',
          },
        }}
      />

      <Composition
        id="StillAdSquare"
        component={StillAd}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          size: '1080x1080',
          headline: 'GET GOV.\nCONTRACTS\nFREE',
          subline: 'Government contracts • SAM.gov',
          ctaText: 'Get Government Contracts Free',
          offerLine: 'Government contracts • SAM.gov',
          priceLine: '$19.99/mo after • cancel anytime',
          theme: 'sunset',
          showPerson: false,
        }}
      />

      <Composition
        id="StillAdPortrait"
        component={StillAd}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          size: '1080x1920',
          headline: 'GET GOV.\nCONTRACTS\nFREE',
          subline: 'Government contracts • SAM.gov',
          ctaText: 'Get Government Contracts Free',
          offerLine: 'Government contracts • SAM.gov',
          priceLine: '$19.99/mo after • cancel anytime',
          theme: 'violet',
          showPerson: false,
        }}
      />

      <Composition
        id="StillAdFeed"
        component={StillAd}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          size: '1080x1350',
          headline: 'GET GOV.\nCONTRACTS\nFREE',
          subline: 'Government contracts • SAM.gov',
          ctaText: 'Get Government Contracts Free',
          offerLine: 'Government contracts • SAM.gov',
          priceLine: '$19.99/mo after • cancel anytime',
          theme: 'ice',
          showPerson: false,
        }}
      />
    </>
  );
};
