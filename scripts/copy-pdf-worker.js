const fs = require('fs');
const path = require('path');

function copyPdfWorker() {
  console.log('Copying PDF.js worker file to public directory...');
    try {
    // Source paths (try both versions based on what might be installed)
    const possibleSourcePaths = [
      // For pdfjs-dist v5+ (check these paths first)
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.mjs'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.js'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs'),
      // Legacy paths
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.min.js'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.js'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'webpack', 'pdf.worker.min.js'),
      path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'webpack', 'pdf.worker.js'),
    ];
      // Destination directory and file
    const destDir = path.join(__dirname, '..', 'public', 'pdf-worker');
    // We'll decide the destination filename based on the source file
    let destFile;
    
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`Created directory: ${destDir}`);
    }
      // Try each possible source path
    let copied = false;
    for (const sourcePath of possibleSourcePaths) {
      if (fs.existsSync(sourcePath)) {
        // Extract the source filename and determine if it's an mjs file
        const sourceFileName = path.basename(sourcePath);
        const isMjs = sourcePath.endsWith('.mjs');
        
        // Set the destination filename appropriately
        if (isMjs) {
          destFile = path.join(destDir, 'pdf.worker.mjs');
        } else {
          destFile = path.join(destDir, 'pdf.worker.min.js');
        }
        
        fs.copyFileSync(sourcePath, destFile);
        console.log(`Successfully copied from ${sourcePath} to ${destFile}`);
        copied = true;
        break;
      }
    }    if (!copied) {
      console.warn('Could not find PDF worker file in node_modules. Creating a placeholder worker file...');
      
      // Create a basic worker file that will trigger the fallback to CDN
      const placeholderFile = path.join(destDir, 'pdf.worker.min.js');
      fs.writeFileSync(placeholderFile, '// Placeholder worker file - actual worker will be loaded from CDN');
      console.log(`Created placeholder worker file at: ${placeholderFile}`);
    }
  } catch (error) {
    console.error('Error copying PDF worker file:', error);
  }
}

// Run the function
copyPdfWorker();
