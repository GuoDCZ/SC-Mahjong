import getScore from "./judge.js";

export default class Brain {
    constructor(table) {
        this.table = table;
    }
    potentialTile() {
        var player = this.table.count % 4;
        let tiles = new Array();
        for (let t = 0; t < 30; ++t) {
            if (t % 10 == 0) tiles.push(0);
            else tiles.push(4);
        }
        for (let p = 0; p < 4; ++p) {
            for (let index = 0; index < this.table.discards[p].length; ++index) {
                tiles[this.table.discards[p][index]]--;
            }
        }
        for (let index = 0; index < 13; ++index) {
            tiles[this.table.hands[player][index]]--;
        }
        if (this.table.staged != 0) tiles[this.table.staged]--;
        return tiles;
    }
    lestSuit(hand) {
        var nSuit = [0,0,0]
        hand.forEach(element => nSuit[parseInt(element/10)]++);
        let pos = 0;
        let lest = 20;
        for (let i = 0; i < 3; ++i) {
            if (lest > nSuit[i] && nSuit[i] != 0) {
                lest = nSuit[i];
                pos = i;
            }
        } 
        return pos;       
    }
    bestDiscard(hand) {
        var current = getScore(hand);
        if (current == -10) {
            let discardColor = this.lestSuit(hand);
            for (let i = 0; i < hand.length; ++i) {
                if (parseInt(hand[i]/10) == discardColor) return i;
            }
        }
        else {
            var pTile = this.potentialTile();
            // console.log(pTile);
            var rate = [];
            for (let i = 0; i < 14; ++i) {
                var tempRate = 0;
                var temp = hand[i];
                hand.splice(i,1)
                let s = getScore(hand);
                console.log(hand, s);
                if (s == current) {
                    for (let j = 0; j < 30; ++j) {
                        if (pTile[j] > 0) {
                            hand.push(j)
                            let ss = getScore(hand);
                            if (ss > current) {
                                tempRate += pTile[j];
                            }
                            hand.pop();
                        }
                    }
                }
                hand.splice(i,0,temp)
                rate.push(tempRate);
            }
        }
        // console.log(hand, rate);
        let pos = 0;
        let best = 0;
        for (let i = 0; i < 14; ++i) {
            if (best < rate[i]) {
                best = rate[i];
                pos = i;
            }
        } 
        return pos;       
    }
}


