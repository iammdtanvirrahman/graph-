const Keypad = {


    keys:[

        [
            {t:"x",v:"x"},
            {t:"y",v:"y"},
            {t:"a²",v:"^2"},
            {t:"aᵇ",v:"^"},
            {t:"√",v:"sqrt("},
            {t:"π",v:"pi"},
            {t:"e",v:"e"},
            {t:"(",v:"("},
            {t:")",v:")"},
            {t:"⌫",v:"back"}
        ],


        [
            {t:"sin",v:"sin("},
            {t:"cos",v:"cos("},
            {t:"tan",v:"tan("},
            {t:"log",v:"log("},
            {t:"ln",v:"ln("},
            {t:"|x|",v:"abs("},
            {t:"÷",v:"/"},
            {t:"×",v:"*"},
            {t:"−",v:"-"},
            {t:"+",v:"+"}
        ],


        [
            {t:"7",v:"7"},
            {t:"8",v:"8"},
            {t:"9",v:"9"},
            {t:"4",v:"4"},
            {t:"5",v:"5"},
            {t:"6",v:"6"},
            {t:"1",v:"1"},
            {t:"2",v:"2"},
            {t:"3",v:"3"},
            {t:"0",v:"0"}
        ],


        [
            {t:"←",v:"left"},
            {t:"→",v:"right"},
            {t:",",v:","},
            {t:".",v:"."},
            {t:"=",v:"="},
            {t:"<",v:"<"},
            {t:">",v:">"},
            {t:"≤",v:"<="},
            {t:"≥",v:">="},
            {t:"↵",v:"enter"}
        ]

    ],




    activeInput:null,



    init(){


        let keypad =
        document.getElementById("keypad");


        keypad.innerHTML="";


        this.keys.forEach(row=>{


            let rowDiv=
            document.createElement("div");


            rowDiv.className="key-row";



            row.forEach(key=>{


                let btn=
                document.createElement("button");


                btn.className="key";


                btn.innerText=key.t;



                if(
                    key.t=="⌫" ||
                    key.t=="↵"
                ){

                    btn.classList.add("special");

                }



                btn.onclick=()=>{

                    this.press(key.v);

                };


                rowDiv.appendChild(btn);



            });



            keypad.appendChild(rowDiv);


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




    press(value){


        if(!this.activeInput)
        return;



        let input=this.activeInput;



        if(value=="back"){


            let pos=input.selectionStart;


            input.value=
            input.value.substring(0,pos-1)
            +
            input.value.substring(pos);


            input.selectionStart=
            input.selectionEnd=pos-1;


        }


        else{


            let pos=input.selectionStart;


            input.value=
            input.value.substring(0,pos)
            +
            value
            +
            input.value.substring(pos);



            input.selectionStart=
            input.selectionEnd=
            pos+value.length;


        }



        input.dispatchEvent(
            new Event("input")
        );


        input.focus();



    }


};