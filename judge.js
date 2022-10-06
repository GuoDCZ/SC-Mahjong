
function getQuadNum() {
    for (let i = 1; i < 30; ++i) {
        if (this.tiles[i] == 4) {
            this.quadNum++;
        }
    }
}

function getSuitNum() {
    for (let k = 0; k < 3; ++k) {
        var ifSuitExist = false;
        for (let i = 1 + 10 * k; i < 10 * (k + 1); ++i) {
            if (this.tiles[i] > 0) ifSuitExist = true;
        }
        if (ifSuitExist) this.suitNum++; 
    }
}

function scoring(normal) {
    var score = 1; // Chicken Hand
    if (normal) {
        if (this.All_Triplets){
            if (this.Eye_Triplets) score = 8; // 2/5/8 Triplets
            else score = 2; // All Triplets
        }
        else if (this.Terminals_in_All_Sets) score = 4; // Terminals in All Sets
    } else {
        score = 4; // Seven Pairs
    }
    if (this.suitNum == 1) score *= 4;
    for (let i = 0; i < this.quadNum; ++i) {
        score *= 2;
    }
    // console.log(this,normal, score);
    return score;
}

function dfsFirstPair(hand) {
    for (let i = 0; i < 30; ++i) {
        if (hand.tiles[i] >= 2) {
            var h = JSON.parse(JSON.stringify((hand)));
            h.tiles[i] -= 2;
            h.pair++;
            if (i % 10 != 1 && i % 10 != 9) h.Terminals_in_All_Sets = false;
            if (i % 10 != 2 && i % 10 != 5 && i % 10 != 8) h.Eye_Triplets = false;
            dfsTriplet(h);
        }
    }
    dfsTriplet(hand);
    // console.log(hand);
    // return;
    var h = JSON.parse(JSON.stringify((hand)));
    for (let i = 0; i < 30; ++i) {
        if (h.tiles[i] >= 2) {
            h.tiles[i] -= 2;
            h.pair++;
            i--;
        }
    }
    updateSheet(h);
}

function dfsTriplet(hand, start = 0) {
    for (let i = start; i < 30; ++i) {
        if (hand.tiles[i] >= 3) {
            var h = JSON.parse(JSON.stringify((hand)));
            h.tiles[i] -= 3;
            h.meld++;
            if (i % 10 != 1 && i % 10 != 9) h.Terminals_in_All_Sets = false;
            if (i % 10 != 2 && i % 10 != 5 && i % 10 != 8) h.Eye_Triplets = false;
            dfsTriplet(h, i);
        }
    }
    dfsSequence(hand);
} 

function dfsSequence(hand, start = 0) {
    for (let i = start; i < 30; ++i) {
        if (hand.tiles[i] >= 1 && hand.tiles[i+1] >= 1 && hand.tiles[i+2] >= 1) {
            var h = JSON.parse(JSON.stringify((hand)));
            h.tiles[i] -= 1; h.tiles[i+1] -= 1; h.tiles[i+2] -= 1;
            h.meld++;
            h.All_Triplets = false;
            if (i % 10 != 1 && i % 10 != 7) h.Terminals_in_All_Sets = false;
            dfsSequence(h, i);
        }
    }
    // console.log(hand.tiles.slice(1,10),hand);
    dfsLack(hand);
}

function dfsLack(hand, level = 0, start = 0) {
    if (hand.meld + hand.lack >= 4 || level == 3) {
        updateSheet(hand);
        return;
    }
    for (let i = start; i < 30; ++i) {
        if (level == 0 && hand.tiles[i] >= 2) {
            var h = JSON.parse(JSON.stringify((hand)));
            h.tiles[i] -= 2;
        }
        else if (level == 1 && hand.tiles[i] >= 1 && hand.tiles[i+1] >= 1) {
            var h = JSON.parse(JSON.stringify((hand)));
            h.tiles[i]--; h.tiles[i+1]--;
        }
        else if (level == 2 && hand.tiles[i] >= 1 && hand.tiles[i+2] >= 1 && (hand.tiles[i]%10) != 9) {
            var h = JSON.parse(JSON.stringify((hand)));
            h.tiles[i]--; h.tiles[i+2]--;
        }
        else continue;
        h.lack++;
        dfsLack(h, level, i);
    }
    dfsLack(hand, level + 1);
}

var disco = -6;

function updateSheet(hand) {
    var nScore = 2 * (hand.meld) + hand.lack + hand.pair - 8;
    if (nScore == 1) var nScore = scoring.call(hand, true);
    var sScore = hand.pair - 6;
    if (sScore == 1) var sScore = scoring.call(hand, false);
    var score = (nScore > sScore) ? nScore : sScore;
    if (disco < score) disco = score;
}

/** ***
写得跟屎一样
*/
export default function getScore(handArray) {
    disco = -6;
    var hand = {
        tiles: [],
        pair: 0,
        meld: 0,
        lack: 0,
        All_Triplets: true,
        Eye_Triplets: true,
        Terminals_in_All_Sets: true,
        suitNum: 0,
        quadNum: 0
    };
    for (let i = 0; i < 30; ++i) hand.tiles.push(0);
    for (let i = 0; i < 14; ++i) hand.tiles[handArray[i]]++;
    getQuadNum.call(hand);
    getSuitNum.call(hand);
    if (hand.suitNum == 3) return -10;
    dfsFirstPair(hand);
    // console.log(hand);
    return disco;
}