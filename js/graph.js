// ==========================
// js/graph.js (Peak Edition)
// ==========================
// Canvas drawing, grid, axes, zoom, pan, and High-DPI support

const GraphEngine = {
    canvas: null,
    ctx: null,
    scale: 50,
    offsetX: 0,
    offsetY: 0,
    
    // Interaction State
    dragging: false,
    lastX: 0,
    lastY: 0,
    
    // Performance State
    needsRedraw: true,

    init() {
        this.canvas = document.getElementById("graphCanvas");
        // alpha: false tells the browser the background is opaque, optimizing rendering speed
        this.ctx = this.canvas.getContext("2d", { alpha: false });

        this.resize();
        
        window.addEventListener("resize", () => this.resize());
        this.events();
        
        // Start the infinite 60fps render loop
        this.renderLoop();
    },

    // rAF Loop decoupled from user input
    renderLoop() {
        if (this.needsRedraw) {
            this.draw();
            this.needsRedraw = false;
        }
        requestAnimationFrame(() => this.renderLoop());
    },

    resize() {
        // High-DPI (Retina) Canvas scaling for razor-sharp lines
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement.getBoundingClientRect();

        // Set actual internal canvas resolution
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Set CSS display size
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        // Normalize coordinate system to use css pixels
        this.ctx.scale(dpr, dpr);
        
        this.needsRedraw = true;
    },

    draw() {
        let ctx = this.ctx;
        // Use CSS pixels for logic due to scaling in resize()
        let w = this.canvas.clientWidth;
        let h = this.canvas.clientHeight;

        // Clear and fill background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);

        let centerX = w / 2 + this.offsetX;
        let centerY = h / 2 + this.offsetY;

        this.drawGrid(centerX, centerY, w, h);

        // Draw expressions safely
        if (typeof ExpressionManager !== "undefined" && ExpressionManager.list) {
            ExpressionManager.list.forEach(eq => {
                if (!eq.visible || eq.text.trim() === "") return;
                this.drawFunction(eq, centerX, centerY, w);
            });
        }
        
        this.updateCoordinatesDisplay();
    },

    drawGrid(cx, cy, w, h) {
        let ctx = this.ctx;
        let step = this.scale;

        ctx.strokeStyle = "#e8e8e8";
        ctx.lineWidth = 1;

        // Vertical grid lines
        for (let x = cx % step; x < w; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }

        // Horizontal grid lines
        for (let y = cy % step; y < h; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Main Axes (X and Y)
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 2;

        // Y-Axis
        if (cx >= 0 && cx <= w) {
            ctx.beginPath();
            ctx.moveTo(cx, 0);
            ctx.lineTo(cx, h);
            ctx.stroke();
        }

        // X-Axis
        if (cy >= 0 && cy <= h) {
            ctx.beginPath();
            ctx.moveTo(0, cy);
            ctx.lineTo(w, cy);
            ctx.stroke();
        }
    },

    drawFunction(eq, cx, cy, w) {
        let ctx = this.ctx;
        ctx.strokeStyle = eq.color;
        ctx.lineWidth = 2.5; // Slightly thinner for elegance
        ctx.lineJoin = "round"; // Smoother corners on sharp curves

        ctx.beginPath();
        let first = true;

        // Optimization: Step by 2 pixels instead of 1 for complex graphs, 
        // or keep at 1 for maximum fidelity. 1 is fine for now.
        for (let px = 0; px < w; px++) {
            let x = (px - cx) / this.scale;
            let y = MathParser.functions.evaluate(eq.text, x);

            if (isNaN(y) || !isFinite(y)) {
                first = true; // Break the line (e.g., for asymptotes like tan(x) or 1/x)
                continue;
            }

            let py = cy - y * this.scale;

            if (first) {
                ctx.moveTo(px, py);
                first = false;
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
    },

    updateCoordinatesDisplay() {
        const coordDiv = document.getElementById("coordinates");
        if (!coordDiv) return;
        
        // Calculate the math coordinates of the center of the screen
        let mathX = -this.offsetX / this.scale;
        let mathY = this.offsetY / this.scale;
        
        // Format to 2 decimal places
        coordDiv.innerText = `Center: (${mathX.toFixed(2)}, ${mathY.toFixed(2)})`;
    },

    events() {
        this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            
            // Smoother zooming logic
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            this.scale *= zoomFactor;
            
            // Keep scaling within reasonable bounds to prevent NaN crashes
            this.scale = Math.max(5, Math.min(this.scale, 5000));
            
            this.needsRedraw = true;
        }, { passive: false });

        this.canvas.addEventListener("mousedown", (e) => {
            this.dragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            this.canvas.style.cursor = "grabbing"; // UX feedback
        });

        window.addEventListener("mouseup", () => {
            this.dragging = false;
            this.canvas.style.cursor = "default";
        });

        window.addEventListener("mousemove", (e) => {
            if (!this.dragging) return;
            
            this.offsetX += e.clientX - this.lastX;
            this.offsetY += e.clientY - this.lastY;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            this.needsRedraw = true;
        });
    }
};
