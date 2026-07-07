// Math Parser Engine
// Handles evaluation of graph expressions


const MathParser = {


    functions: {


        evaluate(expression, xValue){


            try{


                let exp = expression
                    .replace(/\^/g, "**")
                    .replace(/π/g, "pi")
                    .replace(/\bpi\b/g, "PI")
                    .replace(/\be\b/g, "E");



                let scope = {

                    x:xValue,

                    pi:Math.PI,

                    PI:Math.PI,

                    E:Math.E,


                    sin:Math.sin,
                    cos:Math.cos,
                    tan:Math.tan,


                    asin:Math.asin,
                    acos:Math.acos,
                    atan:Math.atan,


                    sqrt:Math.sqrt,

                    abs:Math.abs,

                    log:Math.log10,

                    ln:Math.log,


                    floor:Math.floor,

                    ceil:Math.ceil,


                    exp:Math.exp

                };



                return math.evaluate(exp,scope);



            }

            catch(error){

                return NaN;

            }


        }



    }



};