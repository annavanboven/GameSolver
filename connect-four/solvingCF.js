let table = document.querySelectorAll('.slot2');
console.log(table[0]);
var tableRow = document.querySelectorAll('.row');
let background = "rgb(238, 252, 255)";
let arrowRight = document.querySelector('.arrow.right');
var boardScore = document.getElementById("board-score");
console.log(boardScore);
var runningScore = 0;
//make a fake board to play with
var board = [];
board.length = 6;
for(let i = 0; i<6; i++){
   board[i] = [];
   board[i].length = 7;
   for(let j = 0; j<7; j++){
       board[i][j] = 0;
   }
}

//make the board score div
setUpBoardScore();
var humanScore = 0;
var computerScore = 0;

//make the graphics object
var graphic = new graphics(background);
 //make the computer player
 let computer = new computerPlayer(1,-1,board,1);
graphic.resetTable(table);
graphic.drawArrowRight(arrowRight);
var highlightColor = "skyblue";


//fill fake board with values
makeMove(2,"red",-1);
makeMove(3,"red",-1);
makeMove(3,"yellow",1);
makeMove(4,"yellow",1);
function makeMove(column, color, number){
    for(let i = 5; i >=0; i --){
        //work up from the bottom of the column and fill the first
        //empty slot you come across with a tile from the player
        if(board[i][column]==0){
            //update the array board and the displayed board
            board[i][column] = number;
            graphic.drawTile(tableRow[i].children[column].children[0], color);
            break;
        }
    }
}

//arrays are filled  as follows:
//[identifier, starting coordinates [row,col], ending coordinates [row,col]]
let horiz = [0,[4,0],[5,3]]
let vert = [1, [1,2],[2,4]]
let asc = [2,[4,2],[5,3]]
let desc = [3,[1,0],[2,1]]

var scoreArr = [horiz,vert,asc,desc]
var dirIndex = 0;
var row = scoreArr[dirIndex][1][0] - 1
var col = scoreArr[dirIndex][1][1] - 1
var reset = 0;

arrowRight.addEventListener('click',()=>{
    //step ahead to the next starting row
    let finalRow = scoreArr[dirIndex][2][0];
    let finalCol = scoreArr[dirIndex][2][1];

    //remove the last highlighted array
    if(reset >0){
        resetArr(dirIndex,row,col);
    }
    //first, go through the columns in the current row
    if(col <= finalCol){
        col++;
    }
    //when you reach the end of those columns, go to the next row
    if(col > finalCol){
        row++;
        //if you incremented the row too far, move on to the next check
        if(row <= finalRow){
         col = scoreArr[dirIndex][1][1];
        }

    }

    if(row > finalRow){
        dirIndex++;
        //if you're still valid, replace the row and col
        if(dirIndex <=3){
            row = scoreArr[dirIndex][1][0];
            col = scoreArr[dirIndex][1][1];
            // finalRow = scoreArr[dirIndex][2][0];
            // finalCol = scoreArr[dirIndex][2][1];
        }
        //otherwise, reset the col and col to the beginning
        else{
            row = scoreArr[0][1][0];
            col = scoreArr[0][1][1];
            resetBoardScore();
            reset = 0;
        }
    }
    reset++;
    console.log("row ",row);
    console.log("col ",col);
    console.log("finalRow ",finalRow);
    console.log("finalCol ",finalCol);
    console.log("dirIndex ",dirIndex);

    //calculate the score
    calcScore(dirIndex,row,col);
    //display new score
    displayScores();
});

function resetBoardScore(){
    humanScore = 0; 
    computerScore = 0;
    let bsChildren = boardScore.children;
    bsChildren[3].textContent = `Highlighted Score: 0`
    displayScores();
}

function resetArr(dirIndex, row, col){
    if(dirIndex == 0){
        resetHorizArr(row,col);
    }
    if(dirIndex ==1){
        resetVertArr(row,col);
    }
    if(dirIndex == 2){
        resetAscArr(row,col);
    }
    if(dirIndex ==3){
        resetDescArr(row,col);
    }
}

function resetHorizArr(row,col){
    let indices = [[row,col],[row,col+1],[row,col+2],[row,col+3]];
    unHighlight(indices);
}

function resetVertArr(row,col){
    let indices = [[row,col],[row+1,col],[row+2,col],[row+3,col]];
    unHighlight(indices);
}

