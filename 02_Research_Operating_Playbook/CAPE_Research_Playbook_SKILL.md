---
name: research-operating-playbook
description: >
  William Bowdler-Raynar's Research Operating Playbook. Load when conducting
  any research task: thematic, situational, company, or market. Covers research
  intent declaration, prompt generation for external platforms, source standards,
  synthesis rules, universe construction, and output formats.
---

# Research Operating Playbook v1.0
# William Bowdler-Raynar

Load this playbook alongside the Core Profile for all research tasks.

---

## 1. RESEARCH INTENT

Declare the intent at the start of every research task. It determines the workflow and output.

**Understand**
Build knowledge of a theme or market. No investment decision required.
Triggered by: intellectual interest, current events, political developments, future reference.
Output: research paper or reference note.
Example: studying oil and gas dynamics following Iran airstrikes.

**Situational**
Event-driven. Something has happened. Assess relevance and implications quickly.
Triggered by: market moves, geopolitical events, policy announcements, earnings surprises.
Output: situation brief — what happened, why it matters, what to watch.

**Invest**
Active evaluation for capital allocation. Full workflow applies.
Triggered by: a theme under active consideration for portfolio inclusion.
Output: full research paper + universe construction + IC one-pager.

GO / NO-GO / MONITOR verdicts apply only to the Invest track.

---

## 2. RESEARCH PRINCIPLES

Apply by default across all research intents:

- Accuracy over speed
- Explicit reasoning over impressionistic prose
- Distinguish clearly between fact, inference, and judgement
- Identify the key variables early; do not bury them
- Include disconfirming evidence — it is not optional
- Make the transmission mechanism explicit: from theme to economic impact to investable consequence
- Rank drivers and risks; do not present undifferentiated lists
- Avoid fake precision
- Prefer analysis that is decision-useful over analysis that is merely thorough

Research should answer:
- What is happening?
- Why is it happening?
- Why now?
- What matters economically?
- What matters for markets or portfolios?
- What is consensus missing, underpricing, or misreading?
- What would change the conclusion?

---

## 3. SOURCE STANDARDS

**Recency rule**
Prioritise recent sources for current developments, policy changes, market structure, earnings context, and competitive dynamics. Default to the last 12 months where relevant. Do not exclude older sources if they are foundational or still the best explanation of the system.

**Source hierarchy**

Tier 1 — Primary and strategic
Company filings, annual reports, investor presentations, earnings calls. Official statistics and government or regulator publications. IMF, World Bank, BIS, OECD, IEA. Top-tier broker and investment bank research where accessible. Expert interviews, conference materials, and technical papers where relevant.

Tier 2 — High-quality secondary
McKinsey, BCG, Bain, Deloitte, PwC (used selectively). Reputable market research and industry analysis. FT, WSJ, Bloomberg, The Economist. Academic and technical journals where they clarify mechanisms or challenge consensus.

Tier 3 — Emerging and directional
Specialist trade publications. Tech and industry press. Visual explainers and infographics. These can surface trends and vocabulary but should not anchor a conclusion on their own.

**Handling rules**
- Prefer primary over secondary where possible
- Check dates carefully
- Check whether the source describes facts, estimates, advocacy, or opinion
- Use multiple source types for important claims
- If sources conflict, state that clearly and explain which interpretation is more credible

---

## 4. SOURCE BALANCE RULE (SYNTHESIS)

**This rule is mandatory and must be applied explicitly.**

When William provides documents alongside external research:
- No single provided document should dominate the synthesis
- Provided research and externally gathered research carry equal weight by default
- If a provided document conflicts with external sources, flag the conflict explicitly rather than defaulting to the provided source
- State clearly which sources informed which conclusions
- If one source is used more than others, explain why

Overweighting provided documents is a known failure mode. Guard against it actively.

---

## 5. NEW THEME INITIALISATION (run every time a new theme is opened)

When William starts a new research theme, automatically run the following setup before any other step.

### 5a. Folder Structure

Create the following four subfolders inside `06 Themes/[Theme Name]/`:

```
01 Prompts/
02 Research Inputs/
03 Synthesis/
04 Deliverables/
```

### 5b. Research Prompts File

Generate the three research prompts (Prompt A, B, C — see Section 6) and save as:
`06 Themes/[Theme Name]/01 Prompts/[Theme Name] - Research Prompts.md`

### 5c. Blank Input Documents

Create four blank .docx files in `06 Themes/[Theme Name]/02 Research Inputs/` using consistent naming:

```
Perplexity_[Theme Name].docx
ChatGPT_[Theme Name].docx
AlphaSense_[Theme Name].docx
Grok_[Theme Name].docx
```

