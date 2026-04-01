---
name: cape-presenter
description: "Convert PowerPoint (.pptx) files into stunning, branded web-based HTML presentations following Cape Capital brand guidelines. Use this skill whenever a user uploads a .pptx file and wants it converted to an interactive HTML presentation, or when they mention 'web presentation', 'convert my deck', 'HTML slides', 'branded presentation', or 'Cape presentation'. Also trigger when a user wants to create a new presentation from scratch in the Cape Capital brand. This skill handles extraction of all PPTX content (text, charts, images, tables), recreation of charts from underlying data, and generation of responsive, animated HTML slides. Every conversion must perfectly preserve all content — nothing removed, nothing changed — while applying Cape Capital's visual identity."
---

# Cape Presenter: PPTX → Branded Web Presentation

## Overview

This skill converts PowerPoint presentations into responsive, animated HTML presentations branded to Cape Capital's visual identity. The output is a single navigable HTML file with iframe-isolated slides, keyboard/click navigation, and responsive scaling.

**Core principle: NO CONTENT is changed or removed. Only transferred and redesigned.**

## Workflow

### Phase 1: Extract

Run the extraction script to parse the PPTX into a structured manifest:

```bash
pip install python-pptx openpyxl Pillow --break-system-packages -q
python /path/to/skill/scripts/extract_pptx.py /mnt/user-data/uploads/FILENAME.pptx /home/claude/extracted/
```

This produces:
- `manifest.json` — structured data for every slide (text, positions, formatting, chart data, table data)
- `images/` — all extracted images
- `charts/` — chart data as JSON files

**CRITICAL: Review the manifest carefully before proceeding.** Check:
- All slides are captured (compare count to original)
- Chart data points are complete (spot-check values against any visible numbers)
- No text blocks are missing
- Image references are valid

### Phase 2: Design

Read the manifest and decide on the design approach for each slide:

1. **Read the brand guidelines:** `view /path/to/skill/references/brand_guidelines.md`
2. **Read the template catalogue:** `view /path/to/skill/references/template_catalogue.md`
3. **Map each slide** to the best template based on its content type
4. **Plan the presentation** — decide background colors, which slides are dark/light, the visual rhythm

**Design rules:**
- Alternate between light (beige/white) and dark (red/purple/green) backgrounds for visual rhythm
- Never have more than 2 consecutive slides with the same background tone
- Title slides and section dividers use distinctive backgrounds
- Chart slides generally use light backgrounds for readability
- Stat-heavy slides work well on dark backgrounds

### Phase 3: Build

For each slide, create a standalone HTML file:

1. Apply the Cape Capital design system (see Design System below)
2. Recreate all charts as SVG from the extracted data — NEVER use screenshots
3. Embed images as base64
4. Ensure all text is preserved verbatim
5. If a PPTX slide has too much content for one viewport, split into two HTML slides (note this to the user)

### Phase 4: Combine

Assemble all slides into a single navigable presentation:

```bash
python /path/to/skill/scripts/combine_slides.py /home/claude/slides/ /home/claude/presentation.html
```

Or build the combiner manually following the Combiner Pattern below.

### Phase 5: Verify

Before delivering:
- Count slides (must match PPTX or explain splits)
- Check every chart has correct data points
- Verify all text is present
- Test navigation (arrow keys + click)
- Check responsive scaling at different viewport sizes

---

## Design System

### CSS Variables (MUST be included in every slide)

```css
:root {
    --capital-red: #831011;
    --deep-red: #4A090A;
    --red-500: #AD2A2B;
    --red-300: #C85657;
    --red-200: #F7C9C9;
    --red-100: #FAF0F0;
    --white: #FFFFFF;
    --black: #000000;
    --beige: #F5F2E6;
    --beige-400: #E4DFC8;
    --beige-300: #EFECDD;
    --beige-100: #FCFAF0;
    --beige-50: #FFFDF6;
    --purple: #403050;
    --deep-purple: #2D1F3B;
    --purple-300: #746188;
    --purple-200: #B1A2C1;
    --purple-100: #F7F2FD;
    --green: #044049;
    --deep-green: #033138;
    --green-300: #458C88;
    --green-200: #BAE0D6;
    --green-100: #F0F8F6;
    --sky-blue: #9FDAFF;
    --moss: #828010;
    --orange: #C66A37;
    --deep-blue: #105782;
    --peach: #F7C9C9;
    --matcha: #ACC79B;
    --grey-800: #4C4F56;
    --grey-400: #ADB2BA;
    --grey-300: #C8CBD1;
    --grey-200: #DCDFE5;
    --grey-100: #EEF0F4;
    --grey-50: #FAFBFE;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'Inter', Arial, sans-serif;
}
```

**Font note:** PP Eiko and F37 Hooj are proprietary Cape fonts not available via Google Fonts. For web presentations, use Cormorant Garamond (display/headlines) and Inter (body) as web-safe alternatives that match the brand's typographic character.

### Typography Rules

