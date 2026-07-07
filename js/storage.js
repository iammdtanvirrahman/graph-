// ==========================================================================
// js/storage.js (Peak Edition Workspace Persistence Module)
// ==========================================================================

const StorageManager = {
    key: "graphing_calculator_data_peak",

    save() {
        if (typeof ExpressionManager === "undefined") return;
        try {
            const data = JSON.stringify(ExpressionManager.list);
            localStorage.setItem(this.key, data);
            console.log("Calculations saved to internal browser storage state.");
        } catch (error) {
            console.error("Storage persistence load fault error:", error);
        }
    },

    load() {
        if (typeof ExpressionManager === "undefined") return;
        const data = localStorage.getItem(this.key);
        if (!data) return;

        try {
            ExpressionManager.list = JSON.parse(data);
            ExpressionManager.render();
            if (typeof GraphEngine !== "undefined") {
                GraphEngine.needsRedraw = true;
            }
        } catch (error) {
            console.warn("Unable to securely decode loaded data strings:", error);
        }
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};
