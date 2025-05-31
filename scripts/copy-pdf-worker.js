const fs = require('fs');
const path = require('path');

function copyPdfWorker() {
  console.log('Copying PDF.js worker file to public directory...');
  
  try {    // Source paths to try (check multiple possible locations)
    const possibleSourcePaths = [
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.mjs'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.mjs'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs'),
    ];
      // Destination directory and file
    const destDir = path.join(__dirname, '..', 'public', 'pdf-worker');
    const destFile = path.join(destDir, 'pdf.worker.min.mjs');
    
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`Created directory: ${destDir}`);
    }
    
    // Try each possible source path
    let copied = false;
    for (const sourcePath of possibleSourcePaths) {
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destFile);
        console.log(`Successfully copied worker from: ${sourcePath}`);
        console.log(`Worker file available at: ${destFile}`);
        copied = true;
        break;
      }
    }
    
    if (!copied) {
      console.error('Error: Could not find PDF worker file in any expected location');
      console.log('Searched paths:');
      possibleSourcePaths.forEach(p => console.log(`  - ${p}`));
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error copying PDF worker file:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  copyPdfWorker();
}

module.exports = copyPdfWorker;