function resetAscArr(row,col){
    let indices = [[row,col],[row-1,col+1],[row-2,col+2],[row-3,col+3]];
    unHighlight(indices);
}

function resetDescArr(row,col){
    let indices = [[row,col],[row+1,col+1],[row+2,col+2],[row+3,col+3]];
    unHighlight(indices);
}

function unHighlight(boardIndices){
    for(let i = 0; i < boardIndices.length; i++){
        let row = boardIndices[i][0];
        let col = boardIndices[i][1];
        graphic.unHighlightCell(tableRow[row].children[col].children[0]);
    }
}

function displayScores(){
    let bsChildren = boardScore.children;
    bsChildren[0].textContent = `Running Score: ${humanScore+computerScore}`;
    bsChildren[1].textContent = `Computer Score: ${computerScore}`;
    bsChildren[2].textContent = `Human Score: ${humanScore}`
}

function calcScore(dirIndex,row,col){
    if(dirIndex == 0){
        calcHorizScore(row,col);
    }
    if(dirIndex ==1){
        calcVertScore(row,col);
    }
    if(dirIndex == 2){
        calcAscScore(row,col);
    }
    if(dirIndex ==3){
        calcDescScore(row,col);
    }
}

function displayCurrScore(human,computer){
    total = human+computer
    let bsChildren = boardScore.children;
    let pageElement = bsChildren[3];
    pageElement.textContent = `Highlighted Score: ${total}`;
}

function highlightArr(boardIndices){
    for(let i = 0; i < boardIndices.length; i++){
        let row = boardIndices[i][0];
        let col = boardIndices[i][1];
        graphic.highlightCell(tableRow[row].children[col].children[0],highlightColor);
    }
}

function calcHorizScore(row,col){
    let testFour = [];
    testFour.length = 4;
    testFour[0] = board[row][col]
    testFour[1] = board[row][col+1]
    testFour[2] = board[row][col+2]
    testFour[3] = board[row][col+3]

    let indices = [[row,col],[row,col+1],[row,col+2],[row,col+3]]
    highlightArr(indices);

    let scores = computer.calculateFour(testFour)
    computerScore += scores[0]
    humanScore += scores[1]
    displayCurrScore(scores[1],scores[0]);
}

function calcVertScore(row,col){
    let testFour = [];
    testFour.length = 4;
    testFour[0] = board[row][col]
    testFour[1] = board[row+1][col]
    testFour[2] = board[row+2][col]
    testFour[3] = board[row+3][col]

    let indices = [[row,col],[row+1,col],[row+2,col],[row+3,col]]
    highlightArr(indices);
    

    let scores = computer.calculateFour(testFour)
    computerScore += scores[0]
    humanScore += scores[1] 
    displayCurrScore(scores[1],scores[0]);
}

function calcAscScore(row,col){
    let testFour = [];
    testFour.length = 4;
    testFour[0] = board[row][col]
    testFour[1] = board[row-1][col+1]
    testFour[2] = board[row-2][col+2]
    testFour[3] = board[row-3][col+3]

    let indices = [[row,col],[row-1,col+1],[row-2,col+2],[row-3,col+3]]
    highlightArr(indices);
    

    let scores = computer.calculateFour(testFour)
    computerScore += scores[0]
    humanScore += scores[1] 
    displayCurrScore(scores[1],scores[0]);
}

function calcDescScore(row,col){
    let testFour = [];
    testFour.length = 4;
    testFour[0] = board[row][col]
    testFour[1] = board[row+1][col+1]
    testFour[2] = board[row+2][col+2]
    testFour[3] = board[row+3][col+3]

    let indices = [[row,col],[row+1,col+1],[row+2,col+2],[row+3,col+3]]
    highlightArr(indices);
    

    let scores = computer.calculateFour(testFour)
    computerScore += scores[0]
    humanScore += scores[1] 
    displayCurrScore(scores[1],scores[0]);
}

function setUpBoardScore(){
    let header = document.createElement('h2');
    header.textContent = `Running Score: ${runningScore}`

    let comScore = document.createElement('p');
    comScore.textContent = `Computer Score: 0`;

    let humScore = document.createElement('p');
    humScore.textContent = 'Human Score: 0';

    let currScore = document.createElement('p');
    currScore.textContent = 'Highlighted Score: 0'

    boardScore.appendChild(header);
    boardScore.appendChild(comScore);
    boardScore.appendChild(humScore);
    boardScore.appendChild(currScore);
}
