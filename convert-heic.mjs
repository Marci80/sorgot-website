import heicConvert from 'heic-convert';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname, basename } from 'path';

const srcDir  = 'C:/Users/marci/Desktop/סורגות/home page pics';
const destDir = 'C:/Users/marci/Desktop/sorgot-website/public/images/home';

const heicFiles = readdirSync(srcDir).filter(f => extname(f).toUpperCase() === '.HEIC');

// Find current highest home-XX number
const existing = readdirSync(destDir);
const nums = existing.map(f => parseInt(f.match(/home-(\d+)/)?.[1] ?? '0')).filter(Boolean);
let counter = Math.max(...nums) + 1;

for (const file of heicFiles) {
  const input = readFileSync(join(srcDir, file));
  try {
    const output = await heicConvert({ buffer: input, format: 'JPEG', quality: 0.85 });
    const outName = `home-${String(counter).padStart(2, '0')}.jpg`;
    writeFileSync(join(destDir, outName), Buffer.from(output));
    console.log(`✓ ${file} → ${outName}`);
    counter++;
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log(`\nDone. ${counter - (Math.max(...nums) + 1)} files converted.`);
