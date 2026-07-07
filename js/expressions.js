// ==========================================================================
// js/expressions.js (Peak Edition State Framework)
// ==========================================================================

const ExpressionManager = {
    list: [
        { id: 1, text: "a = 2", color: "#64748b", visible: true },
        { id: 2, text: "a * sin(x)", color: "#2563eb", visible: true }
    ],
    colors: ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c"],
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
                <div class="color-dot" style="background: ${exp.color}; border: 2px solid ${exp.visible ? 'transparent' : '#94a3b8'}"></div>
                <input type="text" value="${exp.text}" data-id="${exp.id}" class="expression-input" placeholder="y = f(x) or a = 5" autocomplete="off" spellcheck="false">
                <span class="delete" title="Delete">✕</span>
            `;

            const input = row.querySelector(".expression-input");

            input.addEventListener("input", (e) => {
                exp.text = e.target.value;
                if (typeof GraphEngine !== "undefined") {
                    GraphEngine.needsRedraw = true;
                }
            });

            row.querySelector(".delete").onclick = () => {
                this.remove(exp.id);
            };

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
        const inputs = this.container.querySelectorAll(".expression-input");
        if (inputs.length > 0) inputs[inputs.length - 1].focus();
    },

    remove(id) {
        this.list = this.list.filter(e => e.id !== id);
        this.render();
        if (typeof GraphEngine !== "undefined") {
            GraphEngine.needsRedraw = true;
        }
    }
};
