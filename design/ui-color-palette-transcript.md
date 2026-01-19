# UI Color Palette Guide - Video Transcript

**Source:** https://www.youtube.com/watch?v=vvPklRN0Tco

---

## Introduction

Colors are one of those things where the more you learn, the more you realize how much you didn't know before, and it gets complicated real fast. But for UI stuff, you don't need to become a color scientist.

In my experience, colors are honestly the easiest part of the UI. **The tricky bit is knowing when to stop playing and just pick something that works.**

Here's what actually works.

---

## The Three Types of Colors You Need

### 1. Neutral Colors
For background, text, borders, and a lot of other elements.

### 2. Brand/Primary Color
For main actions and to add a bit of character.

### 3. Semantic Colors
Maybe some semantic colors to communicate different states.

**These are all the colors you'll ever need to design apps and UIs.**

---

## Understanding Shades

When I say colors, what I actually mean is **shades**. You will see this everywhere on a UI, like when you hover over a button or a gradient background.

To create shades, you need to pick the right color format.

### The Problem with Hex and RGB

Most people are familiar with hex and RGB color values, but they are the worst when it comes to creating a color palette.

Like these three shades of gray we have for our background colors - they look very similar visually, but the code doesn't make sense.

### The Solution: HSL Format

Now compare that with a more intuitive color format, and the code actually makes sense.

#### HSL Components:

1. **Hue (H)** - The actual color on the color wheel that goes from 0 to 360
2. **Saturation (S)** - Goes from 0 to 100, controls the intensity of that color. In our case, we have set it to zero. That means no matter what color you choose for the hue, it's always going to be neutral.
3. **Lightness (L)** - Used to create a bunch of shades

**Simple and easy math to create a harmonic palette without any guesswork.**

---

## Creating Background Colors (Dark Mode)

Now that we've learned how to play with colors, let's create the most prominent colors of a UI: background and text colors. I'll start with dark mode because let's be honest, it slaps.

### Setting Up the Palette

Saturation can stay at zero because we are creating a neutral palette. Without saturation, hue doesn't matter anyway.

With hue and saturation both set to zero, we will start with:

| Shade | Lightness | Use Case |
|-------|-----------|----------|
| Base | 0% | Base background color |
| Surface | 5% | Cards and other surface elements |
| Raised | 10% | Highlight the most important or raised elements |

**The lighter elements appear on top and feel closer to the user.** So obviously only use them for important stuff.

---

## Creating Text Colors

Same thing with text:

- **Keep a sharper and high contrast color** for headings and important elements
- **Use a slightly muted shade** for the rest - still legible, just not in your face all the time

That's why we don't use 100% lightness for the headings. It would look too harsh on the eyes.

---

## Converting to Light Mode

Speaking of harsh, let's flip these colors for light mode.

### The Process:

1. **Start by subtracting the lightness value from 100** - That'll give you a good starting point
2. **Use your eyes and some common sense to adjust the values manually**

### Example Adjustment:

Why does the top element have the darkest color? Light usually comes from the top, so it should be the lightest and the base color should be the darkest.

That's why I name my background colors as:
- **BG dark** - Will be the darkest
- **BG light** - Will be the lightest shade

Whether it's dark or light mode, the naming stays consistent.

But we can't do that with text colors. So use names that make sense for both cases.

---

## Recap: How We Built the Palette

