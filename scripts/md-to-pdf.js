import { chromium } from 'playwright';
import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Usage: node scripts/md-to-pdf.js <input.md>');
  process.exit(1);
}

const inputPath = path.resolve(inputFile);
const outputPath = inputPath.replace(/\.md$/, '.pdf');
const markdown = fs.readFileSync(inputPath, 'utf-8');
const body = marked(markdown);

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      color: #24292e;
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 48px;
    }
    h1 { font-size: 2em; border-bottom: 2px solid #e1e4e8; padding-bottom: 8px; margin-bottom: 16px; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #e1e4e8; padding-bottom: 6px; margin-top: 32px; margin-bottom: 12px; }
    h3 { font-size: 1.15em; margin-top: 24px; margin-bottom: 8px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 12px; }
    th { background: #f6f8fa; font-weight: 600; text-align: left; }
    th, td { border: 1px solid #d0d7de; padding: 6px 12px; }
    tr:nth-child(even) { background: #f6f8fa; }
    code { background: #f6f8fa; padding: 2px 5px; border-radius: 3px; font-family: 'Consolas', monospace; font-size: 11.5px; }
    pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 14px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #d0d7de; margin: 0; padding: 0 16px; color: #57606a; }
    hr { border: none; border-top: 1px solid #e1e4e8; margin: 24px 0; }
    a { color: #0969da; text-decoration: none; }
    ul, ol { padding-left: 24px; }
    li { margin: 4px 0; }
    p { margin: 8px 0; }
  </style>
</head>
<body>
${body}
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({
  path: outputPath,
  format: 'A4',
  margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  printBackground: true,
});
await browser.close();

console.log(`PDF saved to: ${outputPath}`);
