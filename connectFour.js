/**
 * Connect Four Game
 * 
 * A simple implementation of the Connect Four game where a player competes 
 * against a computer. The player drops red pieces and the computer drops yellow
 * pieces in a grid. The goal is to connect four of your pieces in a row, either
 * horizontally, vertically, or diagonally.
 * 
 * Game Features:
 * - Player vs Computer: The player (red) faces off against a simple AI (yellow).
 * - Interactive Game Board: Click on columns to drop your pieces into the board.
 * - Win Detection: Checks for horizontal, vertical, and diagonal wins.
 * - Responsive UI: The game adapts to different screen sizes.
 * ver 1.0
 * Developed with p5.js.
 * @author MGC https://github.com/mgc-00/mgc-git-repo 10/02/2025
 */

let board;
const cols = 7; // Number of columns in the game grid
const rows = 6; // Number of rows in the game grid
let currentPlayer = 1; // 1 for player (red), -1 for computer (yellow)

/**
 * setup()
 * 
 * Initializes the game by creating the canvas and setting up the game board.
 * This function runs once at the beginning.
 */
function setup() {
    createCanvas(windowWidth, windowHeight); // Set canvas size to window size
    board = Array(cols).fill().map(() => Array(rows).fill(0)); // Initialize empty board (0 represents empty spaces)
}

/**
 * draw()
 * 
 * Continuously runs to update the game state and redraw the board. 
 * It checks for a win after every draw and stops the game if there is a winner.
 */
function draw() {
    background(255); // White background for the canvas
    drawBoard(); // Call the function to draw the game board
    if (checkWin()) { // If a win is detected
        noLoop(); // Stop the game from continuously drawing
        if (currentPlayer === 1) { // If the player wins
            setTimeout(() => alert("Congratulations! You win!"), 100); // Display custom message for Player win
        } else { // If the computer wins
            setTimeout(() => alert("Oops! The computer wins! Better luck next time."), 100); // Display custom message for Computer win
        }
    }
}

/**
 * drawBoard()
 * 
 * Draws the game board, including the background, grid, and pieces (red or yellow).
 * It adjusts the board's size to fit within the available window dimensions.
 */
function drawBoard() {
    let cellSize = min(width / cols, height / rows) * 0.9; // Calculate cell size to fit the board within the window
    let offsetX = (width - cellSize * cols) / 2; // Horizontal offset to center the board
    let offsetY = (height - cellSize * rows) / 2; // Vertical offset to center the board
    fill(0, 0, 255); // Blue color for the border
    rect(offsetX - cellSize * 0.05, offsetY - cellSize * 0.05, 
         cellSize * cols + cellSize * 0.1, cellSize * rows + cellSize * 0.1, 20); // Draw the outer border with rounded corners

    // Loop through each column and row to draw the individual pieces (red, yellow, or empty)
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            // Color the cell based on the value (red for player, yellow for computer, grey for empty)
            fill(board[c][r] === 1 ? 'red' : board[c][r] === -1 ? 'yellow' : 200);
            // Draw each piece as a circle at the calculated position
            ellipse(offsetX + c * cellSize + cellSize / 2, offsetY + r * cellSize + cellSize / 2, cellSize * 0.8);
        }
    }
}

/**
 * mousePressed()
 * 
 * Handles player input. When the player clicks on a column, the function places 
 * the player's piece in the lowest available row of that column. It also checks 
 * if the move results in a win and switches turns to the computer if the game 
 * is not over.
 */
function mousePressed() {
    let cellSize = min(width / cols, height / rows) * 0.9; // Calculate cell size
    let offsetX = (width - cellSize * cols) / 2; // Horizontal offset
    let col = floor((mouseX - offsetX) / cellSize); // Determine the clicked column based on mouseX position
    if (col >= 0 && col < cols) { // Ensure the column is valid
        for (let r = rows - 1; r >= 0; r--) { // Start from the bottom row
            if (board[col][r] === 0) { // If the cell is empty
                board[col][r] = currentPlayer; // Place the player's piece
                if (!checkWin()) { // If the player didn't win, switch turns
                    currentPlayer *= -1; // Switch turn: 1 (player) to -1 (computer)
                    computerMove(); // Let the computer make a move
                }
                break; // Exit loop after placing the piece
            }
        }
    }
}

/**
 * computerMove()
 * 
 * Handles the computer's move. The computer now tries to block the player's 
 * winning move or try to win itself if possible.
 */
