// @ts-check
/**
 * Created on Wed Mar 10 11:58:44 2021
 * 
 * @author: prowe
 * 
 * Solving Sudoku using
 * a constraint satisfaction problem with AC-3 and Backtracking
 * 
 * This is the main program that loads in, displays the board and
 * calls the solver.
 * 
 * by Penny Rowe
 * 2021/03/11
 * For AI and Software Engineering with Prof. Chambers
 * at the University of Puget Sound
 * Spring 2021, Spring 2022
 * 
 */

/*****************************************************
    FUNCTIONS
******************************************************/

/**
 * Check if a file exists
 * @param {String} urlToFile
 * @return  True if file exists, else false
 */
function fileExists(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    if (xhr.status === 404) {
        throw `File ${urlToFile} not found.`;
    }
    return xhr.status !== 404;
}

/**
 * Load in the incompleted Sudoku puzzle, or use default
 * @param {String} puzzle  Name of puzzle to use
 * @return  The grid of numbers; list of lists
 * @raises  NameError  If filename is not '' and does not exist
 */
function loadStartingValues(puzzle='easy') {
    let grid;

    if (puzzle === 'random') {
        let puzzleTypes = ['easy', 'medium', 'hard', 'evil'];
        let randint = Math.floor(puzzleTypes.length * Math.random());
        puzzle = puzzleTypes[randint];
    }

    if (puzzle === 'easy') {
        grid = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]];
        return grid;
    }

    if (puzzle === 'medium') {
        grid = [[0, 0, 2, 0, 0, 9, 0, 0, 0],
        [0, 3, 0, 8, 0, 1, 2, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 9],
        [0, 2, 5, 0, 0, 0, 4, 0, 0],
        [0, 7, 0, 0, 0, 0, 8, 0, 2],
        [0, 0, 0, 6, 0, 0, 9, 3, 0],
        [8, 0, 0, 5, 2, 0, 0, 0, 0],
        [0, 0, 0, 3, 4, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 0, 0]];
        return grid;
    }

    if (puzzle === 'hard') {
        grid = [[0, 0, 0, 7, 0, 8, 0, 3, 5],
        [5, 9, 3, 0, 4, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 4, 0, 0, 0, 0, 2, 8],
        [0, 0, 9, 0, 5, 0, 3, 0, 0],
        [2, 6, 0, 0, 0, 0, 9, 0, 0],
        [0, 0, 8, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 5, 9, 7],
        [4, 7, 0, 9, 0, 3, 0, 0, 0]];
        return grid;
    }

    if (puzzle === 'evil') {
        grid = [[0, 0, 0, 6, 3, 5, 2, 0, 0],
        [0, 0, 5, 7, 0, 0, 0, 0, 9],
        [0, 7, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 4, 6, 0, 0],
        [0, 9, 0, 0, 5, 0, 0, 7, 0],
        [0, 0, 4, 8, 0, 0, 0, 0, 5],
        [0, 0, 0, 0, 0, 0, 0, 4, 0],
        [7, 0, 0, 0, 0, 2, 3, 0, 0],
        [0, 0, 2, 5, 9, 6, 0, 0, 0]];
        return grid;
    }

    //If none of these selected, use the easy grid
    grid = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]];
    return grid;
}


/**
 * Test if two 2-D arrays are equal by comparing the lengths and then the
 * elements 1 by one
 * @param {array} arr1 
 * @param {array} arr2 
 * @returns 
 */
// function isArrayEqual(array1, array2) {
//     if (array1.length !== array2.length) {
//         return false;
//     }
//     // Go through row by row
//     let allEqual = true;
//     // for (i=0; i<9; i++) {
//     //     arr1 = array1[0];
//     //     arr2 = array2[0];
//     //     let isEqual = arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
//     //     allEqual = isEqual & allEqual;
//     return allEqual;
// }


/**
 * Set up the empty grid
 * @param {number} nrows
 * @param {number} ncols 
 */
