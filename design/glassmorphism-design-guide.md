# Glassmorphism Design Guide

> A comprehensive guide to implementing glassmorphism effects in modern UI design, with emphasis on dark mode, accessibility, and performance.

---

## What is Glassmorphism?

Glassmorphism is a UI design trend that mimics the appearance of frosted or etched glass. It creates translucent, layered interfaces with visual depth while maintaining content readability.

**Core Visual Properties:**
- Background blur (`backdrop-filter`)
- Semi-transparent backgrounds
- Subtle borders (often white with low opacity)
- Soft shadows for depth
- Layered composition

---

## When to Use Glassmorphism

### Ideal Use Cases

| Element | Why It Works |
|---------|--------------|
| Navigation bars | Creates visual hierarchy without heavy weight |
| Modal dialogs | Maintains context with underlying content |
| Cards (primary focus) | Elevates important content above others |
| Hero sections | Adds sophistication over gradient backgrounds |
| Floating action buttons | Draws attention while feeling lightweight |
| Sidebars | Provides separation without harsh boundaries |

### When to Avoid

- Every component on screen (loses impact through overuse)
- Over busy, high-contrast backgrounds
- Text-heavy content areas where readability is critical
- Low-powered devices or performance-critical applications
- Stacking multiple blurred elements (expensive to render)

---

## Core CSS Implementation

### Basic Glass Effect

```css
.glass {
  /* Semi-transparent background */
  background: oklch(1 0 0 / 0.15);

  /* The magic - blur what's behind */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */

  /* Subtle border for definition */
  border: 1px solid oklch(1 0 0 / 0.2);

  /* Soft shadow for depth */
  box-shadow: 0 8px 32px oklch(0 0 0 / 0.1);

  /* Rounded corners enhance the effect */
  border-radius: 16px;
}
```

### Blur Values Guide

| Blur Amount | Effect | Use Case |
|-------------|--------|----------|
| 4-6px | Subtle frost | Overlays on clean backgrounds |
| 8-10px | Standard glass | Most UI cards and panels |
| 12-15px | Heavy frost | Hero sections, modals |
| 20-30px | Dramatic blur | Artistic effect, high performance cost |

**Recommendation:** Start with `blur(10px)` and adjust based on context. Higher values are more expensive to render.

### Transparency Values

| Opacity | Light Mode | Dark Mode |
|---------|------------|-----------|
| 0.05-0.10 | Very subtle | Standard glass |
| 0.15-0.20 | Standard | Slightly opaque |
| 0.25-0.30 | More visible | Text areas |
| 0.40-0.50 | Semi-opaque | Fallback for readability |

---

## Dark Mode Glassmorphism

Dark glassmorphism requires different values than light mode. The effect should feel like tinted glass with subtle luminosity.

### Dark Glass CSS

```css
.glass-dark {
  /* Dark semi-transparent base */
  background: oklch(0 0 0 / 0.25);

  /* Slightly less blur for dark mode */
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);

  /* Subtle light border on top edge */
  border: 1px solid oklch(1 0 0 / 0.08);

  /* Softer shadows in dark mode */
  box-shadow:
    0 8px 32px oklch(0 0 0 / 0.3),
    inset 0 1px 0 oklch(1 0 0 / 0.05);

  border-radius: 16px;
}
```

### Dark Mode Color Values

```css
:root {
  /* Dark glass backgrounds */
  --glass-bg-dark: oklch(0 0 0 / 0.25);
  --glass-bg-dark-hover: oklch(0 0 0 / 0.35);

  /* Alternative: colored dark glass (slate-900 equivalent) */
  --glass-bg-tinted: oklch(0.15 0.02 250 / 0.6);

  /* Borders - avoid pure white */
  --glass-border-dark: oklch(1 0 0 / 0.08);
  --glass-border-dark-hover: oklch(1 0 0 / 0.12);

  /* Inner highlights - very subtle */
  --glass-highlight-dark: oklch(1 0 0 / 0.05);

  /* Shadows - deeper in dark mode */
  --glass-shadow-dark: 0 8px 32px oklch(0 0 0 / 0.4);
}
```

### Key Differences: Light vs Dark

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `oklch(1 0 0 / 0.15)` | `oklch(0 0 0 / 0.25)` |
| Border | `oklch(1 0 0 / 0.2)` | `oklch(1 0 0 / 0.08)` |
| Shadow opacity | 10-20% | 30-40% |
| Blur amount | 10-15px | 8-12px |
| Saturation boost | Optional | Recommended (180%) |
| Inner highlight | Strong | Very subtle |

