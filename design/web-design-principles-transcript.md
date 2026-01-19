# Web Design Principles - Video Transcript

**Source:** https://www.youtube.com/watch?v=qyomWr_C_jA

---

## Introduction: Creativity is a Process

In this video you will learn the key design principles and practical tips to build top tier websites. Consider this a guide to creativity, because **creativity is a process, not a moment**.

Being creative isn't about being the first person to think of an idea - it's all about **connecting ideas**. You don't have to create new designs from a blank slate. Top designers take what is already present and combine those elements in a unique way. But to be able to do that, you need to know the rules of the game.

---

## Rule #1: Good Design is as Little Design as Possible

It means focus on essential features and make them better and useful for the users. It also means less colors, words, and clutter on the screen.

### Common Mistake When Designing a Website

You start with the header and then go down from there. Or you are thinking about the overall structure:
- How many sections do I need?
- How wide should they be?
- How should I design the buttons?

That's a lot of "hows." Each of these questions will slow you down and drain your creativity.

### Instead, Ask:

**"What's the key functionality or the main selling point of this website?"**

For a lot of websites, it could be a heading, input field, and a button. **Start from there.**

At this point, design as little as possible. Chances are that's all you needed anyway. Don't complicate websites by adding too many elements that frustrate users and look ugly as well.

Our brain has evolved to simplify things and looks for key visual information only. So why not choose the easy way and keep things simple? It's a win-win situation.

---

## Rule #2: Use the Law of Similarity and Proximity

Use the law of similarity and proximity to simplify the design. You can use **shape**, **size**, **color**, and **spacing** to group elements.

### Gestalt Theory

Gestalt Theory emphasizes that the whole of something is greater than its parts, focusing on how our minds perceive patterns and wholes rather than just individual elements.

Our brain first processes the information as a whole, and as we spend more time looking at something, we start to notice the small details as well.

**Your first goal is to make the design simple enough to be understood as a whole.** In simple words, the design should be scannable within seconds.

This ties nicely with the first rule as well.

### Law of Similarity
- Makes the design better and consistent
- It's easier to implement as well

### Law of Proximity
- Gives you a better understanding of layout and spacing

---

## Rule #3: Elements Need More Spacing Than You Think

When you are focused on designing a specific element, the space might seem too much to you. But the users scan the whole UI before focusing on individual elements.

### Approach:
1. **Start with a lot of spacing**
2. Look at the design as a whole
3. Then start to remove it until you are happy with the results

But doing this manually becomes boring and repetitive, so you need a system in place.

---

## Rule #4: Use a Design System

Especially if you are designing a big and complex website or app, because it's made up of essential elements and components.

### Types of Design Systems

There are multiple ways to create a design system:
- **For a simple website:** You just need to define key design elements and you are good to go
- **For UIs:** You need more complex and detailed design systems that cover a lot of scenarios

Once you understand the basic design principles behind these systems, you don't really need a CSS framework to style your websites.

---

## Building Your Design System

### Spacing System

You can use this list to get started or create your own system. Just have the values that are **divisible by four**.

Spacing totally depends on the context. It's a very bad idea to design with Lorem Ipsum or vague data, because spacing that is perfect for this card can be a disaster for that one.

The system is just there to help you pick a value quickly, so you can play with different values instead of trying random values on the fly.

#### Example:
In the previous example, we started with a lot of spacing like 40 pixels. Then bring elements closer that belong together. To do that, pick a value from this system - let's try 20. It's still pretty big. Let's try 12. Perfect.

#### Use REM Units

Generally, we use REM units for font size and margins so the design can adapt to the user system preference. To assign REM values, just **divide the pixel value by 16**.

A better way is to set these values as variables so you can play with different values and see what works best.

### Fonts and Colors

Same thing for your fonts and colors. Handpick a few values and assign them as global variables.

You can get started by picking any one font and type scale that fits your project.

**There is no real science in choosing colors**, so don't fall for those tutorials or articles that teach you the psychology of colors. Just pick a dark and light color for your text and background, and two more to add some personality. Just make sure the colors are legible and don't overwhelm the users.

### Typography Tips

- **Avoid center-aligned text**, especially for paragraphs and smaller text sizes
- **Line height is inversely proportional to font size** - smaller text needs greater line height for better legibility
- Greater line height also acts as margin-top on text elements, so you don't have to assign spacing between all text elements - it's already done for you

### Key Elements

Now that you have your fonts and colors in place, design the key elements. Start with the links and buttons. You generally need two types of each:
1. **Primary actions**
2. **Secondary actions**

Once we have a design system in place, we can start the actual design process.

---

## Rule #5: Hierarchy is Everything

Web design is all about putting the right elements at the right place with the right sizing.

We need to emphasize certain elements on the page to help users navigate and find important actions.

### Tools for Emphasis

To emphasize important elements, we can use:
- **Size**
- **Weight**
- **Color**

But it's very easy to overdo these things, so **start small**. You will be surprised to see how little changes can make a big impact on the overall design.