Each document should contain:
- Title in CAPE red (#831011): "[Theme Name] — [Source] [Prompt Type]"
- Subtitle: prompt label (e.g. "Prompt A Output") and today's date
- A thin red divider line
- Italic instruction: "Paste the full [Source] output below this line."

Use the Node.js `docx` library to generate these. Template script is at:
`/sessions/vigilant-epic-ritchie/mnt/Claude Cowork/02 Research Operating Playbook/create_input_docs_template.js`

Run: `node create_input_docs_template.js "[Theme Name]"`

### 5d. Confirm Setup

After completing 5a–5c, confirm to William:
- Folder structure created ✓
- Research prompts saved to 01 Prompts ✓
- Four blank input documents created in 02 Research Inputs ✓
- Ready to run prompts in Perplexity, ChatGPT, AlphaSense, and Grok

---

## 6. STEP 2 — PROMPT GENERATION

When a research task begins, generate three ready-to-use prompts before conducting any synthesis.

**Theme Input (3 fields)**
- Theme name
- Intent: Understand / Situational / Invest; and if Invest: Tactical (6–24 months) or Strategic (5–10 years)
- Initial hypothesis in 2–3 bullets (what you think is happening, mispriced, or worth examining)

Clarification: ask at most one question if scope or boundaries are unclear.

---

### Prompt A — Deep Research (Perplexity / ChatGPT)

Generate this prompt for broad macro and thematic research.

```
DEEP RESEARCH PROMPT — [THEME NAME]
Intent: [Understand / Situational / Invest — Tactical / Strategic]

You are acting as a senior research analyst. Conduct structured research on the following theme.

1. MACRO DRIVERS
   Which economic, policy, and structural variables most directly affect this theme?
   Quantify where possible. Cite sources.

2. CURRENT DEVELOPMENTS
   What has changed in the last 12 months? Distinguish between cyclical and structural shifts.

3. HISTORICAL ANALOGUES
   Has a comparable theme played out before? What were the outcomes and key differences?

4. MARKET SIZE AND GROWTH
   Provide TAM and growth rate estimates where available. Source all figures.
   Flag if estimates rely on promoter or advocacy sources.

5. DISRUPTION AND OBSOLESCENCE RISK
   What could make this theme obsolete or irrelevant within 2–5 years?

6. CATALYST CALENDAR
   Known upcoming dates, events, regulatory decisions, or earnings prints that could move the theme.

OUTPUT FORMAT:
- Bottom line (3–5 sentences)
- Section-by-section findings with source citations
- Distinguish: (a) confirmed facts, (b) analyst consensus, (c) emerging signals
- 15–25 high-quality sources minimum
- Flag data gaps explicitly
```

---

### Prompt B — AlphaSense

Generate this prompt for earnings intelligence, broker research, and expert calls.

```
ALPHASENSE PROMPT — [THEME NAME]
Intent: [Understand / Situational / Invest — Tactical / Strategic]

You are conducting investment-grade research. Focus on primary source intelligence.

1. FUNDAMENTAL VALIDITY
   What are earnings calls, broker research, and expert interviews saying about this theme?
   Is corporate behaviour (capex, hiring, M&A) consistent with the thesis?

2. ADOPTION AND INDUSTRY SIGNALS
   Quantify adoption signals where possible.
   What are the leading indicators companies and analysts are monitoring?

3. KEY PLAYERS AND COMPETITIVE DYNAMICS
   Who are the main listed beneficiaries? What do market share trends show?
   Where are competitive advantages durable versus eroding?

4. REGULATORY AND MACRO CONTEXT
   What tailwinds or headwinds are flagged in recent filings and expert calls?

5. BEAR CASE
   What would invalidate the thesis? What are the most credible sceptical views in the research?

OUTPUT FORMAT:
- Findings structured by section above
- Source each claim (company, date, document type)
- Distinguish confirmed facts from analyst consensus from emerging signals
- Flag where evidence is thin or conflicting
```

---

### Prompt C — Grok / X Sentiment

Generate this prompt for market narrative and sentiment intelligence.

```
GROK PROMPT — [THEME NAME]
Window: last 90 days

1. DOMINANT NARRATIVE
   What are investors, analysts, and commentators saying about this theme on X?
   What is the prevailing framing?

2. SENTIMENT DIRECTION
   Is momentum building or fading? Has sentiment shifted in the last 30 days?

3. KEY VOICES
   Which accounts are driving the conversation? Are they credible (practitioners, analysts)
   or primarily retail and promotional?

4. CROWDING SIGNALS
   Is this theme consensus or contrarian? Is it overcrowded?

5. RED FLAGS
   What negative signals or dissenting views are present but being dismissed?
   What is the market not paying attention to?

OUTPUT FORMAT:
- Sentiment summary (2–3 sentences)
- Section findings with representative examples
- Distinguish signal from noise
- Flag if narrative appears promotional or coordinated
```

---

## 7. STEP 3 — SYNTHESIS

After all research inputs are gathered (external prompts + any documents William provides):

1. Map agreements and conflicts across sources
2. Apply source balance rule (Section 4) — no single source dominates
3. Identify the key variables that drive the thesis
4. Distinguish fact, inference, and judgement explicitly throughout
5. Include disconfirming evidence; do not omit it to strengthen the narrative
6. Build a view — do not merely aggregate

### 7a. Generating the Synthesis Document

Use the deliverable template at:
`02 Research Operating Playbook/deliverable_template.js`

Adapt the script for the new theme (update content, theme name, date, output path to `03 Synthesis/`). Generate using `node deliverable_template.js`. Validate with the office validation script. Save the final version to:
`06 Themes/[Theme Name]/03 Synthesis/[Theme Name] - Synthesis vX.X.docx`

### 7b. Synthesis Handover (run immediately after synthesis is saved)

**This step is mandatory.** When the synthesis document is complete and saved, automatically generate a handover note and save it as:
`06 Themes/[Theme Name]/03 Synthesis/[Theme Name] - Handover.md`

The handover note must follow this exact structure:

```markdown
# [Theme Name] — Research Handover
Date: [today]
Intent: [Understand / Situational / Invest]
Status: Synthesis complete

## Synthesis
File: `06 Themes/[Theme Name]/03 Synthesis/[Theme Name] - Synthesis vX.X.docx`
Sections covered: [list section numbers and titles, one line each]

## Key Findings to Carry Forward
- [Finding 1 — one sentence, decision-relevant]
- [Finding 2]
- [Finding 3]
- [Finding 4]
- [Finding 5]

## What Comes Next
- [ ] FactSet RBICS L5 screen → save output to `02 Research Inputs/`
- [ ] Build universe spreadsheet → `04 Deliverables/[Theme Name] - Universe.xlsx`
- [ ] [Any other pending task identified during synthesis]

## File Locations
- Synthesis: `06 Themes/[Theme Name]/03 Synthesis/`
- Template script: `02 Research Operating Playbook/deliverable_template.js`
- Cape Capital logo: `04 Business Overlays/cape_capital_logo.png`
- Research prompts: `06 Themes/[Theme Name]/01 Prompts/`

## Instructions for New Chat
Paste the following at the start of the new chat:

> Continuing [Theme Name] research. Synthesis complete (vX.X). Intent: [intent].
> Key carry-forward: [one-sentence summary of the most important finding].
> Next task: [first item from What Comes Next above].
> Files at: 06 Themes/[Theme Name]/ — see Handover.md for full state.
```

After saving the handover file, tell William:
> "Synthesis complete and saved. Handover note written to 03 Synthesis/. This is a good point to start a new chat — paste the 'Instructions for New Chat' block at the top of your next message."

---

## 8. UNIVERSE CONSTRUCTION (Invest track only — conditional)

### Applicability check (mandatory before running any screen)

Before initiating universe construction, confirm both conditions:

1. Intent = Invest
2. The theme falls within CAPE's investable universe

Ask William explicitly: "Is this theme in CAPE's investable universe? Should I run the FactSet screen?"

Do not proceed until William confirms. Some themes (e.g. oil & gas, tobacco, certain extractive sectors) are outside CAPE's investment mandate. In those cases, skip Sections 8a–8c entirely and note in the handover: "Universe construction not applicable — theme outside CAPE mandate."

---

### 8a. FactSet Screening (run only if confirmed applicable)

After research synthesis, generate a FactSet pull request:

```
FACTSET PULL REQUEST — [THEME NAME]

RBICS L5 SCREEN
[List confirmed RBICS L5 codes relevant to the theme]
[Use exact FactSet field syntax for direct entry into FactSet Workstation]

FILTERS
Market cap: ≥ USD 500M
ADV: ≥ USD 10M (liquidity floor)
Geography: [specify if relevant]
Additional filters: [any theme-specific criteria]
```

### 8b. ETF Map

Identify ETFs that:
- Track the theme directly (dedicated thematic ETFs)
- Have significant thematic overlap (≥ 20–25% of portfolio in relevant names)

For each ETF note: ticker, AUM, top holdings overlap with theme, liquidity.

### 8c. Reconciliation

Once William provides the FactSet equity list:
- Compare against names surfacing in AlphaSense, Grok, and Deep Research outputs
- Recommend names to add (missed by FactSet screen but supported by research)
- Recommend names to exclude (in FactSet screen but not supported by research)
- Flag names where evidence is mixed or thin

---

## 9. OUTPUT FORMATS BY INTENT

### Understand — Research Paper

1. What the theme is and why it matters
2. Key structural drivers
3. System map: sector structure, value chain, key actors, margin pools
4. Economic mechanism: demand, supply, pricing, adoption dynamics
5. Historical context and analogues
6. Key uncertainties and open questions
7. Sources

### Situational — Market Brief

1. What happened
2. Why it matters (economic and market mechanism)
3. What it changes, if anything
4. What consensus may be missing or overreacting to
5. What to watch next
6. Sources

### Invest — Full Research Paper + Summary Note + Verdict Note

**Research paper** follows the Understand structure above, extended with:
- Investable transmission (direct beneficiaries, indirect, potential losers, timing)
- What is already priced in
- Risks ranked
- Monitoring framework

**Summary Note (all intents)**

Produced automatically at the end of every synthesis, regardless of whether a presentation is planned. Filing note for the CAPE thematic research folder.

```
[THEME NAME] — Summary
[Date]

Filing: [SharePoint link placeholder]

• [Bold label]: [Concise, data-rich sentence. Real numbers. Sourced facts.]
• [Bold label]: [Concise, data-rich sentence.]
• [Bold label]: [Concise, data-rich sentence.]
[... 8–12 bullets total ...]
• [Final bullet — forward-looking or upside scenario. The note worth carrying away.]
```

Rules:
- Bold label + colon + data-rich content. Actual figures, named actors, specific mechanisms — not general description.
- 8–12 bullets. No more. No paragraphs.
- Final bullet always forward-looking or scenario-based.
- Total: 200–250 words maximum.
- Output as .docx (primary) and .md (portable).

**Verdict Note (Invest track only)**

Produced immediately after synthesis when Intent = Invest. Stands alone; does not require a presentation to have been built first. Verdict stated first, not buried.

```
[THEME NAME] — Investment Verdict
Date: [value]
Intent: [Tactical 6–24m / Strategic 5–10y]
Rescore date: [60 days or next major catalyst, whichever sooner]

VERDICT: GO / NO-GO / MONITOR
[One sentence explaining the verdict plainly.]

THESIS
[2 sentences: what is happening, what the market is missing or mispricing.]

SIZING STEER
[Starter / Core / Overweight — one-line rationale.]
[If NO-GO or MONITOR: note what would change the verdict.]

BULL CASE
1. [One sentence]
2. [One sentence]
3. [One sentence]

BEAR CASE
1. [One sentence]
2. [One sentence]
3. [One sentence]

SIGNALS TO MONITOR
Signal | Current reading | Trigger level | Source
[4–5 rows]

EXIT CONDITIONS (GO only)
Condition | Threshold | Time frame | Action
[3–4 rows]

UNIVERSE
[Equity count] names — see attached list
ETFs: [list, or "not applicable"]
```

Rules:
- Bull and bear cases must be genuinely asymmetric, not mirror images.
- Signals to monitor must be specific and measurable, not generic.
- Output as .docx (primary) and .md (portable).

---

## 10. RESEARCH MODULES

### Theme Research
Cover: what the theme is, why now, structural versus cyclical, sector and sub-sector exposure, value chain, margin pools and chokepoints, policy drivers, adoption path, geographic distribution, main protagonists and challengers, what consensus gets right, what consensus gets wrong, most investable parts, hardest parts to monetise, main failure modes.

Use TAM figures only when the methodology is sound and they genuinely add to the analysis.

### Company Due Diligence
Focus on: what the company does, where it sits in the value chain, revenue model, margin structure, competitive position, theme exposure, management and capital allocation where relevant, strategic strengths and vulnerabilities, what the market believes, what may be misunderstood.

Avoid generic business-school summaries.

### Market Analysis / Recurring
Prioritise: what changed, why it changed, whether it is noise or structural, cross-asset implications, market narrative versus underlying reality, implications for positioning and timing. Keep outputs short, ranked, and decision-oriented.

### Content Ingestion
For videos, podcasts, transcripts, long reports:
Do not summarise. Instead: extract the core thesis, identify assumptions, separate evidence from rhetoric, note what is new versus known, identify what is decision-useful, identify what is weak or promotional.
Output: 5–10 key takeaways, what matters most, what to verify, what this changes if anything.

### Contrarian and Debate
Cover: consensus view, strongest case for consensus, strongest case against, hidden assumptions, blind spots, timing asymmetries, what the market is over- and under-focusing on, what evidence would settle the debate.

Contrarian work means serious pressure-testing, not forced cleverness.

---

## 11. QUALITY CONTROL

**Good research:**
- Separates fact, inference, and judgement
- Identifies the key driver of the thesis
- Explains the transmission mechanism
- Includes disconfirming evidence
- Ranks risks and uncertainties
- Distinguishes structural from cyclical
- Is useful for portfolio or communication decisions

**Bad research:**
- Polished summary with no real view
- Uses growth figures without explaining assumptions
- Lists themes without showing how value accrues
- Confuses excitement with investability
- Generic risks without ranking
- Mistakes source quantity for analytical quality
- Overweights one source or narrative without flagging it

---

*This skill covers the research operating methodology. Business overlays live in separate modules.*
