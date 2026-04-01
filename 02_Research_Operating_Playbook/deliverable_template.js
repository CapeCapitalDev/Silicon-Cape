/**
 * synthesis_v2.js
 * Oil and Gas — Thematic Synthesis v2.0
 * Format: CAPE Capital Nuclear document style
 *   - Cover page: dark teal (#044049) background, Cape Capital logo, PP Eiko Light title
 *   - Headings: PP Eiko Light, dark teal (#044049)
 *   - Body: Arial 11pt
 *   - Tables: dark teal header rows
 *   - Footer: CAPE CAPITAL AG  |  Page X of Y
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell,
  ShadingType, VerticalAlign, PageNumber, Footer,
  LevelFormat, TabStopType, TabStopPosition, HeightRule
} = require('docx');
const fs = require('fs');

// ─── COLOURS ──────────────────────────────────────────────────────────────────
const TEAL   = '044049';   // CAPE dark teal — headings and accents
const TEAL_L = '0A6070';   // slightly lighter teal for sub-accents
const WHITE  = 'FFFFFF';
const DARK   = '1A1A1A';
const GREY   = '666666';
const GREY_L = '999999';
const LIGHT_GREY = 'F2F2F2';
const MID_GREY   = 'DDDDDD';

// ─── BORDERS ──────────────────────────────────────────────────────────────────
const border  = (color = MID_GREY) => ({ style: BorderStyle.SINGLE, size: 1, color });
const borders = (color = MID_GREY) => ({ top: border(color), bottom: border(color), left: border(color), right: border(color) });
const noBorder  = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ─── ELEMENT FACTORIES ────────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    children: [new TextRun({ text, font: 'PP Eiko Light', size: 52, bold: false, color: TEAL })],
    spacing: { before: 200, after: 160, line: 600, lineRule: 'exact' },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 4 } }
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: 'PP Eiko Light', size: 38, bold: false, color: TEAL })],
    spacing: { before: 280, after: 100, line: 400, lineRule: 'exact' }
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'PP Eiko Light', size: 28, bold: false, color: DARK })],
    spacing: { before: 200, after: 80 }
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({
      text,
      font: 'Arial',
      size: 20,
      color: opts.color || DARK,
      italics: opts.italic || false,
      bold: opts.bold || false
    })],
    spacing: { before: opts.spaceBefore || 60, after: opts.spaceAfter || 80 },
    alignment: opts.align || AlignmentType.LEFT
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text, font: 'Arial', size: 20, color: opts.color || DARK, bold: opts.bold || false })],
    spacing: { before: 40, after: 60 }
  });
}

function label(labelText, valueText) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [
      new TextRun({ text: labelText + ': ', font: 'Arial', size: 20, bold: true, color: DARK }),
      new TextRun({ text: valueText, font: 'Arial', size: 20, color: DARK })
    ],
    spacing: { before: 40, after: 60 }
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: MID_GREY, space: 1 } },
    spacing: { before: 200, after: 200 }
  });
}

function callout(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Arial', size: 20, italics: true, color: GREY })],
    spacing: { before: 100, after: 100 },
    indent: { left: 600 },
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: TEAL, space: 8 } }
  });
}

function makeTable(headers, rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => new TableCell({
          borders: borders(TEAL),
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: TEAL, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: h, font: 'Arial', size: 18, bold: true, color: WHITE })] })]
        }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, ci) => new TableCell({
          borders: borders(),
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? LIGHT_GREY : WHITE, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, font: 'Arial', size: 18, color: DARK })] })]
        }))
      }))
    ]
  });
}

function sp(n = 1) {
  return new Paragraph({ children: [new TextRun('')], spacing: { before: n * 100, after: 0 } });
}

function toc() {
  const sections = [
    '1. Bottom Line',
    '2. Source Reconciliation',
    '3. The Industry in Numbers',
    '4. Price, Benchmarks, and Cost Structure',
    '5. The Shale Revolution',
    '6. OPEC+: Cohesion, Spare Capacity, and Strategic Calculus',
    '7. The Value Chain',
    '8. IOC Landscape — The US/Europe Split',
    '9. Supply and Demand — The Structural Picture',
    '10. The Iran Conflict — The Live Stress Test (March 2026)',
    '11. Producers Under Sanctions',
    '12. Energy Transition: Where Oil Sits in the Long Game',
    '13. Oil and Government Finance',
    '14. Technology — Extracting More from Existing Wells',
    '15. Oil Exploration — Less Exploration, New Frontiers',
    '16. Commodity Traders — Switzerland\'s Hidden Oil Industry',
    '17. Key Uncertainties and Open Questions',
    '18. Downstream Dependencies — Industries Built on Oil and Gas',
    '19. Sources',
  ];

  return [
    new Paragraph({
      children: [new TextRun({ text: 'Contents', font: 'PP Eiko Light', size: 52, bold: false, color: TEAL })],
      spacing: { before: 400, after: 320 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: TEAL, space: 4 } }
    }),
    sp(),
    ...sections.map(s => new Paragraph({
      children: [new TextRun({ text: s, font: 'Arial', size: 20, color: DARK })],
      spacing: { before: 60, after: 60 }
    })),
  ];
}

// ─── COVER PAGE ELEMENTS ──────────────────────────────────────────────────────
// Teal-background cover card using a full-width table
function coverPage() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Top block: logo + spacer
      new TableRow({
        height: { value: 11800, rule: HeightRule.EXACT },
        children: [
          new TableCell({
            borders: noBorders,
            shading: { fill: TEAL, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.BOTTOM,
            margins: { top: 700, bottom: 600, left: 800, right: 800 },
            children: [
              // Cape Capital wordmark — right-aligned at top
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 0, after: 0 },
                children: [new TextRun({ text: 'CAPE CAPITAL AG', font: 'Arial', size: 18, color: '7AACB5', characterSpacing: 60 })]
              }),
              sp(6),
              // Subtitle label
              new Paragraph({
                children: [new TextRun({
                  text: 'THEMATIC RESEARCH',
                  font: 'Arial',
                  size: 18,
                  color: '7AACB5',
                  characterSpacing: 80
                })],
                spacing: { before: 0, after: 120 }
              }),
              // Main title
              new Paragraph({
                children: [new TextRun({
                  text: 'Oil and Gas',
                  font: 'PP Eiko Light',
                  size: 128,
                  bold: false,
                  color: WHITE
                })],
                spacing: { before: 0, after: 160 }
              }),
              // Thin white rule
              new Paragraph({
                border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: WHITE, space: 1 } },
                spacing: { before: 0, after: 240 },
                children: [new TextRun('')]
              }),
              // Date and intent
              new Paragraph({
                children: [new TextRun({
                  text: 'March 2026  ·  Intent: Understand',
                  font: 'Arial',
                  size: 20,
                  color: 'AACCCC',
                  italics: false
                })],
                spacing: { before: 0, after: 60 }
              }),
              new Paragraph({
                children: [new TextRun({
                  text: 'CAPE Capital AG  ·  Internal Research',
                  font: 'Arial',
                  size: 18,
                  color: '7AACB5'
                })],
                spacing: { before: 0, after: 0 }
              }),
            ]
          })
        ]
      })
    ]
  });
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const bodyFooter = new Footer({
  children: [new Paragraph({
    children: [
      new TextRun({ text: 'CAPE CAPITAL AG', font: 'Arial', size: 16, color: GREY }),
      new TextRun({ text: '\t', font: 'Arial', size: 16 }),
      new TextRun({ text: 'Page ', font: 'Arial', size: 16, color: GREY }),
      new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 16, color: GREY }),
      new TextRun({ text: ' of ', font: 'Arial', size: 16, color: GREY }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 16, color: GREY }),
    ],
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: MID_GREY, space: 4 } }
  })]
});

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 600, hanging: 300 } } } }]
    }]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 20 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 52, bold: false, font: 'PP Eiko Light', color: TEAL },
        paragraph: { spacing: { before: 200, after: 160, line: 600, lineRule: 'exact' }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 38, bold: false, font: 'PP Eiko Light', color: TEAL },
        paragraph: { spacing: { before: 280, after: 100, line: 400, lineRule: 'exact' }, outlineLevel: 1 } }
    ]
  },

  sections: [
    // ─── SECTION 1: COVER PAGE ────────────────────────────────────────────────
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      },
      children: [ coverPage() ]
    },

    // ─── SECTION 2: TOC + BODY ────────────────────────────────────────────────
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
        }
      },
      footers: {
        default: bodyFooter
      },
      children: [

        // ── TABLE OF CONTENTS ─────────────────────────────────────────────────
        ...toc(),

        divider(),
        sp(2),

        // ─── SECTION 1: BOTTOM LINE ──────────────────────────────────────────
        h1('1. BOTTOM LINE'),

        body('The global oil market in March 2026 is experiencing two simultaneously contradictory forces. Before the Iran conflict, the structural backdrop was unambiguously bearish: a supply surplus of ~3.8 mb/d, the largest since COVID, driven by record US production and tepid demand growth. The market was heading toward $55-60/bbl Brent. The US-Israeli strike campaign against Iran in late February 2026, and the resulting effective closure of the Strait of Hormuz, has overlaid a severe acute supply shock onto that bearish structure — suspending ~20% of global crude and gas supply and pushing Brent above $114/bbl.'),
        sp(),
        body('The critical question for the medium term is not the current price spike but what lies underneath it: an oversupplied market with peaking shale, slowing demand growth, 5 mb/d of OPEC spare capacity, and major IOCs retreating from exploration. When the Hormuz crisis resolves — and history suggests it will — the structural bear case will likely reassert. The timing and path of resolution are the dominant variables.'),
        sp(),
        h3('Five key things to hold in your head:'),
        bullet('The world produces ~104 million barrels of oil per day — 16.5 billion litres, or roughly 6,600 Olympic swimming pools every single day. It is simultaneously the most traded and most geopolitically weaponised commodity on earth.'),
        bullet('Brent above $114/bbl today reflects an acute crisis, not fundamentals. Strip the Iran shock and 2026 supply-demand points to ~$55-60/bbl. The gap between the two is entirely geopolitical premium.'),
        bullet('The shale revolution is maturing, not ending. Tier-one Permian inventory depletion is acknowledged by operators themselves. Production plateaus at high efficiency, but the era of volume growth is over.'),
        bullet('Majors are spending less on exploration than at any point since the 1990s, preferring M&A and buybacks. This creates a structural supply risk in the late 2020s if demand does not fall as fast as the IEA projects.'),
        bullet('The Hormuz closure — 20 mb/d through a 21-mile strait — is the defining geopolitical fact of energy markets in 2026. It was always the tail risk. It has now occurred.'),

        divider(),

        // ─── SECTION 2: SOURCE RECONCILIATION ───────────────────────────────
        h1('2. SOURCE RECONCILIATION'),
        body('Perplexity and ChatGPT produced near-identical outputs from Prompt A — both ran the same deep research cycle and converged on the same data points, tables, and source hierarchy. They are treated as a single consolidated source (Deep Research) below. AlphaSense provided primary-source intelligence from earnings calls, 10-Ks, and broker research — the most granular and company-specific data. Grok provided live market sentiment from X, confirming the directional narrative and flagging crowding signals.'),
        sp(),
        h3('Where sources agree:'),
        bullet('Global production ~103-104 mb/d; US is the largest single producer at ~20 mb/d including NGLs.'),
        bullet('Iran conflict is the most severe supply shock since 1973 (all four sources).'),
        bullet('Shale growth era is over: operators explicitly acknowledge tier-one depletion. AlphaSense provides the most granular confirmation — from operator 10-Ks and earnings calls, not analyst inference.'),
        bullet('OPEC+ compliance is structurally fragile: Saudi Arabia compensates for Russia and Iraq overproduction.'),
        bullet('US and European majors are diverging sharply on capital discipline: BP suspended buybacks, Total halved them; Shell and ExxonMobil maintained distributions.'),
        h3('Where sources diverge — flag:'),
        bullet('Demand growth 2026: OPEC projects +1.4 mb/d; IEA projects +0.7-0.85 mb/d. This is the widest agency divergence in years and creates the widest range of structural price outcomes. There is no settled consensus — treat both endpoints as plausible.'),
        bullet('Post-crisis price trajectory: Kenanga/Weatherford see sustained $80+ floor; Zedcrest argues structural glut will reassert as EV penetration and slowing China compress demand. Neither view is wrong — they are pricing different assumptions about crisis duration and demand trajectory.'),
        bullet('OPEC spare capacity estimates range from 3.5 mb/d (XP Investments) to 5 mb/d (Kenanga). Aramco itself states ~2 mb/d of "readily available" spare — the remainder requires more lead time.'),
        callout('Source balance note: Perplexity/ChatGPT outputs are comprehensive but structurally overlap. AlphaSense is weighted more heavily for company-specific claims, capital allocation data, and operator statements. Grok is used for sentiment direction only, not as a factual source.'),

        divider(),

        // ─── SECTION 3: THE INDUSTRY IN NUMBERS ─────────────────────────────
        h1('3. THE INDUSTRY IN NUMBERS'),
        h2('3.1 Scale and Production'),
        body('The global oil and gas industry produces approximately 103-104 million barrels of oil per day (mb/d) of petroleum liquids. At 159 litres per barrel, this equates to ~16.5 billion litres per day — enough to fill Lake Zurich (3.9 trillion litres) approximately every 245 days, or just over 8 months.'),
        sp(),

        makeTable(
          ['Country', 'Production (mb/d)', '% of Global'],
          [
            ['United States', '20.1 (incl. NGLs)', '~19%'],
            ['Saudi Arabia', '10.9', '~10%'],
            ['Russia', '10.8', '~10%'],
            ['Canada', '5.9', '~6%'],
            ['Iran', '4.0–5.1 (pre-conflict)', '~4–5%'],
            ['Iraq', '4.4', '~4%'],
            ['UAE', '4.0', '~4%'],
            ['Brazil', '3.5', '~3%'],
          ],
          [3200, 3200, 2600]
        ),
        sp(2),

        h2('3.2 Global Reserves'),
        body('Global proven reserves stand at approximately 1.56-1.57 trillion barrels. At current production rates of ~38 billion barrels/year, this equates to roughly 41 years of production — though this is a misleading metric, as reserves are continuously revised upward. Key reserve holders:'),
        sp(),
        makeTable(
          ['Country', 'Proven Reserves (bn bbl)', 'Note'],
          [
            ['Venezuela', '303', 'World\'s largest; production collapsed to ~1 mb/d'],
            ['Saudi Arabia', '267', 'Most credible and lowest-cost reserves'],
            ['Iran', '209', 'Directly affected by current conflict'],
            ['Iraq', '145–201', 'Cannot export without Hormuz access'],
            ['Canada', '163', 'Includes oil sands; expensive to extract'],
            ['Norway', '~8', 'Small reserves; managed via sovereign wealth fund'],
          ],
          [2800, 2800, 3400]
        ),
        sp(2),

        body('Reserve categories matter: Proven (1P/P90) underpins corporate valuations and government budgets. Probable (2P) and Possible (3P) are used for internal planning only. Most national reserve figures from petrostates have not been independently audited.', { italic: true, color: GREY }),

        divider(),

        // ─── SECTION 4: PRICE, BENCHMARKS, COST STRUCTURE ───────────────────
        h1('4. PRICE, BENCHMARKS, AND COST STRUCTURE'),
        h2('4.1 The Key Benchmarks'),
        body('Crude oil is not a single commodity. It varies by density (API gravity) and sulphur content ("sweet" vs "sour"). Two benchmarks dominate:'),
        bullet('Brent Crude: A basket of five North Sea streams (BFOET). The global benchmark for ~two-thirds of international oil transactions. Light (~38 API), sweet (~0.37% sulphur). Traded on ICE London.'),
        bullet('WTI (West Texas Intermediate): The US domestic benchmark. Lighter and sweeter than Brent (API ~39.6, sulphur ~0.24%). Priced at Cushing, Oklahoma. Typically trades $3-8/bbl below Brent in normal conditions due to landlocked logistics.'),
        bullet('Urals (Russia): Medium-sour. Trades at a significant discount to Brent — a $32/bbl discount at the height of sanctions enforcement in March 2023, now narrowed.'),
        sp(),
        h2('4.2 Production Cost Structure'),
        body('There is a critical distinction between extraction cost (what it costs to lift oil from the ground) and fiscal breakeven (the oil price a government needs to balance its budget). Saudi Arabia\'s extraction cost is among the world\'s lowest, but its government needs ~$91-94/bbl to fund Vision 2030 and the Public Investment Fund.'),
        sp(),
        makeTable(
          ['Region / Producer', 'Lifting Cost ($/bbl)', 'Full-Cycle Breakeven', 'Fiscal Breakeven'],
          [
            ['Saudi Arabia (Aramco)', '$2–10', '$10–20', '$91–94 (Bloomberg 2025)'],
            ['UAE', '$5–12', '$15–25', '~$60–65'],
            ['Iraq', '$3–10', '$10–20', '~$85–90'],
            ['Russia (conventional)', '$5–15', '$15–30', '~$70–77'],
            ['US shale (Permian)', '$25–40', '$48–70', 'N/A (private operators)'],
            ['US offshore (GoM)', '$15–30', '$20–48', 'N/A'],
            ['Canadian oil sands', '$25–45', '$40–65', 'N/A'],
            ['North Sea (UK)', '$25–45', '$40–55', 'N/A'],
            ['Brazil (pre-salt)', '$10–20', '$28–30 (Petrobras)', 'N/A'],
          ],
          [2900, 1800, 2200, 2100]
        ),
        sp(2),
        callout('Analyst note: Saudi Arabia\'s fiscal breakeven of $91-94/bbl climbs to ~$111/bbl when PIF domestic spending is included (Bloomberg Economics 2025). At current prices above $100/bbl, Saudi Arabia is running a surplus. Below $80/bbl, it runs a fiscal deficit. This is the constraint on how long Saudi Arabia can afford to flood markets in a price war.'),

        divider(),

        // ─── SECTION 5: SHALE ────────────────────────────────────────────────
        h1('5. THE SHALE REVOLUTION — MATURITY, NOT COLLAPSE'),
        body('US tight oil (commonly called "shale oil") transformed the United States from a declining producer into the world\'s largest oil producer within a decade. The US now produces ~20 mb/d including NGLs, up from 5 mb/d in 2008. The revolution rested on three innovations: horizontal drilling, multi-stage hydraulic fracturing, and private mineral rights (unique to the US).'),
        sp(),
        h2('5.1 Why the Growth Era Is Over'),
        body('This is one of the clearest signals across all sources — and it comes directly from operators, not analysts. Key primary-source evidence from AlphaSense:'),
        bullet('Diamondback Energy (10-K, 2025): explicitly states that "as the US shale industry matures and the best resources are consumed, maintaining an advantage in inventory quality and duration is an existential imperative."'),
        bullet('Devon Energy (earnings call): "do not plan to add incremental barrels to the market at this time."'),
        bullet('EOG Resources: restricts growth to only wells meeting a 30% direct after-tax return at $40/bbl flat — a high hurdle that limits volume growth at current prices.'),
        bullet('US production hit 14 mb/d with only ~400 rigs — a recessionary-level rig count. Efficiency gains from longer laterals and simul-frac technology have been largely exhausted.'),
        bullet('Drilled-but-uncompleted (DUC) well inventories have fallen sharply, indicating recent production growth relied on drawing down inventory rather than new drilling.'),
        sp(),
        h2('5.2 Shale Economics Today'),
        makeTable(
          ['Operator', 'LOE ($/boe)', 'Breakeven (WTI)', 'Capital Discipline Signal'],
          [
            ['Diamondback', '$5.55 LOE; $10.23 total cash opex', '$40/bbl base dividend floor', 'Production flat at 500-510k bbl/d in 2026'],
            ['Devon Energy', 'Fully funded below $45/bbl', '~$40/bbl operating breakeven', 'Capital budget cut $500M vs 2025'],
            ['EOG Resources', 'Well costs down 7% in 2025', '$40/bbl + $2.50 gas hurdle', 'Growth "intentionally constrained"'],
            ['Occidental', '$7.77/boe (lowest since 2021)', '$55-60/bbl 2026 capex plan', 'CapEx cut $550M; pivoting to EOR'],
          ],
          [2000, 2300, 2300, 2400]
        ),
        sp(2),
        callout('Key inference: Shale is not collapsing — it is transitioning from a growth business to a maintenance and cash-return business. At $60-70/bbl, operators maintain flat production. At $80+, some incremental growth returns. The era of debt-fuelled volume maximisation is definitively over.'),

        divider(),

        // ─── SECTION 6: OPEC+ ───────────────────────────────────────────────
        h1('6. OPEC+: COHESION, SPARE CAPACITY, AND STRATEGIC CALCULUS'),
        h2('6.1 What OPEC+ Is'),
        body('OPEC was founded in 1960 (Baghdad, 14 September) by Venezuela, Iraq, Saudi Arabia, Iran, and Kuwait. OPEC+ was formed in November 2016 when Russia and nine other non-OPEC producers joined in coordinated cuts. Today, OPEC+ controls ~40-42 mb/d or roughly 40% of global production.'),
        sp(),
        h2('6.2 How the System Works — and Where It Breaks'),
        bullet('Saudi Arabia is the de facto central banker: it is the only producer with meaningful spare capacity (~2 mb/d readily available per Aramco\'s own filings, 5 mb/d total OPEC+ spare per Kenanga Research estimates). It frequently cuts more than agreed to compensate for overproducers.'),
        bullet('Compliance is monitored but unenforceable. Russia, Iraq, and Kazakhstan are serial overproducers. There are no penalties — only reputational damage and Saudi patience.'),
        bullet('The system has no enforcement mechanism other than Saudi Arabia\'s willingness to flood markets — as it demonstrated in 2014 (vs shale) and 2020 (COVID price war with Russia). Both times, Saudi Arabia ultimately backed down.'),
        sp(),
        h2('6.3 OPEC+ in 2026: Pre-Conflict Dilemma'),
        body('Before the Iran conflict, OPEC+ faced an impossible choice: maintain cuts to defend the price (and lose market share to Brazil, Guyana, and US producers) or increase production (and crash prices into the $50-60 range). Analysts were split on whether OPEC would hold discipline. The Iran crisis has temporarily resolved this tension by removing supply.'),
        sp(),
        callout('Saudi fiscal breakeven of ~$91/bbl means that at current $114 prices, Riyadh is running a significant surplus. If the crisis resolves and prices fall to $55-60, Saudi Arabia faces a structural fiscal problem. This is a key strategic constraint on Saudi flexibility going forward.'),

        divider(),

        // ─── SECTION 7: VALUE CHAIN ──────────────────────────────────────────
        h1('7. THE VALUE CHAIN'),
        h2('7.1 Three Segments'),
        makeTable(
          ['Segment', 'Activities', 'Key Players', 'Margin Profile'],
          [
            ['Upstream (E&P)', 'Exploration, drilling, production', 'IOCs, NOCs, independents (EOG, COP)', 'High risk, high reward. Margins >50% in low-cost regions.'],
            ['Midstream', 'Pipelines, storage, tankers, gas processing', 'Kinder Morgan, Enbridge, Frontline; Saudi Aramco pipelines', 'Fee-based/tolling. Lower risk, stable returns.'],
            ['Downstream', 'Refining, petrochemicals, retail', 'Reliance (Jamnagar: 1.24 mb/d), Sinopec, Valero, ADNOC', 'Cyclical. Crack spreads range from near-zero to $50+/bbl.'],
          ],
          [1500, 2900, 2600, 2000]
        ),
        sp(2),
        h2('7.2 Where the Money Is'),
        bullet('Highest margins: Upstream in the lowest-cost regions (Saudi Arabia, UAE, Iraq) and commodity trading. Aramco\'s lifting cost of $3.51/boe is industry-defining.'),
        bullet('Commodity traders: Vitol ($331bn revenue, ~$8-8.5bn net profit), Trafigura ($243bn, $2.8bn), Gunvor ($136bn, $729m). All based in Switzerland. They earn 3-5% net margins but on enormous volumes.'),
        bullet('Refining: highly cyclical. US 3:2:1 crack spread peaked above $50/bbl in 2022; now ~$15-25/bbl. ExxonMobil\'s refining earnings surged 8x year-over-year in Q4 2025 following the Iran supply shock.'),
        bullet('Petrochemicals: ~$577-675bn market (2024). Growing to $900bn+ by early 2030s, driven by Asian demand. This is the one downstream segment with structural growth regardless of fossil fuel transition.'),

        divider(),

        // ─── SECTION 8: IOC LANDSCAPE ───────────────────────────────────────
        h1('8. IOC LANDSCAPE — THE US/EUROPE SPLIT'),
        body('The defining capital markets story of the past 18 months in oil is the divergence between US and European majors. US majors are running offensive operations; European majors are running defence.'),
        sp(),
        makeTable(
          ['Company', '2025 Production', 'Capital Discipline Signal', 'Analyst View'],
          [
            ['ExxonMobil (XOM)', '4.7m boe/d (40-year high)', '$27-29bn capex 2026; $150bn shareholder returns in 5 years', 'Freedom Broker: Sell (EPS declining despite volume records)'],
            ['Chevron (CVX)', 'Record US + global output; +261k boe/d from Hess', '$3bn buyback Q4 2025; 4% dividend increase', 'Freedom Broker: Sell (OPEC+ volume increase pressure)'],
            ['Shell', '+2.7% YoY in Q4 2025 to 2.84m boe/d', '$3.5bn buyback Q1 2026; "sacrosanct" 40-50% CFFO return', 'Diverged from European peers; maintained distributions'],
            ['TotalEnergies', '+4% YoY 2025', 'Buyback halved from $1.5bn to $750m; capex cut to $15bn', 'Freedom Broker: Sell (deteriorating fundamentals)'],
            ['BP', 'Production flat 2025; expected flat 2026', 'Buybacks fully suspended; net debt target $14-18bn by 2027', 'Edison: balance sheet correction required'],
          ],
          [1800, 2400, 2800, 2000]
        ),
        sp(2),
        callout('Key structural signal from Hannam & Partners (AlphaSense): Most majors posted organic reserve replacement ratios below 100% in 2025. The industry loses ~5% of supply annually to natural decline. This is forcing exploration back to the agenda and driving aggressive M&A — ExxonMobil/Pioneer ($64.5bn), Chevron/Hess ($60bn).'),

        divider(),

        // ─── SECTION 9: SUPPLY/DEMAND BALANCE ───────────────────────────────
        h1('9. SUPPLY AND DEMAND — THE STRUCTURAL PICTURE'),
        h2('9.1 Demand: Slow Growth, Not Collapse'),
        body('Demand growth is slowing structurally but not collapsing. The key disagreement is between agencies:'),
        makeTable(
          ['Forecaster', '2026 Demand Growth (mb/d)', 'Driver of View'],
          [
            ['OPEC', '+1.4 mb/d', 'Non-OECD growth (India, China, broader Asia)'],
            ['IEA', '+0.7–0.85 mb/d', 'EV penetration, industrial efficiency, macro uncertainty'],
            ['ICBC International Research', '+1.1 mb/d', 'Below pre-pandemic 1.5 mb/d average; peak demand approaching'],
            ['EIA', 'Inventory build of 3.1 mb/d in 2026', 'Supply outpacing demand'],
          ],
          [2500, 2500, 4000]
        ),
        sp(2),
        body('The OPEC-IEA gap of ~0.6 mb/d is not merely a forecasting difference — it reflects fundamentally different views of China\'s EV transition, India\'s growth trajectory, and the speed of efficiency improvements. For context, 0.6 mb/d is the equivalent of Norway\'s entire production.'),
        sp(),
        h2('9.2 Supply Surplus — Pre-Conflict'),
        bullet('MBC Group: global supply surplus of ~3.84 mb/d in 2026, which would push Brent toward $55/bbl.'),
        bullet('EIA: inventory builds averaging 3.1 mb/d in 2026, vs 2.7 mb/d in 2025.'),
        bullet('Commerzbank: OECD commercial stocks hit 2.84 billion barrels at end-2025 — first time exceeding five-year average since February 2021.'),
        bullet('Supply growth drivers: Brazil (deepwater pre-salt, ~3.5 mb/d), Guyana (Stabroek; 11 billion barrels discovered since 2015), Canada (oil sands expansion), US shale at elevated plateau levels.'),
        sp(),
        callout('The pre-conflict oil market in early 2026 was structurally the weakest since COVID. OPEC+ discipline was the only thing preventing a price collapse. The Iran crisis has temporarily resolved that tension by removing 20 mb/d from the market. The structural surplus will reassert once the Strait reopens.'),

        divider(),

        // ─── SECTION 10: THE IRAN CRISIS ────────────────────────────────────
        h1('10. THE IRAN CONFLICT — THE LIVE STRESS TEST (MARCH 2026)'),
        h2('10.1 What Has Happened'),
        bullet('Late February 2026: Coordinated US-Israeli strikes on Iran (Operation Epic Fury). Iran retaliated by effectively closing the Strait of Hormuz.'),
        bullet('Strait of Hormuz: 20.7 mb/d of petroleum liquids and 20% of global LNG normally transit this 21-mile channel. There is no adequate bypass: Saudi Arabia\'s East-West Pipeline handles 5 mb/d; UAE\'s ADCOP handles 1.5 mb/d. Combined bypass capacity is 3-5 mb/d — far less than the 20 mb/d at stake.'),
        bullet('Iraq slashed southern oilfield production by 70% (removing 1.3 mb/d); Kuwait, Bahrain, UAE declared force majeure.'),
        bullet('Qatar halted LNG production at Ras Laffan following drone strikes. Qatar accounts for 20% of global LNG supply.'),
        bullet('Saudi Aramco\'s Ras Tanura refinery and export terminal closed due to attacks.'),
        bullet('Oil price: Brent surged from ~$72 to above $114/bbl. Goldman Sachs warned of $100+ if sustained.'),
        bullet('Saudi Arabia, UAE, Iraq, Kuwait collectively halted ~140 million barrels of shipments.'),
        sp(),
        h2('10.2 Winners and Losers'),
        makeTable(
          ['Category', 'Countries/Entities', 'Mechanism'],
          [
            ['Most exposed producers', 'Iran, Iraq, Kuwait, Qatar', 'Direct attack or Hormuz dependence; no bypass infrastructure'],
            ['Clear beneficiaries', 'Russia, Brazil, Norway', 'Higher prices; Russia also benefits from emergency sanction waivers'],
            ['US producers', 'XOM, CVX, shale operators', 'Higher prices, though US consumer energy costs also rise'],
            ['Most damaged importers', 'India, Japan, South Korea, Thailand', '60% of Asian crude imports from Middle East ("dual shock": oil + LNG simultaneously)'],
            ['China', 'Moderately exposed', '40% of oil imports via Hormuz; 30% of LNG from Qatar/UAE; but strategic reserves + Russian alternative'],
            ['European consumers', 'Moderately exposed', 'LNG price spike compounds already elevated energy costs'],
          ],
          [2100, 2400, 4500]
        ),
        sp(2),
        h2('10.3 Market Narrative: How Long Does This Last?'),
        body('There is genuine disagreement across sources — this is the most important analytical uncertainty.'),
        bullet('Bullish camp (Kenanga, Weatherford expert call): structural damage to Gulf infrastructure could sustain elevated prices for 6 months to several years. Pre-conflict market was already underpricing geopolitical risk at $60/bbl.'),
        bullet('Bearish camp (Zedcrest Wealth): the current spike is a panic premium, not a structural shift. The underlying 2026 supply-demand is bearish. Once acute anxiety subsides, $55-60 Brent will reassert.'),
        bullet('Moderate view (Desjardins): pre-conflict 4.4 mb/d surplus + 5 mb/d OPEC spare capacity provides substantial cushion once Hormuz reopens.'),
        sp(),
        callout('Our read: The bearish structural view is likely correct for the medium term (12-18 months post-resolution). But the timing of resolution is unknowable and could extend longer than historical analogues suggest if Iranian infrastructure is structurally damaged rather than temporarily disrupted. The key watch variable is whether Ras Tanura and Iraqi southern export terminals are back online — not just whether tankers can transit the Strait.'),

        h2('10.4 Historical Precedents'),
        makeTable(
          ['Disruption', 'Year', 'Peak Price Impact', 'Duration of Spike'],
          [
            ['1973 Arab Oil Embargo', '1973', '+400% (from $3 to $12/bbl)', '5–6 months; structural regime change'],
            ['Iranian Revolution', '1979', '+100% (from $14 to $35/bbl)', '18 months'],
            ['Iraq-Kuwait War', '1990', '+100% (from $16 to $34/bbl)', '6 months; quickly reversed'],
            ['Libyan Civil War', '2011', '+25% (Brent $90 to $115)', '2–3 months'],
            ['Russia-Ukraine (2022)', '2022', '+65% from $80 to $130/bbl)', '4–6 months of elevated prices'],
            ['Iran conflict (2026)', 'NOW', '+58% ($72 to $114+ ongoing)', 'Unresolved'],
          ],
          [2600, 1000, 2600, 2800]
        ),
        sp(2),
        body('Historical pattern: price spikes from supply disruptions have typically reversed within 3-12 months as alternative supply activates and demand responds. The exception is the 1973 embargo, where a structural regime change occurred. The 2026 crisis is different in severity — Hormuz handles far more volume than any historical disruption — but OPEC spare capacity is also higher than in 1973.'),

        divider(),

        // ─── SECTION 11: SANCTIONS ───────────────────────────────────────────
        h1('11. PRODUCERS UNDER SANCTIONS'),
        body('Iran, Russia, and Venezuela — collectively ~15-16 mb/d — operate under significant Western sanctions. All three have developed sophisticated workarounds. The effectiveness of enforcement is increasing in 2026, particularly against Russia.'),
        sp(),
        h2('11.1 Iran'),
        bullet('Pre-conflict production: ~3.2-3.6 mb/d capacity; ~1.6-2.0 mb/d exported to China and India via shadow fleet, AIS manipulation, and ship-to-ship transfers.'),
        bullet('Discount to Brent: ~$8-10/bbl offered to buyers as compensation for legal and logistical risk.'),
        bullet('Current status: production severely disrupted by direct military targeting.'),
        h2('11.2 Russia'),
        bullet('Rerouted exports to India (~1.1 mb/d) and China (~1.7 mb/d) using shadow fleet; discounts of $10-15/bbl.'),
        bullet('The EU\'s 19th sanctions package specifically targeted shadow fleet registries; Denmark and Germany are physically intercepting vessels in the Baltic Sea. The US seized a Russian-flagged tanker in the North Atlantic.'),
        bullet('G7 and EU discussing replacing the $60 price cap with a comprehensive ban on maritime services. If implemented, this would represent a step-change in enforcement effectiveness.'),
        bullet('Temporary beneficiary of Iran crisis: India received 30-day sanction waivers to buy Russian crude to replace lost Middle Eastern supply. Russia gains both higher prices and reduced scrutiny.'),
        h2('11.3 Venezuela'),
        bullet('Production ~1 mb/d, down from 3.5 mb/d in the 1990s. Infrastructure severely degraded.'),
        bullet('Following the apprehension of Maduro in January 2026, the US partially lifted oil-related sanctions. Production recovery is possible but infrastructure rehabilitation will take years.'),
        bullet('Vitol and Trafigura both obtained preliminary US Treasury licenses to market Venezuelan crude — a significant development given Gunvor\'s simultaneous difficulties.'),

        divider(),

        // ─── SECTION 12: ENERGY TRANSITION ──────────────────────────────────
        h1('12. ENERGY TRANSITION: WHERE OIL SITS IN THE LONG GAME'),
        body('The energy transition is real but slower than optimists assumed in 2021-2022. Oil demand for transport is under structural pressure from EVs; demand for petrochemicals is growing. The IEA projects demand "peaking" in the late 2020s; OPEC\'s internal models show growth to 2045. The truth is probably in between.'),
        sp(),
        bullet('EV penetration is the key variable. IEA: EV-driven efficiency gains are already reducing transport fuel demand growth in advanced economies. BEV share of new car sales exceeded 20% in Europe in 2025.'),
        bullet('But: petrochemicals demand is growing structurally in Asia and is not replaceable. ~12-15% of each barrel ends up as non-fuel products. The ICA projects petrochemical feedstocks will account for more than half of all demand gains by 2026.'),
        bullet('Natural gas is the transition fuel. Aramco is expanding gas production capacity by 80% over 2021 levels by 2030, targeting 6m boe/d. The Jafurah unconventional gas basin (first production December 2025) is the core vehicle — releasing ~500k bpd of crude currently burned for Saudi domestic power generation into export markets.'),
        bullet('European energy security: Europe replaced ~80% of Russian pipeline gas with LNG within two years — a remarkable logistical achievement. US LNG now costs 2-3x Russian pipeline gas ($15/MMBtu vs $5-6/MMBtu pre-2022). Wood Mackenzie forecasts EU gas prices falling to ~€24/MWh by 2030-2035 as new LNG capacity floods the market.'),
        bullet('The Iran crisis will delay, not accelerate, transition: governments under energy price stress prioritise supply security over transition investment. Expect increased domestic production incentives in the US, UK, and Norway.'),
        callout('Inference: Oil demand does not need to "collapse" to create a bearish structural price environment. Even 0.5-1.0 mb/d of annual demand deceleration, combined with 1-2 mb/d of non-OPEC supply growth (Brazil, Guyana, Canada), implies OPEC losing market share or prices declining. The marginal cost of US shale (~$48-70/bbl full-cycle) sets a de facto ceiling on structural oil prices.'),

        divider(),

        // ─── SECTION 13: GOVERNMENT FINANCE ─────────────────────────────────
        h1('13. OIL AND GOVERNMENT FINANCE'),
        body('The importance of oil to government revenues varies by three orders of magnitude — from negligible (Switzerland) to existential (Saudi Arabia, Nigeria).'),
        sp(),
        makeTable(
          ['Country', 'O&G Share of Government Revenue', 'Primary Mechanism', 'Trend'],
          [
            ['Saudi Arabia', '~60–65%', 'Aramco dividends, royalties, corporate tax', 'Diversifying via Vision 2030; still dominant'],
            ['Norway', '~20–25%', '78% marginal tax on petroleum profits; Oil Fund', 'Stable; managed via sovereign wealth fund'],
            ['Russia', '~30–40% of federal budget', 'Export duties, mineral extraction tax (MET)', 'Declining with sanctions enforcement'],
            ['United Kingdom', '~2–3% (fuel duties)', 'Fuel duty (52.95p/litre) + VAT; Energy Profits Levy', 'Declining with frozen duty since 2011'],
            ['France', '~2–3% of GDP', 'TICPE excise (~€0.65/litre) + 20% VAT', 'Declining with efficiency + EV adoption'],
            ['United States', '~1–2% of federal revenue', 'Federal royalties (~$10bn/yr), state severance taxes, fuel excise', 'Stable; significant for Alaska, Texas, ND'],
            ['Switzerland', 'Negligible', 'Mineral oil tax + CO₂ levy on fuels. No domestic production.', 'Flat; transition revenue from CO₂ levy growing'],
          ],
          [1600, 2200, 2800, 2400]
        ),
        sp(2),
        h2('13.1 What Consumers Pay in Tax'),
        makeTable(
          ['Country', 'Approx. Tax per Litre (Petrol)', 'Tax as % of Pump Price'],
          [
            ['UK', '~£0.80–0.85 (duty 52.95p + VAT 20%)', '~53%'],
            ['France', '~€0.85–0.90 (TICPE ~€0.65 + VAT 20%)', '~55–60%'],
            ['Switzerland', '~CHF 0.73 (mineral oil tax + surtax)', '~45–50%'],
            ['United States', '~$0.57 federal + state average', '~20–25% (much lower than Europe)'],
          ],
          [2200, 4000, 2800]
        ),
        sp(2),
        h2('13.2 The Norway Model'),
        body('Norway\'s Government Pension Fund Global (GPFG) — the world\'s largest sovereign wealth fund at ~NOK 18.8 trillion (~$1.8-2.2 trillion) — is the canonical example of converting finite oil wealth into permanent intergenerational capital. The government may only spend 3% of the fund\'s value annually (the expected real return). Norway\'s oil revenues flow into the fund rather than into current government spending. This contrasts sharply with petrostates that rely on oil revenue for current expenditure and face fiscal collapse when prices fall.'),

        divider(),

        // ─── SECTION 14: EOR AND WELL TECHNOLOGY ────────────────────────────
        h1('14. TECHNOLOGY — EXTRACTING MORE FROM EXISTING WELLS'),
        h2('14.1 Recovery Factor'),
        body('Conventional oil recovery leaves 50-70% of oil underground. The global average recovery factor is approximately 35-50% — meaning the majority of known oil resources are technically accessible but uneconomically recoverable at current costs and technology.'),
        sp(),
        makeTable(
          ['Recovery Phase', 'Method', 'Typical Recovery Factor'],
          [
            ['Primary', 'Natural reservoir pressure, pumps', '5–30%'],
            ['Secondary', 'Waterflooding, gas reinjection', '30–50%'],
            ['Tertiary (EOR)', 'Thermal, gas injection, chemical', '30–70%+'],
          ],
          [2000, 3500, 3500]
        ),
        sp(2),
        h2('14.2 Enhanced Oil Recovery (EOR)'),
        bullet('Thermal EOR: Injecting steam to reduce viscosity of heavy oil. Used in Canadian oil sands and California. Recovery uplift: +15-25%. High energy cost.'),
        bullet('CO₂ injection: At high pressure, CO₂ mixes with oil, swelling it and reducing viscosity. Adds 8-15% to recovery factor. Cost: ~$20-30/bbl added. Economic above ~$40-60/bbl. US Permian Basin is the global leader.'),
        bullet('Chemical EOR (polymer flooding): Injecting polymers/surfactants to improve sweep efficiency. Adds 5-15%. China\'s Daqing field is the global reference case.'),
        bullet('Occidental Petroleum is actively redirecting capital toward Permian EOR and Gulf of Mexico waterfloods to lower its base decline rate — a direct response to tier-one shale depletion.'),
        sp(),
        h2('14.3 Field Life Extension Technologies'),
        bullet('4D seismic (time-lapse): Repeated 3D seismic surveys track fluid movement, improving well placement and injection strategy. Studies show 25% improvement in hydrocarbon recovery.'),
        bullet('AI reservoir modelling: Reduced seismic data processing times by 40% in documented applications. SLB, CGG, and TGS are the primary oilfield services providers.'),
        bullet('Horizontal and multilateral drilling: Accessing wider reservoir areas from single surface locations — the technology that underpinned the shale revolution now applied to conventional fields.'),
        sp(),
        h2('14.4 End-of-Well-Life: The Growing Environmental Liability'),
        body('This is materially underappreciated by capital markets.'),
        bullet('US: ~2.6 million documented unplugged onshore wells, plus ~1.2 million undocumented. Cost to plug all documented wells: ~$280 billion. Orphaned wells emit ~7-20 million metric tonnes of CO₂-equivalent per year.'),
        bullet('Offshore: Global decommissioning liability exceeds $300 billion (real terms). UK Continental Shelf alone: £44 billion (NSTA 2025 estimate). Actual UK spending was £2.4 billion in 2024 — the highest annual rate on record.'),
        bullet('UK taxpayer exposure: HM Treasury estimates ~£20 billion in tax relief on decommissioning — approximately 60% of total UK costs effectively falls on the taxpayer.'),
        bullet('Legal responsibility: Under most regimes (including UK Petroleum Act), liability falls on current and previous licensees — joint and several. If companies go bankrupt, costs cascade to the state.'),
        callout('Investment signal: Decommissioning and well integrity is a growing specialised services market. Companies with proprietary P&A (plug and abandonment) technology and environmental remediation capabilities are likely to see sustained demand regardless of oil price cycles.'),

        divider(),

        // ─── SECTION 15: EXPLORATION ─────────────────────────────────────────
        h1('15. OIL EXPLORATION — LESS EXPLORATION, NEW FRONTIERS'),
        h2('15.1 The Exploration Lifecycle'),
        body('Discovery-to-first-oil takes 7-15 years for major offshore projects. The stages: basin screening/geological assessment (1-3 years) → seismic survey (6 months-2 years; cost $50-300m offshore) → exploration drilling (1-3 years; cost $5-25m onshore, $50-150m deepwater) → appraisal → development (FID) → first oil (2-5 years from FID). This long lead time means decisions made today about exploration will determine supply availability in the mid-2030s.'),
        sp(),
        h2('15.2 Technology: Better Success Rates'),
        bullet('3D seismic: Now dominates exploration (45% of survey market). Enables precise well placement.'),
        bullet('4D seismic: Tracks reservoir fluid movement over time; improved recovery rates by 10-25%.'),
        bullet('AI/ML: Reduced seismic data processing times by 40%. SLB, CGG, TGS are the key service providers. Success rate has improved from ~25% to ~40% for commercially viable discoveries.'),
        bullet('Ocean-bottom nodes (OBN): Higher-resolution seismic in complex or congested deepwater environments — increasingly replacing towed streamer surveys for appraisal work.'),
        bullet('Satellite remote sensing: Low-cost screening tool for surface oil seeps and ground deformation.'),
        sp(),
        h2('15.3 The Retreat from Exploration'),
        body('This is one of the clearest structural signals across sources — and it carries the most significant long-term supply implications.'),
        bullet('IEA data: Major companies cut exploration spending since 2015. The supermajors have systematically shifted capital toward buybacks, dividends, and M&A rather than frontier exploration.'),
        bullet('ExxonMobil spent $64.5 billion on Pioneer; Chevron spent $60 billion on Hess. Both could have funded significant exploration programmes at those levels.'),
        bullet('Most majors now grow production primarily through developing existing discovered assets and acquisitions — not from drilling frontier prospects.'),
        bullet('Organic reserve replacement ratios below 100% at most majors in 2025 (Hannam & Partners via AlphaSense). The industry is consuming reserves faster than it is replenishing them.'),
        sp(),
        h2('15.4 New Frontiers (Still Being Opened)'),
        makeTable(
          ['Basin', 'Country', 'Discovered Volumes', 'Economics', 'Status'],
          [
            ['Stabroek Block', 'Guyana', '>11 bn barrels since 2015', '>30% returns; ~$40/bbl breakeven', 'Active production and development; ExxonMobil/Hess/CNOOC'],
            ['Pre-salt', 'Brazil', 'Large; drives ~3.5 mb/d total production', '$28-30/bbl (Petrobras)', 'Active; Petrobras leads'],
            ['Orange Basin', 'Namibia', 'Potentially billions of barrels', 'Deepwater; no existing infrastructure', 'Major TotalEnergies and Shell discoveries; early stage'],
            ['Rovuma Basin', 'Mozambique', 'Large gas discoveries', 'LNG development economics', 'Insurgency has severely delayed development'],
          ],
          [1600, 1400, 2200, 2000, 2000]
        ),
        sp(2),
        callout('Long-term supply risk: If exploration decline continues while demand decelerates (rather than collapses), the industry risks a structural supply deficit in the late 2020s-2030s. Guyana, Brazil, and Namibia are the growth offsetters. US shale can swing but not plug the gap alone if major conventional fields decline faster than expected.'),

        divider(),

        // ─── SECTION 16: COMMODITY TRADERS ──────────────────────────────────
        h1('16. COMMODITY TRADERS — SWITZERLAND\'S HIDDEN OIL INDUSTRY'),
        body('A small group of largely private trading houses, based overwhelmingly in Geneva and Zurich, moves more oil daily than most OPEC members produce. They are systemically important to global oil markets but operate with minimal public scrutiny.'),
        sp(),
        makeTable(
          ['Trader', 'Revenue (2024)', 'Net Profit', 'Traded Volume', 'Listed?'],
          [
            ['Vitol', '$331bn', '~$8–8.5bn', '7.2 mb/d crude + products', 'Private (~500 employee-shareholders; $10.6bn buybacks 2024)'],
            ['Trafigura', '$243bn', '$2.8bn', '537mt oil equivalent', 'Private (~1,400 employee-shareholders)'],
            ['Gunvor', '$136bn', '$729m', '232mt total', 'Private; founder Törnqvist departed after US Treasury "Kremlin puppet" label'],
            ['Mercuria', '~$110–118bn', '$1.3–2.1bn', 'Not disclosed', 'Private; co-founders Dunand and Jaeggi, Geneva'],
            ['Glencore', 'Diversified', '$3.7bn adj. EBIT (marketing)', '~6 mb/d crude equivalent', 'LSE listed (GLEN)'],
          ],
          [1100, 1200, 1200, 2000, 3500]
        ),
        sp(2),
        body('Core economics: margins are typically 3-5% in normalised years. The model depends entirely on volume. What they make on arbitrage — geographic, quality, and temporal — is the real alpha. The Iran crisis is generating exceptional arbitrage opportunities as physical flows restructure.'),
        sp(),
        body('Gunvor note: The US Treasury\'s "Kremlin puppet" designation and blocking of the Lukoil asset acquisition led to the abrupt departure of founder Törnqvist (86% stake sold to employees). Gunvor is now weighing US domestic oil asset investments to rebuild Washington relationships. This is a significant governance event for one of the world\'s largest private oil traders.'),

        divider(),

        // ─── SECTION 17: KEY UNCERTAINTIES ──────────────────────────────────
        h1('17. KEY UNCERTAINTIES AND OPEN QUESTIONS'),
        body('Ranked by impact on the medium-term supply/demand picture:'),
        sp(),
        label('1. Duration and resolution of the Iran conflict', 'How long does Hormuz remain closed? Is Gulf energy infrastructure permanently degraded or temporarily disrupted? This is the single variable that determines whether 2026 is a $114 Brent year or a $60 year.'),
        label('2. OPEC+ cohesion without Iran', 'Does the Iran crisis accelerate Saudi Arabia\'s willingness to restore production volume — at the cost of other members? Saudi Arabia\'s fiscal surplus at current prices removes the urgency to cut.'),
        label('3. China demand trajectory', 'EV penetration in China is the largest single variable in the IEA/OPEC demand split. If China\'s oil demand for transport peaks in 2026-2027 as per IEA, the structural bear case strengthens significantly.'),
        label('4. US shale response', 'At $100+ oil, does US shale production accelerate materially? The bottleneck is not price but tier-one inventory. EOG, Devon, and Diamondback have all committed to production discipline. But at $100+, secondary zones and higher-cost acreage become viable.'),
        label('5. Russia sanctions enforcement', 'If the G7 comprehensive maritime services ban is implemented, Russia loses ~7.5 mb/d of export routing infrastructure. This would be a massive structural supply shock — potentially more consequential than the Iran disruption.'),
        label('6. Decommissioning liability crystallisation', 'UK North Sea assets are declining. If smaller operators go bankrupt at lower oil prices, £44bn+ of decommissioning costs could cascade to larger IOCs or the state. This is a tail risk for BP and Shell specifically.'),
        label('7. Exploration and the 2030s supply cliff', 'If exploration capex remains suppressed through 2026-2030, the supply pipeline for the mid-2030s will be inadequate even under a demand deceleration scenario. This is the market\'s least-priced risk.'),

        divider(),

        // ─── SECTION 18: DOWNSTREAM DEPENDENCIES ────────────────────────────
        h1('18. DOWNSTREAM DEPENDENCIES — INDUSTRIES BUILT ON OIL AND GAS'),

        body('The energy transition debate focuses almost exclusively on combustion — the 92-93% of each barrel burned as fuel. The other 7-8% is petrochemical feedstock, and that fraction underpins a vast industrial economy that is not subject to electrification. Six thousand or more everyday products trace their supply chain to a refinery or gas processing plant. Several of these industries face existential risk if the feedstock is disrupted or structurally re-priced.'),
        sp(),
        callout('Key structural point: non-fuel demand for oil and gas is GROWING, not declining. The IEA projects petrochemical feedstocks will account for over half of all demand growth through 2030. EVs do not displace this demand — in several cases they increase it.'),

        h2('18.1 Fertilizers and Global Food Production — The Most Critical Dependency'),
        body('No category illustrates the hidden criticality of natural gas more starkly than fertilizers. The Haber-Bosch process — synthesising ammonia from atmospheric nitrogen and hydrogen derived from natural gas — is arguably the most consequential industrial invention of the 20th century. Without it, approximately 40-50% of global food production would be impossible. Earth\'s current population of 8 billion could not be fed.'),
        sp(),
        bullet('Natural gas accounts for ~80% of the production cost of ammonia. Ammonia (NH₃) is then converted to urea, ammonium nitrate, and other nitrogen fertilizers — the foundation of modern agriculture.'),
        bullet('~1.8% of all global natural gas consumption goes directly to fertilizer production. In energy terms, roughly 14 EJ per year — equivalent to Germany\'s total natural gas consumption.'),
        bullet('Russia is the world\'s largest single exporter of nitrogen fertilizers (urea and ammonium nitrate). The 2022 invasion of Ukraine and subsequent sanctions created a global fertilizer supply shock that drove wheat prices up ~50% within months. The cascade from gas prices to food prices is direct, fast, and severe.'),
        bullet('Europe\'s fertilizer industry nearly collapsed in 2022 when Russian gas was cut. CF Industries, Yara, and BASF\'s Ludwigshafen complex all curtailed ammonia production as gas prices hit €300/MWh. European farmers reduced nitrogen application; crop yields fell.'),
        bullet('Potash and phosphate: mined minerals (not petrochemical), but their transport, processing, and application are energy-intensive. Urea is often mixed with phosphate and potash in blended NPK fertilizers — energy price spikes affect the whole system.'),
        sp(),
        callout('Investment inference: a sustained $60+/MWh gas price environment would make European-produced nitrogen fertilizers uneconomical versus Middle Eastern or US producers. Gulf gas (at $0.75/MMBtu domestic prices) gives Saudi Arabia and Qatar a structural cost advantage in fertilizer production that could displace European capacity permanently.'),

        h2('18.2 Helium and the Semiconductor Supply Chain'),
        body('Helium is extracted as a byproduct of natural gas production — it accumulates underground over millions of years from the radioactive decay of uranium and thorium in surrounding rock. It is geologically rare, non-renewable, and cannot be synthesised economically. Once released into the atmosphere, it escapes Earth\'s gravity.'),
        sp(),
        makeTable(
          ['Country', 'Share of Global Helium Supply', 'Source Field', 'Key Risk'],
          [
            ['United States', '~40–50%', 'Hugoton gas field (KS/OK/TX); Federal Helium Reserve, Amarillo', 'Reserve depletion; BLM sale programme delayed multiple times due to supply security concerns'],
            ['Qatar', '~25–30%', 'North Field (same as LNG)', 'Dual exposure: Iran crisis directly threatens Qatari helium supply via Ras Laffan shutdown'],
            ['Algeria', '~8%', 'Arzew', 'Stable but limited'],
            ['Russia', '~6–7%', 'Amur Gas Processing Plant (East Siberia)', 'Sanctions risk; Amur fire in 2021 caused global shortage'],
            ['Australia', 'Emerging', 'Several projects; first production 2024–25', 'Still small; long ramp timeline'],
          ],
          [1600, 1800, 2500, 3100]
        ),
        sp(2),
        body('Semiconductor manufacturing uses helium at multiple critical steps:'),
        bullet('Epitaxial silicon deposition: ultra-pure helium (99.9999%+) used as carrier gas and thermal medium in CVD chambers. No substitute at required purity levels.'),
        bullet('Czochralski crystal growth: silicon ingot pulling requires helium atmosphere to control temperature gradients. One ingot = wafers for millions of chips.'),
        bullet('Leak detection: semiconductor fabs are hermetically sealed. Helium is the standard leak-detection gas because its small atomic size penetrates any breach. No substitute with equivalent sensitivity.'),
        bullet('Fiber optic cabling: helium used in drawing optical fiber (the backbone connecting chip fabs, data centres, and internet infrastructure).'),
        bullet('Cryogenics: MRI magnets (medical + industrial NMR for materials science) require liquid helium at –269°C. Superconducting quantum computers — the emerging frontier of computing — require uninterrupted helium supply.'),
        sp(),
        callout('The Qatar angle is under-appreciated: Qatar\'s Ras Laffan facility produces LNG, petrochemicals, AND helium from the same North Field gas. The drone strikes that halted LNG production in the Iran crisis (Section 10) simultaneously removed ~25-30% of global helium supply. A sustained Qatar outage would hit semiconductor fabs, MRI machine production, and quantum computing development simultaneously.'),

        h2('18.3 Plastics — The Invisible Infrastructure'),
        body('Plastic production is the largest single petrochemical use of oil and gas after fuels. ~14 million barrels per day of crude oil equivalent goes into plastics globally. The feedstocks — naphtha from crude oil refineries, ethane from natural gas liquids — are cracked into ethylene, propylene, and other building-block monomers.'),
        sp(),
        makeTable(
          ['Plastic', 'Feedstock', 'Primary Industrial Uses', 'Why It Cannot Be Replaced Easily'],
          [
            ['Polyethylene (PE)', 'Ethylene (from naphtha/ethane)', 'Food packaging, IV bags, pipes, cable insulation', 'Cheapest food-safe barrier material per kg. Bio-based PE exists but costs 3–5x more.'],
            ['Polypropylene (PP)', 'Propylene (from naphtha)', 'Medical devices, automotive parts, food containers, textiles', 'Highest chemical resistance/weight ratio of any commodity plastic. No bio-equivalent at scale.'],
            ['PVC', 'Ethylene + chlorine', 'Construction pipes, medical tubing, cable coatings, flooring', 'Pipes last 100+ years; critical infrastructure already installed globally.'],
            ['PET', 'Ethylene + p-xylene', 'Beverage bottles, food trays, polyester textiles', 'Bio-PET possible but currently ~20% of market. Rest dependent on petrochemical p-xylene.'],
            ['Polystyrene (PS)', 'Styrene (benzene + ethylene)', 'Food packaging, insulation, laboratory equipment', 'EPS insulation is difficult to replace in building energy efficiency.'],
          ],
          [1200, 1600, 2800, 3400]
        ),
        sp(2),
        body('The medical device sector is entirely dependent on plastics derived from petrochemicals. Disposable syringes, IV bags, catheters, blood bags, sterile packaging, and surgical instruments all require polyethylene, polypropylene, or PVC. The post-COVID supply chain analysis of medical PPE (nitrile gloves, polyethylene gowns, polypropylene masks) demonstrated how a petrochemical supply disruption translates directly into healthcare system vulnerability within weeks.'),

        h2('18.4 Pharmaceuticals'),
        body('The pharmaceutical industry is not typically thought of as an oil and gas dependent sector. It is. Virtually all modern synthetic active pharmaceutical ingredients (APIs) trace their molecular lineage to petrochemical building blocks — benzene, toluene, xylene (the BTX aromatics from naphtha), ethylene, propylene, and their derivatives.'),
        sp(),
        bullet('Aspirin (acetylsalicylic acid): benzene → phenol → salicylic acid → aspirin. Benzene is a direct refinery product.'),
        bullet('Paracetamol: phenol (from benzene) → p-aminophenol → paracetamol. ~80% of global phenol comes from cumene, produced from benzene and propylene.'),
        bullet('Antibiotics: many penicillin precursors and synthetic antibiotics use benzene-derived aromatic intermediates.'),
        bullet('Isopropanol (IPA): from propylene (refinery/cracker output). IPA is the universal medical disinfectant and solvent. During COVID-19, isopropanol shortages in 2020 created hand sanitiser supply crises within weeks of oil refinery output disruptions.'),
        bullet('Polyurethane (from propylene oxide): foam in medical mattresses, prosthetics, wound dressings, and insulation.'),
        sp(),
        body('The geographic concentration of API manufacturing in China (~60-70% of global API supply) and India (formulation) reflects those countries\' access to cheap petrochemical feedstocks. A sustained oil price shock that reprices naphtha and BTX aromatics in Asia would flow through to global drug manufacturing costs with a 12-24 month lag.'),

        h2('18.5 Synthetic Rubber, Tyres, and the EV Irony'),
        body('~60-65% of all rubber used globally is synthetic rubber — not natural latex. The primary synthetic rubbers (SBR, polybutadiene, nitrile rubber) are all derived from petrochemical monomers: butadiene (a C4 byproduct of naphtha cracking) and styrene (from benzene and ethylene). This creates a structural irony for the EV transition:'),
        bullet('Every EV tyre still requires synthetic rubber, carbon black, and synthetic textile reinforcement — all petrochemical.'),
        bullet('EVs are typically 15-25% heavier than equivalent ICE vehicles due to battery packs. Heavier vehicles generate more tyre wear.'),
        bullet('Higher torque in EV powertrains (instantaneous maximum torque) accelerates tyre wear, particularly in urban stop-start driving.'),
        bullet('EV tyre wear generates more microplastic particles per km than ICE vehicle tyres. The synthetic rubber debate is thus not eliminated by electrification — it may intensify.'),
        bullet('Carbon black — from the partial combustion of heavy oil fractions — constitutes ~28% of tyre weight by mass. There is no viable synthetic carbon black alternative at comparable price and performance.'),

        h2('18.6 Carbon Fibre, Bitumen, and Advanced Materials'),
        body('Several high-growth industries of the energy transition era are structurally dependent on oil and gas derivatives — creating the paradox that decarbonisation requires hydrocarbons to manufacture.'),
        bullet('Carbon fibre: made from polyacrylonitrile (PAN), a synthetic polymer produced from acrylonitrile (a petrochemical from propylene and ammonia). Carbon fibre is 70% of the structure of modern wind turbine blades by weight. Boeing 787 is 50% carbon fibre by weight. EV battery casings and structural parts increasingly use carbon fibre composites. Demand is growing 8-10% per year — directly correlated with the energy transition pace.'),
        bullet('Bitumen/asphalt: the residual fraction from crude oil refining. ~75% of roads globally are asphalt-surfaced. Road construction is a direct function of oil refinery throughput. As refineries are shut down in the energy transition, bitumen supply will tighten before road infrastructure demand falls.'),
        bullet('Lubricants and hydraulic fluids: base oil from crude refining. Wind turbines, EV gearboxes, and industrial machinery all require petroleum-derived lubricants. Synthetic lubricants (PAO base oils) are also petrochemical derivatives.'),
        bullet('Solvents: acetone, toluene, MEK, naphtha — used in electronics manufacturing (PCB cleaning), automotive painting, adhesives. No energy transition pathway reduces industrial solvent demand materially.'),

        h2('18.7 The Dependency Matrix — A Summary'),
        makeTable(
          ['Industry', 'Key Petrochemical Input', 'Consequence of Oil/Gas Supply Shock', 'EV/Transition Reduces Exposure?'],
          [
            ['Agriculture (fertilizers)', 'Natural gas → ammonia → nitrogen fertilizers', 'Direct food security risk. 40% of global food production dependent.', 'No. Gas-based ammonia has no scalable substitute.'],
            ['Semiconductors/Electronics', 'Helium (from gas fields); specialty gases', 'Chip fab shutdowns within weeks if He supply disrupted.', 'No. Demand increases with AI compute buildout.'],
            ['Medical devices/pharma', 'Ethylene → PE/PP; BTX aromatics → APIs', 'Healthcare supply chain crisis. PPE and drug shortages.', 'No. Demand grows with ageing populations.'],
            ['Tyres/Automotive', 'Butadiene, styrene → synthetic rubber; carbon black', 'Tyre price inflation; reduced vehicle production.', 'Partially. Demand shifts but not eliminated; EVs may worsen it.'],
            ['Construction', 'Bitumen (asphalt); PVC pipes; insulation foams', 'Road and building material shortages. Infrastructure backlog.', 'No. Road networks expand with EVs.'],
            ['Wind/Solar manufacturing', 'Carbon fibre (PAN precursor); ethylene/vinyl acetate (EVA solar encapsulant)', 'Renewable energy buildout would be slowed.', 'No. Transition increases this demand.'],
            ['Food packaging', 'PE, PP, PET films', 'Food waste increases without packaging. Cold chain failure.', 'No. Packaging demand structurally resilient.'],
            ['Aerospace', 'Jet fuel (operational); carbon fibre, titanium processing', 'Direct fuel dependency; materials cost increase.', 'Very partially. SAF is years from scale.'],
          ],
          [1800, 2300, 2700, 2200]
        ),
        sp(2),
        callout('Synthesis inference: the industries most critically dependent on oil and gas products — agriculture, healthcare, semiconductor manufacturing, construction — are the industries society is least willing to see disrupted. This creates a structural floor under oil and gas demand that is politically and economically much harder to remove than transport fuel demand. The energy transition\'s "demand destruction" thesis applies primarily to combustion; the non-combustion demand base is durable, growing, and inelastic.'),

        divider(),

        // ─── SECTION 19: SOURCES ─────────────────────────────────────────────
        h1('19. SOURCES'),
        body('Research inputs used in this synthesis:'),
        sp(),
        bullet('Perplexity Deep Research (Prompt A, March 2026): Macro deep-dive, 17 sections. Key sources: IEA, EIA, OPEC, Bloomberg Economics, NSTA, company filings.'),
        bullet('ChatGPT Deep Research (Prompt A, March 2026): Parallel run; outputs consistent with Perplexity. Used for cross-validation and table data.'),
        bullet('AlphaSense Primary Source Intelligence (Prompt B, March 2026): IOC earnings calls, 10-Ks, broker research (Freedom Broker, Edison Investment Research, Hannam & Partners, Commerzbank, Desjardins Economics, Kenanga Research, QNB Financial Services, Zedcrest Wealth, WIIW, and 20+ others). Most granular source for company-specific claims.'),
        bullet('Grok/X Sentiment Analysis (Prompt C, March 2026): Market narrative and sentiment. Credible voices: Eric Nuttall (@ericnuttall), Art Berman (@aeberman12), Tracy Shuchart (@chigrl), Lukas Ekwueme (@ekwufinance). Used for sentiment direction only.'),
        sp(),
        body('Synthesis date: 10 March 2026. Data points as of research run dates. The Iran conflict situation is evolving; verify current status before use in any external communication.', { italic: true, color: GREY }),

      ]
    }
  ]
});

// ─── OUTPUT ───────────────────────────────────────────────────────────────────
const outPath = '/sessions/vigilant-epic-ritchie/mnt/Claude Cowork/06 Themes/Oil and Gas/03 Synthesis/Oil and Gas - Synthesis v2.2.docx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('✓ Oil and Gas - Synthesis v2.0.docx written to 04 Deliverables');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
