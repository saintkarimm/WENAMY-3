const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'images', 'icons', 'Amenities');
const outputDir = path.join(__dirname, 'images', 'icons', 'Amenities');

const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.png'));

async function convert() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputName = file.replace(/\.png$/i, '.webp');
    const outputPath = path.join(outputDir, outputName);
    
    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      console.log(`Converted: ${file} -> ${outputName}`);
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err.message);
    }
  }
  console.log('\nDone! Converted', files.length, 'files.');
}

convert();