---

## Creating Realistic Depth

### The Light Direction Principle

Glassmorphism looks most realistic when all elements share a consistent light source direction. Typically, light comes from the top or top-left.

```css
.glass-elevated {
  background: oklch(1 0 0 / 0.15);
  backdrop-filter: blur(10px);

  /* Combined shadow system: light top + dark bottom */
  box-shadow:
    /* Top highlight - simulates light hitting the top edge */
    inset 0 1px 0 0 oklch(1 0 0 / 0.4),

    /* Bottom shadow - creates depth */
    0 1px 3px oklch(0 0 0 / 0.15),
    0 4px 12px oklch(0 0 0 / 0.1);

  border-radius: 16px;
}
```

### Multi-Layer Shadow System

For more sophisticated depth, combine multiple shadows:

```css
.glass-deep {
  background: oklch(1 0 0 / 0.12);
  backdrop-filter: blur(12px);

  box-shadow:
    /* Inner top highlight */
    inset 0 1px 0 0 oklch(1 0 0 / 0.3),

    /* Inner glow for luminosity */
    inset 0 4px 20px oklch(1 0 0 / 0.15),

    /* Short, sharp shadow */
    0 2px 4px oklch(0 0 0 / 0.1),

    /* Long, soft shadow */
    0 8px 32px oklch(0 0 0 / 0.15);
}
```

### Inset (Recessed) Glass Effect

For elements that should appear pushed into the surface:

```css
.glass-inset {
  background: oklch(0 0 0 / 0.08);
  backdrop-filter: blur(6px);

  box-shadow:
    /* Dark top shadow - light blocked from above */
    inset 0 2px 4px oklch(0 0 0 / 0.15),

    /* Light bottom edge - reflected light */
    inset 0 -1px 0 oklch(1 0 0 / 0.1);
}
```

---

## Apple Liquid Glass Effect (2026)

Apple's iOS 26 introduced "Liquid Glass" - an evolution of glassmorphism with flowing, organic highlights.

### Liquid Glass CSS

```css
.liquid-glass {
  position: relative;
  background: oklch(1 0 0 / 0.15);
  backdrop-filter: blur(2px) saturate(180%);
  -webkit-backdrop-filter: blur(2px) saturate(180%);
  border: 1px solid oklch(1 0 0 / 0.8);
  border-radius: 2rem;
  box-shadow:
    0 8px 32px oklch(0.25 0.05 265 / 0.2),
    inset 0 4px 20px oklch(1 0 0 / 0.3);
}

/* Liquid shine highlight layer */
.liquid-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  background: oklch(1 0 0 / 0.1);
  border-radius: inherit;
  backdrop-filter: blur(1px);
  box-shadow:
    inset -10px -8px 0px -11px oklch(1 0 0 / 1),
    inset 0px -9px 0px -8px oklch(1 0 0 / 1);
  opacity: 0.6;
  z-index: -1;
  filter: blur(1px) drop-shadow(10px 4px 6px oklch(0 0 0)) brightness(115%);
  pointer-events: none;
}
```

### Key Liquid Glass Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `saturate(180%)` | Color boost | Makes colors behind more vibrant |
| `brightness(115%)` | Light boost | Enhances luminosity |
| Inset shadows | Multiple | Creates light refraction effect |
| `::after` layer | z-index: -1 | Highlight layer behind content |

---

## Integration with OKLCH Colors

OKLCH provides perceptually uniform colors, making it easier to create consistent glass effects across themes.

### Glass Colors in OKLCH

```css
:root {
  /* Glass backgrounds using OKLCH */
  --glass-bg: oklch(1 0 0 / 0.15);           /* White at 15% */
  --glass-bg-hover: oklch(1 0 0 / 0.2);      /* White at 20% */

  /* Tinted glass (blue-violet) */
  --glass-bg-tinted: oklch(0.65 0.1 265 / 0.1);

  /* Dark glass backgrounds */
  --glass-bg-dark: oklch(0 0 0 / 0.25);
  --glass-bg-dark-tinted: oklch(0.15 0.02 250 / 0.6);

  /* Borders */
  --glass-border: oklch(1 0 0 / 0.2);
  --glass-border-dark: oklch(1 0 0 / 0.08);

  /* Shadows - using oklch for consistency */
  --glass-shadow-color: oklch(0 0 0 / 0.15);
  --glass-shadow-color-dark: oklch(0 0 0 / 0.4);
}
```