function makeEmptyGrid(nrows, ncols) {
    let table = document.getElementById("sudokuGraphic");
    while (table.lastChild) {
        table.removeChild(table.lastChild);
    }
    for (let i = 0; i < nrows; i++) {
        let row = document.createElement("tr");
        row.classList.add(`row-${i}`);
        table.appendChild(row);
        for (let j = 0; j < ncols; j++) {
            // To let player play the game, make an input box as a child to the cell
            let col = document.createElement("td");
            col.classList.add(`col-${j}`);
            col.classList.add("sudokubox");
            row.appendChild(col);
        }
    }
}


/**
 * Reset the board and the state of play (i.e. filling in the board) to the beginning
 */
function runBacktrackSolver() {

    // Highlight the button for the selected solver, and put the other back to normal
    let solverMethod = document.getElementById("solverDemoBacktrack");
    solverMethod.classList.add("selectedsolver");

    let nonsolverMethod = document.getElementById("playSudokuSolver");
    nonsolverMethod.classList.remove("selectedsolver");

    // Reset the state of play and the board
    playReset();
    boardReset();

    // Print a message while we wait for the solver
    let state = document.querySelector(".state");
    state.innerHTML = "<p>You have chosen backtracking.</p><p>Please wait while I solve the puzzle.</p>";
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";

    // Solve the board using backtracking alone, using backtrack, in backtrack.js
    let grid = loadStartingValues(puzzleType);
    let result = backtracker(grid);
    let finalgrid = grid;

    let msg = result[0];
    moves = result[1]; // row, column, value, method

    // Write the message saying it's been solved
    state.innerHTML = "<p>I have solved the puzzle using backtracking. You can: </p>1) Choose another puzzle or solver on the left. <p>2) Use the controls to play the solution.</p><p>3) Click 'Show the domain' to walk through an explanation of the solution.";
}


/**
 * Unlight all control buttons (play, rewind, etc)
 */
function refreshControls() {
    // Deselect all buttons - remove "selected" class from all play buttons
    rewindToBegButton.classList.remove("selected");
    rewindButton.classList.remove("selected");
    pauseButton.classList.remove("selected");
    playButton.classList.remove("selected");
    forwardToEndButton.classList.remove("selected");

    stepButton.classList.remove("selected");
    stepBackButton.classList.remove("selected");
}


/**
 * Reset the board and the state of play (i.e. filling in the board) to the beginning
 */
function playReset() {
    // Reset the state of play
    clearInterval(timeId);
    delay = 1000;
    imove = 0;
    running = false;

    // Turn off the domain, if on
    setupForControls();
}


/**
 * Reset the board, but do not clear timers or alter the state of play
 */
function boardReset() {
    originalgrid = loadStartingValues(puzzleType);
    makeEmptyGrid(9, 9);
    populateBoard(originalgrid);

    // global variable with the current state of the grid
    currentgrid = loadStartingValues(puzzleType);
}


/**
* Populate a box of the board and move the pointer to the next box.
* If at the final move, quit playback
* Also update the grid to the current state
* @param {array} moves  Array of arrays of moves, where inner array is [row, col, value, string]
*/
let populator = function (moves) {
    if (imove < moves.length) {
        // Populate the box, update the grid, and increment the pointer to the moves
        populateSquare(moves[imove][0], moves[imove][1], moves[imove][2], moves[imove][3]);
        currentgrid[moves[imove][0]][moves[imove][1]] = moves[imove][2];
        imove++;
    }
    else {
        clearInterval(timeId);
        // Finished with solution
        let state = document.querySelector(".state");
        state.innerHTML = "<p>Puzzle Completed!</p><p>Continue using controls or choose a different puzzle or solver.</p>";
        let explanation = document.querySelector(".explanation");
        explanation.innerHTML = "<p></p>";
        running = false;
    };
};


/**
 * Draw a box around the next square to be populated.
 * Then populate the box and move the pointer to the next box.
 * If at the final move, quit playback
 * Also update the grid to the current state
 */
let steppopulator = function () {
    if (!outlined && !(typeof moves==='undefined') && (!(typeof imove==='undefined')) && (!(typeof moves[imove]==='undefined'))) {
        // Draw a box around the next square that will be populated.
        boxborder(moves[imove][0], moves[imove][1], moves[imove][3]);

        // There is an outline drawn. Next time we will not draw the outline
        outlined = true;        
    }
    else {
        // The populator should remove the box
        if (outlined) {
            removeboxborder(moves[imove][0], moves[imove][1], moves[imove][3]);
        }
        populator(moves);
        // Next time we will draw the box again
        outlined = false;
    }
};