| Role | Font | Weight | Size | Spacing |
|------|------|--------|------|---------|
| Subheader | Inter | 500 | 0.7rem | letter-spacing: 0.25em; text-transform: uppercase |
| Display/Headline | Cormorant Garamond | 300 | clamp(1.8rem, 4vw, 3rem) | letter-spacing: -0.02em |
| Body | Inter | 400 | 0.82rem | line-height: 1.55 |
| Stat number | Cormorant Garamond | 300 | 2-3rem | letter-spacing: -0.02em |
| Source citation | Inter | 400 | 0.58rem | color at 25-30% opacity |

### Slide Structure

Every slide MUST follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* CSS variables here */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: var(--CHOSEN-BG); height: 100vh; width: 100vw; overflow: hidden; }
        .slide { width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .content { width: 100%; max-width: 1060px; padding: clamp(1.2rem, 2.5vw, 2rem) clamp(2rem, 4vw, 4rem); }
        /* Reveal animation */
        .reveal { opacity: 0; transform: translateY(14px); animation: fadeUp 0.5s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <div class="slide">
        <div class="content">
            <!-- Decorative line -->
            <div style="width:40px;height:2px;background:ACCENT_COLOR;margin-bottom:1rem;" class="reveal"></div>
            <!-- Subheader -->
            <p class="reveal" style="SUBHEADER_STYLES">SUBHEADER TEXT</p>
            <!-- Headline -->
            <h2 class="reveal" style="HEADLINE_STYLES">HEADLINE</h2>
            <!-- Content area -->
            ...
        </div>
        <!-- Source citation (bottom right) -->
        <div style="position:absolute;bottom:12px;right:24px;font-size:0.58rem;color:rgba(...);">
            <strong>Source:</strong> Citation text
        </div>
    </div>
</body>
</html>
```

### Chart Recreation Rules

**CRITICAL: All charts MUST be recreated as SVG from extracted data. Never use chart screenshots.**

1. **Line charts:** Use SVG `<path>` elements with correct data-to-coordinate mapping
2. **Bar charts:** Use SVG `<rect>` elements with proportional heights
3. **Pie charts:** Use SVG `<circle>` with `stroke-dasharray` for segments
4. **Colors:** Use the brand graph colour palette in order: Capital Red #831011, Beige #E4DFC8, Purple #403050, Light Purple #B1A2C1, Sky Blue #9FDAFF, Moss #828010, Orange #C66A37, Deep Blue #105782, Peach #F7C9C9, Matcha #ACC79B

For every chart:
- Map data values to SVG coordinates using: `y = y_bottom - (value / max_value) * (y_bottom - y_top)`
- Include axis labels, legends, and data labels where the original had them
- Add subtle gradient fills under line charts
- Animate line drawing with `stroke-dasharray` / `stroke-dashoffset`

### Alignment Rules

**These are NON-NEGOTIABLE:**

1. All content centered within `.content` wrapper (max-width: 1060px)
2. Grid layouts use CSS Grid with explicit `grid-template-columns`
3. Stat cards in a row must have equal height (use `align-items: stretch`)
4. Text within cards must be vertically centered
5. All elements must scale proportionally — use `clamp()`, `rem`, `%`, and `vw` units. NEVER use fixed `px` for font sizes
6. Test at both narrow (1024px) and wide (1920px) viewports mentally — if something would break, fix it

### Combiner Pattern

The combined presentation uses iframe `srcdoc` for CSS isolation:

```javascript
// Each slide is an iframe with srcdoc containing the full HTML
// Navigation: arrow keys + click (left third = back, right two-thirds = forward)
// Slide numbers injected into each iframe
// SVG animations replay on slide activation via postMessage
// Viewport scaling: html { font-size: clamp(16px, 1.1vw, 28px); } + max-width: 92vw
```

Dark slides (dark backgrounds) get light slide numbers; light slides get dark slide numbers.

---

## Background Color Assignments

Use this palette for slide backgrounds:

| Background | Use for | Text color |
|---|---|---|
| Beige #F5F2E6 | Default content slides | Black/grey-800 |
| Beige-50 #FFFDF6 | Charts, light content | Black/grey-800 |
| Deep Red #4A090A | High-impact stats, crisis | Beige/white |
| Purple #403050 | Framework slides, forward-looking | Beige/white |
| Green #044049 | Feature deep-dives, lessons | Beige/green-200 |
| White #FFFFFF | Clean data slides | Black/grey-800 |
| Black #000000 | Special emphasis (rare) | White |

---

## Quality Checklist

Before delivering any presentation, verify:

- [ ] All PPTX slides accounted for (or splits explained)
- [ ] Every piece of text preserved verbatim
- [ ] Every chart recreated from data (not screenshots)
- [ ] Chart values spot-checked against original
- [ ] All images included
- [ ] Source citations preserved on every slide that had them
- [ ] Navigation works (arrows + click)
- [ ] Slide numbers correct (X / total)
- [ ] No content clipped or overflowing
- [ ] Visual rhythm maintained (alternating light/dark backgrounds)
- [ ] Responsive at different viewport sizes
- [ ] Animations play correctly

---

## Learning and Iteration

This skill improves over time. After each conversion:

1. If the user suggests design improvements, note them for future template additions
2. If a new slide pattern is encountered that doesn't match existing templates, create a new template
3. If chart recreation accuracy is questioned, refine the extraction or SVG generation approach

The template catalogue in `references/template_catalogue.md` should grow with each project.
