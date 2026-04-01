/**
 * create_input_docs_template.js
 *
 * Creates four blank research input documents for a new theme.
 * Usage: node create_input_docs_template.js "Theme Name"
 *
 * Output: Four .docx files saved to:
 *   06 Themes/[Theme Name]/02 Research Inputs/
 *     Perplexity_[Theme Name].docx
 *     ChatGPT_[Theme Name].docx
 *     AlphaSense_[Theme Name].docx
 *     Grok_[Theme Name].docx
 */

const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

const themeName = process.argv[2];
if (!themeName) {
  console.error('Usage: node create_input_docs_template.js "Theme Name"');
  process.exit(1);
}

const baseDir = path.join(__dirname, '..', '06 Themes', themeName, '02 Research Inputs');

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
  console.log(`Created folder: 06 Themes/${themeName}/02 Research Inputs`);
}

const sources = [
  { filename: `Perplexity_${themeName}.docx`, label: 'Perplexity Deep Research', prompt: 'Prompt A Output' },
  { filename: `ChatGPT_${themeName}.docx`,    label: 'ChatGPT Deep Research',    prompt: 'Prompt A Output' },
  { filename: `AlphaSense_${themeName}.docx`, label: 'AlphaSense',               prompt: 'Prompt B Output' },
  { filename: `Grok_${themeName}.docx`,       label: 'Grok / X',                 prompt: 'Prompt C Output' },
];

function createDoc(source) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const title = `${themeName} — ${source.label}`;

  return new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 24 } } },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text: title, bold: true, size: 40, color: '831011', font: 'Arial' })],
          spacing: { after: 120 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `${source.prompt}   |   ${today}`, size: 22, color: '666666', font: 'Arial' })],
          spacing: { after: 320 }
        }),
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '831011', space: 1 } },
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `Paste the full ${source.label} output below this line.`, italics: true, color: '888888', size: 20, font: 'Arial' })],
          spacing: { after: 800 }
        }),
        new Paragraph({ children: [new TextRun('')] }),
        new Paragraph({ children: [new TextRun('')] }),
        new Paragraph({ children: [new TextRun('')] }),
      ]
    }]
  });
}

async function main() {
  for (const source of sources) {
    const doc = createDoc(source);
    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(baseDir, source.filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`✓ Created: ${source.filename}`);
  }
  console.log(`\nAll four documents saved to: 06 Themes/${themeName}/02 Research Inputs/`);
}

main().catch(console.error);
