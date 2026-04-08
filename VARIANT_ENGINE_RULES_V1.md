# OnionReel Variant Engine Rules v1

## Core Idea
- **Master Timeline**: Create one master cut that serves as the foundation for all variants.
- **Variants**: Generate multiple versions based on:
  - Platform
  - Hook
  - Call to Action (CTA)
  - Aspect Ratio
  - Duration

## Variant Axes
- **Platform**: Facebook, Instagram, YouTube, TikTok, etc.
- **Aspect Ratio**: 
  - 9:16 (Vertical)
  - 1:1 (Square)
  - 16:9 (Horizontal)
- **Durations**: 
  - 6 seconds
  - 15 seconds
  - 30 seconds
  - 60 seconds
- **Hooks**: Vary the opening to grab attention.
- **CTAs**: Different calls to action to drive engagement.
- **Offers**: Change promotional offers as needed.
- **Captions**: On or off, based on platform requirements.

## Naming Convention for Exports
- **Format**: project_platform_ratio_duration_hook-id_cta-id_version
- **Example**: campaignA_instagram_9:16_15s_hook1_cta3_v1

## Guardrails
- **Must Stay Consistent**:
  - Brand elements (logo, colors)
  - Core message
  - Tone and style
- **Can Change**:
  - Hooks
  - CTAs
  - Offers
  - Captions

## Hook System
- **10 Hook Archetypes**:
  1. **Question**: Engage curiosity (Use for educational content)
  2. **Shock**: Startle the audience (Use for breaking news)
  3. **Testimonial**: Share a story (Use for product reviews)
  4. **Statistic**: Present a fact (Use for informative ads)
  5. **Challenge**: Pose a challenge (Use for interactive content)
  6. **Visual**: Start with a striking image (Use for visual products)
  7. **Humor**: Use a joke (Use for light-hearted content)
  8. **Narrative**: Tell a short story (Use for storytelling)
  9. **Comparison**: Show before/after (Use for transformation)
  10. **Urgency**: Create FOMO (Use for limited-time offers)

## CTA System
- **8 CTA Types**:
  1. **Shop Now**: Direct to purchase (Use for e-commerce)
  2. **Learn More**: Drive to website (Use for informational content)
  3. **Sign Up**: Capture leads (Use for newsletters)
  4. **Download**: Offer a resource (Use for e-books)
  5. **Watch More**: Direct to longer content (Use for trailers)
  6. **Follow Us**: Build community (Use for social engagement)
  7. **Share**: Encourage sharing (Use for viral content)
  8. **Get Offer**: Highlight promotions (Use for discounts)

## Captioning Rules
- **Burned-in Captions**: Use for platforms where captions are essential and autoplay is common (e.g., Instagram, TikTok).
- **SRT Files**: Use for platforms that support external captions (e.g., YouTube).

## QC Checklist for Variants
- [ ] Check audio levels across all variants.
- [ ] Ensure branding is consistent.
- [ ] Verify hook effectiveness.
- [ ] Confirm CTA visibility and clarity.
- [ ] Review aspect ratio and cropping.
- [ ] Test caption accuracy and timing.
- [ ] Ensure compliance with platform guidelines.
- [ ] Validate export naming convention.

## Failure Modes + Fixes
- **Inconsistent Branding**: 
  - Fix: Refer to brand guidelines before export.
- **Incorrect Aspect Ratio**: 
  - Fix: Double-check settings in export menu.
- **Weak Hook**: 
  - Fix: Review hook effectiveness; consider A/B testing.
- **Unclear CTA**: 
  - Fix: Simplify language; ensure visibility.
- **Audio Issues**: 
  - Fix: Normalize audio levels in master timeline.
- **Caption Errors**: 
  - Fix: Cross-check captions with original script.
- **Export Naming Mistakes**: 
  - Fix: Use automated scripts for naming consistency.

By following these rules, the OnionReel Variant Engine will streamline the process of creating effective media variants tailored for different platforms and audiences.
