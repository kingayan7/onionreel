import React from 'react';
import {Composition} from 'remotion';
import {Reel30} from './compositions/Reel30';
import {StillAd} from './compositions/StillAd';
import {StillFlyerV2} from './compositions/StillFlyerV2';
import {StillFlyerV3} from './compositions/StillFlyerV3';
import {StillFlyerV4} from './compositions/StillFlyerV4';
import {StillFlyerV5} from './compositions/StillFlyerV5';
import {StillFlyerV6} from './compositions/StillFlyerV6';
import {StillFlyerV7} from './compositions/StillFlyerV7';
import {StillFlyerV8} from './compositions/StillFlyerV8';
import {StillFlyerV9} from './compositions/StillFlyerV9';
import {StillFlyerV10} from './compositions/StillFlyerV10';
import {StillFlyerV11} from './compositions/StillFlyerV11';
import {StillFlyerV12} from './compositions/StillFlyerV12';

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
          ctaText: 'Get Matches',
          offerLine: 'Government contracts • SAM.gov',
          priceLine: '$19.99/mo after • cancel anytime',
          theme: 'ice',
          layoutVariant: 2,
          showPerson: false,
        }}
      />

      <Composition
        id="StillFlyerV2"
        component={StillFlyerV2}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          headline: 'GET GOV.\nCONTRACTS\nFREE',
          subline: 'Government contracts • SAM.gov',
          ctaText: 'Get Matches',
          offerLine: 'Government contracts • SAM.gov',
          priceLine: '$19.99/mo after • cancel anytime',
        }}
      />

      <Composition
        id="StillFlyerV3"
        component={StillFlyerV3}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          headline: 'GET GOV.\nCONTRACTS\nFREE',
          subline: 'Government contracts • SAM.gov',
          ctaText: 'Get Gov Contracts Free (7 Days)',
          offerLine: 'Start Free • 7-day trial',
          priceLine: '$19.99/mo after • cancel anytime',
        }}
      />

      <Composition
        id="StillFlyerV4"
        component={StillFlyerV4}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          ctaText: 'Get Gov Contracts Free (7 Days)',
          subline: 'AI matches contracts to your business',
          offerLine: 'Start Free • 7-day trial',
          priceLine: '$19.99/mo after • cancel anytime',
        }}
      />

      <Composition
        id="StillFlyerV5"
        component={StillFlyerV5}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          ctaText: 'Get Gov Contracts Free (7 Days)',
          subline: 'AI matches contracts to your business',
          offerLine: 'Start Free • 7-day trial',
          priceLine: '$19.99/mo after • cancel anytime',
        }}
      />

      <Composition
        id="StillFlyerV6"
        component={StillFlyerV6}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          ctaText: 'Get Gov Contracts Free (7 Days)',
          subline: 'AI matches contracts to your business',
          offerLine: 'Start Free • 7-day trial',
        }}
      />

      <Composition
        id="StillFlyerV7"
        component={StillFlyerV7}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          ctaText: 'Get Gov Contracts Free (7 Days)',
          subline: 'AI matches contracts to your business',
          offerLine: 'Start Free • 7-day trial',
        }}
      />

      <Composition
        id="StillFlyerV8"
        component={StillFlyerV8}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          ctaText: 'Get Gov Contracts Free (7 Days)',
          subline: 'AI matches contracts to your business',
          offerLine: 'Start Free • 7-day trial',
        }}
      />

      <Composition
        id="StillFlyerV9"
        component={StillFlyerV9}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'contractor',
          ctaText: 'Get Government\nContracts Free',
          subline: 'AI matches contracts to your business',
          offerLine: '( 7 Day free Trial • $19.99/mo after)',
        }}
      />

      <Composition
        id="StillFlyerV10"
        component={StillFlyerV10}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'security',
          ctaLine1: 'Get Government',
          ctaLine2: 'Contracts Free',
          trialLine: '( 7 Day free Trial • $19.99/mo after)',
          subline: 'AI matches contracts to your business',
        }}
      />

      <Composition
        id="StillFlyerV11"
        component={StillFlyerV11}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          role: 'nurse',
          cta: 'Get Government Contracts Free',
          trialLine: '( 7 Day free Trial • $19.99/mo after)',
          subline: 'AI matches contracts to your business',
        }}
      />

      <Composition
        id="StillFlyerV12"
        component={StillFlyerV12}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1350}
        defaultProps={{
          cta: 'Get Government\nContracts Free',
          trialLine: '( 7 Day free Trial • $19.99/mo after)',
          subline: 'AI matches contracts to your business',
        }}
      />
    </>
  );
};
