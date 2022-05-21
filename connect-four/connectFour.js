/**
 * Grab the selectors from the html page
 */
//get an array of the table rows 
var tableRow = document.querySelectorAll('.row');

//array of all the cells in the table
var tableCell = document.getElementsByTagName('td');
//array of all the slots in the table(each cell has one slot)
var tableSlot = document.querySelectorAll('.slot');
//this variable will update whose turn it is
const playerTurn = document.querySelector('.player-turn');
//reset button
const reset = document.querySelector('.reset');
//nextMove button
const nextMove = document.querySelector('.next-move');

nextMove.style.display = 'none';

/* Walkthrough variables */
//walkthrough Button
const walkthrough_button = document.querySelector('.walkthrough');
walkthrough_button.style.display = 'block';
//walkthrough div
const walkthrough = document.querySelector('.mm-walkthrough');
walkthrough.style.display = 'none';
//walkthrough max element
var mm_max = document.querySelector('.mm-max');
//walkthrough min element
var mm_min = document.querySelector('.mm-min');





//array of canvases (one for each column)
let aboveTable = document.querySelectorAll('.aboveTable');
//depth of the slider
var depth = document.querySelector('.slider');
var depthContainer = document.querySelector('.slidecontainer');
var mmDepth = depth.value;
//mode of the computer player
let computerModes = document.getElementsByName('autoMan');
for(let i = 0; i< computerModes.length; i++){
    console.log(computerModes[i].value);
}

//initialize computer mode to auto
let computerMode = 'auto';

//grab all the td slots
let table = document.querySelectorAll('.slot1');
var gamePause = false;

//set players
playerHuman = [-1,'red',"Human"]
playerComputer = [1, 'yellow',"Computer"]
players = [playerHuman,playerComputer];
//want current player to start the game
var currentPlayer = 0;
playerTurn.textContent = `Your turn!`;
playerTurn.style.color = players[currentPlayer][1];

//state player colors
background = "rgb(238, 252, 255)";




/**
 * Create array boards that the minimax functions will use to play the game.
 * Gameboard stays updated with the current state of the real game.
 * Board copies the values in gameboard, then is used in minimax to
 * simulate longer connectfour games to then determine which move the computer
 * will make.
 */
 var board = [];
 var playBoard = [];
 board.length = 6;
 playBoard.length = 6;
 for(let i = 0; i<6; i++){
    board[i] = [];
    board[i].length = 7;
    playBoard[i] = [];
    playBoard.length = 7;
    for(let j = 0; j<7; j++){
        board[i][j] = 0;
        playBoard[i][j] = 0;
    }
 }

 //make the computer player
 let computer = new computerPlayer(1,-1,board,mmDepth);

//make the graphics object
 let graphic = new graphics(background);

 //reset the table for the begining of the game
 graphic.resetTable(table);


/**
 * Event listeners for all the buttons
 */

//mouseover events that display a tile over whatever column the human is hovering over
for(let i = 0; i < tableCell.length; i++){
    //when the player hovers over a cell, place a red tile above that column
    tableCell[i].addEventListener('mouseenter',(e)=>{
        graphic.displayAboveTable(aboveTable[e.target.cellIndex],players[currentPlayer][1]);
    })

    //when a player stops hovering over a cell, remove the tile above that column
    tableCell[i].addEventListener('mouseleave',(e)=>{
        graphic.clearAboveTable(aboveTable[e.target.cellIndex]);
    })
}

//event listener for switching from automatic to manual mode for the computer
for(let i = 0; i< computerModes.length; i++){
    if(!gamePause){
        computerModes[i].addEventListener('click', ()=>{
            computerMode = computerModes[i].value;
            //in manual, show the next move button. otherwise, hide it
            if(computerMode == 'man'){
                nextMove.style.display = 'block';
            }
            if(computerMode == 'auto'){
                nextMove.style.display = 'none';
            }
        })
    }

}

