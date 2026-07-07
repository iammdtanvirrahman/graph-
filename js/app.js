// ==========================================================================
// js/app.js (Main System Orchestrator Control Panel Entry Point)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Sequentially initiate modular layout frameworks
    if (typeof GraphEngine !== "undefined") GraphEngine.init();
    if (typeof ExpressionManager !== "undefined") ExpressionManager.init();
    if (typeof Keypad !== "undefined") Keypad.init();

    const addExpBtn = document.getElementById("addExpression");
    if (addExpBtn && typeof ExpressionManager !== "undefined") {
        addExpBtn.onclick = (e) => {
            e.preventDefault();
            ExpressionManager.add();
        };
    }

    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn && typeof StorageManager !== "undefined") {
        saveBtn.onclick = (e) => {
            e.preventDefault();
            StorageManager.save();
        };
    }

    // Auto-recover workspace definitions from stored local states
    if (typeof StorageManager !== "undefined") StorageManager.load();

    // Trigger non-blocking visual frame refreshes on button actions
    const zoomInBtn = document.getElementById("zoomIn");
    if (zoomInBtn && typeof GraphEngine !== "undefined") {
        zoomInBtn.onclick = () => {
            GraphEngine.scale *= 1.2;
            GraphEngine.scale = Math.min(GraphEngine.scale, 5000);
            GraphEngine.needsRedraw = true;
        };
    }

    const zoomOutBtn = document.getElementById("zoomOut");
    if (zoomOutBtn && typeof GraphEngine !== "undefined") {
        zoomOutBtn.onclick = () => {
            GraphEngine.scale *= 0.8;
            GraphEngine.scale = Math.max(GraphEngine.scale, 5);
            GraphEngine.needsRedraw = true;
        };
    }

    const resetBtn = document.getElementById("reset");
    if (resetBtn && typeof GraphEngine !== "undefined") {
        resetBtn.onclick = () => {
            GraphEngine.scale = 50;
            GraphEngine.offsetX = 0;
            GraphEngine.offsetY = 0;
            GraphEngine.needsRedraw = true;
        };
    }
});
