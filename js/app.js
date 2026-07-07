// ==========================
// js/app.js (Peak Edition)
// ==========================
// Main Orchestrator - Boots up application lifecycle subsystems and flags window interactions

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize core system layers sequentially
    if (typeof GraphEngine !== "undefined") {
        GraphEngine.init();
    }
    
    if (typeof ExpressionManager !== "undefined") {
        ExpressionManager.init();
    }
    
    if (typeof Keypad !== "undefined") {
        Keypad.init();
    }

    // 2. Event Binding: Add Expression Button
    const addExpBtn = document.getElementById("addExpression");
    if (addExpBtn && typeof ExpressionManager !== "undefined") {
        addExpBtn.onclick = (e) => {
            e.preventDefault();
            ExpressionManager.add();
        };
    }

    // 3. Event Binding: Save Functionality
    const saveBtn = document.getElementById("saveBtn");
    if (saveBtn && typeof StorageManager !== "undefined") {
        saveBtn.onclick = (e) => {
            e.preventDefault();
            StorageManager.save();
        };
    }

    // 4. Automatic Workspace Recovery
    if (typeof StorageManager !== "undefined") {
        StorageManager.load();
    }

    // 5. Interface Navigation: Zoom In Interaction
    const zoomInBtn = document.getElementById("zoomIn");
    if (zoomInBtn && typeof GraphEngine !== "undefined") {
        zoomInBtn.onclick = () => {
            GraphEngine.scale *= 1.2;
            // Prevent excessive macro zoom artifacts
            GraphEngine.scale = Math.min(GraphEngine.scale, 5000);
            GraphEngine.needsRedraw = true;
        };
    }

    // 6. Interface Navigation: Zoom Out Interaction
    const zoomOutBtn = document.getElementById("zoomOut");
    if (zoomOutBtn && typeof GraphEngine !== "undefined") {
        zoomOutBtn.onclick = () => {
            GraphEngine.scale *= 0.8;
            // Prevent excessive micro zoom loss of precision
            GraphEngine.scale = Math.max(GraphEngine.scale, 5);
            GraphEngine.needsRedraw = true;
        };
    }

    // 7. Interface Navigation: Coordinate Recenter View
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
