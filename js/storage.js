// Local Storage Manager
// Saves and loads calculator expressions


const StorageManager = {


    key:"graphing_calculator_data",



    save(){


        let data =
        JSON.stringify(
            ExpressionManager.list
        );


        localStorage.setItem(
            this.key,
            data
        );


        alert("Graph saved!");

    },





    load(){


        let data =
        localStorage.getItem(
            this.key
        );



        if(!data)
        return;



        try{


            ExpressionManager.list =
            JSON.parse(data);



            ExpressionManager.render();


            GraphEngine.draw();



        }

        catch(error){


            console.log(
                "Unable to load data"
            );


        }


    },





    clear(){


        localStorage.removeItem(
            this.key
        );


    }



};