/**
 * Get the step size for rewinding, depending on the delay
 * @param {number} imove  The index to the move
 * @param {number} delay  The delay between rewind steps
 * @returns 
 */
function stepSizeForRewind(imove, delay) {

    let deltai = 1;              // slow: 1 step back

    if (delay <= 0) {            // fastest: 10 steps to location
        deltai = Math.round(imove / 10);
    }
    else if (delay <= 10) {      // fast: 100 steps to location
        deltai = Math.round(imove / 100);
    }
    else if (delay <= 100) {     // medium: 1000 steps to location
        deltai = Math.round(imove / 1000);
    }

    // Do not allow deltai < 1
    if (deltai < 1) {
        deltai = 1;
    }

    return deltai;
}


/**
 * For running operations that should not show the domain, when the
 * domain is on. Check if the domain button is on and, if so, turn it off
 * and remove the domain from the display board. Also remove any box outlines
 */
 function setupForControls() {
    let button = document.getElementById("showDomainButton");
    if (button.value === "ON") {
        button.value = "OFF";
        //TODO: better way to do the following?
        showDomainButton.classList.remove("selected");
        clearDomainFromTable();
    }

    if (outlined && !(typeof moves === 'undefined') && !(typeof imove === 'undefined')) {
        removeboxborder(moves[imove][0], moves[imove][1], moves[imove][3]);
        outlined = false;
    }
}


/**
 * Repopulate the board back the given location (movement number)
 * 
 * The play timeline, where
 *   imove: current location
 *   location: the final location after rewind is complete
 *   jump:  the movement for one rewinding step, which depends on the delay 
 *   |-------------------|--------|-----------|
 *   0               location    imove     moves.length
 *                          
 * 
 * @param {number} location  The location to rewind back to
 */
let rewindToMove = function (location) {
    // Do any actions that need to be done before control functions, such as
    // removing the outline
    setupForControls();

    if (location > imove) {
        throw "Rewinding, so new location must be before current";
    }
    else if (location === imove) {
        throw "Rewinding, but new location is same as current";
    }

    // Build the board at the desired location and display it
    // Remember that we start all over from the original grid
    // and add all the moves up to the current location
    let newgrid = updateGridFromMoves(originalgrid, moves, location, outlined);

    return newgrid;
};


/** Determine the delay for the graphics display based on the animation speed
* @param {number} ANIMATION_SPEED The speed from the slider
* @returns {number} The delay for filling in boxes in the puzzle
*/
function getDelayFromSpeed(ANIMATION_SPEED) {
    delay = 10 ** (3 - ANIMATION_SPEED / 100);
    if (delay <= 1) {
        delay = 0;
    }
    return delay;
}



/*****************************************************
    EVENTS TRIGGERED WHEN THE DOM IS FINISHED LOADING
******************************************************/

// Global variables
//TODO: Do these all have to be globals?
var puzzleType = document.getElementById("dropdownpuzzle").value;
var originalgrid = loadStartingValues(puzzleType);
var currentgrid = loadStartingValues(puzzleType);

var rewindToBegButton = document.getElementById("rewindToBeg");
var rewindButton = document.getElementById("rewind");
var playButton = document.getElementById("playPause");
var forwardToEndButton = document.getElementById("forwardToEnd");
var stepButton = document.getElementById("step");
var stepBackButton = document.getElementById("stepBack");
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
var speedSlider = document.querySelector(".slider");
var pauseButton = document.getElementById("pauseButton");
var sudokuSolverMethod = document.getElementById("playSudokuSolver");
var backtrackSolverMethod = document.getElementById("solverDemoBacktrack");

var playOrRewind = populator;

let method = 'backtracking';
var moves = [];
let timeId;
let imove = 0;
let running = false;
let ANIMATION_SPEED = speedSlider.value;
let delay = 10 ** (3 - ANIMATION_SPEED / 100);           // default delay
let outlined = false;

