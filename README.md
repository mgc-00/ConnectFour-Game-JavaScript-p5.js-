@author MGC https://github.com/mgc-00/mgc-git-repo 10/02/2025

Connect Four Game (JavaScript p5.js ver.1

A simple Connect Four game where a player competes against a computer. The game is built using p5.js and features a graphical interface with an interactive board. The objective is to get four of your pieces in a row, either horizontally, vertically, or diagonally.

Features

    Player vs Computer: Play against a simple AI that randomly drops pieces into the columns.
    Interactive Board: The player can click on a column to drop their piece into the first available slot.
    Responsive UI: The game board scales based on the window size for different devices.
    Win Detection: The game checks for horizontal, vertical, and diagonal wins.

Installation

    Download or clone the repository to your local machine.
    Ensure you have p5.js set up in your environment.
    Open the index.html file in your browser to play the game.

How to Play

    The game board consists of a grid with 7 columns and 6 rows.
    The player starts with the red pieces, and the computer uses yellow pieces.
    Click on any of the columns to drop your piece.
    The game will detect a win condition for both the player and the computer. If either wins, an alert will show the result, and the game will stop.

Code Overview
setup()

Initializes the game by setting up the board with 7 columns and 6 rows, filling them with 0 (empty spaces).
draw()

Continuously redraws the game board and checks for a win after each move.
drawBoard()

Displays the game board with red, yellow, and empty spaces, dynamically adjusting to fit the window size.
mousePressed()

Handles player input, where the player clicks on a column to place their piece.
computerMove()

The AI makes a move by selecting a random column, ensuring the column is not full.
checkWin()

Checks the game board for any horizontal, vertical, or diagonal connections of four pieces by the current player.
checkDirection()

Helps check if there’s a line of four pieces in a given direction (horizontal, vertical, or diagonal).
