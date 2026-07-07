// ==========================================================================
// js/parser.js (Peak Edition Constant Engine)
// ==========================================================================

const MathParser = {
    compileCache: new Map(),
    constantsScope: {}, // Shared system scope memory structure for variables

    functions: {
        /**
         * Rebuilds parameter scopes across assigned formulas (e.g. "a = 2")
         */
        rebuildConstantsScope() {
            MathParser.constantsScope = {
                pi: Math.PI,
                e: Math.E,
                ln: math.log // Alias implementation support standard
            };

            if (typeof ExpressionManager === "undefined") return;

            ExpressionManager.list.forEach(eq => {
                if (!eq.visible || !eq.text.includes("=")) return;
                
                try {
                    const parts = eq.text.split("=");
                    const varName = parts[0].trim();
                    const varExpr = parts[1].trim();

                    // Ensure syntax meets explicit alphanumeric rules
                    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName) && varExpr !== "") {
                        const compiled = math.compile(varExpr);
                        const value = compiled.evaluate(MathParser.constantsScope);
                        if (typeof value === "number") {
                            MathParser.constantsScope[varName] = value;
                        }
                    }
                } catch(e) {
                    // Mute parsing runtime assignment syntax errors gracefully
                }
            });
        },

        /**
         * Resolves function evaluation at runtime using local compiled caches
         */
        evaluate(expression, xValue) {
            if (!expression || expression.includes("=")) return NaN;

            try {
                let compiledCode = MathParser.compileCache.get(expression);
                if (!compiledCode) {
                    compiledCode = math.compile(expression);
                    MathParser.compileCache.set(expression, compiledCode);
                }

                // Inherit current variables framework maps inside runtime instance
                const executionScope = Object.create(MathParser.constantsScope);
                executionScope.x = xValue;

                const result = compiledCode.evaluate(executionScope);
                return typeof result === 'number' ? result : NaN;
            } catch (error) {
                return NaN;
            }
        },

        clearCache() {
            MathParser.compileCache.clear();
        }
    }
};