1. **Picked the HSL color format** so the colors actually make sense in code
2. **Kept hue and saturation at zero** because we want a neutral color palette (without saturation, hue doesn't matter anyway)
3. **Played with the lightness value** to create three shades for the background and two shades for text colors
4. **Flipped these colors for light mode** by subtracting the lightness value from 100
5. **Switched BG dark and BG light** since the original conversion didn't make sense

And that's all we've done so far.

---

## CSS Implementation

### Setting Up Color Variables

```css
:root {
  /* Your default theme goes here */
}

body.light {
  /* The other theme can go in the body selector */
}
```

Then, one line of JavaScript to toggle it back and forth.

Or just wrap your light mode in this media query to automatically adapt to user's preferred theme:

```css
@media (prefers-color-scheme: light) {
  /* Light mode colors */
}
```

There are many ways to do this and your implementation will depend on your framework or how much control you want to give the user. But **the main task is defining your colors** - the rest can be handled by the agent.

---

## Adding Visual Interest: Four More Properties

At this point, our UI looks too boring. So to fix that, we are going to use four more properties.

### 1. Border Color

The border should be clearly visible but not too distracting.

### 2. Gradient

Create a simple gradient using our background colors. If it feels too distracting, we can tweak it a bit and reveal the full gradient on hover.

This way, it looks shiny on top, like the light is coming from above.

### 3. Highlight (Top Border)

To really sell this effect, we can use a lighter color for the top border. I'm calling it "highlight."

### 4. Shadow

Let's add a nice shadow to create some depth because **where there's light, there's a shadow**.

Shadows need some transparency, so you'll need to use an alpha value that goes from 0 to 1.

**Always mix a darker and shorter shadow with a lighter and longer one to achieve a more realistic effect.**

---

## Light Mode Refinements

Now let's see how this looks in light mode. Since we haven't defined our gradients for light mode yet, it's still showing the dark mode version.

### Adjustments Needed:

1. **Highlight in light mode** doesn't look like a highlight, but a plain border. So bump the lightness all the way up.

2. **Border issue** - Now the border doesn't make any sense and looks ugly. Create a new variable that can be applied directly as the border. Then change the border color to match the background color in light mode, so it blends into the card.

---

## Understanding Hue and Saturation

But did you notice we've come this far without even touching hue or saturation?

So, let's see what hue and saturation can do for your designs.

### Using the Tool

I've made a tool that lets you do just that in real time. I've already set the right contrast, gradient, highlight, and shadows. All you need to do is play with hue and saturation.

- **Want a cool and vibrant look?**
- **Or something warm and neutral?**

This lets you try everything and find the perfect balance for your project. Then just flip this switch and see if the light mode needs any tweaking.

Make sure to check all the colors, especially your primary and secondary ones since they're mainly used for buttons and hover states.

Once you're happy with the results, just click the button to copy the colors.

---

## OKLCH: The Modern Color Format

### What is OKLCH?

- **L** = Lightness (same as HSL)
- **C** = Chroma (kind of like saturation, but goes from 0 to 0.4 instead of 0 to 100)
- **H** = Hue (same as before, 0 to 360)

For UI work, you rarely need more than 0.15 or 0.2 chroma.

### Color Format Comparison

| Format | Lightness Range | Saturation/Chroma Range | Hue Range |
|--------|-----------------|------------------------|-----------|
| HSL | 0-100% | 0-100% | 0-360° |
| LCH | 0-100 | 0-0.4 | 0-360° |
| OKLCH | 0-1 | 0-0.2 | 0-360° |

### Why OKLCH is Better

With HSL, the biggest issue is how it handles lightness. **The dark and light shades lose all saturation.**

With LCH and OKLCH, **the increments look way more natural**.

Actually, LCH is a color format on its own. OKLCH is the newer and better version of it. With the V4 update, Tailwind has also switched to OKLCH as the default color format.

---

## Final Thoughts

You can still just copy the HSL code if you want. The theme includes everything - both color formats for dark and light mode. Just copy paste the code into your CSS file and start designing.

---

## Key Takeaways

1. **You only need three types of colors**: Neutral, Primary/Brand, and Semantic
2. **Use HSL or OKLCH** instead of Hex/RGB for creating color palettes
3. **For neutral colors**, set saturation to 0 and only adjust lightness
4. **Lighter elements appear on top** and feel closer to the user
5. **To convert to light mode**, subtract lightness from 100 as a starting point
6. **100% lightness for text is too harsh** - use slightly muted values
7. **Add depth with gradients, highlights, and shadows**
8. **Shadows need transparency** - mix short/dark with long/light shadows
9. **OKLCH handles lightness increments more naturally** than HSL
10. **For UI work**, you rarely need chroma above 0.15-0.2
11. **The highlight should come from the top** (where light comes from)
12. **Name your variables semantically** (BG dark/light) so they work in both modes
