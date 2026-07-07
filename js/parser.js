// ==========================
// js/parser.js (Peak Edition)
// ==========================
// Math Parser Engine with AST compilation caching for high-speed canvas evaluation

const MathParser = {
    // High-performance cache map for compiled math.js expressions
    compileCache: new Map(),

    functions: {
        /**
         * Safely evaluates an expression for a given x value.
         * Leverages pre-compilation caching so lookups skip parsing overhead.
         */
        evaluate(expression, xValue) {
            if (!expression || expression.trim() === "") return NaN;

            try {
                // Normalize mathematical characters for math.js engine compatibility
                let sanitized = expression.replace(/π/g, "pi");

                // Look up or generate compiled executable machine nodes
                let compiledCode = MathParser.compileCache.get(sanitized);
                if (!compiledCode) {
                    compiledCode = math.compile(sanitized);
                    MathParser.compileCache.set(sanitized, compiledCode);
                }

                // Create clean, minimal local scope mapping for execution
                const scope = {
                    x: xValue,
                    ln: math.log // Alias standard math.js natural log to 'ln' for user preference
                };

                const result = compiledCode.evaluate(scope);
                
                // Enforce proper primitive floating-point returns
                return typeof result === 'number' ? result : NaN;
            } catch (error) {
                // Gracefully suppress formatting structural errors to protect the rendering sequence
                return NaN;
            }
        },

        /**
         * Clears memory cache structures when needed
         */
        clearCache() {
            MathParser.compileCache.clear();
        }
    }
};