//event listener for resetting the game
reset.addEventListener('click',()=>{
    //reset the playboard
    graphic.resetTable(table);
    //reset the board that makeMove() uses to play
    for(let i = 0; i<6; i++){
        board[i] = [];
        board[i].length = 7;
        for(let j = 0; j<7; j++){
            board[i][j] = 0;
        }
    
    }
    //reset it so its the human's turn
    currentPlayer = 0;
    playerTurn.style.color = 'black';
    return playerTurn.textContent = 'Your turn!';
    }
);

//event listener to adjust the depth of the minimax algorithm
depth.addEventListener('click',()=>{
    if(!gamePause){
        mmDepth = depth.value;
        //for depths of 1 or 2, display the walkthrough
        if(depth.value <=2){
            walkthrough_button.style.display = 'block';
        }
        //for depths of 3 or 4, hide the walkthrough and reset it
        if(depth.value >2){
            walkthrough_button.style.display = 'none';
            walkthrough.style.display = 'none';
            gamePause = false;
            resetWalkthrough();
        }
        //update the depth for the computer player
        computer.updateDepth(mmDepth);
    }
});

//event listener to display the walkthrough
walkthrough_button.addEventListener('click', ()=>{
    //if it is currently not showing, display the walkthrough
    if(walkthrough.style.display === 'none'){
        mmWalkthrough();
        walkthrough.style.display = 'block';
        //hide the button, since another one shows up as part of the walkthrough
        walkthrough_button.style.display = "none";
    }
    else{  
        //allow the game to continue play
        gamePause = false;
        //hide the walkthrough and display the button
        resetWalkthrough();
        walkthrough.style.display = 'none';
        walkthrough_button.textContent = 'Show Minimax Walkthrough'
      
    }
    }
)

//event listener to make the computer's next move
nextMove.addEventListener('click',()=>{
    if(currentPlayer ==1){
        makeMove(computer.makeMove());
    }
})


//event listener for the human to make a move on all of the table cells
for(let i = 0; i<tableRow.length; i++){
    for(let j = 0; j<tableRow[i].children.length; j++){
        cell = tableRow[i].children[j];
        cell.addEventListener('click',()=>{
            if(currentPlayer ===0){
                makeMove(j);
            }
        });
    }
}







/**
 * making a move on the gameboard, for either the human or the computer
 * @param {*} column column to make the move in
 * @returns 
 */
function makeMove(column){
    //if the walkthrough is happening, no player can make a move
    if(gamePause){
        console.log("game paused")
        return;
    }   

    for(let i = 5; i >=0; i --){
        //work up from the bottom of the column and fill the first
        //empty slot you come across with a tile from the player
        if(board[i][column]==0){
            //update the array board and the displayed board
            board[i][column] = players[currentPlayer][0];
            graphic.drawTile(tableRow[i].children[column].children[0], players[currentPlayer][1]);
            //if there is a winning state on the board, the game is over
            if(winCheck()){
                //if the human won, print that to the screen and keep them the current player
                if(currentPlayer==0){
                    playerTurn.textContent = `You won!`;
                    playerTurn.style.color = players[currentPlayer][1];
                    currentPlayer = 0;
                }
                //if the computer won, print that to the screen and set human to current player
                else{
                    playerTurn.textContent = `Computer won!`;
                    playerTurn.style.color = players[(currentPlayer*-1)][1];
                    currentPlayer = 0;
                }
                reset.textContent = 'Play Again';
            }  
            //if there is a draw, print to the screen and set human to current player
            else if(drawCheck()){
                playerTurn.textContent = 'Game is a Draw';
                currentPlayer = 0;
            }
            else{
                //after the human makes a move
                if(currentPlayer==0){
                    playerTurn.textContent = `Computer's turn!`;
                    currentPlayer = 1;
                    //if the computer is automatically playing, make the computer move
                    if(computerMode==='auto' && walkthrough.style.display=="none"){
                        return makeMove(computer.makeMove());
                    }
                }
                else{
                    //after the computer makes a move
                    playerTurn.textContent = 'Your turn!';
                    currentPlayer = 0;
                }          
            }
            //if we are going through the walkthrough, call the walkthrough on the next move
            if(walkthrough.style.display=="block"){
                mmWalkthrough();
            }
            return;
        }
        
    }

}



