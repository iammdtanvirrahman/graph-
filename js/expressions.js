// ==========================
// js/expressions.js (Peak Edition)
// ==========================
// Manages system equation records, color palette tracks, and synchronized layout binding

const ExpressionManager = {
    list: [
        { id: 1, text: "sin(x)", color: "#1976d2", visible: true },
        { id: 2, text: "x^2", color: "#e53935", visible: true }
    ],

    colors: [
        "#1976d2", // Tech Blue
        "#e53935", // Crimson Red
        "#43a047", // Vivid Green
        "#8e24aa", // Rich Purple
        "#fb8c00"  // Amber Orange
    ],

    container: null,

    init() {
        this.container = document.getElementById("expressions");
        this.render();
    },

    render() {
        this.container.innerHTML = "";

        this.list.forEach((exp) => {
            const row = document.createElement("div");
            row.className = "expression";
            if (!exp.visible) row.style.opacity = "0.5";

            row.innerHTML = `
                <div class="color-dot" style="background: ${exp.color}; border: 2px solid ${exp.visible ? 'transparent' : '#888'}"></div>
                <input type="text" value="${exp.text}" data-id="${exp.id}" class="expression-input" placeholder="y = f(x)" autocomplete="off" spellcheck="false">
                <span class="delete" title="Delete expression">✕</span>
            `;

            const input = row.querySelector(".expression-input");

            // Input listener optimized for the state-driven frame loop
            input.addEventListener("input", (e) => {
                exp.text = e.target.value;
                
                // Trigger non-blocking visual refresh signal
                if (typeof GraphEngine !== "undefined") {
                    GraphEngine.needsRedraw = true;
                }
            });

            // Clean element removal layout
            row.querySelector(".delete").onclick = () => {
                this.remove(exp.id);
            };

            // Expression hide/show visibility toggling
            row.querySelector(".color-dot").onclick = () => {
                exp.visible = !exp.visible;
                row.style.opacity = exp.visible ? "1" : "0.5";
                
                if (typeof GraphEngine !== "undefined") {
                    GraphEngine.needsRedraw = true;
                }
            };

            this.container.appendChild(row);
        });
    },

    add() {
        const id = Date.now();
        this.list.push({
            id: id,
            text: "",
            color: this.colors[this.list.length % this.colors.length],
            visible: true
        });

        this.render();
        
        // Premium UX: Instantly focus the typing cursor inside the new input line
        const inputs = this.container.querySelectorAll(".expression-input");
        if (inputs.length > 0) {
            inputs[inputs.length - 1].focus();
        }
    },

    remove(id) {
        this.list = this.list.filter(e => e.id !== id);
        this.render();
        
        if (typeof GraphEngine !== "undefined") {
            GraphEngine.needsRedraw = true;
        }
    }
};
