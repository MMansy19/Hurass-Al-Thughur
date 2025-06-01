const fs = require('fs');
const path = require('path');

// Paths
const srcPath = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const destDir = path.join(__dirname, '..', 'public', 'pdf-worker');
const destPath = path.join(destDir, 'pdf.worker.min.mjs');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('✅ Created pdf-worker directory');
}

// Copy the worker file
try {
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log('✅ PDF.js worker copied successfully');
  } else {
    console.warn('⚠️ PDF.js worker file not found, trying alternative path...');
    
    // Try alternative path for different versions
    const altSrcPath = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.js');
    const altDestPath = path.join(destDir, 'pdf.worker.js');
    
    if (fs.existsSync(altSrcPath)) {
      fs.copyFileSync(altSrcPath, altDestPath);
      console.log('✅ PDF.js worker (js) copied successfully');
    } else {
      console.error('❌ PDF.js worker file not found in expected locations');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('❌ Error copying PDF.js worker:', error.message);
  process.exit(1);
}
