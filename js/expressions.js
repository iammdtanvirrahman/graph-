// Expression Manager
// Handles equations, colors, visibility and UI


const ExpressionManager = {


    list: [

        {
            id:1,
            text:"sin(x)",
            color:"#1976d2",
            visible:true
        },

        {
            id:2,
            text:"x^2",
            color:"#e53935",
            visible:true
        }

    ],



    colors:[

        "#1976d2",
        "#e53935",
        "#43a047",
        "#8e24aa",
        "#fb8c00"

    ],



    container:null,



    init(){


        this.container=document.getElementById("expressions");

        this.render();


    },




    render(){


        this.container.innerHTML="";



        this.list.forEach((exp,index)=>{


            let row=document.createElement("div");

            row.className="expression";



            row.innerHTML=`

                <div 
                class="color-dot"
                style="background:${exp.color}">
                </div>


                <input 
                value="${exp.text}"
                data-id="${exp.id}"
                class="expression-input">


                <span class="delete">
                ✕
                </span>

            `;



            let input=row.querySelector("input");


            input.addEventListener("input",(e)=>{

                exp.text=e.target.value;

                GraphEngine.draw();

            });



            row.querySelector(".delete")
            .onclick=()=>{


                this.remove(exp.id);


            };



            row.querySelector(".color-dot")
            .onclick=()=>{


                exp.visible=!exp.visible;

                row.style.opacity=
                exp.visible ? "1":"0.4";


                GraphEngine.draw();


            };



            this.container.appendChild(row);



        });


    },




    add(){


        let id=Date.now();



        this.list.push({

            id:id,

            text:"",

            color:this.colors[
                this.list.length % this.colors.length
            ],

            visible:true


        });



        this.render();


    },





    remove(id){


        this.list=
        this.list.filter(
            e=>e.id!==id
        );


        this.render();

        GraphEngine.draw();


    }



};