### Combining with the 4-Layer System

```css
:root {
  /* Base layers (solid) */
  --color-bg-base: oklch(0.12 0.015 250);
  --color-bg-subtle: oklch(0.15 0.015 250);
  --color-bg-surface: oklch(0.18 0.015 250);
  --color-bg-elevated: oklch(0.22 0.015 250);

  /* Glass variants (semi-transparent) */
  --color-glass-surface: oklch(0.22 0.015 250 / 0.6);
  --color-glass-elevated: oklch(0.28 0.015 250 / 0.5);

  /* Glass over gradients */
  --color-glass-overlay: oklch(0.18 0.015 250 / 0.7);
}
```

---

## Accessibility Requirements

### WCAG Contrast Standards

| Text Type | Minimum Ratio | Glassmorphism Challenge |
|-----------|---------------|------------------------|
| Normal text | 4.5:1 | Background varies behind glass |
| Large text (18px+) | 3:1 | Easier to achieve |
| UI components | 3:1 | Icons, buttons, borders |

### Making Glass Accessible

```css
/* Accessible glass card */
.glass-accessible {
  background: oklch(1 0 0 / 0.15);
  backdrop-filter: blur(10px);

  /* Higher opacity overlay behind text */
  position: relative;
}

.glass-accessible::before {
  content: '';
  position: absolute;
  inset: 0;
  background: oklch(0 0 0 / 0.3);
  border-radius: inherit;
  z-index: -1;
}

/* Text shadow for improved legibility */
.glass-accessible h1,
.glass-accessible p {
  text-shadow: 0 1px 2px oklch(0 0 0 / 0.2);
}
```

### Respecting User Preferences

```css
/* Reduce transparency for users who prefer it */
@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: oklch(1 0 0 / 0.9);
    backdrop-filter: none;
  }

  .glass-dark {
    background: oklch(0.15 0 0 / 0.95);
    backdrop-filter: none;
  }
}

/* Reduce motion for vestibular conditions */
@media (prefers-reduced-motion: reduce) {
  .glass {
    transition: none;
  }

  /* Reduce blur which can cause discomfort */
  .glass {
    backdrop-filter: blur(4px);
  }
}
```

### Browser Fallback Pattern

```css
/* Solid fallback first */
.glass {
  background: oklch(1 0 0 / 0.9);
}

/* Enhanced glass for supporting browsers */
@supports (backdrop-filter: blur(10px)) {
  .glass {
    background: oklch(1 0 0 / 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
```

---

## Performance Optimization

### Cost of Glass Effects

| Technique | Performance Impact | Notes |
|-----------|-------------------|-------|
| `backdrop-filter: blur()` | High | GPU-intensive |
| Multiple glass layers | Very High | Compounds quickly |
| Animated blur | Extreme | Avoid if possible |
| Large blur values (20px+) | High | Diminishing visual returns |
| Pre-blurred images | Low | Good fallback strategy |

### Optimization Strategies

```css
/* Enable GPU acceleration */
.glass {
  transform: translateZ(0);
  will-change: transform;
}

/* Limit glass elements per viewport */
/* Recommendation: 2-3 maximum */

/* Reduce blur on mobile */
@media (max-width: 768px) {
  .glass {
    backdrop-filter: blur(6px);
  }
}

/* Use simpler effect for low-power mode */
@media (prefers-reduced-motion: reduce) {
  .glass {
    backdrop-filter: blur(4px);
    background: oklch(1 0 0 / 0.4);
  }
}
```

### Pre-Blurred Background Fallback

For performance-critical applications, use a pre-blurred background image instead of `backdrop-filter`:

```css
/* Container with pre-blurred background */
.glass-container {
  position: relative;
}

.glass-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('background-blurred.jpg');
  background-size: cover;
  z-index: -1;
}

.glass-panel {
  background: oklch(1 0 0 / 0.2);
  /* No backdrop-filter needed */
}
```

---

## Complete Component Examples

### Glass Card (Dark Theme)

```css
.glass-card {
  background: oklch(1 0 0 / 0.08);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);

  border: 1px solid oklch(1 0 0 / 0.1);
  border-radius: 1rem;

  box-shadow:
    inset 0 1px 0 0 oklch(1 0 0 / 0.05),
    0 4px 12px oklch(0 0 0 / 0.25),
    0 8px 32px oklch(0 0 0 / 0.15);

  padding: 1.5rem;
}

.glass-card:hover {
  background: oklch(1 0 0 / 0.12);
  border-color: oklch(1 0 0 / 0.15);
  box-shadow:
    inset 0 1px 0 0 oklch(1 0 0 / 0.08),
    0 8px 24px oklch(0 0 0 / 0.3),
    0 16px 48px oklch(0 0 0 / 0.2);
  transform: translateY(-2px);
}
```

