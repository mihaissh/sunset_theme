const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate gzip size estimate (rough approximation)
 * @param {string} content - File content
 * @returns {number} Estimated gzip size
 */
function estimateGzipSize(content) {
    // Rough estimate: CSS typically compresses to 15-25% of original size
    return Math.round(Buffer.byteLength(content, 'utf8') * 0.20);
}

/**
 * Process CSS with PostCSS (autoprefixer and optional minification)
 * @param {string} css - CSS content
 * @param {boolean} minify - Whether to minify the CSS
 * @returns {Promise<string>} Processed CSS
 */
async function processCSS(css, minify = false) {
    const plugins = [autoprefixer];
    
    if (minify) {
        plugins.push(
            cssnano({
                preset: ['default', {
                    discardComments: { removeAll: true },
                    normalizeWhitespace: true,
                    colormin: true,
                    minifyFontValues: true,
                    minifyGradients: true,
                    minifyParams: true,
                    minifySelectors: true,
                    reduceIdents: false,
                    mergeLonghand: true,
                    mergeRules: true,
                    cssDeclarationSorter: { order: 'smacss' },
                    calc: { precision: 5 },
                    uniqueSelectors: true,
                }]
            })
        );
    }

    const result = await postcss(plugins).process(css, { from: undefined });
    return result.css;
}

/**
 * Combine all CSS files from source directory
 * @param {string} srcDir - Source directory path
 * @returns {string} Combined CSS content
 */
function combineSourceFiles(srcDir) {
    let combinedCSS = '';

    const allFiles = fs
        .readdirSync(srcDir)
        .filter((file) => file.endsWith('.css'))
        .map((file) => path.join(srcDir, file));

    // Process main.css first if it exists
    const mainFile = allFiles.find((file) => path.basename(file) === 'main.css');
    const otherFiles = allFiles.filter((file) => path.basename(file) !== 'main.css');

    if (mainFile) {
        const mainContent = fs.readFileSync(mainFile, 'utf8');
        combinedCSS += `/* ${path.basename(mainFile)} */\n${mainContent}\n`;
    }

    // Then process other files
    otherFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        combinedCSS += `/* ${path.basename(file)} */\n${content}\n`;
    });

    return combinedCSS;
}

/**
 * Create a simple file hash for cache busting
 * @param {string} content - File content
 * @returns {string} Hash string
 */
function createHash(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
}

/**
 * Check if file needs rebuilding based on cache
 * @param {string} cacheFile - Path to cache file
 * @param {string} content - Current content
 * @returns {boolean} True if rebuild is needed
 */
function needsRebuild(cacheFile, content) {
    if (!fs.existsSync(cacheFile)) {
        return true;
    }
    
    try {
        const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        const currentHash = createHash(content);
        return cache.hash !== currentHash;
    } catch (error) {
        return true;
    }
}

/**
 * Save cache information
 * @param {string} cacheFile - Path to cache file
 * @param {string} content - Content to cache
 */
function saveCache(cacheFile, content) {
    const cache = {
        hash: createHash(content),
        timestamp: Date.now()
    };
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

/**
 * Analyze CSS file and provide statistics
 * @param {string} css - CSS content
 * @returns {Object} Analysis results
 */
function analyzeCSS(css) {
    const rules = css.match(/[^{}]+{[^}]*}/g) || [];
    const selectors = css.match(/[^{]+{/g) || [];
    const properties = css.match(/[a-z-]+:/gi) || [];
    const colors = css.match(/#[0-9a-f]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\)|oklch\([^)]+\)/gi) || [];
    
    return {
        totalRules: rules.length,
        totalSelectors: selectors.length,
        totalProperties: properties.length,
        totalColors: colors.length,
        avgPropertiesPerRule: Math.round(properties.length / rules.length * 10) / 10
    };
}

/**
 * Print build statistics
 * @param {string} originalCSS - Original CSS content
 * @param {string} processedCSS - Processed CSS content
 * @param {number} buildTime - Build time in ms
 * @param {boolean} showAnalysis - Whether to show detailed analysis
 */
function printStats(originalCSS, processedCSS, buildTime, showAnalysis = false) {
    const originalSize = Buffer.byteLength(originalCSS, 'utf8');
    const processedSize = Buffer.byteLength(processedCSS, 'utf8');
    const reduction = Math.round((1 - processedSize / originalSize) * 100);
    const estimatedGzip = estimateGzipSize(processedCSS);

    console.log('\n📊 Build Statistics:');
    console.log(`   Original size:  ${formatSize(originalSize)}`);
    console.log(`   Processed size: ${formatSize(processedSize)} (${reduction}% reduction)`);
    console.log(`   Gzip estimate:  ${formatSize(estimatedGzip)} (~${Math.round(estimatedGzip / processedSize * 100)}% of processed)`);
    console.log(`   Build time:     ${buildTime}ms`);

    if (showAnalysis) {
        const analysis = analyzeCSS(processedCSS);
        console.log('\n🔍 CSS Analysis:');
        console.log(`   Total rules:              ${analysis.totalRules}`);
        console.log(`   Total selectors:          ${analysis.totalSelectors}`);
        console.log(`   Total properties:         ${analysis.totalProperties}`);
        console.log(`   Total colors:             ${analysis.totalColors}`);
        console.log(`   Avg properties per rule:  ${analysis.avgPropertiesPerRule}`);
    }
    console.log('');
}

/**
 * Debounce function for file watching
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

module.exports = {
    formatSize,
    estimateGzipSize,
    processCSS,
    combineSourceFiles,
    createHash,
    needsRebuild,
    saveCache,
    analyzeCSS,
    printStats,
    debounce
};

