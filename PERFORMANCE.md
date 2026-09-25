# Performance notes

## Implemented
- Hero copy and CTAs render before the Three.js chunk through React.lazy/Suspense.
- Canvas DPR is capped at 1.5.
- Reduced-motion disables the hero sequence, board rotation and GSAP motion.
- Post-processing is disabled on touch-capable/mobile layouts.
- The board is procedural: no downloaded 3D asset files.
- WebGL fallback is an inline SVG.
- Architecture diagrams are deterministic SVG and do not load image assets.
- Optional EmailJS form configuration is absent, so direct contact is shown.

## Verification
CI runs `npm install --legacy-peer-deps` followed by `npm run build`. The latest verified run on `portfolio-v3` completed successfully.

## Metrics
Lighthouse has not been run in this environment, so no Lighthouse score or LCP claim is presented as measured data. Run Lighthouse at the deployed URL on a 390px viewport before release and record the actual Performance, Accessibility and SEO scores here.
