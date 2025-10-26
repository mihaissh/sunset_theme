const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const {
    processCSS,
    combineSourceFiles,
    debounce
} = require('./utils');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// File and directory paths
const baseFile = path.join(__dirname, '..', '/themes/sunset.theme.css');
const buildFile = path.join(__dirname, '..', '/build/sunset.css');
const srcDir = path.join(__dirname, '..', '/src');
const outputPaths = process.env.DEV_OUTPUT_PATH ? process.env.DEV_OUTPUT_PATH.split(',') : [];

// Ensure output paths are set
if (outputPaths.length === 0) {
    console.error('❌ DEV_OUTPUT_PATH is not set in .env file');
    console.log('\n💡 Create a .env file with:');
    console.log('   DEV_OUTPUT_PATH=/path/to/your/BetterDiscord/themes/sunset.css');
    process.exit(1);
}

// Track ongoing builds to prevent race conditions
let isBuilding = false;
let buildQueue = false;

/**
 * Process the base file and replace imports with compiled CSS
 * @param {string} compiledCSS - Compiled and processed CSS
 */
function processBaseFile(compiledCSS) {
    const baseContent = fs.readFileSync(baseFile, 'utf8');
    const importRegex = /@import\s+url\(['"]?[^'"]+['"]?\);/g;

    const processedContent = baseContent.replace(importRegex, compiledCSS);

    // Write to build directory
    fs.writeFileSync(buildFile, processedContent);

    // Write to dev output paths
    outputPaths.forEach((outputPath) => {
        try {
            fs.writeFileSync(outputPath.trim(), processedContent);
            console.log(`✅ Updated ${outputPath.trim()}`);
        } catch (error) {
            console.error(`❌ Failed to write to ${outputPath.trim()}:`, error.message);
        }
    });
}

/**
 * Main processing function
 */
async function processFiles() {
    // If already building, queue another build
    if (isBuilding) {
        buildQueue = true;
        return;
    }

    isBuilding = true;
    const startTime = Date.now();

    try {
        // Combine source files
        const combinedCSS = combineSourceFiles(srcDir);
        
        // Process CSS with PostCSS (autoprefixer only in dev mode)
        const processedCSS = await processCSS(combinedCSS, false);
        
        // Write processed content
        processBaseFile(processedCSS);
        
        const buildTime = Date.now() - startTime;
        console.log(`⚡ Build completed in ${buildTime}ms`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
    } finally {
        isBuilding = false;
        
        // Process queued build if any
        if (buildQueue) {
            buildQueue = false;
            setTimeout(processFiles, 0);
        }
    }
}

// Debounced version of processFiles (300ms delay)
// This prevents multiple rapid rebuilds when saving multiple files
const debouncedProcess = debounce(processFiles, 300);

// Initial build
console.log('🚀 Starting development mode...');
console.log(`📂 Watching: ${srcDir}`);
console.log(`📝 Base file: ${baseFile}`);
console.log('📤 Output paths:');
outputPaths.forEach((p) => console.log(`   - ${p.trim()}`));
console.log('\n👀 Watching for changes...\n');

processFiles();

// Set up file watcher
const watcher = chokidar.watch([baseFile, `${srcDir}/**/*.css`], {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50
    }
});

// Watch for changes
watcher
    .on('change', (filePath) => {
        console.log(`📝 File changed: ${path.basename(filePath)}`);
        debouncedProcess();
    })
    .on('add', (filePath) => {
        console.log(`➕ New file added: ${path.basename(filePath)}`);
        debouncedProcess();
    })
    .on('unlink', (filePath) => {
        console.log(`🗑️  File deleted: ${path.basename(filePath)}`);
        debouncedProcess();
    })
    .on('error', (error) => {
        console.error(`❌ Watcher error: ${error.message}`);
    });

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down dev server...');
    watcher.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down dev server...');
    watcher.close();
    process.exit(0);
});
