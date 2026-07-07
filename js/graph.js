// ==========================================================================
// js/graph.js (Peak Edition Canvas Processing Unit)
// ==========================================================================

const GraphEngine = {
    canvas: null,
    ctx: null,
    scale: 50,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    needsRedraw: true, // Non-blocking state pipeline control flag

    init() {
        this.canvas = document.getElementById("graphCanvas");
        this.ctx = this.canvas.getContext("2d", { alpha: false });

        this.resize();
        window.addEventListener("resize", () => this.resize());
        this.events();
        
        // Fire rendering loops asynchronously
        this.renderLoop();
    },

    renderLoop() {
        if (this.needsRedraw) {
            this.draw();
            this.needsRedraw = false;
        }
        requestAnimationFrame(() => this.renderLoop());
    },

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement.getBoundingClientRect();

        // Enforce high display pixel density optimizations
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        this.ctx.scale(dpr, dpr);
        this.needsRedraw = true;
    },

    draw() {
        let ctx = this.ctx;
        let w = this.canvas.clientWidth;
        let h = this.canvas.clientHeight;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);

        let centerX = w / 2 + this.offsetX;
        let centerY = h / 2 + this.offsetY;

        this.drawGrid(centerX, centerY, w, h);

        // Compute variable state parameters within parser allocations
        if (typeof MathParser !== "undefined" && MathParser.functions.rebuildConstantsScope) {
            MathParser.functions.rebuildConstantsScope();
        }

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

        ctx.strokeStyle = "#f1f5f9";
        ctx.lineWidth = 1;

        for (let x = cx % step; x < w; x += step) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = cy % step; y < h; y += step) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;

        if (cx >= 0 && cx <= w) {
            ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
        }
        if (cy >= 0 && cy <= h) {
            ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
        }
    },

    drawFunction(eq, cx, cy, w) {
        let ctx = this.ctx;
        ctx.strokeStyle = eq.color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";

        ctx.beginPath();
        let first = true;

        for (let px = 0; px < w; px++) {
            let x = (px - cx) / this.scale;
            let y = MathParser.functions.evaluate(eq.text, x);

            if (isNaN(y) || !isFinite(y)) {
                first = true; 
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
        let mathX = -this.offsetX / this.scale;
        let mathY = this.offsetY / this.scale;
        coordDiv.innerText = `Center: (${mathX.toFixed(2)}, ${mathY.toFixed(2)})`;
    },

    events() {
        this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
            this.scale = Math.max(5, Math.min(this.scale, 5000));
            this.needsRedraw = true;
        }, { passive: false });

        this.canvas.addEventListener("mousedown", (e) => {
            this.dragging = true;
            this.lastX = e.clientX; this.lastY = e.clientY;
        });

        window.addEventListener("mouseup", () => this.dragging = false);
        window.addEventListener("mousemove", (e) => {
            if (!this.dragging) return;
            this.offsetX += e.clientX - this.lastX;
            this.offsetY += e.clientY - this.lastY;
            this.lastX = e.clientX; this.lastY = e.clientY;
            this.needsRedraw = true;
        });
    }
};
