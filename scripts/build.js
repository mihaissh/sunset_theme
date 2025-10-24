const fs = require('fs');
const path = require('path');

// File and directory paths
const baseFile = path.join(__dirname, '..', '/themes/sunset.theme.css');
const buildFile = path.join(__dirname, '..', '/build/sunset.css');
const srcDir = path.join(__dirname, '..', '/src');

// Combine all CSS files from the source directory
function combineSourceFiles() {
    let combinedCSS = '';

    // Get all CSS files
    const allFiles = fs
        .readdirSync(srcDir)
        .filter((file) => file.endsWith('.css'))
        .map((file) => path.join(srcDir, file));

    // Split into main.css and other files
    const mainFile = allFiles.find((file) => path.basename(file) === 'main.css');
    const otherFiles = allFiles.filter((file) => path.basename(file) !== 'main.css');

    // Process main.css first if it exists
    if (mainFile) {
        const mainContent = fs.readFileSync(mainFile, 'utf8');
        combinedCSS += `/* ${path.basename(mainFile)} */\n${mainContent}\n`;
    }

    // Then process other files
    otherFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        combinedCSS += `/* ${path.basename(file)} */\n${content}\n`;
    });

    fs.writeFileSync(buildFile, combinedCSS);
    return combinedCSS;
}

// Process the base file and replace imports with actual content
function processBaseFile(compiledCSS) {
    const baseContent = fs.readFileSync(baseFile, 'utf8');
    const importRegex = /@import\s+url\(['"]?[^'"]+['"]?\);/g;

    const processedContent = baseContent.replace(importRegex, compiledCSS);
    fs.writeFileSync(buildFile, processedContent);
    console.log(`Built ${buildFile}`);
}

// Main function to process files
function processFiles() {
    try {
        const compiledCSS = combineSourceFiles();
        processBaseFile(compiledCSS);
        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Error processing files:', error);
        process.exit(1);
    }
}

processFiles();

