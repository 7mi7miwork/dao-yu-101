const fs = require('fs');
const path = require('path');

// Simple build script to copy src to docs
function build() {
  const srcDir = path.join(__dirname, 'src');
  const docsDir = path.join(__dirname, 'docs');
  
  // Remove existing docs directory
  if (fs.existsSync(docsDir)) {
    fs.rmSync(docsDir, { recursive: true, force: true });
  }
  
  // Copy src to docs
  copyRecursive(srcDir, docsDir);
  
  // Copy public files
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    copyRecursive(publicDir, docsDir);
  }
  
  // Create .nojekyll file
  fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
  
  console.log('Build completed! Files copied to docs/');
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

build();
