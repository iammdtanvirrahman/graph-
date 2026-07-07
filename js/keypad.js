// ==========================
// js/keypad.js (Peak Edition)
// ==========================
// Virtual keyboard interaction engine with automatic cursor alignment tracking

const Keypad = {
    keys: [
        [
            { t: "x", v: "x" },
            { t: "y", v: "y" },
            { t: "a²", v: "^2" },
            { t: "aᵇ", v: "^" },
            { t: "√", v: "sqrt(" },
            { t: "π", v: "pi" },
            { t: "e", v: "e" },
            { t: "(", v: "(" },
            { t: ")", v: ")" },
            { t: "⌫", v: "back" }
        ],
        [
            { t: "sin", v: "sin(" },
            { t: "cos", v: "cos(" },
            { t: "tan", v: "tan(" },
            { t: "log", v: "log(" },
            { t: "ln", v: "ln(" },
            { t: "|x|", v: "abs(" },
            { t: "÷", v: "/" },
            { t: "×", v: "*" },
            { t: "−", v: "-" },
            { t: "+" }, { t: "+", v: "+" }
        ],
        [
            { t: "7", v: "7" },
            { t: "8", v: "8" },
            { t: "9", v: "9" },
            { t: "4", v: "4" },
            { t: "5", v: "5" },
            { t: "6", v: "6" },
            { t: "1", v: "1" },
            { t: "2", v: "2" },
            { t: "3", v: "3" },
            { t: "0", v: "0" }
        ],
        [
            { t: "←", v: "left" },
            { t: "→", v: "right" },
            { t: ".", v: "." },
            { t: ",", v: "," },
            { t: "C", v: "clear" }
        ]
    ],

    activeInput: null,

    init() {
        const keypad = document.getElementById("keypad");
        if (!keypad) return;

        keypad.innerHTML = ""; // Clear baseline content structures safely

        this.keys.forEach((row) => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "key-row";

            row.forEach((key) => {
                if (!key.t) return; // Skip broken key assignments safely
                
                const btn = document.createElement("button");
                btn.className = "key";
                btn.innerText = key.t;

                // Visually flag structural special utility commands
                if (["⌫", "C", "←", "→"].includes(key.t)) {
                    btn.classList.add("special");
                }

                btn.onclick = (e) => {
                    e.preventDefault(); // Stop click hijacking contexts
                    this.press(key.v || key.t);
                };

                rowDiv.appendChild(btn);
            });

            keypad.appendChild(rowDiv);
        });

        // Global tracker updates the active focused math field automatically
        document.addEventListener("focusin", (e) => {
            if (e.target.classList.contains("expression-input")) {
                this.activeInput = e.target;
            }
        });
    },

    press(value) {
        if (!this.activeInput) return;

        const input = this.activeInput;
        let pos = input.selectionStart;

        if (value === "back") {
            if (pos > 0) {
                input.value = input.value.substring(0, pos - 1) + input.value.substring(pos);
                input.selectionStart = input.selectionEnd = pos - 1;
            }
        } else if (value === "clear") {
            input.value = "";
            pos = 0;
        } else if (value === "left") {
            const newPos = Math.max(0, pos - 1);
            input.selectionStart = input.selectionEnd = newPos;
        } else if (value === "right") {
            const newPos = Math.min(input.value.length, pos + 1);
            input.selectionStart = input.selectionEnd = newPos;
        } else {
            // Standard dynamic character interpolation sequence
            input.value = input.value.substring(0, pos) + value + input.value.substring(pos);
            input.selectionStart = input.selectionEnd = pos + value.length;
        }

        // Notify input listeners to update math objects seamlessly
        input.dispatchEvent(new Event("input"));
        input.focus();
    }
};
