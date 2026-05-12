 ---
name: SeatNow
description: Premium restaurant discovery and booking platform.
colors:
  primary: "#630ed4"
  primary-container: "#7c3aed"
  secondary: "#6e3aca"
  tertiary: "#7d3d00"
  surface: "#f8f9fa"
  neutral-bg: "#f8f9fa"
  on-background: "#191c1d"
  on-surface: "#191c1d"
  outline: "#7b7487"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  lg: "2rem"
  xl: "3rem"
  md: "0.75rem"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "0.5rem"
    padding: "1rem 2rem"
  restaurant-card:
    backgroundColor: "#ffffff"
    rounded: "0.75rem"
    padding: "2rem"
---

# Design System: SeatNow

## 1. Overview

**Creative North Star: "The Digital Maître D'"**

SeatNow is designed to feel like an elite concierge service. It combines the sophistication of fine dining with the efficiency of modern technology. The interface is spacious, allowing high-quality restaurant imagery to breathe, while keeping critical booking actions always within reach. We reject the cluttered, high-urgency tropes of delivery apps in favor of a calm, premium atmosphere.

**Key Characteristics:**
- Refined violet-led palette.
- High-contrast typography for legibility.
- Sublte, purposeful motion using exponential curves.
- Intentional use of whitespace to signify luxury.

## 2. Colors

The palette is anchored by a deep, sophisticated violet that signals premium service and technological confidence.

### Primary
- **Deep Violet** (#630ed4): Used for primary actions, branding, and highlighting active states. It carries the weight of the interface's authority.

### Neutral
- **Ghost White** (#f8f9fa): The standard background color. It's cool, clean, and provides a neutral canvas for restaurant photography.
- **Ink Black** (#191c1d): Used for primary text and headings to ensure maximum contrast and authority.

### Named Rules
**The 10% Accent Rule.** The primary violet is used on ≤10% of any given screen. Its rarity is what makes it feel premium and intentional.

## 3. Typography

**Display Font:** Plus Jakarta Sans
**Body Font:** Plus Jakarta Sans

We use a single, versatile geometric sans-serif to maintain a modern, technical, yet approachable feel.

### Hierarchy
- **Display** (700, 3.5rem, 1.1): Used for main hero headings.
- **Headline** (600, 1.375rem, 1.2): Used for restaurant names and section titles.
- **Body** (400, 1rem, 1.5): Used for descriptions and general content. Max line length capped at 70ch.
- **Label** (700, 0.625rem, uppercase): Used for tags, cuisine types, and meta-data.

## 4. Elevation

We use a flat-by-default strategy, relying on tonal layering and subtle borders for structure. Shadows are reserved for interaction and focus.

### Shadow Vocabulary
- **Interactive Lift** (0 10px 25px -5px rgba(0, 0, 0, 0.1)): Used on hover for cards and primary buttons to signify depth and clickability.

## 5. Components

### Buttons
- **Shape:** Rounded (0.5rem)
- **Primary:** Deep Violet background, white text. Bold weight.
- **Secondary:** White/Glass background, Ink Black text, backdrop-blur (12px).

### Cards
- **Restaurant Card:** White background, subtle border (#f1f5f9), rounded corners (0.75rem). Image takes top half.

## 6. Do's and Don'ts

### Do:
- **Do** use OKLCH for any new color derivations to maintain perceptual uniformity.
- **Do** tint all neutrals toward the primary violet (chroma 0.005).
- **Do** use `ease-out-expo` for all entrance animations.

### Don't:
- **Don't** use generic #000 or #fff. Always use the Neutral Ink or Ghost variants.
- **Don't** use side-stripe borders on cards or alerts.
- **Don't** use gradient text on headings.
- **Don't** use identical card grids for more than 2 sections on the same page.
