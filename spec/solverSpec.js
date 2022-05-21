/**
 * Unit tests for functions within solver.js
 */


/**
 * Test for solve
 */
describe("testSolveEasy", () => {

    // The easy puzzle can be solved with only AC-3
    beforeEach(() => {
        // The starting grid for the easy puzzle
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
    it("gives the correct msg and moves length/first/last for the easy puzzle", () => {
        let msg;
        let moves;
        [msg, moves] = solve(grid);

        expect(msg).toBe('success');
        expect(moves.length).toBe(51);
        expect(moves[0]).toEqual([4, 4, 5, 'finalAC3']);
        expect(moves[moves.length-1]).toEqual([8, 1, 4, 'finalAC3']);

    });

    it("gives the correct result for the easy puzzle", () => {
        let msg;
        let moves;
        let expectedGrid = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9]];

        [msg, moves] = solve(grid);

        //Use the moves to create the final grid
        for (move of moves) {
            grid[move[0]][move[1]] = move[2];
        };

        //The output grid should be as expected
        for (let i=0; i<expectedGrid.length; i++) {
            for (let j=0; j<expectedGrid.length; j++) {
                expect(grid[i][j]).toBe(expectedGrid[i][j]);
            };
        };
    });
});


describe("testSolveMedium", () => {

    // The medium puzzle requires AC-3 and backtracking
    beforeEach(() => {
        // The starting grid for the medium puzzle
        grid = [[0, 0, 2, 0, 0, 9, 0, 0, 0],
        [0, 3, 0, 8, 0, 1, 2, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 9],
        [0, 2, 5, 0, 0, 0, 4, 0, 0],
        [0, 7, 0, 0, 0, 0, 8, 0, 2],
        [0, 0, 0, 6, 0, 0, 9, 3, 0],
        [8, 0, 0, 5, 2, 0, 0, 0, 0],
        [0, 0, 0, 3, 4, 0, 6, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 0, 0]];
    });

    // Happy unit test with a grid that should work
    it("gives the correct msg and moves length/first/last for the medium puzzle", () => {
        let msg;
        let moves;
        [msg, moves] = solve(grid);

        expect(msg).toBe('success');
        expect(moves.length).toBe(367);
        expect(moves[0]).toEqual([5, 0, 4, 'finalAC3']);
        expect(moves[moves.length-1]).toEqual([3, 4, 8, 'backtrackPlusAC3']);

    });

    it("gives the correct result for the medium puzzle", () => {
        let msg;
        let moves;
        let expectedGrid = [
            [5, 4, 2, 7, 3, 9, 1, 8, 6],
            [7, 3, 9, 8, 6, 1, 2, 5, 4],
            [1, 8, 6, 2, 5, 4, 3, 7, 9],
            [6, 2, 5, 9, 8, 3, 4, 1, 7],
            [9, 7, 3, 4, 1, 5, 8, 6, 2],
            [4, 1, 8, 6, 7, 2, 9, 3, 5],
            [8, 9, 1, 5, 2, 6, 7, 4, 3],
            [2, 5, 7, 3, 4, 8, 6, 9, 1],
            [3, 6, 4, 1, 9, 7, 5, 2, 8]];

        [msg, moves] = solve(grid);

        //Use the moves to create the final grid
        for (move of moves) {
            grid[move[0]][move[1]] = move[2];
        };

        //The output grid should be as expected
        for (let i=0; i<expectedGrid.length; i++) {
            for (let j=0; j<expectedGrid.length; j++) {
                expect(grid[i][j]).toBe(expectedGrid[i][j]);
            };
        };
    });

});
