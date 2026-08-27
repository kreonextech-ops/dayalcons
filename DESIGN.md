---
name: Industrial Organic
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#44474a'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#75777a'
  outline-variant: '#c5c6ca'
  surface-tint: '#5d5e61'
  primary: '#000101'
  on-primary: '#ffffff'
  primary-container: '#1a1c1e'
  on-primary-container: '#838486'
  inverse-primary: '#c6c6c9'
  secondary: '#914d00'
  on-secondary: '#ffffff'
  secondary-container: '#fc9430'
  on-secondary-container: '#663500'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca730'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e5'
  primary-fixed-dim: '#c6c6c9'
  on-primary-fixed: '#1a1c1e'
  on-primary-fixed-variant: '#454749'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  section-overlap: -64px
  fluid-gap: clamp(24px, 5vw, 64px)
  container-max: 1440px
  margin-mobile: 20px
  margin-desktop: 80px
---

## Brand & Style

This design system establishes a high-end, architectural presence for Dayal Construction. It blends the raw, structural integrity of the construction industry with a modern, editorial aesthetic characterized by "anti-grid" layouts—where elements breathe, overlap, and break traditional container boundaries.

The personality is **authoritative, innovative, and precise**. It avoids the clutter of traditional corporate construction sites in favor of a **Modern Minimalist** style with **Tactile** influences. Large-scale imagery of raw materials (concrete, steel, glass) is paired with fluid, organic transitions to signify that while the materials are hard, the vision is fluid and human-centric.

The target audience includes developers, architects, and high-net-worth clients who value both structural reliability and sophisticated design.

## Colors

The palette is rooted in the "site and studio" dichotomy. 
- **Deep Charcoal (#1A1C1E):** Represents steel and structural depth; used for primary backgrounds and high-impact typography.
- **Safety Orange (#F28C28):** A nod to industrial high-visibility, used sparingly for critical calls to action and structural accents.
- **Architectural Gold (#D4AF37):** Softens the palette, bringing a sense of premium craft and "golden hour" lighting to finished projects.
- **Industrial Grays & Off-White:** Provide a neutral canvas that mimics concrete and architectural vellum.

Color application should follow a 60-30-10 rule, where the dark charcoal and neutral grays dominate, with the orange/gold reserved for focus points.

## Typography

The typography strategy focuses on "Structural Scale." **Montserrat** is used for headlines to provide a geometric, foundation-like feel. Large display sizes should use tight letter-spacing to feel like monolithic blocks of text.

**Hanken Grotesk** serves as the functional workhorse. It is a highly legible, modern grotesque that handles technical data and long-form project descriptions with professional clarity. For architectural metadata (e.g., "SQ FT," "LOCATION"), use the `label-caps` style to mimic technical drawings.

## Layout & Spacing

This design system utilizes an **Organic Anti-Grid**. While a 12-column underlying structure exists for alignment, elements are encouraged to "float" and "bleed."

- **Overlapping Sections:** Key content blocks should use the `section-overlap` token to stack vertically, creating a sense of physical layers (like floor plans).
- **Asymmetric Balance:** Instead of centering content, use heavy left or right weighting with large "void" spaces to emphasize scale.
- **Fluid Cards:** Cards do not have fixed heights; they scale with content and use `fluid-gap` to maintain a sense of airiness even when content is dense.
- **Breakpoints:** 
  - *Mobile (<768px):* Single column, minimal overlapping to maintain legibility.
  - *Tablet (768px - 1024px):* Reduced margins, introduction of 2-column staggered layouts.
  - *Desktop (>1024px):* Full expressive anti-grid with deep overlaps.

## Elevation & Depth

Depth is conveyed through **Architectural Layering** rather than traditional drop shadows.

1.  **Tonal Stacking:** Darker surfaces are perceived as "further back" or "structural," while lighter neutral surfaces are "closer" to the user.
2.  **Subtle Architectural Textures:** Use low-opacity noise or grain textures (mimicking concrete or brushed metal) on background layers to provide tactile depth.
3.  **Low-Contrast Outlines:** For interactive elements on light backgrounds, use 1px solid borders in Industrial Gray (#D1D1D6) instead of shadows.
4.  **Parallax Overlaps:** When scrolling, overlapping cards should move at slightly different speeds to emphasize the Z-axis.

## Shapes

The shape language is **"Refined Structural."** While construction is often associated with hard 90-degree angles, this design system uses `roundedness: 2` (0.5rem base) to suggest modern architectural finishes and "human-centric" engineering.

- **Standard Elements:** Buttons and input fields use a consistent 0.5rem radius.
- **Large Fluid Cards:** Use `rounded-xl` (1.5rem) to make large imagery feel contained and polished.
- **Iconography:** Use thick-stroke linear icons with slightly rounded caps to match the geometric weight of the Montserrat typeface.

## Components

### Buttons
- **Primary:** Deep Charcoal background, white text, 0.5rem radius. High-contrast hover state using Architectural Gold.
- **Action:** Safety Orange background, reserved exclusively for "Request Quote" or "Emergency Services."
- **Ghost:** 1px Industrial Gray border, no fill, for secondary navigation.

### Cards & Sections
- **Project Cards:** Large-scale imagery with text overlapping the bottom-left corner. Use a subtle gradient overlay to ensure text legibility.
- **Organic Clusters:** Groups of 3 images of varying sizes (one portrait, two landscape) that overlap slightly to create an "architect's mood board" effect.

### Input Fields & Controls
- **Fields:** Underlined style with a subtle background tint. The focus state changes the underline to Safety Orange.
- **Checkboxes:** Square with sharp corners (0.125rem radius) to maintain a technical, "blueprint" feel.

### Navigation
- **Header:** Transparent on scroll-start, blurring into a semi-transparent Deep Charcoal backdrop as the user moves down the page.
- **Floating Menu:** On mobile, a pill-shaped floating action button (FAB) in the bottom-right for quick contact.