// Main Application Controller
// Connects all modules together


document.addEventListener(
    "DOMContentLoaded",
    ()=>{


        // Start graph engine

        GraphEngine.init();



        // Start expression system

        ExpressionManager.init();



        // Start keypad

        Keypad.init();





        // Add expression button

        document
        .getElementById("addExpression")
        .onclick=()=>{


            ExpressionManager.add();


        };





        // Save button

        document
        .getElementById("saveBtn")
        .onclick=()=>{


            StorageManager.save();


        };





        // Load saved graph automatically

        StorageManager.load();





        // Zoom buttons


        document
        .getElementById("zoomIn")
        .onclick=()=>{


            GraphEngine.scale*=1.2;

            GraphEngine.draw();


        };




        document
        .getElementById("zoomOut")
        .onclick=()=>{


            GraphEngine.scale*=0.8;

            GraphEngine.draw();


        };





        // Reset view


        document
        .getElementById("reset")
        .onclick=()=>{


            GraphEngine.scale=50;

            GraphEngine.offsetX=0;

            GraphEngine.offsetY=0;


            GraphEngine.draw();


        };



    }
);