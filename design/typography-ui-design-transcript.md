# Typography in UI Design - Video Transcript

**Source:** https://www.youtube.com/watch?v=9-oefwZ6Z74

---

## Introduction: The Importance of Typography

Most of the UIs are just text and buttons with some icons to help users take necessary actions. So mastering typography is that 20% of the design that gives you the 80% of the results.

## Demonstrating Typography's Impact

Let's start by removing all the font styles from this very popular UI. On the left sidebar, we broke the selected tab - that's definitely bad for user experience. We have no idea where we are right now. Same thing for the buttons on top.

Now coming to the feed itself, there is no hierarchy and point of focus, so it's tough to tell what we are looking at. It's just a bunch of text. Looking at the original shows the impact of typography in UI design.

## Building Typography from Scratch

Let's try to build it from scratch. The most obvious thing is to make the title bigger and a bit bolder than the rest of the elements.

Did you notice the gap here? It's not gap, margin, or padding - it's the line height doing its thing. But more on that later.

For now, we have a UI that is almost there, but we can make it better. Right now, this whole thing looks like one single block of information, like we are telling the user "hey, you better read this as well."

But we know that the title is connected to the thumbnail, and users should look at these two together before moving on to the other elements. In short, we don't just want the title to stand out - we also need it to stand on its own, separate from this group.

## Understanding Visual Grouping

To do that, we need to understand how the human brain recognizes shapes and patterns.

What do you see here? How can we separate them into two groups?

1. **Spacing:** We could space them out like this, but people might still get confused between one group of six circles or two groups of three circles.

2. **Size:** This is also confusing - some might see this as three groups instead of the two we intended.

3. **Color:** It's still not clear enough if it's three or two groups.

4. **Position:** But if we just move the second group a bit down, it becomes very clear that it's two groups instead of three.

You can validate this by showing it to your friends or colleagues.

## Key Properties for Visual Hierarchy

Now let's retrace our steps before we go back to fonts. You are going to need **size**, **color**, and **spacing** to group or separate elements.

Technically, spacing falls under the law of proximity, but it's used for the same purpose - to group or separate elements. Speaking of laws, you can also use shape to group elements, but it doesn't help us in this case. However, we do have font weight - more on that later.

## Applying Typography Principles

For now, let's get back to the UI we were designing earlier. From what we just observed, we already have these three properties to emphasize and separate the title from this group. All we need is color.

But which color? White on black is already at the max contrast possible. So to emphasize this, we need to **de-emphasize that**.

The easiest way to do that is by tweaking the lightness value and seeing what works best. In our case, 60% lightness is the sweet spot for keeping the text readable and still emphasizing the title.

This is a pretty brilliant technique in UI design.

---

## Understanding HSL Color

For now, you just have to understand the HSL color function and how it's used in UI design. It's short for **Hue, Saturation, and Lightness**.

### Hue
- The type of color you want (like red, green, or blue)
- Measured in degrees on a color wheel
- Starts at 0 with red, 120 is green, and 240 is blue
- Think of it as picking the base color

### Saturation
- Controls the intensity of that base color
- A saturation of 100% gives you the most intense version of the color
- 0% turns it into a shade of gray

### Lightness
- Controls the brightness
- At 50% you get the base color
- At 0 it's black, and at 100 it's white

So:
- Hue represents color values that range from 0 to 360
- Saturation is the intensity measured in percentage
- Lightness is a percentage that controls the brightness

To assign a color, we use these values inside the HSL function. For this video, all we need is the lightness value. After all, this video is about font styles, not colors.

---

## Practical Application

That's exactly what we did here. This has a lightness of 100%, and this one has 60.

Using the same concept, we can:
- Wrap this inside a card and give the card 10 or 20% lightness
- Apply the base color to this group and see if it works

We'll check that in a minute, but first we need a lighter color for the title because the base color won't work in this case. 90% looks good, but the base color is a bit dark for this group, so I'm going to bump it up to 70 and see if that does the job.

I think it will work, but let's zoom out and see how it looks on a real UI. We want to check if the title stands out and if the group is legible. Ideally, you'd test this with real users, but you can also show it to friends or colleagues for feedback.

And by the way, this is just using a lighter color to highlight the active tab. Lighter shades appear on top, making them more important.

---

## Designing a Subscription List UI

Before we move forward with the rest of the video, let's improve this UI using the basic concepts we've learned. We have a list of channels the user is subscribed to. How can we provide a better user experience?

