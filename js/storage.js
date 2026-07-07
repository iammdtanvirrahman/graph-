// ==========================
// js/storage.js (Peak Edition)
// ==========================
// Secure local preservation manager linked into the frame refresh cycle

const StorageManager = {
    key: "graphing_calculator_data",

    save() {
        if (typeof ExpressionManager === "undefined") return;

        try {
            const data = JSON.stringify(ExpressionManager.list);
            localStorage.setItem(this.key, data);
            
            // Console confirmations are cleaner than annoying pop-up alert modals
            console.log("Graph calculations saved successfully.");
        } catch (error) {
            console.error("Storage persistence error:", error);
        }
    },

    load() {
        if (typeof ExpressionManager === "undefined") return;

        const data = localStorage.getItem(this.key);
        if (!data) return;

        try {
            ExpressionManager.list = JSON.parse(data);
            ExpressionManager.render();

            // Notify the graph loop to update smoothly
            if (typeof GraphEngine !== "undefined") {
                GraphEngine.needsRedraw = true;
            }
        } catch (error) {
            console.warn("Unable to safely load structured cache configurations:", error);
        }
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};
