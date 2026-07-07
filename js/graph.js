// Graph Rendering Engine
// Canvas drawing, grid, axes, zoom and pan


const GraphEngine = {


    canvas:null,
    ctx:null,


    scale:50,

    offsetX:0,
    offsetY:0,


    dragging:false,

    lastX:0,
    lastY:0,



    init(){


        this.canvas =
        document.getElementById("graphCanvas");


        this.ctx =
        this.canvas.getContext("2d");



        this.resize();



        window.addEventListener(
            "resize",
            ()=>this.resize()
        );



        this.events();



        this.draw();


    },




    resize(){


        this.canvas.width =
        this.canvas.clientWidth;


        this.canvas.height =
        this.canvas.clientHeight;


        this.draw();


    },





    draw(){


        let ctx=this.ctx;

        let w=this.canvas.width;

        let h=this.canvas.height;



        ctx.clearRect(0,0,w,h);



        ctx.fillStyle="#ffffff";

        ctx.fillRect(0,0,w,h);



        let centerX=
        w/2 + this.offsetX;


        let centerY=
        h/2 + this.offsetY;



        this.drawGrid(centerX,centerY);



        ExpressionManager.list.forEach(eq=>{


            if(!eq.visible)
            return;


            if(eq.text.trim()=="")
            return;



            this.drawFunction(
                eq,
                centerX,
                centerY
            );


        });



    },





    drawGrid(cx,cy){


        let ctx=this.ctx;

        let w=this.canvas.width;

        let h=this.canvas.height;



        ctx.strokeStyle="#e8e8e8";

        ctx.lineWidth=1;



        let step=this.scale;



        for(
            let x=cx%step;
            x<w;
            x+=step
        ){

            ctx.beginPath();

            ctx.moveTo(x,0);

            ctx.lineTo(x,h);

            ctx.stroke();

        }



        for(
            let y=cy%step;
            y<h;
            y+=step
        ){

            ctx.beginPath();

            ctx.moveTo(0,y);

            ctx.lineTo(w,y);

            ctx.stroke();

        }




        // axis

        ctx.strokeStyle="#333";

        ctx.lineWidth=2;



        ctx.beginPath();

        ctx.moveTo(cx,0);

        ctx.lineTo(cx,h);

        ctx.stroke();



        ctx.beginPath();

        ctx.moveTo(0,cy);

        ctx.lineTo(w,cy);

        ctx.stroke();



    },





    drawFunction(eq,cx,cy){



        let ctx=this.ctx;



        ctx.strokeStyle=eq.color;

        ctx.lineWidth=3;



        ctx.beginPath();



        let first=true;



        for(
            let px=0;
            px<this.canvas.width;
            px++
        ){



            let x=
            (px-cx)/this.scale;



            let y=
            MathParser.functions.evaluate(
                eq.text,
                x
            );



            if(
                isNaN(y) ||
                !isFinite(y)
            ){

                first=true;

                continue;

            }



            let py=
            cy-y*this.scale;



            if(first){

                ctx.moveTo(px,py);

                first=false;

            }

            else{

                ctx.lineTo(px,py);

            }


        }



        ctx.stroke();


    },





    events(){


        this.canvas.addEventListener(
            "wheel",
            e=>{


                e.preventDefault();


                this.scale *=
                e.deltaY<0 ? 1.1:0.9;


                this.draw();


            },
            {passive:false}
        );




        this.canvas.addEventListener(
            "mousedown",
            e=>{


                this.dragging=true;

                this.lastX=e.clientX;

                this.lastY=e.clientY;


            }
        );



        window.addEventListener(
            "mouseup",
            ()=>{

                this.dragging=false;

            }
        );



        window.addEventListener(
            "mousemove",
            e=>{


                if(!this.dragging)
                return;



                this.offsetX +=
                e.clientX-this.lastX;


                this.offsetY +=
                e.clientY-this.lastY;



                this.lastX=e.clientX;

                this.lastY=e.clientY;



                this.draw();


            }
        );


    }



};