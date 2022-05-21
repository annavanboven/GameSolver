/**
 * Unit tests for constraints.js
 */


describe("qcingBoard", () => {
    // Unit tests for the qcBoard method

    // Executed before each unit test
    beforeEach(() => {
        grid = [[5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]];
    });

    // Happy unit test with a grid that should work
    it("passes qc for a good board", () => {
        let board = getBoard(grid);
        expect(qcBoard(board)).toBe(true);
    });

    // Unhappy unit test with a grid that should not work
    it("fails qc if the input is not a board", () => {
        expect(qcBoard(grid)).toBe(false);
        expect(qcBoard("hello")).toBe(false);
    })

    it("fails qc for a board with three fives in a row", () => {
        grid[0][7] = 5;
        grid[0][3] = 5;
        grid[0][4] = 5;
        let board = getBoard(grid);
        expect(qcBoard(board)).toBe(false);
    });

    it("fails qc for a board with two threes in a column", () => {
        grid[0][4] = 3;
        grid[1][4] = 3;
        let board = getBoard(grid);
        expect(qcBoard(board)).toBe(false);
    });

    it("fails qc for a board with two fours in a 3x3 box", () => {
        grid[0][6] = 4;
        grid[1][7] = 4;
        let board = getBoard(grid);
        expect(qcBoard(board)).toBe(false);
    });

    // Tests that could be added:
    // Make sure the input type is an array
    // Make sure the board is filled with variables

});
