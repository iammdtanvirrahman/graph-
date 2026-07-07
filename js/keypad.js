// ==========================================================================
// js/keypad.js (Peak Edition Tabbed Control Interface)
// ==========================================================================

const Keypad = {
    activeTab: "main",
    activeInput: null,

    tabs: {
        main: [
            [{t:"x",v:"x"}, {t:"y",v:"y"}, {t:"a²",v:"^2"}, {t:"aᵇ",v:"^"}, {t:"√",v:"sqrt("}, {t:"⌫",v:"back",s:"danger"}],
            [{t:"7",v:"7"}, {t:"8",v:"8"}, {t:"9",v:"9"}, {t:"÷",v:"/"}, {t:"(",v:"("}, {t:")",v:")"}],
            [{t:"4",v:"4"}, {t:"5",v:"5"}, {t:"6",v:"6"}, {t:"×",v:"*"}, {t:"π",v:"pi"}, {t:"e",v:"e"}],
            [{t:"1",v:"1"}, {t:"2",v:"2"}, {t:"3",v:"3"}, {t:"−",v:"-"}, {t:"←",v:"left"}, {t:"→",v:"right"}],
            [{t:"0",v:"0"}, {t:".",v:"."}, {t:",",v:","}, {t:"+",v:"+"}, {t:"=",v:"="}, {t:"C",v:"clear",s:"special"}]
        ],
        funcs: [
            [{t:"sin",v:"sin("}, {t:"cos",v:"cos("}, {t:"tan",v:"tan("}, {t:"csc",v:"csc("}, {t:"sec",v:"sec("}, {t:"cot",v:"cot("}],
            [{t:"asin",v:"asin("}, {t:"acos",v:"acos("}, {t:"atan",v:"atan("}, {t:"sinh",v:"sinh("}, {t:"cosh",v:"cosh("}, {t:"tanh",v:"tanh("}],
            [{t:"log",v:"log("}, {t:"ln",v:"ln("}, {t:"abs",v:"abs("}, {t:"exp",v:"exp("}, {t:"floor",v:"floor("}, {t:"ceil",v:"ceil("}],
            [{t:"<",v:"<"}, {t:">",v:">"}, {t:"≤",v:"<="}, {t:"≥",v:">="}, {t:"≠",v:"!="}, {t:"⌫",v:"back",s:"danger"}]
        ],
        abc: [
            [{t:"a",v:"a"}, {t:"b",v:"b"}, {t:"c",v:"c"}, {t:"d",v:"d"}, {t:"e",v:"e"}, {t:"f",v:"f"}, {t:"g",v:"g"}],
            [{t:"h",v:"h"}, {t:"i",v:"i"}, {t:"j",v:"j"}, {t:"k",v:"k"}, {t:"l",v:"l"}, {t:"m",v:"m"}, {t:"n",v:"n"}],
            [{t:"o",v:"o"}, {t:"p",v:"p"}, {t:"q",v:"q"}, {t:"r",v:"r"}, {t:"s",v:"s"}, {t:"t",v:"t"}, {t:"u",v:"u"}],
            [{t:"v",v:"v"}, {t:"w",v:"w"}, {t:"x",v:"x"}, {t:"y",v:"y"}, {t:"z",v:"z"}, {t:"_",v:"_"}, {t:"⌫",v:"back",s:"danger"}]
        ]
    },

    init() {
        this.bindTabs();
        this.render();

        document.addEventListener("focusin", (e) => {
            if (e.target.classList.contains("expression-input")) {
                this.activeInput = e.target;
            }
        });
    },

    bindTabs() {
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.activeTab = btn.getAttribute("data-tab");
                this.render();
            };
        });
    },

    render() {
        const container = document.getElementById("keypad");
        if (!container) return;
        container.innerHTML = "";

        const currentRows = this.tabs[this.activeTab];
        const totalCols = this.activeTab === "abc" ? 7 : 6;

        currentRows.forEach(row => {
            const rowDiv = document.createElement("div");
            rowDiv.className = `key-row cols-${totalCols}`;

            row.forEach(key => {
                const btn = document.createElement("button");
                btn.className = "key";
                btn.innerText = key.t;
                if (key.s) btn.classList.add(key.s);

                btn.onclick = (e) => {
                    e.preventDefault();
                    this.press(key.v);
                };
                rowDiv.appendChild(btn);
            });
            container.appendChild(rowDiv);
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
            input.value = ""; pos = 0;
        } else if (value === "left") {
            input.selectionStart = input.selectionEnd = Math.max(0, pos - 1);
        } else if (value === "right") {
            input.selectionStart = input.selectionEnd = Math.min(input.value.length, pos + 1);
        } else {
            input.value = input.value.substring(0, pos) + value + input.value.substring(pos);
            input.selectionStart = input.selectionEnd = pos + value.length;
        }

        input.dispatchEvent(new Event("input"));
        input.focus();
    }
};