// Create dictionaries to hold all the possible messages for display
let methodSpecificMsgsForDomain = {
    backtracking: "<p>Click 'Step' to see backtracking in action.</p>",
    ac3: "<p>AC-3 solves only the squares with a single value in the domain.</p><p>Click 'Step' to see AC-3 in action.</p>"
}

let stepMethodMsg = {
    'backtracking': "<p>Solving the outlined square with backtracking.</p><p>If there is more than one value in the domain, backtracking tries one, makes a note of the others, and then moves on to the next box.<p>This continues until it encounters an empty square, and then it backs up.</p><p>Click 'Step' again to keep going.",
    'ac3': "<p>Solving the outlined square with AC-3.</p><p>AC-3 solves any boxes with only one value in the domain first. After solving a box, the domains of all the boxes that depend on it are recomputed.</p><p>If all incomplete boxes have more than one value in the domain, it uses backtracking to try out a value from the domain of a square.</p>"
}


// Set up the default grid after the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    makeEmptyGrid(9, 9);
    populateBoard(originalgrid);

    // Reset the state of play and the board
    playReset();
    boardReset();
    runBacktrackSolver();
});


/*****************************************************
    EVENT LISTENERS FOR USER GENERATED EVENTS
******************************************************/

// Get the desired puzzle based on the drop-down menu value
document.querySelector("#dropdownpuzzle").addEventListener("change", function () {
    refreshControls();
    puzzleType = document.getElementById("dropdownpuzzle").value;

    // Reset the original grid and the current grid
    originalgrid = loadStartingValues(puzzleType);
    currentgrid = loadStartingValues(puzzleType);

    // Clear the Sudoku board and populate with the values from the selected puzzle
    imove = 0;
    moves = [];
    makeEmptyGrid(9, 9);
    populateBoard(originalgrid);

    // Default is Backtracking
    runBacktrackSolver();
});


// Solver demo for backtracking
document.querySelector("#solverDemoBacktrack").addEventListener("click", function () {
    method = 'backtracking';
    refreshControls();
    setupForControls();
    runBacktrackSolver();
});


// Solver demo for backtracking + AC-3
document.querySelector("#playSudokuSolver").addEventListener("click", function () {
    method = 'ac3';
    refreshControls();
    setupForControls();

    // Highlight the button for the selected solver, and put the other back to normal
    //let solverMethod = document.getElementById("playSudokuSolver");
    //solverMethod.classList.add("selectedsolver");
    sudokuSolverMethod.classList.add("selectedsolver");
    
    //let nonsolverMethod = document.getElementById("solverDemoBacktrack");
    //nonsolverMethod.classList.remove("selectedsolver");
    backtrackSolverMethod.classList.remove("selectedsolver");

    // Reset the state of play and the board
    playReset();
    boardReset();
    
    // Print a message while we wait for the solver
    let state = document.querySelector(".state");
    state.innerHTML = "<p>You have chosen backtracking.</p><p>Please wait while I solve the puzzle.</p>";
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";

    // Solve the board using AC-3 + backtracking, using solve, in solver.js
    // return an array with a message regarding whether the solver was successful
    // as well as the moves.
    // The moves array has an array for each move, containing the:
    // row, column, value, and method used to get the value
    let grid = loadStartingValues(puzzleType);
    let result = solve(grid);
    let finalgrid = grid;

    let msg = result[0];
    moves = result[1];

    // Write the message saying it's been solved
    state.innerHTML = "<p>I have solved the puzzle using AC-3 and backtracking. You can: </p>1) Choose another puzzle or solver on the left. <p>2) Use the controls to play the solution.</p><p>3) Click 'Show the domain' to walk through an explanation of the solution.";
});


// Event listener for the slider that controls the speed of play or rewind
speedSlider.addEventListener('click', () => {
    // The speed varies from: slowest (delay=1000), medium (100), fast (10), fastest (0)
    // The speed varies from: slowest (delay=1000) to fastest (delay=0)
    // speed = 0 => delay = 1000, or 10**(3-speed) = 1000
    // speed = 1 => delay = 100, or 10**2 = 100
    // speed = 2 => delay = 10, or 10**1 = 10
    // speed = 3 => delay = 1 (which is converted to 0)

    /* Get the new speed from the slider */
    ANIMATION_SPEED = speedSlider.value;
    delay = getDelayFromSpeed(ANIMATION_SPEED);

    if (running) {
        // If the solver animation is running, stop it
        // and restart with the new speed
        // Stop play
        clearInterval(timeId);

        // Restart play at the new speed
        timeId = createInterval(playOrRewind, moves, delay)
    };
});