### Problems:
1. There is no hierarchy - everything just looks like a blob of text
2. The button needs to stand out

### Solutions:
1. Add some size and weight to emphasize the title
2. Use a darker color and smaller size to de-emphasize the username
3. Use a lighter color to highlight the button

But the button doesn't look quite right here. Let's move it to the right and wrap everything inside a card. It's looking much better now.

The button still looks a bit bulky though. Let's reduce the font size to match the username. It looks good, but remember we're zoomed in. We need to check if it works at the original size.

The username might be hard to read. It could use some weight, and so could the button. I'll leave it to you to judge the design.

---

## Font Sizes You Actually Need

For now, let's shift gears. These are all the font sizes you need to design 99% of apps and UIs. And if you want, just these three, combined with weight and color, are enough to build an entire UI.

### Real-World Examples

How many font sizes do you see here? These all have the same font size of 16 pixels, except for this one. The impact of weight and color on font size is pretty wild.

So you don't need many sizes to create hierarchy. Combining size, weight, and color can do the trick.

I'm not saying you should create a type scale like this (too few options), but this won't help you much either (too many options). You'll probably need something more like this.

Yep, that's it. Everything you see is 14 pixels except for the title and the two headings. It's the same on this video page - everything is 14 pixels except for the title and the channel name.

---

## Creating Your Type Scale

For your project, just pick a base font size - either 14 or 16 pixels, regular weight, and 100% lightness. I'll get to light mode in a minute, but let's finish this first.

Once you've picked your base font, try designing everything with that size. And when you absolutely need to, go two pixels up or down from there. That's it. That's your type scale.

### CSS Implementation

To make things easier, assign them as global variables. This isn't a CSS video, but here's how you can do it:

1. First, set the font weight
2. Then the font size and line height
3. And finally, the font family

Any popular font will work just fine. You can get them for free from Google.

First, convert the pixel unit to a rem value - we want our app to follow accessibility guidelines so users should be able to adjust the font size if they need to.

Secondly, this rem value is very important. Remember this gap? This is crucial for the title to stand out and stand alone. In most cases, we don't need to manually add a gap or margin - **the line height takes care of it automatically**, acting as the margin bottom for text elements.

So your global variables might look something like this. And that's it - this is all you need to build a top-tier UI.

### Important Note on Hierarchy

But keep in mind: not all H1 elements will share the same font style. **Code for document hierarchy, but style for visual hierarchy.**

You might think this is the obvious solution, but it should actually look something like this. Use your common sense to judge what the user will focus on and emphasize that text.

Once you're happy with the design, zoom out and view the entire UI. Font size is a relative unit, meaning it depends on its neighboring elements.

Right now, both are competing for attention. Let's try a bigger font size and see if that works. Big bold fonts can often be too harsh on the eyes, so let's bring the weight down and see if that works.

It looks good, but this is a dynamic number, so we need to account for that as well. **Don't just design for visual hierarchy - design for functionality too.**

---

## Converting to Light Mode

Let's now wrap things up by converting this design to light mode. It's much easier than you think.

Let's start with these three colors: white, gray, and black. As I said earlier, all you need is this L value. So always use HSL instead of hex or RGB.

### The Simple Formula

The background is pure black, so the light mode will be pure white. But if you look at the L value, we just did a simple calculation there:

**Subtract the L value from 100.**

That's all you need to do with these colors too.

### Applying to Complex UIs

Let's do the same thing with this UI which has a lot of colors in it - some used for gradient backgrounds and others for text labels and buttons.

Here's what those colors look like on a light background without any modifications. And if we subtract the L value from 100, they'll look something like this.

Now all you have to do is switch out the colors with the help of CSS variables.

---

## Summary

I could keep going, but remember - this video is about font styles, not colors. You can check out this color generator on my website. This could help you break out of the typical gray color scheme. The link will be in the description, just below the like and subscribe buttons.

---

## Key Takeaways

1. **Typography is crucial** - It's the 20% that gives you 80% of design results
2. **Use size, color, and spacing** to create visual hierarchy
3. **HSL is your friend** - Focus on the Lightness value for emphasis
4. **You only need 2-3 font sizes** - Combined with weight and color variations
5. **Line height creates natural spacing** - Use it instead of manual margins
6. **Code for document hierarchy, style for visual hierarchy**
7. **Light mode conversion** - Simply subtract L value from 100
8. **Always use rem units** for accessibility
9. **Test with real users** or get feedback from colleagues
10. **Design for functionality**, not just visual hierarchy
