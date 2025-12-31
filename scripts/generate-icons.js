// Script to generate PNG icons from SVG
// Requires: npm install sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [120, 152, 167, 180, 192, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Read SVG
const svgBuffer = fs.readFileSync(inputSvg);

async function generateIcons() {
  console.log('Generating icon files...');
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Created ${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to create ${size}x${size}.png:`, error.message);
    }
  }
  
  console.log('Done!');
}

generateIcons().catch(console.error);