/**
 * Create an interval for playing/rewinding delay
 * @param f
 * @param dynamicParameter
 * @param {number} interval
 */
function createInterval(f, dynamicParameter, interval) { 
    return setInterval(function() { 
        f(dynamicParameter); 
    }, interval); 
}


// Event listener for the play button
playButton.addEventListener("click", function () {
    // Unlight all control buttons and highlight the button of interest
    setupForControls();
    refreshControls();
    playButton.classList.add('selected');

    // Stop play or rewind, if in progress
    clearInterval(timeId);

    // Set to running, with explanation
    running = true;
    let state = document.querySelector(".state");
    state.innerHTML = "<p>Playing Solution.</p>";

    if (imove >= moves.length) {
        // Finished with solution
        let state = document.querySelector(".state");
        state.innerHTML = "<p>Puzzle Complete!</p><p>Continue using controls or choose a different puzzle or solver.</p>";
        let explanation = document.querySelector(".explanation");
        explanation.innerHTML = "<p></p>";
        running = false;

        // Done, so deselect the button
        playButton.classList.remove('selected');
        return;
    }

    // Get the speed from the slider, and the delay
    ANIMATION_SPEED = speedSlider.value;
    delay = getDelayFromSpeed(ANIMATION_SPEED);

    // Start play using the current delay;
    //timeId = setInterval(populator, delay);
    timeId = createInterval(populator, moves, delay)

    // Set playOrRewind to the populator for play, so the slider can use it to control the speed
    playOrRewind = populator;
});


// Event listener for the rewind button <<
// Rewind is tricky. We cannot undo the last move, because we don't know what was in
// the square before the last move occurred. So instead we have to redo all moves up to
// that point
rewindButton.addEventListener("click", function () {

    // Unlight all control buttons and highlight the button of interest
    setupForControls();
    refreshControls();
    rewindButton.classList.add("selected");

    // Stop play or rewind
    clearInterval(timeId);

    // We will be rewinding, so set running to true and print a message
    running = true;
    let state = document.querySelector(".state");
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";

    // Check if we are aleady at the beginning or not and display appropriate message. Return if at beginning.
    if (imove === 0) {
        // Already at the beginning, so print message and return
        state.innerHTML = "<p>At the beginning.</p><p>Use controls to play the solution.</p><p>Or choose a different puzzle or solver.</p>";
        return;
    }
    state.innerHTML = "<p>Rewinding.</p>";

    /* Get the new speed from the slider */
    ANIMATION_SPEED = speedSlider.value;
    delay = getDelayFromSpeed(ANIMATION_SPEED);

    // Set the rewind step size, because redrawing the board for all moves every step is very slow
    let deltai = stepSizeForRewind(imove, delay);

    /**
     * Depopulate the board, replaying to imove and then moving imove back a box.
     * Stop after the 0th move (the beginning board)
     * @param {array} moves Array of array of moves, with inner array of [row, col, values, string]
     */
    let depopulator = function (moves) {
        if (imove > 0) {
            currentgrid = rewindToMove(Math.max(imove - deltai, 0));
            imove -= deltai;
        }
        else {
            // We have rewound to the very beginning
            clearInterval(timeId);
            imove = 0;
            running = false;
            // Print a message while we wait for the solver
            let state = document.querySelector(`.explanation`);
            state.innerHTML = "<p>Rewound to beginning.</p><p>Continue using controls to play the solution.</p><p>Or choose a different puzzle or solver.</p>";
            rewindButton.classList.remove("selected");
        };
    };

    // Rewind at current delay;
    //TODO: What is going on with these inputs?
    //timeId = setInterval(depopulator, delay);
    timeId = createInterval(depopulator, moves, delay)

    // Set playOrRewind to the depopulator for rewinding, so the slider can change the speed
    playOrRewind = depopulator;
});