/**
 * Functions for the minimax walkthrough
 */



/**
 * mmWalkthrough displays and controls the minimax walkthrough element of the html
 * @returns 
 */
async function mmWalkthrough(){
    //pause the game so that human cannot make any moves
    gamePause = true;
    flipButtons();

    reset.addEventListener('click',()=>{
        clearWalkthrough();
    });

    //make the max value table
    mm_max = createMaxElement();
    //grab the max value table
    let max_children = mm_max.children;
    let table = max_children[2];



    //make a button to step through the table
    let next_step = document.createElement('button');
    next_step.textContent = "Next Step";
    mm_max.appendChild(next_step);

    //set up the values to walk through the board
    let col = 0;
    let maxScore = 0;
    let maxCol = 0;

    //button to return to normal play
    let return_to_game = document.createElement('button');
    return_to_game.textContent = "Return to normal play";
    walkthrough.appendChild(return_to_game);



    //if they want to return to the game
    return_to_game.addEventListener('click',()=>{
            //undo the last move
            if(col>0){
                undoMove(col-1);
            }
        clearWalkthrough();
    });

    //step through the max value table
    next_step.addEventListener('click',async()=>{
        // If you pass the end of the board, undo the last move
        if(col >= board[0].length){
            undoMove(col-1);
            resetWalkthrough();

            //for the computer, call the function that plays the best move
            if(currentPlayer==1){
                gamePause = false;
                return makeMove(computer.makeMove());
            }
            //for the human, force them to play the best move >:)
            else{
                gamePause = false;
                return makeMove(maxCol);
            }
        }

        //before starting the next iteration, reset the board from the last move
        if(col>=1){
            resetElement(mm_min);
            undoMove(col-1);
        }

        //evaluate the score for that column and update the table
        let tempScore;
        //if we are only showing max_value, the score is evaluated for the board
        if(mmDepth==1){
            tempScore = fakeMove(col,currentPlayer);
        }
        // if we are showing min_value, the score is the minimum score from min_value
        else{
            fakeMove(col,currentPlayer);
            tempScore = await mmWalkthrough2();
            
        }

        //update the table with the best score from that move
        addToTable(col,table, tempScore);
        if(tempScore >= maxScore){
            //if you've hit a new max value, update the table and the max
            changeColColor(table,maxCol,"black")
            maxScore = tempScore
            maxCol = col
            changeColColor(table,col,"green")
        }

        //go to the next column and update the description
        col++;
        max_children[1].textContent = `Evaluating board for col ${col-1}`;

        //if you've evaluated the last column, update the button
        if(col >= board[0].length){
            if(currentPlayer==1){
                next_step.textContent = "Make Computer Move"
            }
            else{
                next_step.textContent = "Make Human Move"
            }
            next_step.style.width = '200px'; // setting the width to 200px
            next_step.style.height = '50px'; // setting the height to 200px
            next_step.style.background = 'green'; // setting the background color to teal
            next_step.style.color = 'white'; // setting the color to white
            next_step.style.fontSize = '20px'; // setting the font size to 20px
            max_children[1].textContent = `Max score ${maxScore} in column ${maxCol}`
        }
    });

    return;
}

function clearWalkthrough(){

        //allow the human to make moves
        gamePause = false;
        //reset the walkthorugh 
        resetWalkthrough();
        //display the "show walkthrough" button
        walkthrough_button.style.display = "block";
        //hide the walkthrough
        walkthrough.style.display = "none";

        //if it is the computer's turn and they're playing automatically, continue the game
        if(currentPlayer == 1 && computerMode == 'auto'){
            return makeMove(computer.makeMove());
        }
        return;
}

/**
 * removes the highest tile from the inputted column
 * @param {*} col column to take a tile out of
 */
