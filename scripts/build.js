const fs = require('fs');
const path = require('path');
const {
    processCSS,
    combineSourceFiles,
    needsRebuild,
    saveCache,
    printStats
} = require('./utils');

// File and directory paths
const baseFile = path.join(__dirname, '..', '/themes/sunset.theme.css');
const buildFile = path.join(__dirname, '..', '/build/sunset.css');
const srcDir = path.join(__dirname, '..', '/src');
const cacheFile = path.join(__dirname, '..', '/build/.cache.json');

// Check if this is a production build or analysis mode
const isProduction = process.env.NODE_ENV === 'production';
const shouldAnalyze = process.argv.includes('--analyze');
const shouldMinify = isProduction || process.argv.includes('--minify');

// Ensure build directory exists
const buildDir = path.dirname(buildFile);
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

/**
 * Process the base file and replace imports with compiled CSS
 * @param {string} compiledCSS - Compiled and processed CSS
 */
function processBaseFile(compiledCSS) {
    const baseContent = fs.readFileSync(baseFile, 'utf8');
    const importRegex = /@import\s+url\(['"]?[^'"]+['"]?\);/g;

    const processedContent = baseContent.replace(importRegex, compiledCSS);
    fs.writeFileSync(buildFile, processedContent);
}

/**
 * Main build function
 */
async function build() {
    const startTime = Date.now();
    
    try {
        console.log('🚀 Starting build process...');
        console.log(`   Mode: ${shouldMinify ? '⚡ Production (minified)' : '🛠️  Development'}`);
        
        // Combine source files
        console.log('📦 Combining source files...');
        const combinedCSS = combineSourceFiles(srcDir);
        
        // Check if rebuild is needed (in dev mode only)
        if (!shouldMinify && !shouldAnalyze && !needsRebuild(cacheFile, combinedCSS)) {
            console.log('✅ No changes detected, skipping build (cache hit)');
            return;
        }
        
        // Process CSS with PostCSS (autoprefixer + optional minification)
        console.log(shouldMinify ? '🔧 Processing CSS (autoprefixer + minification)...' : '🔧 Processing CSS (autoprefixer)...');
        const processedCSS = await processCSS(combinedCSS, shouldMinify);
        
        // Write processed content
        console.log('💾 Writing output file...');
        processBaseFile(processedCSS);
        
        // Save cache
        if (!shouldMinify) {
            saveCache(cacheFile, combinedCSS);
        }
        
        // Calculate build time
        const buildTime = Date.now() - startTime;
        
        // Print statistics
        printStats(combinedCSS, processedCSS, buildTime, shouldAnalyze);
        
        console.log(`✅ Build completed successfully: ${buildFile}`);
        
        // Additional tips for production
        if (shouldMinify) {
            console.log('\n💡 Optimization tips:');
            console.log('   - CSS has been minified for production');
            console.log('   - Consider enabling gzip compression on your server');
            console.log('   - Use browser caching with appropriate cache headers');
        }
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        if (error.stack) {
            console.error('\nStack trace:', error.stack);
        }
        process.exit(1);
    }
}

// Run build
build();