// Event listener for the forward to end button >>|
forwardToEndButton.addEventListener("click", async function () {

    // Stop play if any
    clearInterval(timeId);

    // Unlight all buttons and highlight the button of interest
    setupForControls();
    refreshControls();
    forwardToEndButton.classList.add("selected");

    // Print message that forward to end is in progress
    let state = document.querySelector(".state");
    state.innerHTML = "<p>Working on completing the puzzle. Please wait.</p>";

    running = true;

    // Fill in board to end. This can take some time, so return a promise and 
    // make the rest of the code wait until it completes.
    function fwdToEnd(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                forwardToEndButton.classList.add("selected");
                for (imove = imove; imove < moves.length; imove++) {
                    populateSquare(moves[imove][0], moves[imove][1], moves[imove][2], moves[imove][3]);
                }
                resolve();
            },0);
        })
    }
    
    await fwdToEnd();

    // Finished with solution
    state = document.querySelector(".state");
    state.innerHTML = "<p>Puzzle Completed!</p><p>Continue using controls to play the solution.</p><p>Or choose a different puzzle or solver.</p>";
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";
    running = false;
    forwardToEndButton.classList.remove("selected");

    // From rewindtobeg
    
});



// Event listener for the rewind to beginning button |<<
rewindToBegButton.addEventListener("click", async function () {
    // Unlight all buttons and highlight the button of interest
    setupForControls();
    refreshControls();
    rewindToBegButton.classList.add("selected");

    running = true;

    function rwdToBeg(){
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                // Stop play, reset the grid, index to moves, and control values (all globals)
                playReset();
                boardReset();
                resolve();
            },100);
        })
    }
    
    await rwdToBeg();

    // Back at beginning
    let state = document.querySelector(".state");
    state.innerHTML = "<p>At the beginning.</p><p>Continue using controls to play the solution.</p><p>Or choose a different puzzle or solver.</p>";
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";
    running = false;
    rewindToBegButton.classList.remove("selected");
});


// Event listener for the pause button
pauseButton.addEventListener("click", function () {
    running = false;
    // Unlight all buttons and highlight the button of interest
    refreshControls();
    pauseButton.classList.add("selected");

    let state = document.querySelector(".state");
    state.innerHTML = "<p>Paused.</p>"
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";
    clearInterval(timeId);
});


/**
 * Get the domain
 * @param {number} row  Index to the row of currentgrid
 * @param {number} col  Index to the column of currentgrid
 * @param {array} currentgrid  The current grid with values for row and col
 */
function getDomain(row, col, currentgrid) {
    let nside = currentgrid.length;
    let val;
    let excluded = new Set();
    let domain = new Set();

    // Get the constraints for this grid box
    constraints = getConstraintsForBox(row, col, nside);

    // Get the domain from the constraints
    while (constraints.length > 0) {
        constraint = constraints.pop();
        val = currentgrid[constraint[1][0]][constraint[1][1]];
        excluded.add(val);
    }

    // Starting values for domain
    for (i = 0; i <= nside; i++) {
        if (!(excluded.has(i))) {
            domain.add(i);
        }
    }
    return domain;
}


/**
 * For buttons that toggle on and off
 * @param button  The button to toggle on or off (e.g. pause button)
 */
function toggle(button) {
    if (button.value == "OFF") {
        button.value = "ON";
    } else {
        button.value = "OFF";
    }
}


/**
 * For all squares with value = 0, clear the domain
 */
function clearDomainFromTable() {
    let domain;
    let nside = currentgrid.length;
    for (let row = 0; row < nside; row++) {
        for (let col = 0; col < nside; col++) {
            if (currentgrid[row][col] === 0) {
                // Return the Sudoku box to blank
                //TODO: Change "empty" to something more useful below
                populateSquare(row, col, 0, 'empty');
            }
        }
    }
}




/**
 * Show the domain on the display board
 */
function showdomain() {
    // For all squares with value = 0, get the domain and display it
    let domain;
    let nside = currentgrid.length;
    for (let row = 0; row < nside; row++) {
        for (let col = 0; col < nside; col++) {
            if (currentgrid[row][col] === 0) {
                // Get the domain and show it in the Sudoku box
                domain = getDomain(row, col, currentgrid);
                //TODO: is domain ok below?
                populateSquareWithDomain(row, col, domain, 'domain');
            }
        }
    }
}


