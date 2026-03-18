import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

async function processLogo() {
  try {
    const inputPath = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\9472f10c-b23d-4993-af18-f5f940d8d21f\\media__1773470631141.png';
    const outputPath = 'c:\\Users\\Asus\\OneDrive\\Desktop\\Digital_Certificate_System\\server\\public\\logo_clean.png';

    const image = await loadImage(inputPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw original image
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // The checkerboard pattern is usually light gray/white squares. 
    // Typically around hex #e5e5e5 and #ffffff or similar. We want to make them fully transparent, or pure white.
    // Since the PDF background is white, let's make anything close to white or gray (with low saturation) pure white.
    // Actually, making it transparent is safer so it blends anywhere.
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // If the pixel is very light (gray or white checkerboard)
      // Check if it's grayscale-ish and bright
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const diff = max - min;
      
      // If it's bright and has low color saturation (like white or light gray)
      if (r > 200 && g > 200 && b > 200 && diff < 20) {
        data[i + 3] = 0; // Make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    out.on('finish', () => console.log('Logo cleaned and saved to public/logo_clean.png'));

  } catch (error) {
    console.error(error);
  }
}

processLogo();

processLogo();