### Glass Navigation Bar

```css
.glass-navbar {
  position: sticky;
  top: 0;
  z-index: 50;

  background: oklch(1 0 0 / 0.1);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);

  border-bottom: 1px solid oklch(1 0 0 / 0.1);

  box-shadow: 0 4px 16px oklch(0 0 0 / 0.1);
}
```

### Glass Modal

```css
.glass-modal-backdrop {
  position: fixed;
  inset: 0;
  background: oklch(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
}

.glass-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: oklch(1 0 0 / 0.12);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  border: 1px solid oklch(1 0 0 / 0.15);
  border-radius: 1.5rem;

  box-shadow:
    inset 0 1px 0 0 oklch(1 0 0 / 0.1),
    0 24px 48px oklch(0 0 0 / 0.3);

  padding: 2rem;
  max-width: 500px;
  width: 90vw;
}
```

---

## Tailwind CSS Integration

### Custom Utilities

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, oklch(1 0 0 / 0.1) 0%, oklch(1 0 0 / 0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px oklch(0 0 0 / 0.1)',
        'glass-inset': 'inset 0 1px 0 0 oklch(1 0 0 / 0.1)',
        'glass-deep': '0 8px 32px oklch(0 0 0 / 0.1), inset 0 1px 0 0 oklch(1 0 0 / 0.1)',
      },
      colors: {
        glass: {
          white: 'oklch(1 0 0 / <alpha-value>)',
          black: 'oklch(0 0 0 / <alpha-value>)',
          tinted: 'oklch(0.15 0.02 250 / <alpha-value>)',
        },
      },
    },
  },
}
```

### Utility Classes

```html
<!-- Basic glass card (using custom glass colors) -->
<div class="bg-glass-white/10 backdrop-blur-md border border-glass-white/20 rounded-2xl shadow-glass p-6">
  Content here
</div>

<!-- Dark glass card with hover -->
<div class="bg-glass-black/25 backdrop-blur-lg backdrop-saturate-150 border border-glass-white/10 rounded-xl shadow-glass-deep hover:bg-glass-black/30 hover:border-glass-white/15 transition-all">
  Content here
</div>

<!-- Tinted glass for sidebar -->
<div class="bg-glass-tinted/60 backdrop-blur-xl border border-glass-white/8 rounded-2xl">
  Content here
</div>
```

---

## Browser Support

| Browser | backdrop-filter | Notes |
|---------|-----------------|-------|
| Chrome | 76+ | Full support |
| Safari | 9+ | Requires `-webkit-` prefix |
| Firefox | 103+ | Full support |
| Edge | 79+ | Full support |
| iOS Safari | 9+ | Full support |
| Android Chrome | 76+ | Full support |

---

## Key Takeaways

1. **Use sparingly** - Reserve glass for 2-3 key elements, not everything
2. **Design the background** - Glass only works with a designed environment behind it
3. **Consistent light direction** - All highlights and shadows should align
4. **Accessibility first** - Maintain 4.5:1 contrast for text, provide fallbacks
5. **Test both themes** - Light and dark mode require different values
6. **Performance matters** - Limit blur, avoid animation, use GPU acceleration
7. **Provide fallbacks** - Use `@supports` for browsers without `backdrop-filter`
8. **Respect preferences** - Honor `prefers-reduced-transparency` and `prefers-reduced-motion`

---

## Sources

- [UXPilot: Glassmorphism UI Features and Best Practices](https://uxpilot.ai/blogs/glassmorphism-ui)
- [Axess Lab: Glassmorphism Meets Accessibility](https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/)
- [OpenReplay: Create Glassmorphic UI with Pure CSS](https://blog.openreplay.com/create-glassmorphic-ui-css/)
- [Alpha Efficiency: Dark Mode Glassmorphism](https://alphaefficiency.com/dark-mode-glassmorphism)
- [DEV Community: Apple's Liquid Glass Effect](https://dev.to/kevinbism/recreating-apples-liquid-glass-effect-with-pure-css-3gpl)
- [Glass UI Library](https://ui.glass/)