function computerMove() {
    let bestCol = -1;
    let bestScore = -Infinity;

    // Try to block player or win
    for (let col = 0; col < cols; col++) {
        if (board[col][0] === 0) { // If the column is not full
            // Simulate player's move
            let row = getEmptyRow(col);
            board[col][row] = -1; // Computer places a piece
            let score = evaluateBoard(); // Evaluate the board's state after move

            // Undo the move
            board[col][row] = 0;
            
            // If the score is higher, this is the best move
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
        }
    }
    
    // Now that the best column is found, place the computer's piece
    let row = getEmptyRow(bestCol);
    board[bestCol][row] = -1;

    if (!checkWin()) { // If the computer didn't win, switch turns
        currentPlayer *= -1; // Switch turn: -1 (computer) to 1 (player)
    }
}

/**
 * getEmptyRow()
 * 
 * Finds the lowest empty row in a given column.
 * 
 * @param {number} col - The column to check
 * @returns {number} - The row index where the piece can be placed
 */
function getEmptyRow(col) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[col][r] === 0) {
            return r; // Return the first empty row
        }
    }
    return -1; // Should not reach here if column is not full
}

/**
 * evaluateBoard()
 * 
 * A simple evaluation function that looks for potential winning or blocking moves.
 * A higher score means the computer is in a better position.
 * 
 * @returns {number} - The evaluation score of the current board state
 */
function evaluateBoard() {
    let score = 0;

    // Check for potential winning moves for the computer
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[c][r] === -1) {
                score += evaluateDirection(c, r, 1, 0); // Horizontal
                score += evaluateDirection(c, r, 0, 1); // Vertical
                score += evaluateDirection(c, r, 1, 1); // Diagonal ↘
                score += evaluateDirection(c, r, 1, -1); // Diagonal ↗
            }
        }
    }

    return score;
}

/**
 * evaluateDirection()
 * 
 * Evaluates how many consecutive pieces are aligned in a direction.
 * A higher value represents a stronger position for the AI.
 * 
 * @param {number} c - Column index of the current piece
 * @param {number} r - Row index of the current piece
 * @param {number} dc - Directional change for columns
 * @param {number} dr - Directional change for rows
 * @returns {number} - The number of consecutive pieces
 */
function evaluateDirection(c, r, dc, dr) {
    let count = 0;
    let consecutive = 0;

    for (let i = 0; i < 4; i++) {
        let col = c + i * dc;
        let row = r + i * dr;

        if (col >= 0 && col < cols && row >= 0 && row < rows) {
            if (board[col][row] === -1) {
                count++;
            } else if (board[col][row] === 1) {
                consecutive++;
            }
        }
    }

    return count - consecutive; // Favor more computer pieces, block player pieces
}

/**
 * checkWin()
 * 
 * Checks if there is a winner on the board by scanning for four consecutive 
 * pieces in a row, column, or diagonal. If a winner is found, it returns true.
 * Otherwise, it returns false.
 * 
 * @returns {boolean} true if a player has won, false otherwise
 */
function checkWin() {
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[c][r] !== 0) { // Skip empty cells
                // Check horizontal, vertical, and diagonal directions for a win
                if (checkDirection(c, r, 1, 0) || // Horizontal
                    checkDirection(c, r, 0, 1) || // Vertical
                    checkDirection(c, r, 1, 1) || // Diagonal (↘)
                    checkDirection(c, r, 1, -1)) { // Diagonal (↗)
                    return true; // Win found
                }
            }
        }
    }
    return false; // No winner
}

/**
 * checkDirection()
 * 
 * Checks for four consecutive pieces in a specific direction (horizontal, vertical, or diagonal).
 * It iterates over the board in the specified direction (dc, dr) and counts how many consecutive
 * pieces belong to the current player. If there are four in a row, it returns true.
 * 
 * @param {number} c - Column index of the current piece
 * @param {number} r - Row index of the current piece
 * @param {number} dc - Directional change for columns (1 for right, 0 for down)
 * @param {number} dr - Directional change for rows (0 for right, 1 for down)
 * @returns {boolean} true if there are four consecutive pieces in the given direction, false otherwise
 */
function checkDirection(c, r, dc, dr) {
    let count = 0;
    for (let i = 0; i < 4; i++) { // Check for four pieces in a row
        let col = c + i * dc;
        let row = r + i * dr;
        if (col >= 0 && col < cols && row >= 0 && row < rows && board[col][row] === currentPlayer) {
            count++; // Increment count if the piece matches the current player
        } else {
            break; // Stop if there's no match
        }
    }
    return count === 4; // Return true if there are exactly four consecutive pieces
}