### Practical Example

To emphasize an element, ask yourself: **"What's the first thing the user will look for?"**

I guess it's the title, so we need to emphasize it.

1. **Start with color** - But white on black has a pretty good contrast ratio
2. **Reduce contrast from secondary information** - Sometimes to emphasize something you need to de-emphasize other competing elements
3. **Add more contrast by increasing font weight** - It's almost there
4. **Go a step further and increase font size as well**

When you are done with the design, **zoom out** to see if the title stands out from the secondary information.

We do this because the users will scan and look for key information to focus on. If the design isn't scannable, you need to do some adjustments. It could be:
- Choosing different font size
- A darker color
- Simply a bit more spacing

Do whatever you can to emphasize the elements you know the users will look for.

### Context Matters

Sometimes it could be labels, and sometimes it could be values, or maybe an icon. It all depends on the context.

**Not all H1 tags will have the same size and margins.** Same thing is true for other tags as well. Sometimes the H3 or paragraph tag could have a bigger font size than the H2 tag. It all depends on the context.

Just emphasize the most important elements and keep the rest of the design as it is.

> **Good design is less design, and more design almost always results in uglier design.**

---

## Exceptions: Adding Character

But like everything in life, there are a few exceptions to this rule as well.

### Introduce Depth

Use colors and shadows to elevate important elements. Shadows can also be used to replace solid borders.

**The closer something feels to the user, the more it will attract their focus.**

### Use Accent Colors

Speaking of focus, use your accent colors to highlight important elements.

One easy trick to add a bit of excitement is by **replacing a solid color with a subtle gradient**.

### Additional Enhancements

- Work on your lists and tables to make them more fun and engaging for the users
- Try using cards for bland elements

---

## The Creative Process

But the question is: how do you get these ideas?

In the beginning, I said creativity is a process, not a moment. Now it's time to explain that process.

### Step 1: Know the Basics

That we have covered already. Also read these books - they have some really good practical tips to build top tier websites.

### Step 2: Find a Source of Inspiration

You can look at the top tier websites and study their style. Or check out some amazing work on Figma Community.

I personally use Mobbin to take design inspirations for my projects.

#### Example: Designing a Testimonial Section

Say you are designing a testimonial section for a finance app:
1. Go to filters and search for "testimonial section"
2. Set the app category to "finance"
3. Now we have the testimonial section for some top tier apps in the world
4. Look around and save the ones you like to your library

Whether you are designing for mobile or a full-blown web app, there are huge libraries of tried and tested designs. So definitely include it in your design process.

### Step 3: Work Over Designs in Your Mind

Once you have gathered enough inspirations, it's time to work over those designs in your mind.

Trust is crucial for finance apps, so the designers must have spent a lot of time and research on the testimonial section.

Let's try to look at these as users and make a note of key things you like about these designs.

For me:
- They were simple and unique
- I really like the ones with a human face and simple language
- I hate generic testimonial sections that have a bunch of reviews with no emotions

So I have a few ideas now. We need two to three good reviews, ideally with great images, and we need big and bold text to emphasize them.

**But don't go designing yet.**

### Step 4: Step Away from the Problem

Once you have some initial ideas, try to step away from the problem and do something else.

**This is a very important step in the creative process.** This is not just limited to design.

If you are stuck with a problem:
1. Watch a few tutorials or read some articles
2. Think of these potential solutions in your mind
3. But don't act on it
4. Just take a break and do something else

I promise when you revisit the problem, new ideas will come naturally to you.

If this doesn't work, it means you are under a lot of stress lately or not getting proper sleep. So work on that first.

### Step 5: Don't Fall in Love with Your Design

Let's say you got some new ideas and finished your design.

We all have personal biases and see things in a certain way. So first test your design by showing it to your friends or colleagues. If they like it, test it with your users.

**Always be open to adjust the design based on feedback.**

Sometimes you have to design several websites just to discover that you designed one good pricing section in the third design.

---

## Final Thoughts

Just finish something. Anything.

**Stop planning and thinking to design, and just design.**

It doesn't matter how good or how bad it is. You just need to prove to yourself that you have what it takes to produce something.

**Creativity is not just a process - it's also a state of mind.**

---

## Key Takeaways

1. **Good design is as little design as possible** - Focus on essential features
2. **Use the law of similarity and proximity** - Group elements with shape, size, color, and spacing
3. **Elements need more spacing than you think** - Start with more, then reduce
4. **Use a design system** - Create consistent, reusable patterns
5. **Hierarchy is everything** - Emphasize what users need to find
6. **Context matters** - Not all headings need the same styling
7. **De-emphasize to emphasize** - Lower contrast on secondary elements
8. **Add depth sparingly** - Use shadows and gradients for character
9. **Find inspiration** - Study top-tier websites and save what you like
10. **Step away from problems** - Let ideas develop subconsciously
11. **Test your designs** - Get feedback from others, be open to change
12. **Just finish something** - Stop planning, start doing