function undoMove(col){
    for(let i = 0; i <6; i ++){
        if(board[i][col]==1){
            board[i][col] = 0;
            graphic.resetCell(tableRow[i].children[col].children[0])
            break;
        }
    }
}


/**
 * if the current column is highlighted, unhighlight it. 
 * if the current column is unhighlighted, highlight it.
 * @param {*} table table to update
 * @param {*} column column to update the value on
 * @param {*} color color to change the column values to
 */
function changeColColor(table,column,color){
    let tbody = table.children[1];
    tbody.rows[0].cells[column+1].style.color = color
    tbody.rows[1].cells[column+1].style.color = color

    if(color!=="black"){
        tbody.rows[0].cells[column+1].style.fontWeight = 'bold'
        tbody.rows[1].cells[column+1].style.fontWeight = 'bold'
    }
    else{
        tbody.rows[0].cells[column+1].style.fontWeight = 'normal'
        tbody.rows[1].cells[column+1].style.fontWeight = 'normal'
    }
}

/**
 * update the board with the move and evaluate the resulting board
 * @param {*} column column to make the move in
 * @param {*} player player making the move
 * @returns 
 */
function fakeMove(column,player){
    for(let i = 5; i >=0; i --){
        //work up from the bottom of the column and fill the first
            //empty slot you come across with a tile from the player
        if(board[i][column]==0){
            board[i][column] = 1;
            graphic.drawTile(tableRow[i].children[column].children[0], players[player][1]);
            break;
        }
    }
    //get the score of the board
    let score = computer.evaluate(board);
    return score;
}

/**
 * update the table in the inputted column with the inputted score
 * @param {*} column column to update
 * @param {*} table table to update
 * @param {*} score score to put in the column
 * @returns 
 */
function addToTable(column, table, score){
    let tbody = table.children[1];
    tbody.rows[1].cells[column+1].textContent = `${score}`
    return score
}

/**
 * this is the walkthrough for depth 2. It creates a table for min_value
 * @returns the minimum score for the table
 */
async function mmWalkthrough2(){
    //create the element for min_value
    mm_min = createMinElement();

    //grab the min_value table
    let min_children = mm_min.children;
    let table = min_children[2];
    let explanation = min_children[1];
    


    let minScore = 100000;
    let minCol = 0;

    async function getMinScore(minScore,minCol,explanation){
        for(let col = 0; col < board[0].length; col++){
            explanation.textContent = `Evaluating board for col ${col}`;
            //undo the last move
            if(col>0){
                undoMove(col-1);
            }
            //make a move with the opposite of the currentPlayer(min)
            let score = fakeMove(col,Math.abs(1-currentPlayer));
            //update the table with the new value
            addToTable(col,table,score);
            //if you come across a smaller score, update the min score
            if(score<minScore){
                changeColColor(table,minCol,"black");
                minScore = score;
                minCol = col;
                changeColColor(table,col,"red");
            }
            await pause(500);
        }

        //before returning, undo the move made in the last column
        undoMove(6);

        return [minScore,minCol];
    }
  
    //get the minimum score
    tempVals = await getMinScore(minScore,minCol,explanation);
    minScore = tempVals[0];
    minCol = tempVals[1];
    
    explanation.textContent = `Returning minimum score ${minScore} in column ${minCol}`;
    return minScore;
}

function pause(delay){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        },delay);
    })
}

/**
 * Creates max_value element
 * @returns DOM element
 */
