// @ts-check
// # -*- coding: utf-8 -*-
//
// Created on Sat Mar 13 08:35:26 2021
//
// @author: prowe
// 


/** 
 * Get the next unassigned variable in the domain (no heuristic)
 * @param {array} board: Array of Arrays of objects of type Variable, making up
 *                a 2-D array of the board
 * @return Class instance of Variable; a box of the Sudoku board
 * @throws An error if everything has already been assigned.
 * 
 */
function getNextUnassigned(board) {
    for (let row of board) {
        for (let cell of row) {
            if (cell.getDomainSize() > 1) {
                return cell;
            }
        }
    }
    throw 'Looking for next unassigned, but everything seems to be assigned!';
}


//TODO: Implement the methods for the heuristics
// def get_unassigned_using_mrv(board):
//     """
//     Get the next unassigned variable in the domain using a heuristic:
//         1) Use the Minimum Remaining Values (MRV) heuristic: Choose
//            variable with the fewest legal moves (numbers in domain)

//     @param board  Sudoku board. List of lists of variables, making up
//                   a 2-D array of the board
//     @return cell  Class instance of Variable, representing a cell of the
//                   Sudoku board
//     """

//     mrv = 1e4
//     min_mrv = 2
//     chosen = False
//     for row in board:
//         for cell in row:
//             remvals = cell.get_domain_size()   # remaining values
//             if remvals == 0:                # nothing in cell
//                 raise ValueError('Domain empty!')

//             if remvals == 1:              # cell complete
//                 continue

//             if remvals < mrv:
//                 mrv = remvals
//                 chosen = True
//                 chosen_row = cell.row
//                 chosen_col = cell.col
//                 # The MRV must be at least 2, so if we get to 2, quit
//                 if mrv == min_mrv:
//                     return board[chosen_row][chosen_col]
//     if not chosen:
//         raise ValueError('Everything seems to be assigned!')

//     return board[chosen_row][chosen_col]



// def get_unassigned_using_mrv_and_degree(board):
//     """
//     Get the next unassigned variable in the domain using a heuristic:
//         1) First use the Minimum Remaining Values (MRV) heuristic: Choose
//            variable with the fewest legal moves (numbers in domain)
//         2) Next use the degree heuristic: choose the variable involved in
//            the largest number of constraints with remaining unassigned
//            variables.
//     @param board: Sudoku board. List of lists of variables, making up
//                   a 2-D array of the board
//     @return cell  Class instance of Variable; a cell of the Sudoku board
//     """
//     chosen = False
//     mrv = 1e4
//     degree = 0
//     min_mrv = 2                      # min number remaining values possible
//     max_degree = 20                  # max number constraints left (9x9 Sudoku)
//     for row in board:
//         for cell in row:
//             remvals = cell.get_domain_size()   # remaining values
//             if remvals == 0:                # nothing in cell
//                 raise ValueError('Domain empty!')

//             if remvals == 1:              # cell complete
//                 continue

//             if remvals < mrv:
//                 mrv = remvals
//                 chosen = True
//                 chosen_row = cell.row
//                 chosen_col = cell.col
//                 degree = get_constraints_for_x(cell, board)
//             elif remvals == mrv:
//                 new_degree = get_constraints_for_x(cell, board)
//                 if new_degree > degree:
//                     chosen_row = cell.row
//                     chosen_col = cell.col
//                     degree = new_degree

//             # Short stop if it cannot get any better
//             if mrv == min_mrv and degree == max_degree:
//                 return board[chosen_row][chosen_col]


//     if not chosen:
//         raise ValueError('Everything seems to be assigned!')

//     return board[chosen_row][chosen_col]


// def get_constraints_for_x(cell, board):
//     """
//     Get the constraints for a given cell cell
//     @param cell  Class instance of Variable; a cell of the Sudoku board
//     @param board
//     @return  Number of constraints
//     """
//     nconstraints = 0

//     # Row
//     for cellj in board[cell.row][:cell.col]:
//         if cellj.get_domain_size() > 1:
//             nconstraints += 1
//     for cellj in board[cell.row][cell.col+1:]:
//         if cellj.get_domain_size() > 1:
//             nconstraints += 1

//     # Col
//     for irow in range(cell.row):
//         if board[irow][cell.col].get_domain_size() > 1:
//             nconstraints += 1

//     for irow in range(cell.row+1, cell.max_domain_val):
//         if board[irow][cell.col].get_domain_size() > 1:
//             nconstraints += 1

//     # .. This would not generalize to a new board, but leave for now
//     ibox_row = int(cell.row/3) * 3
//     ibox_col = int(cell.col/3) * 3

//     if board[ibox_row+1][ibox_col+1].get_domain_size() > 1 \
//       or board[ibox_row+1][ibox_col+2].get_domain_size() > 1 \
//       or board[ibox_row+2][ibox_col+1].get_domain_size() > 1 \
//       or board[ibox_row+2][ibox_col+2].get_domain_size() > 1:
//         nconstraints += 1

//     return nconstraints
