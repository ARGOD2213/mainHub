# Testing checklist

## Mobile — 360/390px
- [ ] No horizontal scrolling.
- [ ] Header Hire me target is at least 44px.
- [ ] Fixed Call / WhatsApp / Email rail is reachable above the browser safe area.
- [ ] Sample-build topology remains readable and does not clip.
- [ ] Contact rows wrap without overflow.

## Keyboard
- [ ] Skip link becomes visible on focus.
- [ ] Header links, buttons, sample topology buttons and contact controls are reachable by Tab.
- [ ] Focus indicators are 3px copper.
- [ ] Architecture dialog closes with its close control and remains keyboard navigable.

## Motion
- [ ] With prefers-reduced-motion enabled, hero sequence is static and GSAP reveals are disabled by CSS/GSAP trigger behavior.
- [ ] Normal motion runs once on hero load; no background animation is added.

## WebGL fallback
- [ ] Disable WebGL in browser/device settings.
- [ ] Hero renders the SVG board fallback instead of a blank region.

## Contact
- [ ] With EmailJS keys unset, direct email/phone/WhatsApp links are visible.
- [ ] When EmailJS is configured, verify idle, sending, success and error states before enabling the form.

## Accessibility
- [ ] Exactly one h1.
- [ ] Semantic header/main/nav/section landmarks.
- [ ] Visible 3px focus ring.
- [ ] Text remains readable at 200% zoom.

## Release
- [ ] Run Lighthouse mobile.
- [ ] Check the deployed site at 390px and 1440px.
- [ ] Confirm no fabricated client, testimonial, revenue, user-count, trusted-by, or shipped-real-IoT claims.