function createMaxElement(){
    //make a header
    let header = document.createElement('h2');
    header.textContent = `Depth: 1 Player: ${players[currentPlayer][2]}`;
    mm_max.appendChild(header);

    //explain the current move
    let col = 0;
    let explanation = document.createElement('h3');
    explanation.textContent = `Evaluating board for col ${col}`;
    mm_max.appendChild(explanation);

    //create a table that will store the values for every column
    let mm_table = document.createElement('table');
    mm_table.backgroundColor = 'white';
    mm_table.createCaption("Max Values for ConnectFour Board");
    let tbody = document.createElement('tbody');

    //fill the first row of the table with column labels
    tbody.insertRow(0);
    tbody.rows[0].insertCell(0);
    tbody.rows[0].cells[0].appendChild(document.createTextNode("Column"));
    for(let i = 1; i < 8; i++){
        tbody.rows[0].insertCell(i);
        tbody.rows[0].cells[i].appendChild(document.createTextNode(`${i-1}`));
    }

    //leave the second row of the table empty to be updated by max
    tbody.insertRow(1);
    tbody.rows[1].insertCell(0);
    tbody.rows[1].cells[0].appendChild(document.createTextNode("Value"));
    for(let i = 1; i<8; i++){
        tbody.rows[1].insertCell(i);
        tbody.rows[1].cells[i].appendChild(document.createTextNode(""));
    }

    mm_table.appendChild(tbody);
    mm_max.appendChild(mm_table);
    return mm_max;
}

/**
 * Creates min element
 * @returns DOM element
 */
function createMinElement(){
    //create header
    let header = document.createElement('h2');
    header.textContent = `Depth: 2 Player: ${players[Math.abs(currentPlayer-1)][2]}`;
    mm_min.appendChild(header);

    //explain the current move
    let col = 0;
    let explanation = document.createElement('h3');
    explanation.textContent = `Evaluating board for col ${col}`;
    mm_min.appendChild(explanation);

    //create a table that will store the values for every column
    let mm_table = document.createElement('table');
    mm_table.backgroundColor = 'white';
    mm_table.createCaption("Min Values for ConnectFour Board");
    let tbody = document.createElement('tbody');
    mm_table.appendChild(tbody);

    //fill the first row of the table with the column labels
    tbody.insertRow(0);
    tbody.rows[0].insertCell(0);
    tbody.rows[0].cells[0].appendChild(document.createTextNode("Column"));
    for(let i = 1; i < 8; i++){
        tbody.rows[0].insertCell(i);
        tbody.rows[0].cells[i].appendChild(document.createTextNode(`${i-1}`));
    }

    //leave the second row empty to be updated by min
    tbody.insertRow(1);
    tbody.rows[1].insertCell(0);
    tbody.rows[1].cells[0].appendChild(document.createTextNode("Value"));
    for(let i = 1; i<8; i++){
        tbody.rows[1].insertCell(i);
        tbody.rows[1].cells[i].appendChild(document.createTextNode(""));
    }

    mm_min.appendChild(mm_table);
    return mm_min;
}

/**
 * resetWalkthrough clears the walkthrough element
 */
function resetWalkthrough(){
    flipButtons();
    //reset max_value element
    resetElement(mm_max);
    //reset min_value element
    resetElement(mm_min);
    //remove the "return to normal play" button
    walkthrough.removeChild(walkthrough.lastElementChild);
}

/**
 * resetElement clears the passed in element
 * @param {*} elem the DOM element to clear
 */
function resetElement(elem){
    //grab the last child
    let child = elem.lastElementChild;
    //while the element still has children, remove the child
    while(child){
        elem.removeChild(child);
        child = elem.lastElementChild;
    }
}

/**
 * if the buttons are greyed out, it switches them to valid. 
 * if the buttons are green, it greys them out.
 */
function flipButtons(){
    flipNextMove();
    flipSlider();
}

function flipNextMove(){
    if(gamePause){
        nextMove.style.backgroundColor = "grey";
        nextMove.style.cursor = "default";
    }
    else{
        nextMove.style.backgroundColor = "";
        nextMove.style.cursor = "grab";
    }
}

function flipSlider(){ 
    console.log(depthContainer);
    if(gamePause){
    depthContainer.style.backgroundColor = "grey";
    depthContainer.style.cursor = "default";
    }
    else{
     depthContainer.style.backgroundColor = "";
     depthContainer.style.cursor = "grab";
    }
}



/**
 * Win Checks for the html board
*/


/**
 * check if there are any runs of four
 * @returns boolean that says whether or not the game has been won
 */
function winCheck(){
    return (horizontalCheck() || verticalCheck() || diagCheckLR() || diagCheckRL());
}

