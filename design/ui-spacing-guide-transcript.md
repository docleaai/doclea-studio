# The Easy Way to Pick Right Spacing

## Introduction

Let's start by setting the right spacing for this list. Should I make it tighter or more spacious? Should I keep the same space for the heading or move it a bit further or closer to the list?

But before we start, I need to clarify a few points. This is a 27 in 2K monitor. So, I have scaled the design to make things legible at smaller screen sizes as well.

## Using REM Instead of Pixels

Throughout the video, most of the font size is 1 rem, which is 16 pixels. I will use rem instead of pixels because we want our spacing to scale with the font size. This helps create a spacing system that is consistent and useful for any UI you can imagine.

### The Spacing System

For instance, let's look at this list as an example. If we want to try a smaller gap, we don't have to guess a random pixel value. We can just go like this. And we can do the same for higher values as well.

**Just increment by 0.25 rem or 4 pixels.**

So at a smaller scale the spacing system looks like this. In most cases you will be reaching for a one rem spacing because most of the elements are one rem font size.

For example with this list we can start by setting a one rem spacing between all elements. And then we can increase the spacing for the heading because it is not part of the list itself.

## The Most Important Role of Spacing

**Grouping and separating UI elements to help users navigate the interface.**

For example, if you put equal spacing between these three actions, the UI will look cluttered. Users will have to think for a second regarding which button belongs to which group.

Start by grouping the elements with the smallest space possible. Then increase the spacing between distinct groups by one rem. It could be two rem as well if you have the space. It all depends on the context and your preference.

**Just make sure that this space is smaller than the outer space.**

## Inner vs Outer Spacing

For instance, look at a button like this. The inner spacing between the icon and the text should always be smaller than the outer spacing or the horizontal padding of the button.

Otherwise, the button will look ugly and confusing to the user. You can use the same spacing if you really want to. But never make the outer spacing smaller than the inner spacing.

You only put more inner spacing between elements when they serve a different purpose. In this case, the inner space between the like and dislike buttons is greater than the outer padding. However, if you notice the inner space for the button itself is still smaller than the padding.

You can always try a bigger padding so the button looks nice and clean at all screen sizes and of course test different spacing to see which one is the best for your design.

## Vertical Padding and Optical Weight

Have you noticed that the vertical padding is smaller than the horizontal padding?

There is a concept called **optical weight**. Text has more visual noise on the left and right sides because of the varying widths of letters like U versus W. Vertical space is much more constrained by:

- **Cap height** - the height of flat capital letters
- **Descenders** - the tails on letters like Y or G

So, if you put equal vertical padding, that unnecessary space will look off and make the button look bloated and ugly.

**For buttons, just pick a smaller value for the vertical padding and two times or three times the horizontal padding depending on the context.**

But if you have a lot of vertical elements, you are going to need vertical padding to balance that optical weight. In this case, we have 1.25 rem padding on both sides. So the inner elements have vertical room to breathe.

Can you feel the tension if I decrease the padding to one rem and maybe scale it down to its original size? Maybe it looks fine to you, but if you have the space, use it. Because a little extra white space will only make things easier to read. But a tighter spacing can literally hurt user experience.

## Start Big, Then Decrease

So whenever you want to pick spacing, **do not start with a smaller value like 0.5 rem and increase if needed**. Instead, **start with a bigger value like 1.5 rem and decrease the spacing if needed**.

Let me show you what I mean by setting the spacing between these inner elements. I am going to use a bigger spacing like one rem. This is obviously too much. So let us try a lower value. This is much better.

But the title and author are more closely related than other information. So let us bring them closer. Maybe more. Other than that, I don't think we need to touch anything else.

## Balanced Design

These buttons have a one rem spacing because they belong to the same group. But if you notice closely, they both have one rem horizontal padding as well. So the design looks clean and optically balanced.

If you increase or decrease the spacing, the design will still work, but it will not look balanced. You have to train your eyes to notice these small design details.

## Fixing a UI Example

As you can see, the typography, colors, and icons are on point. But I kept this tight spacing on purpose. I kept random spacing to separate these three sections. But apart from that, every icon, text, button, and interactive element has 0.5 REM spacing. Even the padding inside these drop downs and input fields is 0.5 rem.

This is obviously very bad for user experience, but the design might look okay to some of you. That's because of the **consistency**. Like even if we did not pick the right number, just because the spacing is consistent throughout, we can still make sense of what is what.

**So the first rule of spacing is being consistent.** Even if the number is not right, if you stay consistent, the overall design will look okayish. It might not be very user-friendly, but it will not look as ugly as you might expect.

## Step-by-Step Process

Having said that, let us fix this UI. I am going to start with the first section by setting a generous padding of two rem. As I said earlier, we always start by setting too much spacing and decrease it if needed.

### Step 1: Break the UI into Groups

Now, step one of picking the right spacing is to break the UI into groups:
- This title and text are closely related, so they belong to group one
- Group two would be these options
- These two buttons will be group three

Let's separate them by setting a gap of 1.5 rem.

### Spacing Guidelines

You might ask, why this number? Why not one or two rem? I have been doing this thing for a while, so I just know what will work here. But here is a tip:

| Purpose | Recommended Spacing |
|---------|-------------------|
| Group closely related elements | Below 1 rem |
| Separate distinct groups | 1.5 or 2 rem |
| Padding and grouping buttons | 1 rem |

But this is just a small tip and not some science or design rule. Spacing always depends on the context.

### Fixing Each Section

**Section 1:** 0.5 rem spacing works really well with closely related elements but these elements definitely need a little more room to breathe. Let's try a bigger value like one rem.

**Balancing heights:** All these options have equal height because of these drop-downs and input field. But the toggle is a bit shorter. So we have to manually set a height to this option so the spacing feels more balanced.

**Optical weight:** We need a bigger horizontal padding for these elements that flow from left to right. 0.5 to one rem. And let's change this gap to space between so it's cleaner and easier to navigate.

**Section 2:** First, break the section into groups. Then apply a bigger spacing like one rem to separate. The first group is already working, but these cards definitely need bigger padding.

We usually put the same outer spacing or gap as the inner spacing or padding for a better visual balance. For these cards, we also need a grid on top of padding, so they all have equal width.

**Section 3:** Just use space between instead of this 5 rem gap and then separate them with a bigger gap so they have some room to breathe.

## Final Result

Let's scale it down to original size and compare it to where we started. All we did is group and separate elements using the spacing system.

**We just used these three values:**
- 0.5 rem (grouping closely related elements)
- 1 rem (padding, button spacing)
- 1.5-2 rem (separating sections)

So if you do not want to use the full system, just these three can also work for most gaps, margins, and padding. Not only that, but they also make nice round corners as well. Like if you put one rem padding and want optically balanced border radius, these values work really well together.

## Key Takeaways

1. **Use rem instead of pixels** - spacing scales with font size
2. **Increment by 0.25 rem (4px)** for your spacing system
3. **Group related elements** with smaller spacing (below 1 rem)
4. **Separate distinct groups** with larger spacing (1.5-2 rem)
5. **Inner spacing < Outer spacing** - always keep inner gaps smaller
6. **Vertical padding < Horizontal padding** - due to optical weight
7. **Start big, decrease if needed** - don't start with tight spacing
8. **Consistency is key** - even wrong spacing looks okay if consistent
9. **Use space-between** for cleaner navigation
10. **Match outer gap with inner padding** for visual balance
11. **Three values work for most cases**: 0.5 rem, 1 rem, 1.5-2 rem
