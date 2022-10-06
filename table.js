
export default class Table {
    constructor() {
        this.wall = getShuffledTile();
        this.hands = [[],[],[],[]];
        this.discards = [[],[],[],[]];
        this.count = 0;
        this.start = 0;
    }
    initDealEach(player, last) {
        if (last) {
            this.hands[player].push(this.wall.pop());
        }
        else {
            for (let i = 0; i < 4; ++i) {
                this.hands[player].push(this.wall.pop());
            }
        }
    }
    sortHand(player) {
        var hand = this.hands[player];
        hand.sort((a, b) => a - b);
    }
    initDeal() {
        for (let i = 0; i < 16; ++i) {
            this.initDealEach(i % 4, i >= 12);
        }
        for (let i = 0; i < 4; ++i) {
            this.sortHand(i);
        }
    }
    roundDeal() {
        this.hands[this.count % 4].push(this.wall.pop());
        // console.log(this.staged);
    }
    roundDiscard(index) {
        this.discards[this.count % 4].push(this.hands[this.count % 4].splice(index,1));
        this.sortHand(this.count % 4);
        this.count++;
    }
    getLastDiscard() {
        return this.discard[this.count % 4][this.discard[this.count % 4].length - 1];
    }
    endSelfDraw() {
        
    }
    endDealIn() {

    }

}

function getShuffledTile() {
    let wall = new Array();
    for (let i = 0; i < 30; ++i) {
        if (i % 10 == 0) continue;
        for (let j = 0; j < 4; ++j) {
            wall.push(i);
        }
    }
    wall.sort(()=>Math.random()-0.5)
    return wall;
}
