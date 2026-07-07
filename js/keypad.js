// Virtual Math Keypad
// Inserts symbols into active expression input


const Keypad = {


    buttons:[

        "7","8","9","/",
        "4","5","6","*",
        "1","2","3","-",
        "0",".","=","+",

        "sin(",
        "cos(",
        "tan(",

        "sqrt(",
        "^",
        "pi"

    ],



    activeInput:null,



    init(){


        let box =
        document.getElementById("keypad");


        this.buttons.forEach(symbol=>{


            let btn =
            document.createElement("button");


            btn.className="key";


            btn.innerText=symbol;



            btn.onclick=()=>{


                this.insert(symbol);


            };



            box.appendChild(btn);



        });



        document.addEventListener(
            "focusin",
            e=>{


                if(
                    e.target.classList
                    .contains("expression-input")
                ){

                    this.activeInput=e.target;

                }


            }
        );


    },





    insert(value){


        if(!this.activeInput)
        return;



        let input=this.activeInput;



        let start=input.selectionStart;

        let end=input.selectionEnd;



        let text=input.value;



        input.value=
        text.substring(0,start)
        +
        value
        +
        text.substring(end);



        input.focus();



        input.selectionStart=
        input.selectionEnd=
        start+value.length;



        input.dispatchEvent(
            new Event("input")
        );



    }



};