/**
 * check if there are no possible moves left on the board
 * @returns boolean that says whether or not there is a draw
 */
function drawCheck(){
    for(let i = 0; i< board[0].length; i++){
        if(board[0][i]==0){
            return false;
        }
    }
    //if there are no possible moves left, the game is a draw
    return true;
}

/**
 * check to see if there is a run of four
 * @param {*} one color for tile 1
 * @param {*} two color for tile 2
 * @param {*} three color for tile 3
 * @param {*} four color for tile 4
 * @returns boolean saying whether all four colors are the same
 */
function colorMatchCheck(one,two, three, four){
    return (one ===two && one === three && one === four && one !== 0);
}

/**
 * check all horizontal runs for a run of four
 * @returns a boolean saying whether there is a horizontal win
 */
function horizontalCheck(){
    for(let row = 0; row < board.length; row ++){
        for(let col = 0; col < 4; col++){
            console.log(row);
            if(colorMatchCheck(board[row][col],
                board[row][col+1],
                board[row][col+2],
                board[row][col+3])){
                    return true;
                }
        }
    }
}

/**
 * check all vertical runs for a run of four
 * @returns a boolean saying whether there is a vertical win
 */
function verticalCheck(){
    for(let col = 0; col < 7; col ++){
        for(let row = 0; row < 3; row ++){
            if(colorMatchCheck(board[row][col],
                board[row+1][col],
                board[row+2][col],
                board[row+3][col])){
                    return true;
                }
        }
    }
}

/**
 * check all diagonal descending runs for a run of four
 * @returns a boolean saying whether there is a diagonal descending win
 */
function diagCheckLR(){
    for(let col = 0; col < 4; col ++){
        for(let row = 0; row < 3; row ++){
            if(colorMatchCheck(board[row][col],
                board[row+1][col+1],
                board[row+2][col+2],
                board[row+3][col+3])){
                    return true;
                }
        }
    }
}

/**
 * check all diagonal ascending runs for a run of four
 * @returns a boolean saying whether there is a diagonal ascending win
 */
function diagCheckRL(){
    for(let col = 0; col < 4; col ++){
        for(let row = 5; row >2; row --){
            if(colorMatchCheck(board[row][col],
                board[row-1][col+1],
                board[row-2][col+2],
                board[row-3][col+3])){
                    return true;
                }
        }
    }
}






// async function fallingTile(col){
//     let animate;
//     for(let i = 0; i<playBoard.length && playBoard[i][col]==0;i++){
//         console.log(tableRow[i].children[col]);
//         animationCell = tableRow[i].children[col];
//         animationStartPix = 0;
//         animationEndPix = animationCell.children[0].height+animationCell.children[0].height/2;
//         console.log(animationEndPix);
//         console.log("calling animation");
//         animate = await fallingTileAnimation(); 
//     }
//     console.log("returning from fallingTile");
//     return;

// }




// async function fallingTileAnimation(){
//     let cell = animationCell.children[0];
//     if(animationStartPix==2){
//         console.log(cell);
//     }
//     let context = cell.getContext("2d");

//     context.clearRect(0,0,cell.width,cell.height);
//     context.save();

//     context.beginPath();
//     context.arc(cell.width/2,animationStartPix,cell.width/2-2,0,2*Math.PI);
//     context.fillStyle = animationColor;
//     context.fill();
//     animationStartPix++;

//     if(animationStartPix <= animationEndPix){
//         window.requestAnimationFrame(fallingTileAnimation);
//     }
//     else{
//         clearCell(cell);
//         console.log("setting animation back to 0");
//         animationStartPix=0;
//         console.log("returning from fallingTileAnimation");
//         return;
//     }
// }


// function dropTile(row, col){
//     dropID = setTimeout(changeTileColor(row,col,animationColor),10000);
//     row++;
//     if(playBoard[row][col]==0){
//         dropTile(row,col);
//     }
//     return;
// }

// function changeTileColor(row,col,color){
//     tableRow[row].children[col].style.backgroundColor = color;
// }




