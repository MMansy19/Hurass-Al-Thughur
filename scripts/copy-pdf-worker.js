const fs = require('fs');
const path = require('path');

function copyPdfWorker() {
  console.log('Copying PDF.js worker file to public directory...');
  
  try {
    // Source paths (try both versions based on what might be installed)
    const possibleSourcePaths = [
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.js'),
    ];
    
    // Destination directory and file
    const destDir = path.join(__dirname, '..', 'public', 'pdf-worker');
    const destFile = path.join(destDir, 'pdf.worker.min.js');
    
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
        console.log(`Successfully copied from ${sourcePath} to ${destFile}`);
        copied = true;
        break;
      }
    }
    
    if (!copied) {
      console.error('Could not find PDF worker file in node_modules. Make sure pdfjs-dist is installed.');
    }
  } catch (error) {
    console.error('Error copying PDF worker file:', error);
  }
}

// Run the function
copyPdfWorker();
