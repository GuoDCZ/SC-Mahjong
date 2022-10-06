import Draw from "./draw.js"
import Table from "./table.js"
import Brain from "./brain.js"
import getScore from "./judge.js";

const documentWidth = document.documentElement.clientWidth;
const documentHeight = document.documentElement.clientHeight;

const canvas = document.getElementById("myCanvas");
canvas.height = 720;
canvas.width = 840;
const ctx = canvas.getContext("2d");

const draw = new Draw(ctx);

const table = new Table();


    // table.initDeal();

    // table.roundDeal();
    // draw.drawTable(table);

    // table.hands[0] = [1,1,1,2,2,2,3,3,3,7,8,9,18,19];

    var brain = new Brain(table);
    
    // console.log(brain);

    
    // console.log(result);


function loop(i = 0) {
    setTimeout(()=>{
        if (i < 16) {
            table.initDealEach(i % 4, i >= 12);
            draw.drawTable(table);
        }
        else if (i == 16) {
            for (let i = 0; i < 4; ++i) {
                table.sortHand(i);
            }
            draw.drawTable(table);
        }
        else if (i <= (16 + 56 * 2)) {
            // console.log(i);
            if (i % 2 == 1) {
                table.roundDeal();
                draw.drawTable(table);
                var score = getScore(table.hands[table.count % 4]);
                if (score > 0) {
                    draw.drawWin(table, score, true);
                    i = 1000;
                }
            }
            else {
                var result = brain.bestDiscard(table.hands[table.count % 4]);
                table.roundDiscard(result);
                draw.drawTable(table);
            }
        }
        else return;
        loop(++i);
    },100)
}
loop();

// console.log(table);
// console.log(draw);

// loop();

// function loop() {
//     setTimeout(()=>{


//     loop();

//     } ,500);
// }



// const handArray = [1,1,1,2,2,2,3,3,3,8,9,18,19];

// import getScore from "./judge.js";

// var ss = getScore(handArray);

// console.log(ss);
// console.log(win);