// Event listener for the show domain button
showDomainButton.addEventListener("click", function () {

    // Unhighlight all buttons
    refreshControls();

    // Toggle on/off
    let button = document.getElementById("showDomainButton");
    toggle(button);

    let state = document.querySelector(".state");
    let explanation = document.querySelector(".explanation");
    clearInterval(timeId);


    // Highlight or unhighlight the button
    if (button.value === "ON") {
        showDomainButton.classList.add("selected");
        let msg = "<p>Showing the domain of each square.</p><p>The domain consists of all the numbers 0-9 that are not already present in the same row, column, or 3x3 square." + methodSpecificMsgsForDomain[method]
            
        state.innerHTML = msg;
        explanation.innerHTML = "<p></p>";
        showdomain();
    }
    else {
        showDomainButton.classList.remove("selected");
        state.innerHTML = "<p>Removed the domain for each square.</p>"
        explanation.innerHTML = "<p></p>";
        clearDomainFromTable();
    }
});


// Event listener for the step button, which fills in the next box only
stepButton.addEventListener("click", function () {
    // Unlight all buttons and highlight the button of interest
    refreshControls();
    stepButton.classList.add("selected");

    running = false;

    let state = document.querySelector(".state");
    state.innerHTML = stepMethodMsg[method];
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";
    running = false;

    // Stop play, decrease the delay, and fill in the next box
    clearInterval(timeId);
    steppopulator();

    // unhighlight the button
    document.getElementById('step').classList.remove('selected');
    stepButton.classList.remove("selected");

    // If the show domain button is selected, update the domain shown
    let button = document.getElementById("showDomainButton");
    if (button.value === "ON") {
        showdomain();
    }
});


// Event listener for taking a single step back
// Rewind is tricky. We cannot undo the last move, because we don't know what was in
// the square before the last move occurred. So instead we have to redo all moves up to
// that point
stepBackButton.addEventListener("click", function () {

    // Unlight all control buttons and highlight the button of interest
    refreshControls();

    stepBackButton.classList.add("selected");

    // Stop play or rewind
    clearInterval(timeId);

    // We will be rewinding, so set running to true and print a message
    let state = document.querySelector(".state");
    let explanation = document.querySelector(".explanation");
    explanation.innerHTML = "<p></p>";

    // Check if we are aleady at the beginning or not and display appropriate message. Return if at beginning.
    if (imove === 0) {
        stepBack.style.setProperty("border", "none");
        // Already at the beginning, so print message and return
        state.innerHTML = "<p>At the beginning.</p><p>Use controls to play the solution.</p><p>Or choose a different puzzle or solver.</p>";
        return;
    }
    state.innerHTML = "<p>Undoing the previous step.</p>";

    let button = document.getElementById("showDomainButton");

    /**
     * Redraw board at previous move
     */
    if (imove > 0) {
        currentgrid = rewindToMove(Math.max(imove - 1, 0));
        // If the show domain button is selected, update the domain shown
        if (button.value === "ON") {
            let move = moves[imove];
            let domain = getDomain(move[0], move[1], currentgrid);
            showdomain();
        }
        imove -= 1;
    }
    else {
        // We have rewound to the very beginning
        clearInterval(timeId);
        // If the show domain button is selected, update the domain shown
        if (button.value === "ON") {
            let move = moves[imove]
            let domain = getDomain(move[0], move[1], currentgrid)
            showdomain();
        }
        imove = 0;
        running = false;
        // Print a message while we wait for the solver
        let state = document.querySelector(`.explanation`);
        state.innerHTML = "<p>Undid all moves back to beginning.</p><p>Continue using controls to play the solution.</p><p>Or choose a different puzzle or solver.</p>";
    };

    stepBackButton.classList.remove("selected");
});



// Read in the file provided by the user
// document.querySelector("#read-button").addEventListener('click', function() {
//     let file = window.document.querySelector("#file-input").files[0];
//     let reader = new FileReader();
//     reader.addEventListener('load', function(e) {
//             let text = e.target.result;
//             window.document.querySelector("#file-contents").textContent = text;
//     });
//     reader.readAsText(file);
// });

