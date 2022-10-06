const CANVAS_WIDTH = 840;
const CANVAS_HEIGHT = 720;

const tileBigWidth = 51;
const tileBigHeight = 63;
const tileMidWidth = 37;
const tileMidHeight = 47;
const tileSmallWidth = 30;
const tileSmallHeight = 38;

const handWallInterval = 50;
const handMyDrawInterval = 26;
const handOppDrawInterval = 22;

export default class Draw {
    constructor(ctx) {
        this.ctx = ctx;
        this.img_big = new Image();
        this.img_big.src = "imgs/tile_big.png";
        this.img_small = new Image();
        this.img_small.src = "imgs/tile_small.png";
    }
    drawTable(table) {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.ctx.strokeStyle = "#fff";
        this.roundRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20, 40);
        this.ctx.stroke();
        this.ctx.save();
        this.ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 8);
        this.placeWall(table);
        this.placeHand(table);
        this.placeDiscard(table);
        this.ctx.restore();
    }
    drawWin(table, score, selfDraw) {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.ctx.strokeStyle = "#fff";
        this.roundRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20, 40);
        this.ctx.stroke();
        this.ctx.save();
        this.ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 8);
        this.showHand(table.hands[table.count % 4], score, selfDraw)
        this.ctx.restore();
    }
    roundRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.closePath();
    }
    paintTile(tile, x, y, rot90 = 0, big = false, conceal = false) {
        let x_ = x, y_ = y;
        let w = ((big) ? ((conceal) ? tileMidWidth : tileBigWidth) : tileSmallWidth);
        let h = ((big) ? ((conceal) ? tileMidHeight : tileBigHeight) : tileSmallHeight);
        let img = (big) ? this.img_big : this.img_small;
        for (let i = 0; i < rot90 % 4; ++i) {this.ctx.rotate(- Math.PI * 0.5); let temp = x_; x_ = -y_; y_ = temp;}
        if (conceal) this.ctx.drawImage(img, 0, 3*((big) ? tileBigHeight : tileSmallHeight), w, h, x_, y_, w, h);
        else this.ctx.drawImage(img, w*(tile%10-1), h*(parseInt(tile/10)), w, h, x_, y_, w, h);
        for (let i = rot90 % 4; i < 4; ++i) this.ctx.rotate(- Math.PI * 0.5);
    }
    placeWall(table) {
        for (let index = 0; index < table.wall.length; ++index) {
            let relaIndex = (index + table.start) % 54;
            let x, y;
            let rotation = 0;
            if (relaIndex < 26) {
                x = tileSmallWidth * (parseInt(relaIndex / 2) - 6.5);
                y = tileSmallWidth * 7 + tileSmallHeight * (relaIndex % 2 - 2);  
            }
            else {
                relaIndex -= 26;
                rotation++;
                x = tileSmallWidth * 6.5 + tileSmallHeight * (relaIndex % 2);
                y = tileSmallWidth * (7 - parseInt(relaIndex / 2));  
            }
            if (index + table.start >= 54) {
                x = -x;
                y = -y;
                rotation += 2;
            }
            this.paintTile(31, x, y, rotation, false, true);
        }
    }
    placeDiscard(table) {
        for (let player = 0; player < 4; ++player) {
            for (let index = 0; index < table.discards[player].length; ++index) {
                let x, y;
                if (player % 2 == 0) {
                    x = tileSmallWidth * (index % 7 - 3.5);
                    y = tileSmallWidth * 2.5 + tileSmallHeight * (parseInt(index / 7) - 1);
                }
                else {
                    x = tileSmallWidth * 3.5 + tileSmallHeight * parseInt(index / 7);
                    y = tileSmallWidth * (3.5 - index % 7);  
                }
                if (player >= 2) {
                    x = -x;
                    y = -y;
                }
                this.paintTile(table.discards[player][index], x, y, player, false, false);
            }
        }
    }
    placeHand(table) {
        for (let player = 0; player < 4; ++player) {
            for (let index = 0; index < table.hands[player].length; ++index) {
                let handLength;
                if (player == 0) {
                    handLength = tileBigWidth * 14 + handMyDrawInterval;
                }
                else {
                    handLength = tileMidWidth * 14 + handOppDrawInterval;
                }
                let x, y;
                switch (player) {
                    case 0: {
                        x = - handLength / 2 + tileBigWidth * index + ((index == 13) ? handMyDrawInterval : 0);
                        y = tileSmallWidth * 7 + handWallInterval;
                        break;
                    }
                    case 1: {
                        x = tileSmallWidth * 6.5 + tileSmallHeight * 2 + handWallInterval;
                        y = tileSmallWidth * 7 + handOppDrawInterval - tileMidWidth * index - ((index == 13) ? handOppDrawInterval : 0);
                        break;
                    }
                    case 2: {
                        x = handLength / 2 - tileMidWidth * index - ((index == 13) ? handOppDrawInterval : 0);
                        y = - tileSmallWidth * 7 - handWallInterval;
                        break;
                    }
                    case 3: {
                        x = - tileSmallWidth * 6.5 - tileSmallHeight * 2 - handWallInterval;
                        y = tileSmallWidth * 7 + tileMidWidth * (index - 14) + ((index == 13) ? handOppDrawInterval : 0);
                        break;
                    }
                }
                this.paintTile(table.hands[player][index], x, y, player, true, !(player == 0));
            }
        }
    }
    showHand(hand, score, selfDraw) {
        for (let index = 0; index < hand.length; ++index) {
            let handLength = tileBigWidth * 14 + handMyDrawInterval;
            let x = - handLength / 2 + tileBigWidth * index + ((index == 13) ? handMyDrawInterval : 0);
            let y = - tileSmallWidth * 4;
            this.paintTile(hand[index], x, y, 0, true);
        }
        this.ctx.font="50px Arial";
        this.ctx.strokeText("SELF DRAW!",0,0);
        this.ctx.strokeText(toString(score)+"point",0,100);
    }
}