let board;
const cols = 7;
const rows = 6;
let currentPlayer = 1; // 1 for player (red), -1 for computer (yellow)
let gameOver = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    board = Array(cols).fill().map(() => Array(rows).fill(0)); // Initialize the board
}

let winner = 0;

function draw() {
    background(255); // Redraw the background

    // Draw the board and the pieces
    drawBoard();

    // If the game is over, stop all actions
    if (gameOver) {
        return;
    }
}

function drawBoard() {
    let cellSize = min(width / cols, height / rows) * 0.9;
    let offsetX = (width - cellSize * cols) / 2;
    let offsetY = (height - cellSize * rows) / 2;

    // Draw board border
    fill(0, 0, 255);
    rect(offsetX - cellSize * 0.05, offsetY - cellSize * 0.05,
         cellSize * cols + cellSize * 0.1, cellSize * rows + cellSize * 0.1, 20);

    // Draw pieces (red, yellow, or empty)
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            fill(board[c][r] === 1 ? 'red' : board[c][r] === -1 ? 'yellow' : 200);
            ellipse(offsetX + c * cellSize + cellSize / 2, offsetY + r * cellSize + cellSize / 2, cellSize * 0.8);
        }
    }
}

function mousePressed() {
    if (gameOver || currentPlayer !== 1) return; // Block player move if game is over or it's not the player's turn

    let cellSize = min(width / cols, height / rows) * 0.9;
    let offsetX = (width - cellSize * cols) / 2;
    let col = floor((mouseX - offsetX) / cellSize);

    if (col >= 0 && col < cols) {
        for (let r = rows - 1; r >= 0; r--) {
            if (board[col][r] === 0) { // Find the first empty row in the column
                board[col][r] = currentPlayer;
                if (checkWin()) { // Check for win after player's move
                    gameOver = true;
                    winner = 1;
                    setTimeout(() => alert("Congratulations! You win! Press ctrl+R to restart."), 100);
                } else if (isBoardFull()) { // Check for a draw
                    gameOver = true;
                    setTimeout(() => alert("It's a draw! Press ctrl+R to restart."), 100);
                } else {
                    currentPlayer = -1; // Switch to computer's turn
                    setTimeout(computerMove, 500); // Delay computer move for a better user experience
                }
                break; // Exit the loop after placing the player's piece
            }
        }
    }
}

function computerMove() {
    if (gameOver || currentPlayer !== -1) return; // Block computer move if game is over or it's not computer's turn

    let col;

    // Step 1: Check if the computer can win
    col = findWinningMove(-1);
    if (col !== -1) {
        makeMove(col, -1);
        if (checkWin()) {
            gameOver = true;
            winner = -1;
            setTimeout(() => alert("Oops! The computer wins! Better luck next time. Press ctrl+R to restart."), 100);
        }
        return;
    }

    // Step 2: Block the player's winning move
    col = findWinningMove(1);
    if (col !== -1) {
        makeMove(col, -1);
        if (checkWin()) {
            gameOver = true;
            winner = -1;
            setTimeout(() => alert("Oops! The computer wins! Better luck next time. Press ctrl+R to restart."), 100);
        }
        return;
    }

    // Step 3: If no winning or blocking move, make a random move
    do {
        col = floor(random(cols));
    } while (board[col][0] !== 0); // Ensure the column is not full

    makeMove(col, -1);

    if (checkWin()) {
        gameOver = true;
        winner = -1;
        setTimeout(() => alert("Oops! The computer wins! Better luck next time. Press ctrl+R to restart."), 100);
    } else if (isBoardFull()) {
        gameOver = true;
        setTimeout(() => alert("It's a draw! Press ctrl+R to restart."), 100);
    }

    currentPlayer = 1; // Switch back to player's turn
}

function makeMove(col, player) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[col][r] === 0) {
            board[col][r] = player;
            break;
        }
    }
}

function checkWin() {
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[c][r] !== 0) {
                if (checkDirection(c, r, 1, 0) || checkDirection(c, r, 0, 1) ||
                    checkDirection(c, r, 1, 1) || checkDirection(c, r, 1, -1)) {
                    return true; // Win found
                }
            }
        }
    }
    return false;
}

function checkDirection(c, r, dc, dr) {
    let count = 0;
    let player = board[c][r];
    for (let i = 0; i < 4; i++) {
        let x = c + dc * i;
        let y = r + dr * i;
        if (x < 0 || x >= cols || y < 0 || y >= rows || board[x][y] !== player) {
            return false;
        }
        count++;
    }
    return count === 4; // Return true if four in a row
}

function findWinningMove(player) {
    for (let c = 0; c < cols; c++) {
        for (let r = rows - 1; r >= 0; r--) {
            if (board[c][r] === 0) {
                board[c][r] = player;
                if (checkWin()) {
                    board[c][r] = 0;
                    return c; // Return column where the winning move is found
                }
                board[c][r] = 0; // Reset the board if no win
            }
        }
    }
    return -1; // No winning move found
}

function isBoardFull() {
    for (let c = 0; c < cols; c++) {
        if (board[c][0] === 0) {
            return false; // If there's an empty cell in the top row, the board is not full
        }
    }
    return true; // Board is full
}
