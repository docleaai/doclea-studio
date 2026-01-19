# The Easy Way to Design Top Tier Websites

A guide to creativity and practical design principles for building professional websites.

---

## Core Philosophy

> "Creativity is a process, not a moment."

Being creative isn't about being the first person to think of an idea - it's about **connecting ideas**. Top designers take what is already present and combine those elements in a unique way.

To do that, you need to know the rules of the game.

---

## Rule 1: Good Design is As Little Design As Possible

Focus on essential features and make them better and useful for users.

### What This Means

- Less colors
- Less words
- Less clutter on the screen

### Common Mistake

Starting with the header and going down, or thinking about structure first:
- "How many sections do I need?"
- "How wide should they be?"
- "How should I design the buttons?"

Each of these questions will slow you down and drain your creativity.

### Better Approach

Ask: **"What's the key functionality or main selling point of this website?"**

For many websites, it could be:
- A heading
- An input field
- A button

**Start from there.** Design as little as possible. Chances are that's all you needed anyway.

### Why Simplicity Works

- Our brain has evolved to simplify things
- We look for key visual information only
- Keeping things simple is a win-win situation

---

## Rule 2: Use the Law of Similarity and Proximity

Use **shape**, **size**, **color**, and **spacing** to group elements.

### Gestalt Theory

The whole of something is greater than its parts. Our brain:
1. First processes information as a whole
2. Then starts to notice small details as we spend more time looking

### Design Goal

Make the design simple enough to be understood as a whole. **The design should be scannable within seconds.**

### Law of Similarity

- Makes design better and consistent
- Easier to implement
- Creates visual cohesion

### Law of Proximity

- Gives better understanding of layout and spacing
- Groups related elements together
- Separates distinct sections

---

## Rule 3: Elements Need More Spacing Than You Think

When focused on designing a specific element, the space might seem too much to you. But users scan the whole UI before focusing on individual elements.

### Approach

1. Start with a lot of spacing
2. Look at the design as a whole
3. Then start to remove spacing until you're happy with the results

---

## Rule 4: Use a Design System

Especially important for big and complex websites or apps because they're made up of essential elements and components.

### For Simple Websites

Just define key design elements and you're good to go.

### For UIs

Need more complex and detailed design systems that cover many scenarios.

### Understanding Design Systems

Once you understand the basic design principles behind these systems, you don't really need a CSS framework to style your websites.

---

## Building Your Design System

### Spacing System

Use values divisible by 4:

| Pixels | REM |
|--------|-----|
| 4px | 0.25rem |
| 8px | 0.5rem |
| 12px | 0.75rem |
| 16px | 1rem |
| 20px | 1.25rem |
| 24px | 1.5rem |
| 32px | 2rem |
| 40px | 2.5rem |
| 48px | 3rem |
| 64px | 4rem |

**To convert pixels to REM:** Divide pixel value by 16

### Important Notes on Spacing

- Spacing totally depends on context
- Don't design with lorem ipsum or vague data
- A spacing perfect for one card can be a disaster for another
- The system is just there to help you pick values quickly

### Example Workflow

1. Start with a lot of spacing (e.g., 40px)
2. Bring elements closer that belong together
3. Pick a value from the system (try 20px, then 12px)
4. Set values as CSS variables for easy adjustment

```css
:root {
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
}
```

### Typography

- Pick one font and a type scale that fits your project
- Use REM units for font size and margins so design adapts to user system preferences

### Colors

There is no real science in choosing colors - don't fall for tutorials teaching "psychology of colors."

**What you need:**
- A dark color (for text)
- A light color (for background)
- Two more colors to add personality

**Rules:**
- Make sure colors are legible
- Don't overwhelm users
- Avoid center-aligned text, especially for paragraphs and smaller text

### Line Height

Line height is **inversely proportional** to font size:
- Smaller text needs greater line height for better legibility
- Greater line height also acts as margin-top on text elements

### Key Elements to Design

1. **Links** - Primary and secondary styles
2. **Buttons** - Primary and secondary actions

---

## Rule 5: Hierarchy is Everything

Emphasize certain elements on the page to help users navigate and find important actions.

### Tools for Emphasis

| Tool | Usage |
|------|-------|
| Size | Larger = more important |
| Weight | Bolder = more important |
| Color | Higher contrast = more important |

**Warning:** It's very easy to overdo these things. Start small.

### Emphasis Process

1. Ask: "What's the first thing the user will look for?"
2. Start with color adjustments
3. If not enough, reduce contrast on secondary information
4. Increase font weight if needed
5. Increase font size as final step
6. Zoom out to verify hierarchy works

### Key Insight

> Sometimes to emphasize something, you need to de-emphasize other competing elements.

### Context Matters

- Sometimes it could be labels
- Sometimes it could be values
- Sometimes it could be an icon

Not all H1 tags will have the same size and margins. Sometimes H3 or paragraph tags could have bigger font size than H2 - it all depends on context.

### The Golden Rule

> Good design is less design. More design almost always results in uglier design.

---

## Adding Character (Exceptions to "Less is More")

### Introduce Depth

- Use colors and shadows to elevate important elements
- Shadows can replace solid borders
- The closer something feels to the user, the more it attracts focus

### Use Accent Colors

- Highlight important elements
- Replace solid colors with subtle gradients for excitement

### Enhance Lists and Tables

- Make them more fun and engaging
- Try using cards for bland elements

---

## The Creative Process

### Step 1: Know the Basics

Learn the design principles covered above.

**Recommended Reading:**
- Design books with practical tips for building top-tier websites

### Step 2: Find Inspiration

Sources:
- Top-tier websites (study their style)
- Figma Community
- Mobbin (design inspiration library)

**How to use inspiration:**
1. Search for specific elements (e.g., "testimonial section")
2. Filter by category (e.g., "finance")
3. Save designs you like to your library

### Step 3: Analyze and Ideate

Look at saved designs as users would:
- Make notes of key things you like
- Identify what makes them work
- Think about what emotions they evoke

**Example Analysis (Testimonial Section):**
- Simple and unique designs stand out
- Human faces add trust
- Simple language works better
- Generic sections with no emotions fail

### Step 4: Incubation (Critical Step)

Once you have initial ideas:
1. **Step away from the problem**
2. Do something else
3. Let your subconscious work on it

This is crucial for the creative process. When you revisit the problem, new ideas will come naturally.

**If this doesn't work:** You may be under stress or not getting proper sleep. Address that first.

### Step 5: Don't Fall in Love With Your Design

We all have personal biases and see things a certain way.

**Testing Process:**
1. Show design to friends or colleagues
2. If they like it, test with actual users
3. Always be open to adjusting based on feedback

### Step 6: Just Ship It

> "Stop planning and thinking to design - just design."

- It doesn't matter how good or bad it is
- You need to prove to yourself you can produce something
- Sometimes you design several websites just to discover one good pricing section in the third design

**Just finish something. Anything.**

---

## Key Takeaways

1. **Simplicity wins** - Design as little as possible
2. **Use visual laws** - Similarity and proximity help users understand
3. **Space generously** - Then reduce until it feels right
4. **Build systems** - Consistency comes from defined elements
5. **Hierarchy guides** - Help users find what matters
6. **Get inspired** - Study what works, then make it your own
7. **Take breaks** - Creativity needs incubation time
8. **Test and iterate** - Don't be precious about your work
9. **Ship it** - Done is better than perfect

---

> "Creativity is not just a process, it's also a state of mind."

---

*Source: "The Easy Way to Design Top Tier Websites" video transcript*
