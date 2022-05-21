// @ts-check
/**
 * #!/usr/bin/env python3
 * # -*- coding: utf-8 -*-
 * 
 * Created on Thu Mar 11 07:01:49 2021
 *
 * @author: prowe
 */

/**
 * 
 * @param {array} board  Array of arrays of objects of type Variable
 * @returns {boolean}  True if the board is ok, otherwise false
 */
function qcBoard(board) {

    let maxDomainVal = board[0][0].maxDomainVal;
    
    // Fail if the maxDomainVal is not a number above 0
    if (!(Number.isFinite(maxDomainVal)) || maxDomainVal <= 0) {
        return false;
    }

    let boxval;

    for (let irow=0; irow<maxDomainVal; irow++) {  
        for (let icol=0; icol<maxDomainVal; icol++) {

            // If the value in this box is not fixed, move on
            if (!(board[irow][icol].fixed)) {
                continue;
            }

            boxval = board[irow][icol].getOnlyValue();

            // Row: For the row (irow) containing the cell at (irow, icol),
            // add all the columns (e.g. 1-9), except the cell's column (icol)
            // Check if there is only one value in the domain, and, if so,
            // make sure it is different than the value in irow, icol
            for (let jcol=0; jcol<maxDomainVal; jcol++) {
                if (jcol !== icol && board[irow][jcol].domain.size === 1 && board[irow][jcol].getOnlyValue() === boxval) {
                    return false;
                }
            }

            // Column: For the column (icol) containing the cell at (irow, icol), 
            // check all the rows (e.g. 1-9), except the cell's row (irow)
            for (let jrow=0; jrow<maxDomainVal; jrow++) {
                if (jrow !== irow && board[jrow][icol].domain.size === 1 && boxval === board[jrow][icol].getOnlyValue()) {
                    return false;
                }
            }

            // Box: For the (e.g. 3x3) box containing the cell at (irow, icol),
            // check all row,column sets that share the box, except the cell's 
            // (irow, icol) and the cells that have already been checked
            let boxRow = Math.floor(irow/3) * 3;
            let boxCol = Math.floor(icol/3) * 3;
            for (let jrow=boxRow; jrow<boxRow+3; jrow++) {
                for (let jcol=boxCol; jcol<boxCol+3; jcol++) {
                    if (!(jrow===irow && jcol===icol) && board[jrow][jcol].domain.size===1 && boxval===board[jrow][jcol].getOnlyValue()) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}


/**
 * 
 * Row: For the row (irow) containing the box at (irow, icol),
 * add all the columns (e.g. 1-9) to the constraints, except the cell's column (icol)
 * Format: An array containing the current cell [irow, icol], followed by the
 * constraint row and column [irow, jol]
 * @param {number} irow  Index to row
 * @param {number} icol  Index to column
 * @param {number} maxDomainVal  Maximum value allowed in the domain (e.g. 9)
 * @returns  The constraints for the box at irow, icol
 */
function getConstraintsForBox(irow, icol, maxDomainVal) {
    let boxConstraints = [];

    for (let jcol=0; jcol<maxDomainVal; jcol++) {
        if (jcol !== icol) {
            boxConstraints.push([[irow, icol], [irow, jcol]]);
        }
    }

    // Column: For the column (icol) containing the cell at (irow, icol), 
    // add all the rows (e.g. 1-9), except the cell's row (irow)
    for (let jrow=0; jrow<maxDomainVal; jrow++) {
        if (jrow !== irow) {
            boxConstraints.push([[irow, icol], [jrow, icol]]);
        }
    }

    // Box: For the (e.g. 3x3) box containing the cell at (irow, icol),
    // add all row,column sets that share the box, except the cell's 
    // (irow, icol) and the constraint cells that have already been added
    let boxRow = Math.floor(irow/3) * 3;
    let boxCol = Math.floor(icol/3) * 3;
    for (let jrow=boxRow; jrow<boxRow+3; jrow++) {
        for (let jcol=boxCol; jcol<boxCol+3; jcol++) {
            if (jrow != irow && jcol != icol) {
                boxConstraints.push([[irow, icol], [jrow, jcol]]);
            }
        }
    }

    return boxConstraints;
}


/**
 * 
 * Purpose: For all Sudoku boxes that do not have fixed values in them, 
 * get all binary constraints of the form xi,xj and put them their
 * row and column indices into a list.
 * @param {array} board  An array of arrays for the Sudoku board, with each value an object of type Variable
 * @returns {array} constraints  array of arrays containing 2 arrays with 2 elements each:
 *                        [[[xi_row, xi_col],[xj_row,xj_col]], ... ]
 *
 * A Sudoku board has 9 rows and 9 columns, and is divided into 3x3 boxes.
 * For each cell/box (row & column), there are therefore:
 *     Constraints per cell:
 *         8 for the row (9-1)
 *         8 for the column (9-1)
 *         4 for the box (9-1-4 duplicates)
 *         ---------------
 *         20 constraints / cell
 *
 *     There are 81 cells, so 81*20 = 1620 constraints total. Note that we
 *     only include 4 constraints for the box because we have already
 *     counted the other 4: 2 in the row and 2 in the column.
 *
 *     We do not need constraints for boxes with fixed values, so they will
 *     not be added to the list of constraints,
 *
 */
function getConstraints(board) {
    let maxDomainVal = board[0][0].maxDomainVal;
    let constraints = [];
    let boxConstraints;

    for (let irow=0; irow<maxDomainVal; irow++) {
        for (let icol=0; icol<maxDomainVal; icol++) {
            // Do not get constraints for the boxes with fixed values, since
            // they will never change
            if (board[irow][icol].fixed) {
                continue;
            }
            boxConstraints = getConstraintsForBox(irow, icol, maxDomainVal);
            constraints = constraints.concat(boxConstraints);
        }
    }
    return constraints;
}

/**
 * 
 * Purpose: get all binary constraints of the form xi,xj and put them in
 * a list. To save space, we just put the row and column indices in the
 * list.
 * @param {number} maxDomainVal  int, The dimensions of each side of the square board
 * @returns {array} constraints  array of arrays containing 2 arrays with 2 elements each:
 *                               [[[xi_row, xi_col],[xj_row,xj_col]], ... ]
 *
 * A Sudoku board has 9 rows and 9 columns, and is divided into 3x3 boxes.
 * For each cell/box (row & column), there are therefore:
 *     Constraints per cell:
 *         8 for the row (9-1)
 *         8 for the column (9-1)
 *         4 for the box (9-1-4 duplicates)
 *         ---------------
 *         20 constraints / cell
 *
 *     There are 81 cells, so 81*20 = 1620 constraints total. Note that we
 *     only include 4 constraints for the box because we have already
 *     counted the other 4: 2 in the row and 2 in the column.
 *
 *     We can also exclude any fixed cells from the list of constraints,
 *     since (1) we pre-check for consistency, ans (2) they cannot change.
 *     But we do that in another function, just to keep things simple.
 *
 * Notes:
 *     1) There are a lot of nested loops here. However, this code is only
 *        run once and it has to cover all squares. 
 */

function getAllConstraints(maxDomainVal) {
    let constraints = [];

    for (let irow=0; irow<maxDomainVal; irow++) {   //in list_rows:
        for (let icol=0; icol<maxDomainVal; icol++) {
            // Row: For the row (irow) containing the cell at (irow, icol),
            // add all the columns (e.g. 1-9) to the constraints, except the cell's column (icol)
            // Format: An array containing the current cell [irow, icol], followed by the
            // constraint row and column [irow, jol]
            for (let jcol=0; jcol<maxDomainVal; jcol++) {
                if (jcol !== icol) {
                    constraints.push([[irow, icol], [irow, jcol]]);
                }
            }

            // Column: For the column (icol) containing the cell at (irow, icol), 
            // add all the rows (e.g. 1-9), except the cell's row (irow)
            for (let jrow=0; jrow<maxDomainVal; jrow++) {
                if (jrow !== irow) {
                    constraints.push([[irow, icol], [jrow, icol]]);
                }
            }

            // Box: For the (e.g. 3x3) box containing the cell at (irow, icol),
            // add all row,column sets that share the box, except the cell's 
            // (irow, icol) and the constraint cells that have already been added
            let boxRow = Math.floor(irow/3) * 3;
            let boxCol = Math.floor(icol/3) * 3;
            for (let jrow=boxRow; jrow<boxRow+3; jrow++) {
                for (let jcol=boxCol; jcol<boxCol+3; jcol++) {
                    constraints.push([[irow, icol], [jrow, jcol]]);
                }
            }
        }
    }
    return constraints
}



/**
 * Get the reverse contraints, that is, the new constraints on other boxes due to
 * having assigned a value to the box at irow, icol
 * @param {number} irow  Index to row
 * @param {number} icol  Index to column
 * @param {number} maxDomainVal The maximum value allowed in the domain
 * @param {array} xjConstraints  The previous constraints, so new can be added
 * @param {array} board  The board, to check for fixed values and exclude them
 * @returns {array} The previous constraints + the new ones
*/
function reverseConstraints(irow, icol, maxDomainVal, xjConstraints, board){
    let jcol;
    let jrow;

    // Row: Add all column indices to row, except the variable's
    // also do not add any that are fixed
    for (jcol=0; jcol<maxDomainVal; jcol++) {
        if (jcol !== icol && !(board[irow][jcol].fixed) ) {
            xjConstraints.push([[irow, jcol], [irow, icol]]);
        }
    }

    // Column
    for (jrow=0; jrow<maxDomainVal; jrow++) {
        // Add all rows of this column, except the variable's column
        if (!(jrow === irow) && !(board[jrow][icol].fixed) ) {
            xjConstraints.push([[jrow, icol], [irow, icol]]);
        }
    }

    // Box
    //  Add all row,column sets that share the box,
    //  except the variable's row, column
    //  and the ones that have already been one
    let ibox_row = Math.floor(irow/3) * 3;
    let ibox_col = Math.floor(icol/3) * 3;

    for (jrow=ibox_row; jrow<ibox_row+3; jrow++) {
        for (jcol=ibox_col; jcol<ibox_col+3; jcol++) {
            if (!(jrow === irow) && !(jcol === icol) && !(board[jrow][jcol].fixed) ) {
                xjConstraints.push([[jrow, jcol], [irow, icol]]);
            }
        }
    }

    return xjConstraints;
}
