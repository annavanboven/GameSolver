class computerPlayer{
    constructor(player, opponent, board, maxDepth){
        // console.log("making player");
        this.player = player;
        this.opponent = opponent;
        this.realBoard = board;
        this.maxDepth = maxDepth;
        this.playBoard = [];

        this.playBoard.length = 6;
        for(let i = 0; i<6; i++){
            this.playBoard[i] = [];
            this.playBoard[i].length = 7;
            for(let j = 0; j<7; j++){
                this.playBoard[i][j] = 0;
            }
        }
    }

    updateDepth(newDepth){
        this.maxDepth = newDepth;
        // console.log("updated depth: ",this.maxDepth);
    }

    testCalc(){
        let test = [0,-1,0,0];
        // console.log("test = ",test," score = ",this.calculateFour(test));
    }

    updateBoard(newBoard){
        this.realBoard = copyBoard(realBoard,newBoard);
    }

    makeMove(){     
        // // console.log("computer make move");  
        // // console.log("real board",this.realBoard);
        //// console.log("depth ",this.maxDepth);
        let depth = 0;
        this.playBoard = this.copyBoard(this.playBoard, this.realBoard);
        // // console.log("playboard ",this.playBoard);
        let nextPlay = this.getNextPlay(depth, this.maxDepth, this.playBoard);
        // // console.log("returning ", nextPlay);
        return nextPlay;
    }

    copyBoard(copy, original){
        for(let i = 0; i<original.length; i++){
            for(let j = 0; j<original[i].length; j++){
                copy[i][j] = original[i][j];
            }
        }
        return copy;
    }

    getNextPlay(depth, max){
        let res =  this.minimax(depth, max);
        // // console.log("getNextPlay ",res);
        return res;
    }

    minimax(depth, maxDepth){
        let actVal = this.maxValue(depth, maxDepth, -1);
        // // console.log("minimax ",actVal[0]);
        return actVal[0];
    }

     maxValue(depth, prevPlay){
        //  // console.log("maxVal");
        //// console.log("max depth ",depth);
         let actVal = [];
         actVal.length = 2;
         if(this.cutoffTest(depth)){
            //  // console.log("evaluating and returning");
             const evaluateBoard= this.evaluate(this.playBoard);
             actVal[0] = prevPlay;
             actVal[1] = evaluateBoard;
             //// console.log("max returning score ",evaluateBoard," for move ",prevPlay);
             return actVal;
         }
     
         let value = -100000;
         let action = -1;
         depth++;
         let validActs = this.getAction();
         for(let i = 0; i< validActs.length; i++){
             let a = validActs[i];
            // // console.log("\t \t \t COMPUTER TAKING ACTION ",a);
             if(a == -1){
                 continue;
             }
             this.playBoard = this.result(a, this.player);
             let minA = this.minValue(depth, a)[1];
            //  // console.log("minVal action = ",a," value = ",minA);
             //// console.log(this.playBoard);
             if(minA >= value){
                 value = minA;
                 action = a;
                 actVal[0] = action;
                 actVal[1] = value;
             }

             this.undoResult(a);
         }
         //// console.log("(no cutoff) max returning score ",actVal[1]," for move ",actVal[0])
         return actVal;
    }

    minValue(depth, prevPlay){

        // // console.log("minVal");
        // // console.log("depth ",depth);
        //// console.log("min value");
        //// console.log("prev play: ",prevPlay);
       // // console.log("board: ");
        //// console.log(board);
    
        let actVal = [];
        actVal.length = 2;
        if(this.cutoffTest( depth)){
            const evaluateBoard= this.evaluate(this.playBoard);
            actVal[0] = prevPlay;
            actVal[1] = evaluateBoard;
           // // console.log("min returning score ",evaluateBoard," for move ",prevPlay);
            return actVal;
        }
    
        let value = 10000;
        let action;
        depth++;
        let validActs = this.getAction();
        for(let i = 0; i<validActs.length; i++){
            let a = validActs[i];
            //// console.log("\t \t \t MIN TAKING ACTION ",a)
            if(a==-1){
                continue;
            }
            this.playBoard = this.result(a, this.opponent);
            let maxA = this.maxValue(depth, a)[1];
            if(maxA <= value){
                action = a;
                value = maxA;
                actVal[0] = a;
                actVal[1] = value;
            }

            this.undoResult(a);
        }
        //// console.log("(no cutoff) min returning score ",actVal[1]," with move ",actVal[0]);
        return actVal;
    }

    result(column,  player){
        if(this.playBoard[0][column]!==0){
            // console.log("board full")
            return this.playBoard;
        }
    
        for(let i = 0; i< this.playBoard.length; i++){
            if(i===this.playBoard.length-1){
                this.playBoard[i][column] = player;
                break;
            }
            if(this.playBoard[i+1][column]!==0){
                this.playBoard[i][column] = player;
                break;
            }
        }
        //// console.log("player ",player," making move ",column,". board after = ",this.copyBoard(this.makeNewBoard(),this.playBoard));
        // // console.log(this.playBoard);
    
        return this.playBoard;
    }

    undoResult(column){
        for(let row = 0; row<this.playBoard.length; row++){
            if(this.playBoard[row][column]!==0){
                this.playBoard[row][column] = 0;
                return this.playBoard;
            }
        }
        return this.playBoard;
    }

    cutoffTest(depth){
        return depth >= this.maxDepth || this.mmWinCheck(this.playBoard);
    }

    getAction(){
        let validActs = [];
        for(let i = 0; i<this.playBoard[0].length; i++){
            if(this.playBoard[0][i] ===0){
                validActs.push(i);
            }
        }
        return validActs;
    }

    
/*
* The following are the evaluation functions that minimax uses to evaluate the score for a board.
* A board's score is based on how many opportunities there are for a player to have a run of four,
* and how close that player currently is to having a run of four.
*/

evaluate(board){
    //// console.log("evaluating board ",this.copyBoard(this.makeNewBoard(),this.playBoard),"...")
    //// console.log("VERTICAL");
    let vertScore = this.vertical(board);
    // // console.log("HORIZONTAL");
    let horizScore = this.horizontal(board);
    // // console.log("ASCEND");
    let ascendScore = this.ascend(board);
    // // console.log("DESCEND");
    let descendScore = this.descend(board);

    let computerScore = vertScore[0]+horizScore[0]+ascendScore[0]+descendScore[0];
    let humanScore = vertScore[1]+horizScore[1]+ascendScore[1]+descendScore[1];
    // // console.log("computer score = ",computerScore," human score = ",humanScore," total = ",(computerScore+humanScore))
    return computerScore+humanScore;
}


    calcHeuristic(counter){
        if (counter === 0){
            return counter;
        }
        else if(counter ===1){
            return 1;
        }
        else if(counter ===2){
            return 10;
        }
        else if(counter ===3){
            return 100;
        }
        else{
            return 1000;
        }
    }



    makeNewBoard(){
        let board = [];
        board.length = 6;
        for(let i = 0; i<6; i++){
            board[i] = [];
            board[i].length = 7;
        }
        return board;
    }

    horizontal(board){
        let computerScore = 0;
        let humanScore = 0;


        let scores = []
        scores.length = 2

        for(let row = 0; row<=5; row++){
            for(let col = 0; col <= 3; col++){
                let testFour = [];
                testFour.length = 4;
                testFour[0] = board[row][col]
                testFour[1] = board[row][col+1]
                testFour[2] = board[row][col+2]
                testFour[3] = board[row][col+3]

                scores = this.calculateFour(testFour)
                computerScore += scores[0]
                humanScore += scores[1]
            }
        }
        return [computerScore, humanScore]
    }

    vertical(board){
        let computerScore = 0;
        let humanScore = 0;


        let scores = []
        scores.length = 2

        for(let col = 0; col <= 3; col++){
            for(let row = 0; row<=2; row++){
                let testFour = []
                testFour.length = 4
                testFour[0] = board[row][col]
                testFour[1] = board[row+1][col]
                testFour[2] = board[row+2][col]
                testFour[3] = board[row+3][col]

                scores = this.calculateFour(testFour)
                computerScore += scores[0]
                humanScore += scores[1]
            }
        }
        return [computerScore, humanScore]
    }

    ascend(board){
        let computerScore = 0;
        let humanScore = 0;


        let scores = []
        scores.length = 2

        for(let row = 3; row<=5; row++){
            for(let col = 0; col <= 3; col++){
                let testFour = []
                testFour.length = 4
                testFour[0] = board[row][col]
                testFour[1] = board[row-1][col+1]
                testFour[2] = board[row-2][col+2]
                testFour[3] = board[row-3][col+3]

                scores = this.calculateFour(testFour)
                computerScore += scores[0]
                humanScore += scores[1]
            }
        }
        return [computerScore, humanScore]
    }

    descend(board){
        let computerScore = 0;
        let humanScore = 0;


        let scores = []
        scores.length = 2

        for(let row = 0; row<=2; row++){
            for(let col = 0; col <= 3; col++){
                let testFour = []
                testFour.length = 4
                testFour[0] = board[row][col]
                testFour[1] = board[row+1][col+1]
                testFour[2] = board[row+2][col+2]
                testFour[3] = board[row+3][col+3]

                scores = this.calculateFour(testFour)
                computerScore += scores[0]
                humanScore += scores[1]
            }
        }
        return [computerScore, humanScore]
    }

    calculateFour(arr){
        if(arr.includes(-1) && arr.includes(1)){
            // // console.log("included both (returning 0) ",arr);
            return [0,0];
        }

        if(arr.includes(1)){
            let counter = 0;
            for(let i = 0; i<4; i++){
                if(arr[i]===1){
                    counter++;
                }
            }
            // console.log("included 1  ",arr);
            return [this.calcHeuristic(counter),0];
        }

        if(arr.includes(-1)){
            let counter = 0;
            for(let i = 0; i< 4; i++){
                if(arr[i]===-1){
                    counter++;
                }
            }
            // console.log("included -1  ",arr);
            return[0,(-1*this.calcHeuristic(counter))];
        }
        //// console.log("included neither ",arr);
        return [0,0];
    }

    /*
     * The following methods check to see is there is a winning state on the board.
     * It checks whether there is a run of four matching tiles in each row, column, ascending, and descending state.
     * 
     */

    mmWinCheck(){
        return this.mmHorizontalCheck() || this.mmVerticalCheck() || this.mmDiagLRCheck() || this.mmDiagRLCheck();
    }



    mmMatchCheck(one, two, three, four){
        return one == two && one == three && one == four && one !=0;
    }

    mmHorizontalCheck(){
        for(let row = 0; row < this.playBoard.length; row++){
            for(let col = 0; col < 4; col++){
                if(this.mmMatchCheck(this.playBoard[row][col],
                    this.playBoard[row][col+1],
                    this.playBoard[row][col+2],
                    this.playBoard[row][col+3])){
                        return true;
                    }
            }
        }
    }

    mmVerticalCheck(){
        for(let col = 0; col < 7; col ++){
            for(let row = 0; row < 3; row ++){
                if(this.mmMatchCheck(this.playBoard[row][col],
                    this.playBoard[row+1][col],
                    this.playBoard[row+2][col],
                    this.playBoard[row+3][col])){
                        return true;
                    }
            }
        }  
    }


    mmDiagLRCheck(){
        for(let col = 0; col < 4; col ++){
            for(let row = 0; row < 3; row ++){
                if(this.mmMatchCheck(this.playBoard[row][col],
                    this.playBoard[row+1][col+1],
                    this.playBoard[row+2][col+2],
                    this.playBoard[row+3][col+3])){
                        return true;
                    }
            }
        }
    }

    mmDiagRLCheck(){
        for(let col = 0; col < 4; col ++){
            for(let row = 5; row >2; row --){
                if(this.mmMatchCheck(this.playBoard[row][col],
                    this.playBoard[row-1][col+1],
                    this.playBoard[row-2][col+2],
                    this.playBoard[row-3][col+3])){
                        return true;
                    }
            }
        }
    } 
}
