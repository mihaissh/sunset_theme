module.exports = {
    plugins: [
        require('autoprefixer'),
        ...(process.env.NODE_ENV === 'production' ? [
            require('cssnano')({
                preset: ['default', {
                    // Optimization settings for performance
                    discardComments: { removeAll: true },
                    normalizeWhitespace: true,
                    colormin: true,
                    minifyFontValues: true,
                    minifyGradients: true,
                    minifyParams: true,
                    minifySelectors: true,
                    reduceIdents: false, // Keep custom properties intact
                    mergeLonghand: true,
                    mergeRules: true,
                    cssDeclarationSorter: { order: 'smacss' },
                    // Safely reduce calc() expressions
                    calc: { precision: 5 },
                    // Remove duplicate rules
                    uniqueSelectors: true,
                }]
            })
        ] : [])
    ]
};

